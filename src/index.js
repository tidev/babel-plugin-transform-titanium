'use strict';

const CONST = require('./constants');

// FIXME: Have our builder pass in some options to specify various values thar are static to a build, but not constant across all builds:
// i.e.
// deploy type - Ti.App.deployType (from build config)
// SDK version - Ti.version (from sdk package.json)
// build date - Ti.buildDate (from sdk package.json)
// build hash - Ti.buildHash (from sdk package.json)
// application id - Ti.App.id (from tiapp.xml)
// application name - Ti.App.name (from tiapp.xml)
// publisher - Ti.App.publisher (from tiapp.xml)
// aplication url - Ti.App.url (from tiapp.xml)
// application version - Ti.App.version (from tiapp.xml)
// application description - Ti.App.description (from tiapp.xml)
// application copyright - Ti.App.copyright (from tiapp.xml)
// Ti.App.Properties (from tiapp.xml)?
// Maybe just build up our own "Ti" object, filled in with whatever static values we have and then do simple replacement of those values below?

// TODO: Can we do some slightly more complicated logic to handle common case of sniffing ios/windows?
// Basically, most people check Ti.Platform.name/osname for a value in some set of constants, like:
// if (Ti.Platform.name === 'iphone' || Ti.Platform.name === 'ipad')
// if (Ti.Platform.osname === 'iOS' || Ti.Platform.osname === 'iPhone OS')
// or for windows:
// if (Ti.Platform.osname === 'windowsphone' || Ti.Platform.osname === 'windowsstore')
// we should be able to flatten that to be true/false fairly easily (convert to Ti.Platform.name === 'windows' first which is a straight replace?)

// The rest here is ripped straight from Alloy!

// Walk tree transformer changing (Ti|Titanium).Platform.(osname|name)
// into static strings where possible. This will allow the following
// compression step to reduce the code further.

// https://github.com/babel/minify/blob/master/packages/babel-plugin-transform-inline-environment-variables/src/index.js

// This functionality is very similar to https://github.com/babel/minify/blob/master/packages/babel-plugin-minify-replace/src/index.js
// which allows doing replacements of identifiers and variables
// That'd work fine for getting rid of our defines replacements, but isn't complex enough to handle the Ti.Platform.name style replacements.

function flatten(obj, opt_out, opt_paths) {
	var out = opt_out || {};
	var paths = opt_paths || [];
	return Object.getOwnPropertyNames(obj).reduce(function (out, key) {
		paths.push(key);
		if (typeof obj[key] === 'object') {
			flatten(obj[key], out, paths);
		} else {
			out[paths.join('.')] = obj[key];
		}
		paths.pop();
		return out;
	}, out);
}

module.exports = function (_ref) {
	const types = _ref.types;

	return {
		name: 'Titanium API static value inlines',
		pre: function () {
			const config = this.opts || {};
			config.deploytype = config.deploytype || 'development';

			// create a map of static variables to boolean values that we can inject
			// TODO: Be more flexible and inject multiple types of values, not just booleans, use types.valueToNode()?
			const defines = {};
			CONST.DEPLOY_TYPES.forEach(d => {
				defines[d.key] = config.deploytype === d.value;
			});
			CONST.DIST_TYPES.forEach(d => {
				defines[d.key] = d.value.includes(config.target);
			});
			CONST.PLATFORMS.forEach(p => {
				defines['OS_' + p.toUpperCase()] = config.platform === p;
			});
			this.defines = defines;
			// the "Ti" global object that should hold an object populated with any static values we're aware of
			const Ti = config.Ti || config.Titanium || {};

			// here we keep two views of the static values:

			// - an object holding the fully prefixed property names with their values
			this.flattened = flatten({ Ti });
			// duplicate Ti.* to Titanium.*
			Object.keys(this.flattened).forEach(key => {
				this.flattened[key.replace('Ti.', 'Titanium.')] = this.flattened[key];
			});

			// - a Map from the base property names to the full prefixes they can come from:
			// i.e. 'version' => [ 'Ti.App', 'Ti.Platform' ], 'osname' => [ 'Ti.Platform' ]
			this.properties = new Map();
			// Now loop through the array of flattened paths, grab last segment and then do a mapping from unique last segment to full path
			Object.keys(this.flattened).forEach(key => {
				const lastIndex = key.lastIndexOf('.');
				const lastSegment = key.slice(lastIndex + 1);
				const prefix = key.slice(0, lastIndex);
				const matches = this.properties.has(lastSegment) ? this.properties.get(lastSegment) : [];
				matches.push(prefix);
				this.properties.set(lastSegment, matches);
			});
			// FIXME: Need to duplicate entries to match both Ti.* and Titanium.*!
		},
		visitor: {
			MemberExpression: function (path) {
				const key = path.toComputedKey();
				if (!key) {
					return;
				}

				// do a quick lookup to see if any static values we have match this base name
				const name = key.value;
				if (!this.properties.has(name)) {
					return;
				}

				// there is a base property name match, so now do deeper check to see if the full namespace matches
				const prefixes = this.properties.get(name);
				const match = prefixes.find(prefix => types.matchesPattern(path.node, `${prefix}.${name}`));

				if (match) {
					const replacementValue = this.flattened[`${match}.${name}`];
					path.replaceWith(types.valueToNode(replacementValue));
				}
			},
			Identifier: function (path) {
				// replace straight up variable identifiers with the hard-coded boolean value we defined above
				if (this.defines.hasOwnProperty(path.node.name)
					&& (path.parent.type !== 'VariableDeclarator' || path.node.name !== path.parent.id.name)) {
					path.replaceWith(types.booleanLiteral(this.defines[path.node.name]));
				}
			}
		}
	};
};
