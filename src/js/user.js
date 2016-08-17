import { isLogin } from '../middlewares/loginMiddle';
import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import { loginSucc } from '../middlewares/loginMiddle';
import {getBussesInfoCallback} from '../utils/userUtils';

function userInit(f7, view, page) {
    const $$ = Dom7;
    const loginStatus = isLogin();
    const { cacheUserinfoKey } = config;
    let userInfomation = store.get(cacheUserinfoKey);

    const emptyFun = () => {return;}

    const getBussesInfo = () => {
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'getUserCertificate',
            data: [userInfomation.token],
            type: 'get',
            val: {
                token: userInfomation['id']
            }
        }, getBussesInfoCallback);
    }

    const loginCallback = (data) => {
        const { code, message } = data;
        if (code == 1) {
            let _userInfo = data.data;
            _userInfo['token'] = userInfomation['token'];
            store.set(cacheUserinfoKey, _userInfo);
            userInfomation = _userInfo;
            loginSucc(userInfomation, getBussesInfo);
        } else {
            f7.alert(message);
        }
    }
    if (loginStatus) {
        loginSucc(userInfomation, emptyFun);
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'getUserInfo',
            data: [userInfomation.token],
            type: 'get',
            noCache: true,
        }, loginCallback);
    }

    //if login succ, replace to change user info page, else replace to login page.
    $$('.user-header').on('click', () => {
        if (loginStatus) {
            console.log('go to user info.')
        } else {
            view.router.load({
                url: '../views/login.html',
                animatePages: true,
            })
        }

    })

}

module.exports = {
    userInit,
}