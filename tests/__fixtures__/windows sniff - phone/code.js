/* global Ti, Titanium */
if (Ti.Platform.osname === 'windowsstore' || Ti.Platform.osname === 'windowsphone') {
	Ti.API.info('on windows!');
}

if ('windowsstore' == Ti.Platform.osname || 'windowsphone' === Titanium.Platform.osname) { // eslint-disable-line yoda, eqeqeq
	Ti.API.info('on windows!');
}
