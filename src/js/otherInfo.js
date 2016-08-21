import store from '../utils/locaStorage';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {getName, getBusinessLicenseNumber} from '../utils/string';

function otherInfoInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    const userCache = store.get(`getDemandInfo_id_${id}`);
    const {imgPath} = config;
    if (userCache) {
        const { userInfo } = userCache['data'];
        const {
            identificationCard,
            phone,
            enterpriseAuthenticationState,
            personalAuthenticationState,
            name,
            nickname,
            imgUrl,
            address,
            enterpriseName,
            businessLicenseNo,
            businessLicenseUrl
        } = userInfo;

        imgUrl && ($$('.page-other-info .center-head-pic img').attr('src', imgUrl + imgPath(8)));
        nickname && ($$('.page-other-info .my-center-nice-name')[0].innerText = nickname);
        phone && ($$('.other-info-phone')[0].innerText = phone);
        address && ($$('.other-info-address')[0].innerText = address);

        if(enterpriseAuthenticationState == 1){
        	$$('.other-authentication-info').addClass('company');
            $$('.other-cert-text>span')[0].innerText = '企业认证';
            enterpriseName && ($$('.other-campany-name')[0].innerText = enterpriseName);
            businessLicenseNo && ($$('.other-company-number')[0].innerText = getBusinessLicenseNumber(businessLicenseNo));
            $$('.other-cat-company-info').on('click',() => {
                nativeEnvent.catPic(businessLicenseUrl);
            })
        }else if(personalAuthenticationState == 1){
        	$$('.other-authentication-info').addClass('individual');   
            name && ($$('.other-info-name')[0].innerText = getName(name));
        }
    }

}

module.exports = {
    otherInfoInit
}
