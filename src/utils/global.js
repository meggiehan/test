import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import framework7 from '../js/lib/framework7';
import { fishCert } from '../utils/template';

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
});

class CustomClass {
    getPhoneSrc(srcimg, src, index) {
        const { identity, cacheUserinfoKey } = config;
        let individualCert = true;
        const id = store.get(cacheUserinfoKey)['id'];
        const callback = (data) => {
            const { code, message } = data;
            if (1 == code) {
                mainView.router.load({
                    url: 'views/user.html',
                    reload: true
                })
            }
        }
        if (index == 4) {
            $$('.my-center-head img').val(src);
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
        const releaseAddressBtn = $$('.release-write-address>input');
        window['addressObj']['provinceName'] = province;
        window['addressObj']['cityName'] = city;
        window['addressObj']['provinceId'] = provinceId;
        window['addressObj']['cityId'] = cityId;

        releaseAddressBtn.length && releaseAddressBtn.val(`${province}${city}`);
    }

    saveInforAddress(userId, provinceId, cityId, province, city, address) {
        const { identity, cacheUserinfoKey } = config;
        const id = store.get(cacheUserinfoKey)['id'];
        const { ios, android } = window.currentDevice;
        const callback = (data) => {

            console.log(data)
            const { code, message } = data;
            if (1 == code) {
                ios && f7.alert(message, '提示', () => {

                    mainView.router.load({
                        url: 'views/user.html',
                        reload: true
                    })
                })
                android && mainView.router.load({
                    url: 'views/user.html',
                    reload: true
                })

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
        const url = 0 ? 'views/home.html' : 'views/release.html';
        mainView.router.load({ url })
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
        let login_token;
        const userInfo = store.get(cacheUserinfoKey);
        if (userInfo) {
            login_token = userInfo['token'];
        }
        const callback = (data) => {
            const { code, message } = data;
            if (1 == code) {
                const addData = {
                    create_time: '1472721207',
                    file_size: fileSize,
                    path,
                    state: 0,
                    user_id: id,
                    user_login_name: userInfo['phone']
                }
                if (id) {
                    $$('.fish-cert-list>div[data-parent-id="' + id + '"]').remove();
                } else {
                    $$('.user-verification-num').text(parseInt($$('.user-verification-num').text()) + 1);
                }
                $$('.page-fish-cert .fish-cert-list').prepend(fishCert.certList(addData));
                setTimeout(() => { $$('img.lazy').trigger('lazy'); }, 0)
            } else {
                f7.alert(message, '提示')
            }
        }
        if (!id) {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'addUserFishCertificate',
                data: [login_token, path, uploadFilename, fileSize],
                type: 'post',
                noCache: true,
            }, callback);
        } else {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'addUserFishCertificate',
                data: [login_token, path, uploadFilename, fileSize],
                type: 'post',
                val: { id },
                noCache: true,
            }, callback);
        }
    }

    getKey(token, userId, state) {
        if (!state) {
            return;
        }
        window.mainView.router.load({
            url: 'views/user.html?uuid=' + token,
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

    JS_GoBack() {
        if (mainView['url'] && (mainView['url'].indexOf('home.html') > -1 || mainView['url'].index('user.html') > -1 || mainView['url'].indexOf('releaseSucc.html') > -1)) {
            return false;
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
        window['JS_GoBack'] = this.JS_GoBack;
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
