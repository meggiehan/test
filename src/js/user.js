import { isLogin } from '../middlewares/loginMiddle';
import store from '../utils/locaStorage';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import { loginSucc } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import userUtils from '../utils/viewsUtil/userUtils';
import { goHome, goMyCenter, myListBuy, myListSell, uploadCert, contactUs, cancleIndividual, canclCompany, goIdentity } from '../utils/domListenEvent';

function userInit(f7, view, page) {
    f7.hideIndicator();
    const {uuid} = page.query;
    let loginStatus = isLogin(uuid);
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
        f7.hideIndicator();
        const { code, message } = data;
        if (code == 1) {
            let _userInfo = data.data;
            _userInfo['token'] = userInfomation['token'];
            store.set(cacheUserinfoKey, _userInfo);
            userInfomation = _userInfo;
            $$('.user-tell-number').text(`手机号：${_userInfo['phone']}`);
            loginStatus = isLogin(uuid);
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
    $$('.user-header').off('click', goMyCenter).on('click', goMyCenter);

    //cilck identity authentication.
    $$('.user-cert-type>div.go-identity').off('click', goIdentity).on('click', goIdentity);


    //cilck upload fish cert.
    $$('.user-cert-type>div.go-verification').off('click', uploadCert).on('click', uploadCert);

    //click contact us button.
    $$('.user-help-list .first').off('click', contactUs).on('click', contactUs);

    //view my release list.
    $$('.user-info-list>a.my-buy-list').off('click', myListBuy).on('click', myListBuy);
    $$('.user-info-list>a.my-sell-list').off('click', myListSell).on('click', myListSell);

    //cancle authentication.
    $$('.cancel-individual-verify-buuton').off('click', cancleIndividual).on('click', cancleIndividual);

    $$('.cancel-company-verify-buuton').off('click', canclCompany).on('click', canclCompany);

    //go home page;
    $$('.href-go-home').off('click', goHome).on('click', goHome);
}

module.exports = {
    userInit,
}
