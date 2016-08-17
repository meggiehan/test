import nativeEvent from '../utils/nativeEvent';

function identityAuthenticationInit(f7, view, page){
	nativeEvent.init();
	const $$ = Dom7;
	const individualBtn = $$('.identity-individual');
	const companyBtn = $$('.identity-company');
	const certBox = $$('.identity-infomation');
	const authenticationDemo = $$('.identity-pic-demo');
	let individualType = 0;
	let individualPicNum = 0;
	let companyPicNum = 0;

	/*
	* identity individual doing.
	*/
	//select identity individual.
	individualBtn.on('click', () =>{
		individualType = 1;
		$$('.identity-select-type .col-50').removeClass('active');
		individualBtn.addClass('active');
		certBox.addClass('individual').removeClass('company');
		authenticationDemo.addClass('show');
	})
	// select pic.
	$$.each($$('.identity-individual-pic>div'), (index, item) => {
		$$(item).on('click', () => {
			nativeEvent.postPic(index, '');
		})
	})


	/*
	* identity company doing.
	*/
	//select identity company.
	companyBtn.on('click', () =>{
		individualType = 2;
		$$('.identity-select-type .col-50').removeClass('active');
		companyBtn.addClass('active');
		certBox.addClass('company').removeClass('individual');
		authenticationDemo.removeClass('show');
	})


}

module.exports = {
	identityAuthenticationInit
}


