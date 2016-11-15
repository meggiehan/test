import customAjax from '../middlewares/customAjax';
import config from '../config';
import { trim, html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function loginCodeInit(f7, view, page) {
    f7.hideIndicator();
    const { phone } = page.query;
    const {  voiceCodeWaitTime, mWebUrl } = config;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const input = currentPage.find('.login-code-write').children('input')[0];
    const vioceBtn = currentPage.find('.login-code-voice')[0];
    const subBtn = currentPage.find('.login-code-submit')[0];
    let isPass = false;
    let isSend = false;
    let isCountDown = false;
    let _voiceCodeWaitTime = voiceCodeWaitTime;
    $$('.login-code-phone').text(phone);

    const getCodeCallback = (data) => {
        if (data.code == 1) {
            nativeEvent.nativeToast(1, '短信验证码发送成功,请您注意查收!');
            setTimeout(() => {
                input.focus();
            }, 500)
        }else{
            vioceBtn.click();
        }
    };

    //get code message.
    customAjax.ajax({
        apiCategory: 'phoneCode',
        data: [phone, 1],
        type: 'get',
        noCache: true,
        isMandatory: true
    }, getCodeCallback);

    input.oninput = () => {
        const val = trim(input.value);
        let classes = subBtn.className;
        if (/^\d{4}$/.test(val) && val.length == 4) {
            classes += ' on';
            subBtn.className = classes;
            input.blur();
            isPass = true;
            userLogin();
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
        const { code } = data;
        if (1 == code) {
            nativeEvent.nativeToast(1, '当前使用短信服务的人过多，已为你发送语音验证码!');
            const setIntervalId = setInterval(() => {
                if (_voiceCodeWaitTime < 0) {
                    clearInterval(setIntervalId);
                    isCountDown = false;
                    _voiceCodeWaitTime = voiceCodeWaitTime;
                    html(vioceBtn, '收不到验证码？点击这里', f7);
                    return;
                }
                voiceCountDown();
            }, 1000)
            setTimeout(() => {
                input.focus();
            }, 500)
        } else {
            nativeEvent.nativeToast(0, '当前使用人数过多，请稍后再试!');
            view.router.back();
        }
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
            apiCategory: 'phoneCode',
            data: [phone, 2],
            type: 'get',
            noCache: true,
            isMandatory: true
        }, callback);
    }

    //User registration. return user login infomation.
    let userLogin = () => {
        if (!isPass || isSend) {
            return;
        }
        f7.showPreloader('登录中...');
        nativeEvent.nativeLogin(phone, input.value);
    }
    subBtn.onclick = userLogin;

    //go to agreement of yudada.
    currentPage.find('.user-protocol').children('a')[0].onclick = () => {
        apiCount('btn_term');
        nativeEvent['goNewWindow'](`${mWebUrl}terms.html`);
    }
}

module.exports = {
    loginCodeInit
}
