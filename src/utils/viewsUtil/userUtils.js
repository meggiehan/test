import customAjax from '../../middlewares/customAjax';
import store from '../../utils/locaStorage';
import config from '../../config';


function getBussesInfoCallback(data) {
    const $$ = Dom7;
    const { code, message } = data;
    const authenticationBtn = $$('p.user-identity-text');
    const verificationBtn = $$('span.user-verification-num');
    const { cacheUserinfoKey } = config;

    if (code == 1) {
        const list = data.data;
        let text;
        if (list) {
            const {
                demandInfo_buy_number,
                demandInfo_sell_number,
                fish_certificate_number,
                enterprise_authentication_state,
                personal_authentication_state,
                personalAuthenticationTime,
                enterpriseAuthenticationTime,
                userInfo
            } = list;

            if(userInfo){
            	const _token = store.get(cacheUserinfoKey)['token'];
            	const _userInfo = Object.assign({},userInfo,{token: _token});
            	store.set(cacheUserinfoKey, _userInfo);
            }
            demandInfo_buy_number && ($$('.user-sell-num')[0].innerText = demandInfo_buy_number);
            demandInfo_sell_number && ($$('.user-buy-num')[0].innerText = demandInfo_sell_number);
            fish_certificate_number && ($$('.user-verification-num')[0].innerText = fish_certificate_number);

            0 == personal_authentication_state && (text = '个人认证中');
            1 == personal_authentication_state && (text = '已完成个人认证');
            1 == personal_authentication_state && (authenticationBtn.addClass('succ'));
            if (-1 == enterprise_authentication_state) {
                -1 == personal_authentication_state && (text = '点击认证');
                2 == personal_authentication_state && (text = '个人认证失败');
            } else if (2 == enterprise_authentication_state) {
                -1 == personal_authentication_state && (text = '企业认证失败');
                2 == personal_authentication_state && 
                (text = personalAuthenticationTime > enterpriseAuthenticationTime ? '个人认证失败' : '企业认证失败')
            }
            0 == enterprise_authentication_state && (text = '企业认证中');
            1 == enterprise_authentication_state && (text = '已完成企业认证');
            1 == enterprise_authentication_state && (authenticationBtn.addClass('succ'));
        }
    }
}

module.exports = {
    getBussesInfoCallback,
}
