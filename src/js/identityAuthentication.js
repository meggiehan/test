import nativeEvent from '../utils/nativeEvent';
import identityAuthenticationUtils from '../utils/viewsUtil/identityAuthentication';
import store from '../utils/locaStorage';
import config from '../config';

function identityAuthenticationInit(f7, view, page) {
    f7.hideIndicator();
    const individualBtn = $$('.identity-individual');
    const companyBtn = $$('.identity-company');
    const certBox = $$('.identity-infomation');
    const authenticationDemo = $$('.identity-pic-demo');
    const subBtn = $$('.identity-submit>.identity-submit-btn');
    const { cacheUserinfoKey } = config;
    const {
        enterpriseAuthenticationState,
        personalAuthenticationState
    } = store.get(cacheUserinfoKey);
    let individualType = 0;
    let individualPicNum = 0;
    let companyPicNum = 0;
    identityAuthenticationUtils.init(f7);

    /*
     * identity individual doing.
     */
    //select identity individual.
    individualBtn[0].onclick = () => {
        if (1 == personalAuthenticationState) {
            return;
        }
        individualType = 1;
        $$('.identity-select-type .col-50').removeClass('active');
        individualBtn.addClass('active');
        certBox.addClass('individual').removeClass('company');
        authenticationDemo.addClass('show');
        subBtn.hasClass('individual-pass') ? subBtn.addClass('pass') : subBtn.removeClass('pass');
    }
    $$.each($$('.identity-individual-pic>div'), (index, item) => {
        $$(item).on('click', () => {
            nativeEvent.postPic(index, '');
        })
    })


    /*
     * identity company doing.
     */
    //select identity company.
    companyBtn[0].onclick = () => {
        if (1 == enterpriseAuthenticationState) {
            return;
        }
        individualType = 2;
        $$('.identity-select-type .col-50').removeClass('active');
        companyBtn.addClass('active');
        certBox.addClass('company').removeClass('individual');
        authenticationDemo.removeClass('show');
        subBtn.hasClass('company-pass') ? subBtn.addClass('pass') : subBtn.removeClass('pass');
    }

    $$('.identity-company-pic>div').on('click', () => {
        nativeEvent.postPic(3, '');
    })

    //click submit set ajax.
    $$('.identity-submit>a').on('click', () => {
        const classes = $$('.identity-submit>a').attr('class');
        identityAuthenticationUtils.subCardInfo();
    })

    if (enterpriseAuthenticationState == 1) {
        $$('.identity-select-type .identity-company p').eq(1).text('已认证');
        individualBtn.addClass('active');
        certBox.addClass('individual').removeClass('company');
        authenticationDemo.addClass('show');
    } else if (personalAuthenticationState == 1) {
        $$('.identity-select-type .identity-individual p').eq(1).text('已认证');
        companyBtn.addClass('active');
        certBox.addClass('company').removeClass('individual');
    }


}

module.exports = {
    identityAuthenticationInit
}
