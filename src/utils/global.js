import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from './localStorage';
import framework7 from '../js/lib/framework7';
import { releaseInfo } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { goIdentity } from './domListenEvent';
import { isLogin, loginViewHide, loginViewShow } from '../middlewares/loginMiddle';
import { getQuery } from './string';

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示'
});

class CustomClass {

    /*
    * native返回认证上传的信息，h5更新用户关联信息
    * */
    getPhoneSrc(srcimg, src, index) {
        const { identity, cacheUserinfoKey, imgPath } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        let individualCert = true;
        const id = store.get(cacheUserinfoKey) ? store.get(cacheUserinfoKey)['id'] : '';
        const _index = Number(index);
        const callback = (data) => {
            const { code, message } = data;
            if (1 == code) {
                $$('.my-center-head img').attr('src', src + imgPath(8));
                $$('.user-pic>img').attr('src', src + imgPath(8));
                $$('img.picker-invite-head-img').attr('src', src + imgPath(8));
                let userInfoChange = store.get(cacheUserinfoKey);
                userInfoChange['imgUrl'] = src;
                store.set(cacheUserinfoKey, userInfoChange);
            }
        }
        if (_index == 4) {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateUserInfo',
                data: [id, '', src],
                type: 'post',
                noCache: true,
            }, callback);
        } else if (_index > -1 && _index <= 2) {
            /**
             * 上传司机身份证
             * */
            if(currentPage.find('.post-driver-header').length){
                currentPage.find('.post-box').children('.left').children('div').html(`<img src="${src}${identity['individual']}" />`);
                return;
            }

            /**
             * 上传非司机身份证
             * */
            $$('.identity-individual-pic>div').eq(_index).addClass('on');
            $$('.identity-individual-pic>div').eq(_index).find('img').attr('src', src + identity['individual']);
            $$.each($$('.identity-individual-pic>div'), (_index, item) => {
                !$$('.identity-individual-pic>div').eq(_index).find('img').attr('src') && (individualCert = false);
            })
            individualCert && ($$('.identity-submit>.identity-submit-btn').addClass('pass individual-pass'));
        } else if (3 == _index) {
            $$('.identity-company-pic>div').addClass('on');
            $$('.identity-company-pic>div').find('img').attr('src', src + identity['company']);
            $$('.identity-submit>.identity-submit-btn').addClass('pass company-pass');
        }
    }

    /*
    * native返回h5发布信息是选择地区信息
    * */
    getProandCity(province, city, provinceId, cityId) {
        if (!window['addressObj']) {
            window['addressObj'] = {};
        }
        if (!window['selectedAddress']) {
            window['selectedAddress'] = {};
        }
        const releaseAddressBtn = $$('.release-write-address>input');
        window['addressObj']['provinceName'] = province;
        window['addressObj']['cityName'] = city;
        window['addressObj']['provinceId'] = provinceId;
        window['addressObj']['cityId'] = cityId;
        window['selectedAddress']['provinceName'] = province;
        window['selectedAddress']['cityName'] = city;

        releaseAddressBtn.length && releaseAddressBtn.val(`${province}${city}`);
    }

    /*
    * 更新用户信息
    * */
    saveInforAddress(userId, provinceId, cityId, province, city, address) {
        const { identity, cacheUserinfoKey } = config;
        const { ios, android } = window.currentDevice;
        const { provinceName, cityName, id } = store.get(cacheUserinfoKey);
        if (province == provinceName && city == cityName) {
            nativeEvent['nativeToast'](0, '请改变您所在的地区！');
            return;
        }
        const callback = (data) => {

            const { code, message } = data;
            if (1 == code) {
                nativeEvent['nativeToast'](1, message);
                let userInfoChange = store.get(cacheUserinfoKey);
                userInfoChange['provinceName'] = province;
                userInfoChange['cityName'] = city;
                store.set(cacheUserinfoKey, userInfoChange);
                $$('.my-center-address').find('span').text(`${province}${city}`);
            }
        }
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'updateUserInfo',
            data: [id, '', '', address, provinceId, cityId, province, city],
            type: 'post',
            noCache: true,
        }, callback);
    }

    appJump(id) {
        const url = id == 0 ? 'views/home.html' : 'views/release.html';
        mainView.router.load({ url });
    }

    /*
    * native传给h5定位信息
    * */
    getAdreesSys(province, city, longitude, latitude) {
        window['addressObj'] = {};
        window['addressObj']['initProvinceName'] = province;
        window['addressObj']['initCityName'] = city;
        window['addressObj']['longitude'] = longitude;
        window['addressObj']['latitude'] = latitude;
    }

    /*
    * native给h5鱼类资质证书的资源信息，h5更新
    * */
    subAndShowFishAu(TOKEN, path, uploadFilename, fileSize, srcimg, id) {
        const { identity, cacheUserinfoKey } = config;
        const userInfo = store.get(cacheUserinfoKey);
        const callback = (data) => {
            const { code, message } = data;
            if (1 == code) {
                mainView.router.refreshPage();
            } else {
                f7.alert(message, '提示')
            }
        }
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'addUserFishCertificate',
            header: ['token'],
            // paramsType: 'application/json',
            data: [path, uploadFilename, fileSize],
            type: 'post',
            noCache: true,
        }, callback);
    }

    /*
    * native登录后跳转h5页面
    * */
    getKey(token, userId, state, status) {
        /*
         *   status == '0': user fisrt login.
         *   status == '1': user many login.
         *   status == '2':微信绑定手机号
         */
        (0 == status) && nativeEvent.nativeToast(1, '登录成功！');
        (2 == status) && nativeEvent.nativeToast(1, '手机号绑定成功！');
        loginViewHide();
        f7.hideIndicator();
        if('user' == mainView.activePage.name){
            mainView.router.refreshPage();
            f7.hidePreloader();
        }else if('bindAccount' == mainView.activePage.name){
            mainView.router.load({
                url: 'views/user.html'
            })
            f7.hidePreloader();
        }else{
            const loginCallback = (data) => {
                const {code, message} = data;
                const { cacheUserinfoKey } = config;
                if(1 == code){
                    store.set(cacheUserinfoKey, data.data);
                    // nativeEvent.setDataToNative("accessToken", data.token);
                    // store.set("accessToken", data.token);
                    nativeEvent.setUerInfoToNative({
                        inviterId: data.data.inviterId
                    });
                }else{
                    console.log(message);
                }
                f7.hidePreloader();
            }

            customAjax.ajax({
                apiCategory: 'auth',
                header: ['token'],
                type: 'get',
                noCache: true,
            }, loginCallback);
        }
    }

    /*
    * 退出app
    * */
    exitApp() {
        const { ios, android } = window.currentDevice;
        if (mainView['url'] && (mainView['url'].indexOf('home.html') > -1 || mainView['url'].indexOf('user.html') > -1)) {
            ios && JS_ExitProcess();
            android && window.yudada.JS_ExitProcess();
        }
    }

    andriodBack() {
        if (mainView['url'] && (mainView['url'].indexOf('home.html') > -1 || mainView['url'].indexOf('user.html') > -1 || mainView['url'].indexOf('releaseSucc.html') > -1)) {
            const { ios, android } = window.currentDevice;
            if (mainView['url'] && (mainView['url'].indexOf('home.html') > -1 || mainView['url'].indexOf('user.html') > -1)) {
                ios && JS_ExitProcess();
                android && window.yudada.JS_ExitProcess();
            }
        } else {
            mainView.router.back();
        }
    }

    /*
    * 调用native统计
    * */
    apiCount(name) {
        nativeEvent.apiCount(name);
    }

    writeHistory(history) {
        const arr = history.split(' ') || [];
        let resArr = [];
        arr.length && $$.each(arr, (index, str) => {
            resArr.push(str.replace('“', '').replace('”', ''));
        })
        const { cacheHistoryKey } = config;
        store.set(cacheHistoryKey, resArr);
    }

    /*
    * 登录失败时，native通知h5
    * */
    loginFail() {
        const currentPage = $$($$('.view-login .pages>.page')[$$('.view-login .pages>.page').length - 1]);
        f7.hidePreloader();
        currentPage.find('.login-code-write').children('input').val('');
        currentPage.find('.login-code-submit').removeClass('on');
        currentPage.find('input[type="tel"]').focus();
    }

    logout() {
        const { cacheUserinfoKey } = config;
        store.remove(cacheUserinfoKey);
        nativeEvent.setNativeUserInfo();
        window.mainView.router.load({
            url: `views/user.html`,
            animatePages: false,
            reload: true
        })
    }

    initLogout() {
        const { cacheUserinfoKey } = config;
        let refreshId = setInterval(() => {
            if (mainView['url'].indexOf('user.html') > -1) {
                store.remove(cacheUserinfoKey);
                setTimeout(() => {
                    mainView.router.load({
                        url: 'views/user.html',
                        reload: true
                    })
                }, 600)
                clearInterval(refreshId);
            }
        }, 500);
    }

    /*
    * 安卓手机物理键返回callback
    * */
    jsBack() {
        if($$('.view-login').hasClass('show')){
            const currentNavbar = $$($$('.view-login .navbar>.navbar-inner')[$$('.view-login .navbar>.navbar-inner').length - 1]);
            currentNavbar.find('.iconfont').click();
        }else if($$('.view-release-fish').hasClass('show')){
            const currentNavbar = $$($$('.view-release-fish .navbar>.navbar-inner')[$$('.view-release-fish .navbar>.navbar-inner').length - 1]);
            currentNavbar.find('.iconfont').click();
        }else{
            if (mainView['url'] && (mainView['url'].indexOf('home.html') > -1 || mainView['url'].indexOf('user.html') > -1 || mainView['url'].indexOf('releaseSucc.html') > -1)) {
                const { ios, android } = window.currentDevice;
                if (mainView['url'] && (mainView['url'].indexOf('home.html') > -1 || mainView['url'].indexOf('user.html') > -1)) {
                    ios && JS_ExitProcess();
                    android && window.yudada.JS_ExitProcess();
                }
            } else {
                mainView.router.back();
            }
        }
    }

    postReleasePicCallback(index, url, name) {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        currentPage.find('.release-info-pic-add').remove();
        const len = currentPage.find('.release-info-pic-list').children('span').length;
        currentPage.find('.release-info-pic-list').append(releaseInfo.picList(url, currentPage));
        len < 4 && currentPage.find('.release-info-pic-list').append(releaseInfo.addPicBtn());

    }

    /*
     * type: demandInfo, level, auth
     * 信息, 等级, 认证
     */
    jsJumpFromPush(obj) {
        const { cacheUserinfoKey, mWebUrl } = config;
        const { type, id } = getQuery(obj);
        if ('demandInfo' == type) {
            const callback = (data) => {
                if (data.data) {
                    const type = data.data.demandInfo.type;
                    mainView.router.load({
                        url: `views/${2 == type ? 'selldetail' : 'buydetail'}.html?id=${id}`
                    })
                }
            }
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfo',
                data: [id],
                header: ['token'],
                val: {
                    id
                },
                type: 'get'
            }, callback);
        } else {
            if (!isLogin()) {
                nativeEvent['nativeToast'](0, '您还没有登录，请先登录!');
                loginViewShow();
                return;
            }
            if ('level' == type) {
                nativeEvent['goNewWindow'](`${mWebUrl}user/member?id=${store.get(cacheUserinfoKey).id}`);
            } else if ('auth' == type) {
                customAjax.ajax({
                    apiCategory: 'auth',
                    header: ['token'],
                    type: 'get',
                    noCache: true
                }, (data) => {
                    if (data.code == 1) {
                        store.set(cacheUserinfoKey, data.data);
                        if(window.location.hash.indexOf("catIdentityStatus.html") > -1){
                            mainView.router.refreshPage();
                            return;
                        }
                        goIdentity();
                    } else {
                        console.log('获取用户信息失败！')
                    }
                });
            }
        }
    }

    /*
    * native调用h5登录页面
    * */
    jumpToLogin(){
        loginViewShow();
    }

    /*
    * 从native获取微信的用户信息
    * */
    getWeixinDataFromNative(data){
        nativeEvent.setDataToNative('weixinData', data);
        if(nativeEvent.getUserValue()){
            mainView.router.load({
                url: 'views/user.html',
                reload: true
            })
            loginViewHide();
        }else{
            loginView.router.load({
                url: 'views/bindPhone.html?notBindPhone=true'
            })
            mainView.router.refreshPage();
        }
        if(mainView.url && mainView.url.indexOf('bindAccount') > -1){
            mainView.router.refreshPage();
        }
    }

    /*
    * 绑定手机号失败，native调用提示
    * */
    phoneBindFaild(){
        const { servicePhoneNumber } = config;
        f7.hidePreloader();
        f7.modal({
            title: '暂时无法绑定',
            text: '你的手机号码已被其他微信账号绑定，你可以：<br/>1:绑定其它手机号码<br/>2:联系客服',
            verticalButtons: 'true',
            buttons: [
                {
                    text: '绑定其它手机号',
                    onClick: () => {
                        loginView.router.back();
                    }
                },
                {
                    text: '联系客服',
                    onClick: () => {
                        nativeEvent.contactUs(servicePhoneNumber);
                    }
                },
                {
                    text: '我再想想',
                    onClick: () => {}
                }
            ]
        })
    }

    /*
     * 绑定微信号失败，native调用提示
     * */
    weixinBindFaild(){
        const { servicePhoneNumber } = config;
        f7.hidePreloader();
        f7.modal({
            title: '暂时无法绑定',
            text: '你的微信号已被其他用户绑定，你可以：<br/>1:绑定其它微信号<br/>2:联系客服',
            buttons: [
                {
                    text: '我知道了',
                    onClick: () => {
                        mainView.router.refreshPage();
                    }
                },
                {
                    text: '联系客服',
                    onClick: () => {
                        nativeEvent.contactUs(servicePhoneNumber);
                    }
                }
            ]
        })
    }

    /**
     * 上传司机驾照回调函数
     * */
    postDriverFileCallback(index, url, name){
        const { identity } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        currentPage.find('.post-box').children('.right').children('div').html(`<img src="${url}${identity['individual']}" />`);
    }

    /**
     * 上传司机道路运输从业资格证回调函数
     * */
    postDriverRoadTransportFileCallback(index, url, name){
        const { identity } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        currentPage.find('.post-box').children('.left').children('div').html(`<img src="${url}${identity['individual']}" />`);
    }

    /**
     * 上传司机道路运输证回调函数
     * */
    postDriverTransportCertificateFileCallback(index, url, name){
        const { identity } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        currentPage.find('.post-box').children('.right').children('div').html(`<img src="${url}${identity['individual']}" />`);
    }

    init(f) {
        this.f7 = f;
        window['getPhoneSrc'] = this.getPhoneSrc;
        window['getProandCity'] = this.getProandCity;
        window['saveInforAddress'] = this.saveInforAddress;
        window['appJump'] = this.appJump;
        window['getAdreesSys'] = this.getAdreesSys;
        window['subAndShowFishAu'] = this.subAndShowFishAu;
        window['getKey'] = this.getKey;
        window['exitApp'] = this.exitApp;
        window['andriodBack'] = this.andriodBack;
        window['apiCount'] = this.apiCount;
        window['writeHistory'] = this.writeHistory;
        window['loginFail'] = this.loginFail;
        window['logout'] = this.logout;
        window['initLogout'] = this.initLogout;
        window['jsBack'] = this.jsBack;
        window['postReleasePicCallback'] = this.postReleasePicCallback;
        window['jsJumpFromPush'] = this.jsJumpFromPush;
        window['jumpToLogin'] = this.jumpToLogin;
        window['getWeixinDataFromNative'] = this.getWeixinDataFromNative;
        window['phoneBindFaild'] = this.phoneBindFaild;
        window['weixinBindFaild'] = this.weixinBindFaild;
        window['postDriverFileCallback'] = this.postDriverFileCallback;
        window['postDriverRoadTransportFileCallback'] = this.postDriverRoadTransportFileCallback;
        window['postDriverTransportCertificateFileCallback'] = this.postDriverTransportCertificateFileCallback;
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
