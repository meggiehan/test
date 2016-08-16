import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import config from '../config';
import { trim, html } from '../utils/string';

function loginCodeInit(f7, view, page) {
    const $$ = Dom7;
    const { phone, key } = page.query;
    const { cacheUserinfoKey, voiceCodeWaitTime } = config;
    const input = $$('.login-code-write>input');
    const vioceBtn = $$('.login-code-voice');
    const subBtn = $$('.login-code-submit');
    let isPass = false;
    let isSend = false;
    let isCountDown = false;
    let _voiceCodeWaitTime = voiceCodeWaitTime;
    input[0].oninput = () => {
        const val = input.val();
        if (/^\d{4}$/.test(val) && val.length == 4) {
            subBtn.addClass('on');
            input.blur();
            isPass = true;
            subBtn.trigger('click');
        } else {
            subBtn.removeClass('on');
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
        }
        //get voice test code;
    vioceBtn.on('click', () => {
        if (isCountDown) {
            return;
        }
        isSend = true;
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
    })

    const loginCallback = (data) => {
        const { code, message } = data;
        if (code == 1) {
            const { token, userInfo } = data.data;
            let _userInfo = userInfo;
            _userInfo['token'] = token;
            store.set(cacheUserinfoKey, _userInfo);
            f7.alert('登录成功', () => {
                view.router.load({
                    url: '../views/user.html',
                    animatePages: true,
                })
            })
        } else {
            f7.alert(message);
        }
    }
    const regCallback = (data) => {
            if (data.code == 1) {
                const { loginName, loginPass } = data.data;
                //user login, return user infomation.
                customAjax.ajax({
                    apiCategory: 'userLogin',
                    api: 'login',
                    data: [loginName, loginPass],
                    type: 'post',
                    noCache: true,
                }, loginCallback);
            } else {
                f7.alert('登录失败！');
            }
        }
        //User registration. return user login infomation.
    subBtn.on('click', () => {
        if (!isPass || isSend) {
            return;
        }
        isSend = true;
        subBtn.removeClass('on');
        customAjax.ajax({
            apiCategory: 'userLogin',
            api: 'subUserPass',
            data: [input.val(), key],
            type: 'get',
            noCache: true,
        }, regCallback);
    })

}

module.exports = {
    loginCodeInit
}
