import config from '../config/';
import store from '../utils/locaStorage';
import { trim, html } from '../utils/string';

function isLogin() {
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    return userInfo && trim(userInfo.token) ? true : false;
}

function logOut() {
    store.clear();
    mainView.router.load({
        url: 'views/home.html'
    })
}

function loginSucc(data, callback) {
    const {imgPath} = config;
    const {
        imgUrl,
        nickname,
        phone,
        name,
        identificationCard,
        personalAuthenticationState,
        enterpriseAuthenticationState,
        enterpriseName,
        businessLicenseNo,
        loginName,
        provinceName,
        cityName
    } = data;
    $$('.user-header').addClass('login-succ');
    $$('.user-tell-number')[0].innerText = `手机号：${loginName}`;
    imgUrl && ($$('.user-pic img').attr('src', `${imgUrl}${imgPath(8)}`));
    nickname && (html($$('.page-user .user-name'), nickname, null));
    callback();
}

module.exports = {
    isLogin,
    logOut,
    loginSucc,
}
