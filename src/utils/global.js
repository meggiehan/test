import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import framework7 from '../js/lib/framework7';

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

    getProandCity(province, city, longitude, latitude) {
        const $$ = Dom7;
        let addressObj = {
            province,
            city,
            longitude,
            latitude
        };
        const releaseAddressBtn = $$('.release-write-address>input');
        window['addressObj'] = addressObj;
        releaseAddressBtn.length && releaseAddressBtn.val(`${province}${city}`);
    }

    saveInforAddress(userId, provinceId, cityId, province, city, address) {
        const { identity, cacheUserinfoKey } = config;
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
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'updateUserInfo',
            data: [id, '', '', address, provinceId, cityId, province, city],
            type: 'post',
            noCache: true,
        }, callback);
    }

    init(f) {
        this.f7 = f;
        window['getPhoneSrc'] = this.getPhoneSrc;
        window['getProandCity'] = this.getProandCity;
        window['saveInforAddress'] = this.saveInforAddress;
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
