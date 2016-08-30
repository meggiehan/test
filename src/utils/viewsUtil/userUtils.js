import store from '../../utils/locaStorage';
import config from '../../config';
import objectUtil from '../clone';
import { getBusinessLicenseNumber, getName, html } from '../string';

const CustomClass = function() {};
let userUtils = new CustomClass();

userUtils.getAuthenticationText = (enterprise, enterpriseTime, personal, personalTime) => {
        const authenticationBtn = $$('p.user-identity-text');
        let text = '';
        let myCenterText = '';
        0 == personal && (text = '个人认证中');
        1 == personal && (text = '已完成个人认证');
        if (-1 == enterprise) {
            -1 == personal && (text = '点击认证');
            2 == personal && (text = '个人认证失败');
        } else if (2 == enterprise) {
            -1 == personal && (text = '企业认证失败');
            if (personalTime && enterpriseTime) {
                2 == personal && (text = personalTime > enterpriseTime ? '个人认证失败' : '企业认证失败')
            }
        }
        0 == enterprise && (text = '企业认证中');
        1 == enterprise && (text = '已完成企业认证');
        1 == enterprise && (authenticationBtn.addClass('succ'));


        1 == enterprise && (myCenterText = '企业认证');
        1 !== enterprise && 1 == personal && (myCenterText = '个人认证');
        1 !== enterprise && 1 !== personal && (myCenterText = false);

        //edit individual authentication and company authentication popup page.
        const individualStatus = $$('.individual-authentication-status-text>.text');
        const companyStatus = $$('.company-authentication-status-text>.text');
        individualStatus.text((personal == 1 && '审核通过') || (personal == 2 && '审核未通过') || '审核中');
        companyStatus.text((enterprise == 1 && '审核通过') || (enterprise == 2 && '审核未通过') || '审核中');
        if (userUtils.data) {
            const {
                name,
                identificationCard,
                personalAuthenticationDescribe,
                enterpriseAuthenticationDescribe,
                personalAuthenticationState,
                enterpriseAuthenticationState,
                enterpriseName,
                businessLicenseNo
            } = userUtils.data;
            personalAuthenticationDescribe && $$('.individual-faild-content').text(personalAuthenticationDescribe);
            enterpriseAuthenticationDescribe && $$('.company-faild-content').text(enterpriseAuthenticationDescribe);

            enterpriseName && $$('.company-authentication-name').text(enterpriseName);
            name && $$('.individual-authentication-name').text(getName(name));
            businessLicenseNo && $$('.company-authentication-number').text(getBusinessLicenseNumber(businessLicenseNo));
            identificationCard && $$('.individual-authentication-number').text(getBusinessLicenseNumber(identificationCard));
            const subPopup = $$('.page-identity-status');
            subPopup.removeClass('individual-review individual-succ individual-faild company-review company-succ company-faild');
            0 == personalAuthenticationState && subPopup.addClass('individual-review');
            1 == personalAuthenticationState && subPopup.addClass('individual-succ');
            2 == personalAuthenticationState && subPopup.addClass('individual-faild');
            0 == enterpriseAuthenticationState && subPopup.addClass('company-review');
            1 == enterpriseAuthenticationState && subPopup.addClass('company-succ');
            2 == enterpriseAuthenticationState && subPopup.addClass('company-faild');
        }

        return {
            text,
            myCenterText
        }
    },

    userUtils.getBussesInfoCallback = (data) => {
        const { code, message } = data;
        const authenticationBtn = $$('p.user-identity-text');
        const verificationBtn = $$('span.user-verification-num');
        const { cacheUserinfoKey } = config;
        let text = '';
        if (code == 1) {
            const list = data.data;
            userUtils.data = data.data['userInfo'] || data.data;

            if (list) {
                let {
                    demandInfo_buy_number,
                    demandInfo_sell_number,
                    fish_certificate_number,
                    enterprise_authentication_state,
                    personal_authentication_state,
                    personalAuthenticationTime,
                    enterpriseAuthenticationTime,
                    userInfo
                } = list;

                if (userInfo) {
                    const _token = store.get(cacheUserinfoKey)['token'];
                    const _userInfo = objectUtil.clone(userInfo);
                    enterprise_authentication_state = userInfo['enterpriseAuthenticationState'];
                    enterpriseAuthenticationTime = userInfo['enterpriseAuthenticationTime'];
                    personal_authentication_state = userInfo['personalAuthenticationState'];
                    personalAuthenticationTime = userInfo['personalAuthenticationTime'];

                    _userInfo['token'] = _token;
                    fish_certificate_number && (_userInfo['certNum'] = fish_certificate_number);
                    store.set(cacheUserinfoKey, _userInfo);
                }
                demandInfo_buy_number && html($$('.user-sell-num'), demandInfo_buy_number, null);
                demandInfo_sell_number && html($$('.user-buy-num'), demandInfo_sell_number, null);
                fish_certificate_number > -1 && verificationBtn.text(fish_certificate_number);

                enterprise_authentication_state == -1 ? $$('.individual-succ-button').show() : $$('.individual-succ-button').hide();
                personal_authentication_state == -1 ? $$('.company-succ-button').show() : $$('.company-succ-button').hide();
                1 == personal_authentication_state && (authenticationBtn.addClass('succ'));
                if (2 == enterprise_authentication_state) {
                    2 == personal_authentication_state &&
                        (text = personalAuthenticationTime > enterpriseAuthenticationTime ? '个人认证失败' : '企业认证失败')
                }
                1 == enterprise_authentication_state && (authenticationBtn.addClass('succ'));
                text = userUtils.getAuthenticationText(enterprise_authentication_state, enterpriseAuthenticationTime,
                    personal_authentication_state, personalAuthenticationTime)['text'];
            }
            text && authenticationBtn.text(text);
        }
    }

export default userUtils;
