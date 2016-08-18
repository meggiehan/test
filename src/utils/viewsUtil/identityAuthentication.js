import config from '../../config/';
import customAjax from '../../middlewares/customAjax';
import store from '../../utils/locaStorage';


class CustomClass {
    callback(data) {
            const { code, message } = data;
            this.f7.alert(1 == code ? '上传成功' : message);
     }
     //Submit individual infomation to server.
    subCardInfo() {
        const $$ = Dom7;
        const { cacheUserinfoKey } = config;
        const token = store.get(cacheUserinfoKey)['token'];
        const identityClasses = $$('.identity-infomation').attr('class');
        let individualPass = false;
        let individualSrcArr = [];
        if (identityClasses.indexOf('company') > -1) {
            //post company identity;
            const companyUrl = $$('.identity-company-pic img').attr('src');
            if (!companyUrl) {
                this.f7.alert('请按要求上传营业执照正本照', '温馨提示');
                return;
            }
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateEnterpriseUserInfo',
                data: [companyUrl, token],
                type: 'post',
                noCache: true,
            }, this.callback);
        } else {
            //post individual identity;
            individualPass = true;
            $$.each($$('.identity-individual-pic img'), (index, item) => {
            	individualSrcArr[index] = item;
                !$$(item).attr('src') && (individualPass = false);
            })
            if (!individualPass) {
                this.f7.alert('请按要求上传三张证件照', '温馨提示');
                return;
            }
            individualSrcArr.push(token);
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updatePersonalUserInfo',
                data: individualSrcArr,
                type: 'post',
                noCache: true,
            }, this.callback);
        }
    }


    init(f) {
        this.f7 = f;
    }
}

const identityAuthenticationUtils = new CustomClass();
export default identityAuthenticationUtils;
