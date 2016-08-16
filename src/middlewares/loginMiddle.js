import config from '../config/';
import store from '../utils/locaStorage';
import { trim } from '../utils/string';

function isLogin() {
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    const { token } = userInfo;
    return trim(token) ? true : false;
}

function logOut() {
    store.clear();
    location.replace('/#!/../views/login.html');
    location.reload();
}

function loginSucc(data){
	const $$ = Dom7;
	const {} = data;
	$$('.user-header').addClass('login-succ');

}

module.exports = {
    isLogin,
    logOut,
    loginSucc,
}
