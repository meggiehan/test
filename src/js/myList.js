import store from '../utils/locaStorage';
import config from '../config';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import {html} from '../utils/string';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function myListInit(f7, view, page) {
    const { type } = page.query;
    const {pageSize, cacheUserinfoKey} = config;
    const {id, token} = store.get(cacheUserinfoKey);
    let pageNo = 1;
    $$('.my-list-title')[0].innerText = 2 == type ? '我的出售' : '我的求购';

    const callback = (data) => {
    	const {code, message} = data;
    	if(code !== 1){
    		f7.alert(message, '提示');
    		return;
    	}
    	let otehrHtml = '';
    	$$.each(data.data.list, (index, item) => {
    		if(2 == type){
    			otehrHtml += home.cat(item);
    		}else{
    			otehrHtml += home.buy(item);
    		}
    	})
    	html($$('.other-list-info'), otehrHtml, f7);
        if(!$$('.other-list-info>a').length){
            2 == type ? $$('.my-sell-list-empty').show() : $$('.my-buy-list-empty').show();
        }
    	setTimeout(() => {
    		$$('img.lazy').trigger('lazy');
    	},400)
        f7.hideIndicator();
    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [id, pageSize, pageNo, token, type],
        type: 'get'
    }, callback);
}

module.exports = {
    myListInit,
}
