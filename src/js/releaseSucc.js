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
    const { pageSize, cacheUserinfoKey, shareUrl } = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    currentPage.find('span.release-succ-name').text(fishName);
    if (!isLogin()) {
        newF7.confirm('登录之后可以随时查看自己发布的信息，有更多好处，现在去登录吧？', '友情提示', () => {
            apiCount('btn_text_guideLogin_yes');
            mainView.router.load({
                url: 'views/login.html?phone=' + phone
            })
        })
    }else{
        const releaseF7 = new framework7({
            modalButtonOk: '现在转发',
            modalButtonCancel: '我再想想',
            fastClicks: true,
            modalTitle: '温馨提示',
        });
        const {
            type,
            specifications,
            stock,
            provinceName,
            cityName,
            fishTypeName,
            price,
            id,
            state
        } = window['releaseInfo'];

        1 == state && $$('.release-succ-head>p span').text('所有人都可以看到你的信息啦');
        1 == state && $$('.release-succ-head>p').eq(0).hide();

        const catBtn = `<a href='views/${1 == type ? "buydetail" : "selldetail"}.html?id=${id}' class='button col-45' onclick="apiCount('btn_text_goDetail')" class='button col-45 first'>查看信息详情</a>`;
        currentPage.find('.release-succ-back-btn').children('a').eq(1).remove();
        currentPage.find('.release-succ-back-btn').append(catBtn);
        
        releaseF7.confirm('一键转发到微信让您的成交率翻3倍!', '友情提示', () => {
            apiCount('btn_text_guideShare_yes');
            let title = '';
            let messageTile = '';
            let html = '';
            const url_ = `${shareUrl}?id=${id}`;
            const releaseTypeText = 1 == type ? '求购' : '出售';
            title += `【${releaseTypeText}】${fishTypeName}, ${provinceName||''}${cityName||''}`;
            messageTile += `我在鱼大大看到${releaseTypeText}信息${fishTypeName||''}，`;
            messageTile += stock ? `${'库存 ' + stock}，` : '';
            messageTile += price ? `${'价格' + price}，` : '';
            messageTile += specifications ? `${'规格' + specifications}，` : '';
            messageTile += `，对你很有用，赶紧看看吧: ${url_}`;
            html += `${releaseTypeText}${fishTypeName},`;
            html += stock ? `${'库存 ' + stock}，` : '';
            html += price ? `${'价格' + price}，` : '';
            html += specifications ? `${'规格' + specifications}，` : '';
            html += '点击查看更多信息~';
            nativeEvent.shareInfo(title, html, url_, messageTile);
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
        html(currentPage.find('.release-succ-list').children('.list-view'), strHtml, f7);
        strHtml && currentPage.find('.release-succ-list').addClass('show');
        f7.hideIndicator();
    }
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'list',
        data: [id, '', type == 1 ? 2 : 1, '', pageSize, 1],
        type: 'get'
    }, callback);

}

module.exports = {
    releaseSuccInit,
}
