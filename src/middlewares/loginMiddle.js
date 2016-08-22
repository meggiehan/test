import config from '../config/';
import store from '../utils/locaStorage';
import { trim } from '../utils/string';

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
    const $$ = Dom7;
    const { loginName, list, imgPath, personalAuthenticationState, enterpriseAuthenticationState } = data;
    $$('.user-header').addClass('login-succ');
    $$('.user-tell-number')[0].innerText = `手机号：${loginName}`;
    if (list) {
        const {
            imgUrl,
            nickname,
            phone,
            name,
            identificationCard,
            enterpriseName,
            businessLicenseNo,
            provinceName,
            cityName
        } = list;
        imgUrl && ($$('.user-pic img').attr('src', `${imgUrl}${imgPath(8)}`));
        nickname && ($$('.user-name')[0].innerText = nickname);
    }
    callback();
}

module.exports = {
    isLogin,
    logOut,
    loginSucc,
}
