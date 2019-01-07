/* global Ti, OS_ANDROID, OS_IOS, OS_WINDOWS */
if (OS_ANDROID) {
	Ti.API.info('android');
}
if (OS_IOS) {
	Ti.API.info('ios');
}
if (OS_WINDOWS) {
	Ti.API.info('windows');
}
Ti.API.info(Ti.Platform.name);
Ti.API.info(Ti.Platform.osname);
