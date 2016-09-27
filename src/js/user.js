import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import { loginSucc, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import userUtils from '../utils/viewsUtil/userUtils';
import { goHome, goMyCenter, myListBuy, myListSell, uploadCert, contactUs, goIdentity, inviteFriends } from '../utils/domListenEvent';

function userInit(f7, view, page) {
    f7.hideIndicator();
    const { uuid } = page.query;
    let loginStatus = isLogin(uuid);
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { cacheUserinfoKey, servicePhoneNumber, imgPath } = config;
    let userInfomation = store.get(cacheUserinfoKey);
    const emptyFun = () => {
            return;
        }
        // const getBussesInfo = () => {
        //     customAjax.ajax({
        //         apiCategory: 'userInfo',
        //         api: 'getUserCertificate',
        //         data: [userInfomation.token],
        //         type: 'get',
        //         val: {
        //             token: userInfomation['id']
        //         }
        //     }, userUtils.getBussesInfoCallback);
        // }

    const loginCallback = (data) => {
        f7.hideIndicator();
        const { code, message } = data;
        if (code == 1) {
            const {
                scanLink,
                imgUrl,
                nickname
            } = data.data || {};
            const codeUrl = `http://qr.topscan.com/api.php?text=${scanLink}${imgUrl ? '&logo=' + imgUrl + imgPath(8) : ''}`;
            $$('.picker-invite-code-img>img').attr('src', codeUrl);
            let _userInfo = data.data || { point: 40, level: 3 };
            _userInfo['token'] = userInfomation['token'];
            store.set(cacheUserinfoKey, _userInfo);
            userInfomation = _userInfo;
            $$('.user-tell-number').text(`手机号：${_userInfo['phone']}`);
            _userInfo['point'] && $$('.user-member-number').text(_userInfo['point']);
            $$('.user-name>i').addClass(`iconfont icon-v${_userInfo['level'] || 0}`);
            nickname && $$('.page-user .user-name>span').text(nickname);

            loginStatus = isLogin(uuid);
            loginSucc(userInfomation, userUtils.getBussesInfoCallback);
        } else {
            f7.alert(message);
        }
    }
    if (loginStatus) {
        loginSucc(userInfomation, emptyFun);
        customAjax.ajax({
            apiCategory: 'auth',
            data: [userInfomation.token],
            herder: ['login_token'],
            type: 'get',
            noCache: true,
        }, loginCallback);
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
        window.location.href = 'http://m.test.yudada.com/user/member?id=' + userInfomation['id'];
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
