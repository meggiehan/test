import config from '../config/';
import store from '../utils/locaStorage';
import { trim, html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function isLogin(uuid) {
    const { cacheUserinfoKey } = config;
    const nativeToken = nativeEvent.getUserValue() || uuid;
    if (!nativeToken) {
        store.remove(cacheUserinfoKey);
        return false;
    } else{
        return true;
    }
}

function logOut() {
    store.clear();
    nativeEvent.logOut();
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
        point,
        cityName,
        level,
        favoriteCount
    } = data;
    $$('.user-header').addClass('login-succ');
    $$('.user-tell-number').text(`手机号：${loginName || ''}`);
    imgUrl && ($$('.user-pic img').attr('src', `${imgUrl}${imgPath(8)}`));
    favoriteCount && $$('.user-collection-num').text(favoriteCount);
    nickname && $$('.page-user .user-name>span').text(nickname);
    point && $$('.user-member-number').text(point);
    $$('.user-name>i').addClass(`iconfont icon-v${level || 0}`);
    callback(data);
}

module.exports = {
    isLogin,
    logOut,
    loginSucc,
    activeLogout
}
