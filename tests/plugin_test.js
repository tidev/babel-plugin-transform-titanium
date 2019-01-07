const babel = require('@babel/core');
const pluginTester = require('babel-plugin-tester');
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
tests['windowsstore'] = makeTest('windowsstore', {
	platform: 'windows',
	Ti: {
		Platform: {
			name: 'windows',
			osname: 'windowsstore'
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

pluginTester({
	babel,
	plugin,
	// fixtures: path.join(__dirname, '__fixtures__'), // no way to override pluginOptions per-test this way!
	filename: __filename,
	tests
});
