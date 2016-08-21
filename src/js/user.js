import { isLogin } from '../middlewares/loginMiddle';
import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import { loginSucc } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import userUtils from '../utils/viewsUtil/userUtils';

function userInit(f7, view, page) {
    const $$ = Dom7;
    let loginStatus = isLogin();
    const { cacheUserinfoKey, servicePhoneNumber } = config;
    let userInfomation = store.get(cacheUserinfoKey);
    const emptyFun = () => {
        return;
    }

    const getBussesInfo = () => {
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'getUserCertificate',
            data: [userInfomation.token],
            type: 'get',
            val: {
                token: userInfomation['id']
            }
        }, userUtils.getBussesInfoCallback);
    }

    const loginCallback = (data) => {
        const { code, message } = data;
        if (code == 1) {
            let _userInfo = data.data;
            _userInfo['token'] = userInfomation['token'];
            store.set(cacheUserinfoKey, _userInfo);
            userInfomation = _userInfo;
            loginStatus = isLogin();
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
        const url = loginStatus ? 'views/myCenter.html' : 'views/login.html';
        view.router.load({
            url
        })
    })

    //cilck identity authentication.
    $$('.user-cert-type>div').eq(0).on('click', () => {
        if (!loginStatus) {
            f7.alert('您还没登陆，请先登录。', '温馨提示', () => {
                view.router.load({
                    url: 'views/login.html',
                })
            })
        } else {
            view.router.load({
                url: 'views/identityAuthentication.html',
            })
        }
    })
    //click contact us button.
    $$('.user-help-list .first').click(() => {
        // nativeEvent.apiCount();
        nativeEvent.contactUs(servicePhoneNumber);
    })

}

module.exports = {
    userInit,
}
