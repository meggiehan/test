function identityAuthenticationInit(f7, view, page){
	const $$ = Dom7;
	const individualBtn = $$('.identity-individual');
	const companyBtn = $$('.identity-company');
	const individualType = 0;
	individualBtn.on('click', () =>{
		$$('.identity-select-type .col-50').removeClass('active');
		individualBtn.addClass('active');
	})

	companyBtn.on('click', () =>{
		$$('.identity-select-type .col-50').removeClass('active');
		companyBtn.addClass('active');
	})
}

module.exports = {
	identityAuthenticationInit
}


