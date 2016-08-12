import { trim, html } from '../utils/string';


function filterInit(f7, view, page) {
	const $$ = Dom7;
	const {searchVal, release, type, id} = page.query;
	const searchBtn = $$('.filter-searchbar input')
	trim(searchVal) && searchBtn.val(searchVal);
	
}

module.exports = {
    filterInit
}