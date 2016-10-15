import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import { loginSucc, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import userUtils from '../utils/viewsUtil/userUtils';
import { goHome, goMyCenter, myListBuy, myListSell, uploadCert, contactUs, goIdentity, inviteFriends } from '../utils/domListenEvent';

function userInit(f7, view, page) {
    f7.hideIndicator();
    const { uuid, logout } = page.query;
    let loginStatus = logout ? false : isLogin(uuid);
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { cacheUserinfoKey, servicePhoneNumber, imgPath, mWebUrl } = config;
    let userInfomation = store.get(cacheUserinfoKey);
    const emptyFun = () => {
        return;
    }
    const loginCallback = (data) => {
        f7.hideIndicator();
        const { code, message } = data;
        if (code == 1) {
            const {
                scanLink,
                imgUrl,
                nickname,
                favoriteCount
            } = data.data || { scanLink: 'http://baidu.com' };

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

            if (!$$('.picker-invite-head-img').attr('src')) {
                $$('.picker-invite-head-img').attr('src', imgUrl + imgPath(8));
            }
            let _userInfo = data.data || { point: 40, level: 3 };
            _userInfo['token'] = nativeEvent['getUserValue']();
            store.set(cacheUserinfoKey, _userInfo);
            userInfomation = _userInfo;
            userInfomation && loginSucc(userInfomation, userUtils.getBussesInfoCallback);
        } else {
            f7.alert(message);
        }
    }
    if (loginStatus) {
        if (userInfomation) {
            setTimeout(() => {
                loginSucc(userInfomation, userUtils.getBussesInfoCallback)
            }, 0);
        }
        customAjax.ajax({
            // parameType: 'application/json',
            apiCategory: 'auth',
            // data: [userInfomation.token],
            header: ['token'],
            type: 'get',
            isMandatory: true,
        }, loginCallback);
    } else {
        setTimeout(() => {
            currentPage.css({
                borderBottom: '1px solid #efeff4'
            })
        }, 1000)
    }

    currentPage.find('a.user-member')[0].onclick = () => {
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
    $$('.user-cert-type>div.go-identity').off('click', goIdentity).on('click', goIdentity);


    //cilck upload fish cert.
    $$('.user-cert-type>div.go-verification').off('click', uploadCert).on('click', uploadCert);

    //click contact us button.
    $$('.user-help-list>.user-call-service').off('click', contactUs).on('click', contactUs);

    $$('.user-help-list>.user-invit').off('click', inviteFriends).on('click', inviteFriends);

    //view my release list.
    $$('.user-info-list>a.my-buy-list').off('click', myListBuy).on('click', myListBuy);
    $$('.user-info-list>a.my-sell-list').off('click', myListSell).on('click', myListSell);

    //go home page;
    $$('.href-go-home').off('click', goHome).on('click', goHome);
}

module.exports = {
    userInit,
}
