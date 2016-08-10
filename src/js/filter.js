import { trim, html } from '../utils/string';


function filterInit(f7, view, page) {
	const $$ = Dom7;
	const {keyvalue} = page.query;
	const searchBtn = $$('.searchbar-input input');
	searchBtn.val(keyvalue);
	console.log(f7, view, page);
}

module.exports = {
    filterInit: filterInit
}