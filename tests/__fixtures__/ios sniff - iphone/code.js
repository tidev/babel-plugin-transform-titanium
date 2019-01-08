/* global Ti, Titanium */
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
	Ti.API.info('on ios!');
}

if ('iphone' == Ti.Platform.osname || 'ipad' === Titanium.Platform.osname) { // eslint-disable-line yoda, eqeqeq
	Ti.API.info('on ios!');
}
