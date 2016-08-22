import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';


class CustomClass {
    getPhoneSrc(srcimg, src, index) {
        const { identity } = config;
        let individualCert = true;

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
        } else if (!index && src) {
            //save img url to hide button.
            $$('.my-center-head img').val(src);
        }
    }

    getProandCity(province, city, longitude, latitude){
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

    init(f) {
        this.f7 = f;
        window['getPhoneSrc'] = this.getPhoneSrc;
        window['getProandCity'] = this.getProandCity;
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
