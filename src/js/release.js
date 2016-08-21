import nativeEvent from '../utils/nativeEvent';
import config from '../config';

function releaseInit(f7, view, page){
	const $$ = Dom7;
	const {servicePhoneNumber} = config;
	$$('.release-sound').on('click', () => {
		nativeEvent.apiCount();
	})

	$$('.service-contact-us').on('click', () => {
		
		nativeEvent.contactUs(servicePhoneNumber);
	})
}

module.exports = {
	releaseInit,
}