import nativeEvent from '../utils/nativeEvent';

function releaseInit(f7, view, page){
	const $$ = Dom7;
	nativeEvent.init();

	$$('.release-sound').on('click', () => {
		nativeEvent.apiCount();
	})

	$$('.service-contact-us').on('click', () => {
		nativeEvent.contactUs();
	})
}

module.exports = {
	releaseInit,
}