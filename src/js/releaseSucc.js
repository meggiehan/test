import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/locaStorage';
import config from '../config';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
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

    /**
     * 发布成功之后的操作
     * 1：未登录的引导登录
     * 2：已登录的引导分享发布的信息
     * */
    if (!isLogin()) {
        newF7.confirm('登录之后可以随时查看自己发布的信息，有更多好处，现在去登录吧？', '友情提示', () => {
            apiCount('btn_text_guideLogin_yes');
            loginViewShow(phone);
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

        const userInfo = store.get(cacheUserinfoKey);

        1 == state && currentPage.find('.release-succ-head').find('span').text('所有人都可以看到你的信息啦');
        1 == state && currentPage.find('.release-succ-head>p').eq(0).hide();

        const catBtn = `<a href='views/${1 == type ? "buydetail" : "selldetail"}.html?id=${id}' class='button col-45' onclick="apiCount('btn_text_goDetail')" class='button col-45 first'>查看信息详情</a>`;
        currentPage.find('.release-succ-back-btn').children('a').eq(1).remove();
        currentPage.find('.release-succ-back-btn').append(catBtn);

        /**
         * 未实名认证的不引导分享
         * */
        1 == state && releaseF7.confirm('一键转发到微信让您的成交率翻3倍!', '友情提示', () => {
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
            nativeEvent.shareInfo(title, html, url_, messageTile, userInfo.imgUrl || 'http://m.yudada.com/img/app_icon_108.png');
        })
    }

    /**
     * 发布成功后获取相似的反向信息（出售 -> 求购/ 求购 -> 出售）
     * */
    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            return;
        }
        let strHtml = '';
        $$.each(data.data, (index, item) => {
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
