import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import config from '../config';
import { trim, html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function loginCodeInit(f7, view, page) {
    f7.hideIndicator();
    const { phone, key } = page.query;
    const { cacheUserinfoKey, voiceCodeWaitTime } = config;
    const domIndex = $$('.login-code-write>input').length - 1;
    const input = $$('.login-code-write>input')[domIndex];
    const vioceBtn = $$('.login-code-voice')[domIndex];
    const subBtn = $$('.login-code-submit')[domIndex];
    let isPass = false;
    let isSend = false;
    let isCountDown = false;
    let _voiceCodeWaitTime = voiceCodeWaitTime;
    $$('.login-code-phone').text(phone);
    setTimeout(() => {
        input.focus();
    }, 400)
    input.oninput = () => {
        const val = input.value;
        let classes = subBtn.className;
        if (/^\d{4}$/.test(val) && val.length == 4) {
            classes += ' on';
            subBtn.className = classes;
            input.blur();
            isPass = true;
            $$(subBtn).trigger('click');
        } else if (val.length >= 4) {
            input.value = val.substr(0, 4);
        } else {
            subBtn.className = classes.replace(' on', '');
            isPass = false;
        }
    }

    const voiceCountDown = () => {
        isCountDown = true;
        const text = `接收语音验证码大概需要${_voiceCodeWaitTime}秒`;
        html(vioceBtn, text, f7);
        _voiceCodeWaitTime--;
    }

    const callback = (data) => {
        isSend = false;
        const setIntervalId = setInterval(() => {
            if (_voiceCodeWaitTime < 0) {
                clearInterval(setIntervalId);
                isCountDown = false;
                html(vioceBtn, '收不到验证码？点击这里', f7);
                return;
            }
            voiceCountDown();
        }, 1000)
        f7.hideIndicator();
    }

    //get voice test code;
    vioceBtn.onclick = () => {
        if (isCountDown) {
            return;
        }
        isSend = true;
        f7.showIndicator();
        customAjax.ajax({
            apiCategory: 'userLogin',
            api: 'getPhoneCode',
            data: [],
            type: 'get',
            noCache: true,
            isMandatory: true,
            val: {
                type: 2,
                phone
            }
        }, callback);
    }

    // const loginCallback = (data) => {
    //     const { code, message } = data;
    //     if (code == 1) {
    //         const { token, userInfo } = data.data;
    //         let _userInfo = userInfo;
    //         _userInfo['token'] = token;
    //         store.set(cacheUserinfoKey, _userInfo);
    //         f7.alert('登录成功', () => {
    //             view.router.load({
    //                 url: 'views/user.html',
    //             })
    //         })
    //     } else {
    //         isSend = false;
    //         isPass = true;
    //         // f7.alert(message);
    //     }
    // }
    const regCallback = (data) => {
        if (data.code == 1) {
            const { loginName, loginPass } = data.data;
            // f7.hideIndicator();
            f7.showPreloader('登录中...');
            nativeEvent.nativeLogin(loginName, loginPass);
            //user login, return user infomation.
            // customAjax.ajax({
            //     apiCategory: 'userLogin',
            //     api: 'login',
            //     data: [loginName, loginPass],
            //     type: 'post',
            //     noCache: true,
            // }, loginCallback);
        } else {
            isSend = false;
            isPass = true;
            f7.alert(data.message, '提示', () => {
                input.value = '';
                input.focus();
            });
        }
    }


    //User registration. return user login infomation.
    subBtn.onclick = () => {
        if (!isPass || isSend) {
            return;
        }
        // f7.showIndicator();
        isSend = true;
        subBtn.className = subBtn.className.replace(' on', '');
        customAjax.ajax({
            apiCategory: 'userLogin',
            api: 'subUserPass',
            data: [input.value, key],
            type: 'get',
            noCache: true,
        }, regCallback);
    }

}

module.exports = {
    loginCodeInit
}
