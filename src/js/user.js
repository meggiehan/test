import { isLogin } from '../middlewares/loginMiddle';
import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import { loginSucc } from '../middlewares/loginMiddle';


function userInit(f7, view, page) {
    const $$ = Dom7;
    const loginStatus = isLogin();
    const { cacheUserinfoKey } = config;
    let userInfomation = store.get(cacheUserinfoKey);

    const loginCallback = (data) => {
    	console.log(data)
        const { code, message } = data;
        if (code == 1) {
            const { token } = data.data;
            let _userInfo = data.data;
            _userInfo['token'] = userInfomation['taken'];
            store.set(cacheUserinfoKey, _userInfo);
            userInfomation = _userInfo;
            loginSucc(userInfomation);
        } else {
            f7.alert(message);
        }
    }
    if (loginStatus) {
        loginSucc(userInfomation);
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'getUserInfo',
            data: [userInfomation.token],
            type: 'get',
        }, loginCallback);
    } else {
        $$('.user-header').on('click', () => {
            view.router.load({
                url: '../views/login.html',
                animatePages: true,
            })
        })
    }

}

module.exports = {
    userInit,
}
