import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import framework7 from '../js/lib/framework7';
import { fishCert, releaseInfo } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { goIdentity } from './domListenEvent';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import { getQuery } from './string';

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
});

class CustomClass {
    getPhoneSrc(srcimg, src, index) {
        const { identity, cacheUserinfoKey, imgPath } = config;
        let individualCert = true;
        const id = store.get(cacheUserinfoKey)['id'];
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
        if (index == 4) {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateUserInfo',
                data: [id, '', src],
                type: 'post',
                noCache: true,
            }, callback);
        } else if (index > -1 && index <= 2) {
            $$('.identity-individual-pic>div').eq(index).addClass('on');
            $$('.identity-individual-pic>div').eq(index).find('img').attr('src', src + identity['individual']);
            $$.each($$('.identity-individual-pic>div'), (index, item) => {
                !$$('.identity-individual-pic>div').eq(index).find('img').attr('src') && (individualCert = false);
            })
            individualCert && ($$('.identity-submit>.identity-submit-btn').addClass('pass individual-pass'));
        } else if (3 == index) {
            $$('.identity-company-pic>div').addClass('on');
            $$('.identity-company-pic>div').find('img').attr('src', src + identity['company']);
            $$('.identity-submit>.identity-submit-btn').addClass('pass company-pass');
        }
    }

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

    getAdreesSys(province, city, longitude, latitude) {
        window['addressObj'] = {};
        window['addressObj']['initProvinceName'] = province;
        window['addressObj']['initCityName'] = city;
        window['addressObj']['longitude'] = longitude;
        window['addressObj']['latitude'] = latitude;
    }

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
            // parameType: 'application/json',
            data: [path, uploadFilename, fileSize],
            type: 'post',
            noCache: true,
        }, callback);
    }

    getKey(token, userId, state, status) {
        /*
         *   status == '0': user fisrt login.
         *   status == '1': user many login.
         */
        f7.hidePreloader();
        !Number(status) && nativeEvent.nativeToast(1, '登录成功！');
        const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
        currentPage.find('input').blur();
        window.mainView.router.load({
            url: `views/user.html?uuid=${token}`,
            animatePage: true
        })
    }

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

    loginFail() {
        const len = $$('.pages>.page').length - 1;
        f7.hidePreloader();
        $$('.login-code-write>input').val('');
        $$('.login-code-submit').removeClass('on');
        $$($$('.pages>.page')[len]).find('input[type="tel"]').focus();
    }

    logout() {
        const { cacheUserinfoKey } = config;
        store.remove(cacheUserinfoKey);
        window.mainView.router.load({
            url: `views/user.html?logout=true`,
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
                        url: 'views/user.html?logout=true',
                        reload: true
                    })
                }, 600)
                clearInterval(refreshId);
            }
        }, 500);
    }

    jsBack() {
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

    postReleasePicCallback(index, url, name) {
        const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
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
                mainView.router.load({
                    url: 'views/login.html'
                })
                return;
            }
            if ('level' == type) {
                nativeEvent['goNewWindow'](`${mWebUrl}user/member?id=${store.get(cacheUserinfoKey).id}`);
            } else if ('auth' == type) {
                customAjax.ajax({
                    apiCategory: 'auth',
                    header: ['token'],
                    type: 'get',
                    noCache: true,
                }, (data) => {
                    if(data.code == 1){
                        goIdentity();
                    }
                });
            }
        }
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
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
