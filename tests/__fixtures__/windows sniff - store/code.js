/* global Ti, Titanium */
if (Ti.Platform.osname === 'windowsstore' || Ti.Platform.osname === 'windowsphone') {
	Ti.API.info('on windows!');
}

if (Ti.Platform.osname == 'windowsstore' || Titanium.Platform.osname == 'windowsphone') { // eslint-disable-line eqeqeq
	Ti.API.info('on windows!');
}
