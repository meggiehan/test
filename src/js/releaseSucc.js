import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/locaStorage';
import config from '../config';


function releaseSuccInit(f7, view, page) {
    const { type, id } = page.query;
    const { pageSize } = config;

    $$('.release-succ-list>.title>span')[0].innerText = 2 == type ? '出售' : '求购';

    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            return;
        }
        let strHtml = '';
        $$.each(data.data.list, (index, item) => {
            if (2 == type) {
                strHtml += home.cat(item);
            } else {
                strHtml += home.buy(item);
            }
        })
        html($$('.release-succ-list>.list-view'), strHtml, f7);
        strHtml && ($$('.release-succ-list').addClass('show'));
    }
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfoList',
        data: [id, '', type, '', pageSize, 1],
        type: 'get'
    }, callback);

}

module.exports = {
    releaseSuccInit,
}
