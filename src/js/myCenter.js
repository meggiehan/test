import store from '../utils/locaStorage';
import config from '../config';
import { getName, trim } from '../utils/string';
import { logOut } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function myCenterInit(f7, view, page) {
    const $$ = Dom7;
    const { imgPath } = config;
    const nameInput = $$('.center-edit-name-input');
    const userInfo = store.get(config['cacheUserinfoKey']);
    const editUserNameSubBtn = $$('.center-submit-name');
    const {
        name,
        imgUrl,
        identificationCard,
        businessLicenseNo,
        phone,
        enterpriseAuthenticationState,
        personalAuthenticationState,
        nickname,
        provinceName,
        cityName,
        id
    } = userInfo;
    $$('.my-center-phone span').text(phone);
    if (userInfo) {
        imgUrl && ($$('.my-center-head img').attr('src', imgUrl + imgPath(8)));
        provinceName && cityName && $$('.my-center-address span').text(`${provinceName} ${cityName}`);
        name && $$('.center-name span').text(getName(name));
        nickname && $$('.page-my-center .my-center-nickname span').text(nickname);
    }

    //upload user img.
    $$('.my-center-head').off('click', nativeEvent.postPic).on('click', nativeEvent.postPic);

    //Choose Address.
    $$('.my-center-address').on('click', () => {
        nativeEvent.eventChooseAddress(1);
    })

    //user click logout button.
    $$('.my-center-logout').off('click', logOut).on('click', logOut);

    //edit user nickname, open popup.
    $$('.my-center-nickname').on('click', () => {
        f7.popup('.popup-edit-name');
    })

    nickname && (nameInput.val(nickname));
    const getErr = (val) => {
            let err = null;
            if (!val) {
                err = '名字不能为空！'
            } else if (val.length > 8) {
                err = '名字最大长度位8位！'
            } else if (val == nickname) {
                err = '请修改您的名字！'
            }
            return err;
        }
        //edit user name;
    let error;
    let isSendInfo = false;
    nameInput[0].oninput = () => {
        const val = trim(nameInput.val());
        error = getErr(val);
        if (val && val !== nickname && val.length <= 8) {
            editUserNameSubBtn.addClass('pass');
            error = null;
        } else {
            editUserNameSubBtn.removeClass('pass');
        }

    }
    const editUserCallback = (data) => {
            const { code, message } = data;
            if (1 == code) {
                f7.alert(message, '提示', () => {
                    f7.closeModal('.popup-edit-name');
                    view.router.load({
                        url: 'views/user.html'
                    })
                })
            } else {
                f7.alert(message, '提示')
            }
            isSendInfo = false;
            editUserNameSubBtn.removeClass('pass');
        }
    //click sub button post user name; 
    editUserNameSubBtn[0].onclick = () => {
        const val = trim(nameInput.val());
        error = getErr(val);
        if(isSendInfo && error){
            return;
        }
        isSendInfo = true;
        if (!error) {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateUserInfo',
                data: [id, val],
                type: 'post',
                noCache: true,
            }, editUserCallback);
        } else {
            f7.alert(error, '提示');
        }
    }
}

module.exports = {
    myCenterInit
}
