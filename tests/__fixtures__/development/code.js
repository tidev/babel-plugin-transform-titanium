/* global Ti, ENV_DEV, ENV_DEVELOPMENT, ENV_TEST, ENV_PROD, ENV_PRODUCTION */
if (ENV_DEV) {
	Ti.API.info('in development!');
}
if (ENV_DEVELOPMENT) {
	Ti.API.info('in development!');
}
if (ENV_TEST) {
	Ti.API.info('in test!');
}
if (ENV_PROD) {
	Ti.API.info('in production!');
}
if (ENV_PRODUCTION) {
	Ti.API.info('in production!');
}
