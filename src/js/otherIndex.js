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

function otherIndexInit(f7, view, page) {
    const { id } = page.query;
    const userCache = store.get(`getDemandInfo_id_${id}`);
    const { imgPath } = config;
    let callNumber;
    let type = 2;
    if (userCache) {
        const { userInfo, user_ishCertificate_list } = userCache['data'];
        const { enterpriseAuthenticationState, personalAuthenticationState, lastLoginTime, nickname, imgUrl, phone } = userInfo;
        const text = userUtils.getAuthenticationText(enterpriseAuthenticationState, '', personalAuthenticationState)['myCenterText'];
        callNumber = phone;
        if (text) {
            $$('p.other-user-name').addClass('show').find('.text')[0].innerText = text;
        }
        lastLoginTime && ($$('.other-user-info .user-lately-time')[0].innerText = centerShowTime(lastLoginTime));
        nickname && ($$('.other-user-name>.name')[0].innerText = trim(nickname));
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


    const callback = (data) => {
            const list = data.data.list;
            if (!list.length) {
                return;
            }
            let buyList = [];
            let sellList = [];
            let buyHtml = '';
            let sellHtml = '';
            $$.each(list, (index, item) => {
                const { type } = item;
                if (2 == type) {
                    sellHtml += home.cat(item);
                    sellList.push(item);
                } else if (1 == type) {
                    buyHtml += home.buy(item);
                    buyList.push(item);
                }
            })
            html($$('.other-sell-list .list'), sellHtml, f7);
            html($$('.other-buy-list .list'), buyHtml, f7);
            buyList.length && ($$('.other-index-list').addClass('show-buy-list'));
            sellList.length && ($$('.other-index-list').addClass('show-sell-list'));
            /*
             * Trigger lazy load img.
             */
            setTimeout(() => {
                $$('img.lazy').trigger('lazy');
            }, 300)
        }
    //get user demand list.
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [id],
        type: 'get',
        val: { type: 2 }
    }, callback);

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
        if(ele.className.indexOf('open-cert-button') > -1){
            const url = $$(ele).attr('data-url');
            nativeEvent.catPic(url);
        }
    })

    //view current user sell list.
    $$('.other-sell-cat-all').on('click', () => {
        type = 2;
        view.router.load({
            url: 'views/otherList.html?' + `id=${id}&type=${type}`
        })
    })

    //view current user sell list.
    $$('.other-buy-cat-all').on('click', () => {
        type = 1;
        view.router.load({
            url: 'views/otherList.html?' + `id=${id}&type=${type}`
        })
    })

    //other info report.
    $$('.other-report').on('click', () => {
        f7.confirm('确认举报？', '提示', () => {
            f7.alert('举报成功', '提示');
        })
    })

    //call to other user.
    $$('.other-footer-call').on('click', () => {
        nativeEvent.contactUs(callNumber);
    })
}

module.exports = {
    otherIndexInit
}



