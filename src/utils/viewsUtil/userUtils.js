import store from '../../utils/locaStorage';
import config from '../../config';
import objectUtil from '../clone';
import { getBusinessLicenseNumber, getName } from '../string';

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
        individualStatus[0].innerText = (personal == 1 && '审核通过') || (personal == 2 && '审核未通过') || '审核中';
        companyStatus[0].innerText = (enterprise == 1 && '审核通过') || (enterprise == 2 && '审核未通过') || '审核中';
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
            personalAuthenticationDescribe && ($$('.individual-faild-content')[0].innerText = personalAuthenticationDescribe);
            enterpriseAuthenticationDescribe && ($$('.company-faild-content')[0].innerText = enterpriseAuthenticationDescribe);

            enterpriseName && ($$('.company-authentication-name')[0].innerText = enterpriseName);
            name && ($$('.individual-authentication-name')[0].innerText = getName(name));
            businessLicenseNo && ($$('.company-authentication-number')[0].innerText = getBusinessLicenseNumber(businessLicenseNo));
            identificationCard && ($$('.individual-authentication-number')[0].innerText = getBusinessLicenseNumber(identificationCard));
            const subPopup = $$('.popup-individual-authentication');
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

                if (userInfo) {
                    const _token = store.get(cacheUserinfoKey)['token'];
                    const _userInfo = objectUtil.clone(userInfo);
                    _userInfo['token'] = _token;
                    // _userInfo['list'] = list;
                    store.set(cacheUserinfoKey, _userInfo);
                }
                demandInfo_buy_number && ($$('.user-sell-num')[0].innerText = demandInfo_buy_number);
                demandInfo_sell_number && ($$('.user-buy-num')[0].innerText = demandInfo_sell_number);
                (fish_certificate_number || 0 == fish_certificate_number) && ($$('.user-verification-num')[0].innerText = fish_certificate_number);


                1 == personal_authentication_state && (authenticationBtn.addClass('succ'));
                if (2 == enterprise_authentication_state) {
                    2 == personal_authentication_state &&
                        (text = personalAuthenticationTime > enterpriseAuthenticationTime ? '个人认证失败' : '企业认证失败')
                }
                1 == enterprise_authentication_state && (authenticationBtn.addClass('succ'));
                text = userUtils.getAuthenticationText(enterprise_authentication_state, enterpriseAuthenticationTime,
                    personal_authentication_state, personalAuthenticationTime)['text'];
            }
            text && ($$('.user-identity-text')[0].innerText = text);
        }
    }

export default userUtils;
