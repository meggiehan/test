import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import framework7 from '../js/lib/framework7';
import { fishCert } from '../utils/template';

class CustomClass {
    getPhoneSrc(srcimg, src, index) {
        const { identity, cacheUserinfoKey } = config;
        let individualCert = true;
        const id = store.get(cacheUserinfoKey)['id'];
        const callback = (data) => {
            const f = new framework7();

            const { code, message } = data;
            f.alert(message, '提示', () => {
                if (1 == code) {
                    mainView.router.load({
                        url: 'views/user.html'
                    })
                }
            })
        }
        if (index > -1 && index <= 2) {
            $$('.identity-individual-pic>div').eq(index).addClass('on');
            $$('.identity-individual-pic>div').eq(index).find('img').attr('src', src + identity['individual']);
            $$.each($$('.identity-individual-pic>div'), (item) => {
                !$$(item).find('img').attr('src') && (individualCert = false);
            })
            individualCert && ($$('.identity-submit>.identity-submit-btn').addClass('pass individual-pass'));
        } else if (3 == index) {
            $$('.identity-company-pic>div').addClass('on');
            $$('.identity-company-pic>div').find('img').attr('src', src + identity['company']);
            $$('.identity-submit>.identity-submit-btn').addClass('pass company-pass');
        } else if (index == 'undefined' && src) {
            //save img url to hide button.
            $$('.my-center-head img').val(src);
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateUserInfo',
                data: [id, '', src],
                type: 'post',
                noCache: true,
            }, callback);
        }
    }

    getProandCity(province, city, provinceId, cityId) {
        if(!window['addressObj']){
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
        const callback = (data) => {
            const f = new framework7();
            console.log(data)
            const { code, message } = data;
            f.alert(message, '提示', () => {
                if (1 == code) {
                    mainView.router.load({
                        url: 'views/user.html'
                    })
                }
            })
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
        const f = new framework7();
        const userInfo = store.get(cacheUserinfoKey);
        if (userInfo) {
            login_token = userInfo['token'];
        }
        const callback = (data) => {
            const { code, message } = data;
            f.alert(message, '提示', () => {
                if (1 == code) {
                    mainView.router.load({
                        url: 'views/user.html'
                    })
                }
            })
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

    getKey(token, userId, state){
        mainView.router.load({
            url: 'views/user.html',
            reload: true,
            animatePage: true
        })
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
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
