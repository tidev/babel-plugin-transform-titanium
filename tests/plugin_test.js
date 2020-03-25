const babel = require('@babel/core');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../src/index');

const makeTest = (name, pluginOptions) => {
	return {
		fixture: `__fixtures__/${name}/code.js`,
		outputFixture: `__fixtures__/${name}/output.js`,
		pluginOptions
	};
};

const tests = {};
[ 'dist-appstore', 'dist-playstore', 'dist-adhoc' ].forEach(target => {
	tests[target] = makeTest(target, { target });
});

[ 'development', 'test', 'production' ].forEach(deploytype => {
	tests[deploytype] = makeTest(deploytype, { deploytype });
});

tests['android'] = makeTest('android', {
	platform: 'android',
	Ti: {
		Platform: {
			name: 'android',
			osname: 'android'
		}
	}
});
tests['iphone'] = makeTest('iphone', {
	platform: 'ios',
	Ti: {
		Platform: {
			name: 'iOS',
			osname: 'iphone'
		}
	}
});
tests['ipad'] = makeTest('ipad', {
	platform: 'ios',
	Ti: {
		Platform: {
			name: 'iPhone OS',
			osname: 'ipad'
		}
	}
});
tests['simplifies ios Ti.Platform.osname checks when ipad'] = makeTest('ios sniff - ipad', {
	platform: 'ios',
	Ti: {
		Platform: {
			name: 'iPhone OS'
		}
	}
});
tests['simplifies ios Ti.Platform.osname checks when iphone'] = makeTest('ios sniff - iphone', {
	platform: 'ios',
	Ti: {
		Platform: {
			name: 'iOS'
		}
	}
});
tests['windowsphone'] = makeTest('windowsphone', {
	platform: 'windows',
	Ti: {
		Platform: {
			name: 'windows',
			osname: 'windowsphone'
		}
	}
});
tests['windowsstore'] = makeTest('windowsstore', {
	platform: 'windows',
	Ti: {
		Platform: {
			name: 'windows',
			osname: 'windowsstore'
		}
	}
});
tests['simplifies windows Ti.Platform.osname checks when windowsphone'] = makeTest('windows sniff - phone', {
	platform: 'windows',
	Ti: {
		Platform: {
			name: 'windows',
			osname: 'windowsphone'
		}
	}
});
tests['simplifies windows Ti.Platform.osname checks when windowsstore'] = makeTest('windows sniff - store', {
	platform: 'windows',
	Ti: {
		Platform: {
			name: 'windows',
			osname: 'windowsstore'
		}
	}
});

tests['Ti static properties'] = makeTest('ti properties', {
	Ti: {
		App: {
			version: '1.0.0'
		},
		version: '8.0.0.GA'
	}
});

tests['replaces Titanium.* equivalents'] = makeTest('titanium namespace', {
	Ti: {
		App: {
			version: '1.0.0'
		},
		version: '8.0.0.GA'
	}
});

tests['Ti.buildHash'] = makeTest('ti.buildHash', {
	Ti: {
		buildHash: '3726240fa2'
	}
});

tests['Ti.App.copyright'] = makeTest('ti.app.copyright', {
	Ti: {
		App: {
			copyright: '2019-present by Axway, Inc.'
		}
	}
});

tests['Ti.App.description'] = makeTest('ti.app.description', {
	Ti: {
		App: {
			description: 'My Awesome app'
		}
	}
});

tests['Ti.App.id'] = makeTest('ti.app.id', {
	Ti: {
		App: {
			id: 'com.axway.example.app.id'
		}
	}
});

tests['Ti.App.name'] = makeTest('ti.app.name', {
	Ti: {
		App: {
			name: 'my-classic-app'
		}
	}
});

tests['Ti.App.publisher'] = makeTest('ti.app.publisher', {
	Ti: {
		App: {
			publisher: 'Axway, Inc.'
		}
	}
});

tests['Ti.App.url'] = makeTest('ti.app.url', {
	Ti: {
		App: {
			url: 'https://www.appcelerator.com'
		}
	}
});

// TODO: Make sure it does not try to override non-static values if we accidentally pass them in?
// Maybe we need a "whitelist" of Ti.* properties we'll handle?
// What about if there's a method/getter that matches?

pluginTester({
	babel,
	plugin,
	// fixtures: path.join(__dirname, '__fixtures__'), // no way to override pluginOptions per-test this way!
	filename: __filename,
	tests
});
