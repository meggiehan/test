import nativeEvent from '../utils/nativeEvent';


function fishCertInit(f7, view, page){
	const $$ = Dom7;

	$$('.fish-cert-head .button').on('click', () => {
		nativeEvent.postPic(4, '');
	})
}

module.exports = {
	fishCertInit,
}
