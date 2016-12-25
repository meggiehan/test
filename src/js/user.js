import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import {loginSucc, isLogin} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import userUtils from '../utils/viewsUtil/userUtils';
import {getCurrentDay} from '../utils/string';
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
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const {cacheUserinfoKey, imgPath, mWebUrl} = config;
    let userInfomation = store.get(cacheUserinfoKey);

    const qrCodeFun = (data) => {
        const {
            scanLink,
            imgUrl,
            invitationCode
        } = data || {scanLink: 'http://baidu.com'};

        //use qrcodejs create qr code on local.
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
            $$('.picker-invite-head-img').attr('src', imgUrl + imgPath(8));
            $$('.picker-invite-code-header').children('p').eq(1).text(invitationCode);
        }
    }

    const loginCallback = (data) => {
        f7.hideIndicator();
        const {code, message} = data;
        if (code == 1) {
            qrCodeFun(data.data);
            userInfomation = data.data;
            store.set(cacheUserinfoKey, data.data);
            userInfomation && loginSucc(userInfomation, userUtils.getBussesInfoCallback);
            const oldDate = nativeEvent.getDataToNative('oldDate');
            !oldDate && nativeEvent.setDataToNative('oldDate', getCurrentDay());
            if (!oldDate || new Date(oldDate).getTime() < new Date(getCurrentDay()).getTime()) {
                const {
                    nickname,
                    nameAuthentication
                } = userInfomation;
                if(!nickname){
                    f7.modal({
                        title:  '提示',
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
                                onClick: () => {}
                            }
                        ]
                    })
                    return;
                }
                if(!nameAuthentication){
                    f7.modal({
                        title:  '提示',
                        text: '实名认证有助于交易成交，交易额翻番不是梦~',
                        buttons: [
                            {
                                text: '现在去认证',
                                onClick: goIdentity
                            },
                            {
                                text: '取消',
                                onClick: () => {}
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
        setTimeout(() => {
            currentPage.css({
                borderBottom: '1px solid #efeff4'
            })
        }, 1000)
    }

    currentPage.find('a.user-member')[0].onclick = () => {
        apiCount('btn_myCenter_myLevel');
        if (!isLogin()) {
            f7.alert('您还没登录，请先登录。', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/login.html',
                })
            })
            return;
        }
        nativeEvent['goNewWindow'](`${mWebUrl}user/member?id=${userInfomation['id']}`);
    }

    currentPage.find('a.user-help-service')[0].onclick = () => {
        nativeEvent['goNewWindow'](`${mWebUrl}helpCenter.html`);
    }

    currentPage.find('.my-collection-list')[0].onclick = () => {
        if (!isLogin()) {
            f7.alert('您还没登录，请先登录。', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/login.html',
                })
            })
            return;
        }
        mainView.router.load({
            url: 'views/myCollection.html'
        })
    }

    //if login succ, replace to change user info page, else replace to login page.
    $$('.user-header').off('click', goMyCenter).on('click', goMyCenter);

    //cilck identity authentication.
    $$('.go-identity').off('click', goIdentity).on('click', goIdentity);

    //cilck upload fish cert.
    $$('.go-verification').off('click', uploadCert).on('click', uploadCert);

    //click contact us button.
    $$('.user-help-list>.user-call-service').off('click', contactUs).on('click', contactUs);

    $$('.user-help-list>.user-invit').off('click', inviteFriends).on('click', inviteFriends);

    //view my release list.
    $$('.user-info-list>a.my-buy-list').off('click', myListBuy).on('click', myListBuy);
    $$('.user-info-list>a.my-sell-list').off('click', myListSell).on('click', myListSell);
    currentPage.find('.user-refresh-auth').off('click', myListSell).on('click', myListSell);

    //go home page;
    $$('.href-go-home').off('click', goHome).on('click', goHome);
}

module.exports = {
    userInit,
}
