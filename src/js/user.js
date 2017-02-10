import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import {loginSucc, isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import userUtils from '../utils/viewsUtil/userUtils';
import {getCurrentDay, alertTitleText} from '../utils/string';
import {
    goHome,
    goMyCenter,
    myListBuy,
    myListSell,
    uploadCert,
    contactUs,
    goIdentity,
    inviteFriends
} from '../utils/domListenEvent';

function userInit(f7, view, page) {
    f7.hideIndicator();
    const {uuid, logout} = page.query;
    let loginStatus = logout ? false : isLogin(uuid);
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {cacheUserinfoKey, imgPath, mWebUrl} = config;
    let userInfomation = store.get(cacheUserinfoKey);
    const weixinData = nativeEvent.getDataToNative('weixinData');

    /*
    * 生成二维码
    * */
    const qrCodeFun = (data) => {
        const {
            scanLink,
            imgUrl,
            invitationCode
        } = data || {scanLink: 'http://baidu.com'};
        if (!$$('.picker-invite-code-content>img').length) {
            window.qrcodeObj = new QRCode($('.picker-invite-code-content')[0], {
                text: scanLink,
                height: 180,
                width: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            })
        } else {
            window.qrcodeObj.clear(); // clear the code.
            window.qrcodeObj.makeCode(scanLink); // make another code.

        }

        if (imgUrl) {
            $$('.picker-invite-head-img').attr('src', imgUrl + imgPath(8)).show();
        }else{
            $$('.picker-invite-head-img').hide();
        }
        $$('.picker-invite-code-header').children('p').eq(1).text(invitationCode);
    }

    const loginCallback = (data) => {
        f7.hideIndicator();
        const {code, message} = data;
        if (code == 1) {
            qrCodeFun(data.data);
            userInfomation = data.data;
            store.set(cacheUserinfoKey, data.data);
            userInfomation && loginSucc(userInfomation, userUtils.getBussesInfoCallback);
            nativeEvent.setUerInfoToNative({
                inviterId: data.data.inviterId
            });
            const oldDate = nativeEvent.getDataToNative('oldDate');
            !oldDate && nativeEvent.setDataToNative('oldDate', getCurrentDay());
            if (!oldDate || (new Date(oldDate).getTime() < new Date(getCurrentDay()).getTime())) {
                const {
                    nickname,
                    personalAuthenticationState
                } = userInfomation;
                nativeEvent.setDataToNative('oldDate', getCurrentDay());
                if (!nickname) {
                    f7.modal({
                        title: '提示',
                        text: '你还没填写你的名字，填写完整有助于交易成交~',
                        buttons: [
                            {
                                text: '现在去填写',
                                onClick: () => {
                                    mainView.router.load({
                                        url: 'views/editName.html',
                                    })
                                }
                            },
                            {
                                text: '取消',
                                onClick: () => {
                                }
                            }
                        ]
                    })
                    return;
                }
                if (1 != personalAuthenticationState) {
                    f7.modal({
                        title: '提示',
                        text: '实名认证有助于交易成交，交易额翻番不是梦~',
                        buttons: [
                            {
                                text: '现在去认证',
                                onClick: goIdentity
                            },
                            {
                                text: '取消',
                                onClick: () => {
                                }
                            }
                        ]
                    })
                    return;
                }
            }

        } else {
            f7.alert(message);
        }
        setTimeout(() => {
            currentPage.css({
                borderBottom: '1px solid #efeff4'
            })
        }, 1000)
    }

    /*
    * 判断登录状态
    * 已登录：微信登录/手机号登录
    * */
    if (loginStatus) {
        if (userInfomation) {
            loginSucc(userInfomation, userUtils.getBussesInfoCallback);
            setTimeout(() => {
                qrCodeFun(userInfomation);
            }, 0)
        }
        customAjax.ajax({
            apiCategory: 'auth',
            header: ['token'],
            type: 'get',
            noCache: true,
        }, loginCallback);
    } else {
        /*
         * 如果只是微信登录
         * */
        if (weixinData) {
            const {imgUrl, nickname} = JSON.parse(weixinData);
            currentPage.find('.modify-text').text('绑定');
            nickname && currentPage.find('.user-name').children('span').text(nickname);
            imgUrl && currentPage.find('.user-pic').children('img').attr('src', imgUrl);
            currentPage.find('.user-tell-number').text('绑定手机号，可使用更多功能');
            currentPage.find('.user-header').addClass('login-succ');
        }

        /*
        * f7页面渲染的bug，部分页面未渲染出来，强制性再次渲染就ok
        * */
        setTimeout(() => {
            currentPage.css({
                borderBottom: '1px solid #efeff4'
            })
        }, 1000)
    }

    /*
    * 进入我的等级，新开第三方webView
    * */
    currentPage.find('a.user-member')[0].onclick = () => {
        apiCount('btn_myCenter_myLevel');
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
            return;
        }
        nativeEvent['goNewWindow'](`${mWebUrl}user/member?id=${userInfomation['id']}`);
    }

    /*
    * 进入帮助中心，新开第三方webView
    * */
    currentPage.find('a.user-help-service')[0].onclick = () => {
        nativeEvent['goNewWindow'](`${mWebUrl}helpCenter.html`);
    }

    /*
    * 我的收藏列表
    * */
    currentPage.find('.my-collection-list')[0].onclick = () => {
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
            return;
        }
        mainView.router.load({
            url: 'views/myCollection.html'
        })
    }

    /*
    * 进入个人资料
    * */
    $$('.user-header').off('click', goMyCenter).on('click', goMyCenter);

    /*
    * 进入实名认证页面
    * */
    currentPage.find('.go-identity')[0].onclick = goIdentity;

    /*
    * 进入鱼类资质证书管理页面
    * */
    $$('.go-verification').off('click', uploadCert).on('click', uploadCert);

    /*
    * 联系客服
    * */
    $$('.user-help-list>.user-call-service').off('click', contactUs).on('click', contactUs);

    /*
    * 进入邀请界面
    * */
    $$('.user-help-list>.user-invit').off('click', inviteFriends).on('click', inviteFriends);

    /*
    * 进入我的出售/求购列表/刷新信息列表
    * */
    $$('.user-info-list>a.my-buy-list').off('click', myListBuy).on('click', myListBuy);
    $$('.user-info-list>a.my-sell-list').off('click', myListSell).on('click', myListSell);
    currentPage.find('.user-refresh-auth').children()[0].onclick = myListSell;

    /*
    * 回到首页
    * */
    $$('.href-go-home').off('click', goHome).on('click', goHome);

    /*
    * 绑定账号
    * */
    currentPage.find('.user-bind-account')[0].onclick = () => {
        if (!isLogin() && !nativeEvent.getDataToNative('weixinData')) {
            f7.alert('您还没登录，请先登录!', '温馨提示', loginViewShow)
            return;
        }
        apiCount('btn_bindAccounts');
        mainView.router.load({
            url: 'views/bindAccount.html'
        })
    }

    /*
     * 前往发布信息页面
     * */
    currentPage.find('.to-release-page')[0].onclick = () => {
        apiCount('btn_tabbar_post');
        if(!isLogin() && weixinData){
            f7.alert('绑定手机号后，可以使用全部功能!','温馨提示', loginViewShow);
            return;
        }
        view.router.load({
            url: 'views/release.html'
        })
    }
}

module.exports = {
    userInit,
}
