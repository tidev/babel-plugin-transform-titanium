/* global Ti, Titanium */
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	Ti.API.info('on ios!');
}

if (Ti.Platform.osname == 'iphone' || Titanium.Platform.osname == 'ipad') { // eslint-disable-line eqeqeq
	Ti.API.info('on ios!');
}
