import config from '../config';
import { html } from '../utils/string';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';
import { centerShowTime } from '../utils/time';
import { otherIndexClickTip, veiwCert } from '../utils/domListenEvent';
import { isLogin, loginViewShow } from '../middlewares/loginMiddle';

function otherIndexInit(f7, view, page) {
    const { id, currentUserId } = page.query;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const { imgPath } = config;
    const weixinData = nativeEvent.getDataToNative('weixinData');
    let callNumber;
    let level;
    let nameAuthentication;

    function renderUserInfo(userInfo, cerList){
        const { enterpriseAuthenticationState, personalAuthenticationState, lastLoginTime, nickname, imgUrl, phone } = userInfo;
        callNumber = phone;
        level = userInfo['level'];
        level && currentPage.find('.other-user-name').children('i').addClass(`iconfont icon-v${level}`);

        1 == enterpriseAuthenticationState && currentPage.find('.other-index-cert-info').addClass('company-identity').show();
        1 == personalAuthenticationState && currentPage.find('.other-index-cert-info').addClass('individual-identity').show();

        lastLoginTime && currentPage.find('.user-lately-time').text(centerShowTime(lastLoginTime));
        nickname && currentPage.find('.other-user-name').children('.name').text(trim(nickname));
        imgUrl && ($$('.page-other-index .user-pic img').attr('src', imgUrl + imgPath(8)));
        if (cerList.length) {
            let certHtml = '';
            $$.each(cerList, (index, item) => {
                certHtml += selldetail.cert(item)
            })
            html(currentPage.find('.other-index-cert').children('.cert-list'), certHtml, f7);
            currentPage.find('.other-index-cert').addClass('show');
        }
        nameAuthentication = userInfo['nameAuthentication'];
    }

    function renderList(buyLisy, sellList){
        f7.hideIndicator();
        if(!buyLisy.length && !sellList.length){
            currentPage.find('.other-index-empty-info').show();
            currentPage.find('.other-index-list').removeClass('show-buy-list');
            currentPage.find('.other-index-list').removeClass('show-sell-list');
            return;
        }

        if(buyLisy.length){
            let buyHtml = '';
            $$.each(buyLisy, (index, item) => {
                buyHtml += home.buy(item, level);
            })
            html($$('.other-buy-list .list'), buyHtml, f7);
            currentPage.find('.other-index-list').addClass('show-buy-list');
        }

        if(sellList.length){
            let sellHtml = '';
            $$.each(sellList, (index, item) => {
                sellHtml += home.cat(item, level, nameAuthentication);
            })
            html($$('.other-sell-list .list'), sellHtml, f7);
            currentPage.find('.other-index-list').addClass('show-sell-list');
        }

        $$('img.lazy').trigger('lazy');
        f7.pullToRefreshDone();
    }

    const callback = (data) => {
        const {userInfo, saleDemands, buyDemands, fishCertificateList} = data.data;
        renderUserInfo(userInfo, fishCertificateList);
        renderList(buyDemands, saleDemands);
    }

    function getInfo(){
        customAjax.ajax({
            apiCategory: 'userInformation',
            data: [currentUserId],
            val:{
                id: currentUserId
            },
            type: 'get',
            isMandatory: nativeEvent.getNetworkStatus()
        }, callback);
    }

    /*
    * 获取/刷新个人信息
    * */
    const ptrContent = currentPage.find('.other-index-refresh');
    getInfo();
    ptrContent.on('refresh', getInfo);


    /*
    * 进入他人资料
    * */
    currentPage.find('.user-header').click(() => {
        view.router.load({
            url: `views/otherInfo.html?id=${currentUserId}&goodsId=${id}`
        })
    })

    /*
    * 调用native组件查看鱼类资质证书
    * */
    currentPage.find('.cert-list').off('click', veiwCert).on('click', veiwCert);

    /*
    * 查看他人的出售/求购列表
    * */
    currentPage.find('.other-sell-cat-all')[0].onclick = () => {
        view.router.load({
            url: 'views/otherList.html?' + `id=${currentUserId}&type=2`
        })
    }
    currentPage.find('.other-buy-cat-all')[0].onclick = () => {
        view.router.load({
            url: 'views/otherList.html?' + `id=${currentUserId}&type=1`
        })
    }

    /*
    * 电话联系， 调用native拨打电话
    * */
    currentPage.find('.other-footer-call')[0].onclick = () => {
        // if (!isLogin()) {
        //     f7.modal({
        //         title: '友情提示',
        //         text: weixinData ? '绑定手机号后，可以使用全部功能!' : '为了保证信息安全，请登录后拨打电话',
        //         buttons: [
        //             {
        //                 text: '我再想想',
        //                 onClick: () => {
        //                 }
        //             },
        //             {
        //                 text: '安全登录',
        //                 onClick: loginViewShow
        //             }
        //         ]
        //     })
        //     return;
        // }
        apiCount('btn_profile_call');
        nativeEvent.contactUs(callNumber);
    }

    $$('.navbar-inner.other-index .icon-more').off('click', otherIndexClickTip).on('click', otherIndexClickTip);
}

export {
    otherIndexInit
}
