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
import {otherIndexClickTip} from '../utils/domListenEvent';

function otherIndexInit(f7, view, page) {
    const { id, currentUserId } = page.query;
    const userCache = store.get(`getDemandInfo_id_${id}`);
    const { imgPath, pageSize } = config;
    let sellInfoNull = false;
    let buyInfoNull = false;
    let callNumber;
    let type = 2;
    if (userCache) {
        const { userInfo, user_ishCertificate_list } = userCache['data'];
        const { enterpriseAuthenticationState, personalAuthenticationState, lastLoginTime, nickname, imgUrl, phone } = userInfo;
        const text = userUtils.getAuthenticationText(enterpriseAuthenticationState, '', personalAuthenticationState)['myCenterText'];
        callNumber = phone;
        if (text) {
            $$('p.other-user-name').addClass('show').find('.text').text(text);
        }
        lastLoginTime && $$('.other-user-info .user-lately-time').text(centerShowTime(lastLoginTime));
        nickname && $$('.other-user-name>.name').text(trim(nickname));
        imgUrl && ($$('.page-other-index .user-pic img').attr('src', imgUrl + imgPath(8)));
        if (user_ishCertificate_list.list.length) {
            let certHtml = '';
            $$.each(user_ishCertificate_list.list, (index, item) => {
                certHtml += selldetail.cert(item)
            })
            html($$('.other-index-cert>.cert-list'), certHtml, f7);
            $$('.other-index-cert').addClass('show');
        }
    }


    const sellListCallback = (data) => {
            const list = data.data.list;
            if (!list.length) {
                sellInfoNull = true;
                sellInfoNull && buyInfoNull && $$('.other-index-empty-info').show();
                f7.hideIndicator();
                return;
            }
            let sellHtml = '';
            $$.each(list, (index, item) => {
                if (item['state'] !== 1) {
                    return;
                }
                sellHtml += home.cat(item);
            })
            html($$('.other-sell-list .list'), sellHtml, f7);
            sellHtml ? $$('.other-index-list').addClass('show-sell-list') : $$('.other-index-list').removeClass('show-sell-list');

            $$('img.lazy').trigger('lazy');
            f7.hideIndicator();
        }
        //get user sell demand list.
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [currentUserId, pageSize, 1, '', 2],
        type: 'get',
        val: { id: 1 }
    }, sellListCallback);

    const buyListCallback = (data) => {
            const list = data.data.list;
            if (!list.length) {
                buyInfoNull = true;
                sellInfoNull && buyInfoNull && $$('.other-index-empty-info').show();
                return;
            }
            let buyHtml = '';
            $$.each(list, (index, item) => {
                if (item['state'] !== 1) {
                    return;
                }
                buyHtml += home.buy(item);
            })
            html($$('.other-buy-list .list'), buyHtml, f7);
            buyHtml ? $$('.other-index-list').addClass('show-buy-list') : $$('.other-index-list').removeClass('show-buy-list');

            $$('img.lazy').trigger('lazy');
        }
        //get user buy demand list.
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [currentUserId, pageSize, 1, '', 1],
        type: 'get',
        val: { id: 1 }
    }, buyListCallback);

    //go to other user infomation.
    $$('.page-other-index .user-header').click(() => {
        view.router.load({
            url: 'views/otherInfo.html?id=' + id
        })
    })

    //view cert in ew window.
    $$('.other-index-cert .cert-list').on('click', (e) => {
        const event = e || window.event;
        const ele = event.target;
        if (ele.className.indexOf('open-cert-button') > -1) {
            const url = $$(ele).attr('data-url');
            nativeEvent.catPic(url);
        }
    })

    //view current user sell list.
    $$('.other-sell-cat-all').on('click', () => {
        type = 2;
        view.router.load({
            url: 'views/otherList.html?' + `id=${currentUserId}&type=${type}`
        })
    })

    //view current user sell list.
    $$('.other-buy-cat-all').on('click', () => {
        type = 1;
        view.router.load({
            url: 'views/otherList.html?' + `id=${currentUserId}&type=${type}`
        })
    })

    //call to other user.
    $$('.other-footer-call').on('click', () => {
        nativeEvent.contactUs(callNumber);
    })

    $$('.navbar-inner.other-index .icon-more').off('click', otherIndexClickTip).on('click', otherIndexClickTip);
}

module.exports = {
    otherIndexInit
}
