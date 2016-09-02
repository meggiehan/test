import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/locaStorage';
import config from '../config';
import {isLogin} from '../middlewares/loginMiddle';
import framework7 from './lib/framework7';

const newF7 = new framework7({
    modalButtonOk: '现在去登录',
    modalButtonCancel: '算了',
    fastClicks: true,
    modalTitle: '温馨提示',
});

function releaseSuccInit(f7, view, page) {
    const { type, id, fishName, phone } = page.query;
    const { pageSize, cacheUserinfoKey } = config;

    $$('.release-succ-list>.title>span.release-succ-name').text(fishName);
    if (!isLogin()) {
        newF7.confirm('登录之后可以随时查看自己发布的信息，有更多好处，现在去登录吧？', '友情提示', () => {
            view.router.load({
                url: 'views/login.html?phone=' + phone
            })
        })
    }

    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            return;
        }
        let strHtml = '';
        $$.each(data.data.list, (index, item) => {
            if (2 == type) {
                strHtml += home.buy(item);
            } else {
                strHtml += home.cat(item);
            }
        })
        html($$('.release-succ-list>.list-view'), strHtml, f7);
        strHtml && ($$('.release-succ-list').addClass('show'));
        f7.hideIndicator();
    }
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfoList',
        data: [id, '', type == 1 ? 2 : 1, '', pageSize, 1],
        type: 'get'
    }, callback);

}

module.exports = {
    releaseSuccInit,
}
