import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';


class CustomClass {
    getPhoneSrc(srcimg, src, index) {
        const $$ = Dom7;
        const { identity } = config;

        if (mark > -1 && mark <= 2) {
            $$('.identity-individual-pic>div').eq(mark).addClass('on');
            $$('.identity-individual-pic>div').eq(mark).find('img').attr('src', src + identity['individual']);
        } else if (3 == mark) {
            $$('.identity-company-pic>div').addClass('on');
            $$('.identity-company-pic>div').find('img').attr('src', src + identity['company']);
        } else if (4 == mark) {
            //save img url to hide button.
            $$('.user-img-hide').val(src);
        }
    }

    init(f) {
        this.f7 = f;
        window['getPhoneSrc'] = this.getPhoneSrc;
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
