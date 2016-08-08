import config from '../config';
import customAjax from '../middlewares/customAjax';
import { home } from '../utils/template';
import { html } from '../utils/string';

function buydetailInit(f7, view, page) {
    f7.hideIndicator();
    const {id} = page.query;
    const callback = (data) => {
    	console.log(data)
    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfo',
        data: [id],
        type: 'get'
    }, callback);
}

module.exports = {
    buydetailInit,
}
