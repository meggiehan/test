import store from '../utils/locaStorage';
import config from '../config';
import { getName, trim } from '../utils/string';
import { logOut } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function editNameInit(f7, view, page) {
    f7.hideIndicator();
    const nameInput = $$('.center-edit-name-input');
    const userInfo = store.get(config['cacheUserinfoKey']);
    const editUserNameSubBtn = $$('.center-submit-name');
    const {
        nickname,
        id
    } = userInfo;
    if (userInfo) {
        nickname && $$('.page-my-center .my-center-nickname span').text(nickname);
    }

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
                nativeEvent['nativeToast'](1, message);
                const val = trim(nameInput.val());
                let userInfoChange = userInfo;
                userInfoChange['nickname'] = val;
                store.set(config['cacheUserinfoKey'], userInfoChange);
                $$('.page-my-center').find('.center-name').children('span').text(val);
                view.router.back();
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
        if (isSendInfo && error) {
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
    editNameInit
}
