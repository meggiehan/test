import store from '../utils/locaStorage';
import config from '../config';
import { getName, html } from '../utils/string';
import { logOut } from '../middlewares/loginMiddle';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';
import userUtils from '../utils/viewsUtil/userUtils';
import { centerShowTime } from '../utils/time';
import { otherIndexClickTip, veiwCert } from '../utils/domListenEvent';

function otherIndexInit(f7, view, page) {
    const { id, currentUserId } = page.query;
    const userCache = store.get(`getDemandInfo_id_${id}`);
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { imgPath, pageSize } = config;
    let sellInfoNull = false;
    let buyInfoNull = false;
    let callNumber;
    let level;
    let nameAuthentication;
    let type = 2;
    if (userCache) {
        const { userInfo, user_ishCertificate_list } = userCache['data'];
        const { enterpriseAuthenticationState, personalAuthenticationState, lastLoginTime, nickname, imgUrl, phone } = userInfo;
        const text = userUtils.getAuthenticationText(enterpriseAuthenticationState, '', personalAuthenticationState)['myCenterText'];
        callNumber = phone;
        level = userInfo['level'];
        level && currentPage.find('.other-user-name').children('i').addClass(`iconfont icon-v${level}`);

        1 == enterpriseAuthenticationState && currentPage.find('.other-index-cert-info').addClass('company-identity').show();
        1 == personalAuthenticationState && currentPage.find('.other-index-cert-info').addClass('individual-identity').show();

        lastLoginTime && currentPage.find('.user-lately-time').text(centerShowTime(lastLoginTime));
        nickname && currentPage.find('.other-user-name').children('.name').text(trim(nickname));
        imgUrl && ($$('.page-other-index .user-pic img').attr('src', imgUrl + imgPath(8)));
        if (user_ishCertificate_list.list.length) {
            let certHtml = '';
            $$.each(user_ishCertificate_list.list, (index, item) => {
                certHtml += selldetail.cert(item)
            })
            html(currentPage.find('.other-index-cert').children('.cert-list'), certHtml, f7);
            currentPage.find('.other-index-cert').addClass('show');
        }

        level = userCache['data']['userInfo']['level'];
        nameAuthentication = userCache['data']['userInfo']['nameAuthentication'];
    }


    const sellListCallback = (data) => {
        const list = data.data.list;
        if (!list.length) {
            sellInfoNull = true;
            sellInfoNull && buyInfoNull && currentPage.find('.other-index-empty-info').show();
            f7.hideIndicator();
            f7.pullToRefreshDone();
            return;
        }
        let sellHtml = '';
        $$.each(list, (index, item) => {
            if (item['state'] !== 1 || index > 2) {
                return;
            }
            sellHtml += home.cat(item, level, nameAuthentication);
        })
        html($$('.other-sell-list .list'), sellHtml, f7);
        sellHtml ? currentPage.find('.other-index-list').addClass('show-sell-list') : currentPage.find('.other-index-list').removeClass('show-sell-list');

        $$('img.lazy').trigger('lazy');
        f7.hideIndicator();
        f7.pullToRefreshDone();
    }

    //get user sell demand list.
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [currentUserId, 3, 1, 2],
        type: 'get',
        val: { id: 1 }
    }, sellListCallback);

    const buyListCallback = (data) => {
        const list = data.data.list;
        if (!list.length) {
            buyInfoNull = true;
            sellInfoNull && buyInfoNull && currentPage.find('.other-index-empty-info').show();
            f7.pullToRefreshDone();
            return;
        }
        let buyHtml = '';
        $$.each(list, (index, item) => {
            if (item['state'] !== 1 || index > 2) {
                return;
            }
            buyHtml += home.buy(item, level);
        })
        html($$('.other-buy-list .list'), buyHtml, f7);
        buyHtml ? currentPage.find('.other-index-list').addClass('show-buy-list') : currentPage.find('.other-index-list').removeClass('show-buy-list');

        $$('img.lazy').trigger('lazy');
        f7.hideIndicator();
        f7.pullToRefreshDone();
    }

    //get user buy demand list.
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [currentUserId, 3, 1, 1],
        type: 'get',
        val: { id: 1 }
    }, buyListCallback);

    //go to other user infomation.
    currentPage.find('.user-header').click(() => {
        view.router.load({
            url: `views/otherInfo.html?id=${currentUserId}&goodsId=${id}`
        })
    })

    // pull to refresh.
    const ptrContent = currentPage.find('.other-index-refresh');
    ptrContent.on('refresh', function(e) {
        //get user sell demand list.
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getMyDemandInfoList',
            data: [currentUserId, 3, 1, 2],
            isMandatory: true,
            type: 'get',
            val: { id: 1 }
        }, sellListCallback);
        //get user buy demand list.
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getMyDemandInfoList',
            data: [currentUserId, 3, 1, 1],
            isMandatory: true,
            type: 'get',
            val: { id: 1 }
        }, buyListCallback);
    })

    //view cert in ew window.
    currentPage.find('.cert-list').off('click', veiwCert).on('click', veiwCert);

    //view current user sell list.
    currentPage.find('.other-sell-cat-all')[0].onclick = () => {
        type = 2;
        view.router.load({
            url: 'views/otherList.html?' + `id=${currentUserId}&type=${type}`
        })
    }

    //view current user sell list.
    currentPage.find('.other-buy-cat-all')[0].onclick = () => {
        type = 1;
        view.router.load({
            url: 'views/otherList.html?' + `id=${currentUserId}&type=${type}`
        })
    }

    //call to other user.
    currentPage.find('.other-footer-call')[0].onclick = () => {
        nativeEvent.contactUs(callNumber);
    }

    $$('.navbar-inner.other-index .icon-more').off('click', otherIndexClickTip).on('click', otherIndexClickTip);
}

module.exports = {
    otherIndexInit
}
