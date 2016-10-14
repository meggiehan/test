import config from '../config/';
import store from '../utils/locaStorage';
import { trim, html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function isLogin() {
    const { cacheUserinfoKey } = config;
    const nativeToken = nativeEvent.getUserValue();
    let userInfo = store.get(cacheUserinfoKey);
    if (!nativeToken) {
        store.remove(cacheUserinfoKey);
        return false;
    } else {
        if (!userInfo) {
            userInfo = {
                token: nativeToken
            }
        } else {
            userInfo['token'] = nativeToken;
        }
        store.set(cacheUserinfoKey, userInfo);
        return true;
    }

}

function logOut() {
    // nativeEvent.nativeAlert('提示', '退出成功！', '确定'， '');
    store.clear();
    nativeEvent.logOut();
    // store.clear();
    // mainView.router.load({
    //     url: 'views/home.html'
    // })
}

function activeLogout() {
    store.clear();
    nativeEvent.setNativeUserInfo();
    mainView.router.load({
         url: 'views/user.html',
         reload: true
    })
}

function loginSucc(data, callback) {
    const { imgPath } = config;
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
    $$('.user-tell-number').text(`手机号：${loginName}`);
    imgUrl && ($$('.user-pic img').attr('src', `${imgUrl}${imgPath(8)}`));
    callback(data);
}

module.exports = {
    isLogin,
    logOut,
    loginSucc,
    activeLogout
}
