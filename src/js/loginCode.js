import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import config from '../config';
import { trim, html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function loginCodeInit(f7, view, page) {
    f7.hideIndicator();
    const { phone } = page.query;
    let keyCode = page.query['key'];
    const { cacheUserinfoKey, voiceCodeWaitTime, mWebUrl } = config;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const domIndex = $$('.login-code-write>input').length - 1;
    const input = currentPage.find('.login-code-write').children('input')[0];
    const vioceBtn = currentPage.find('.login-code-voice')[0];
    const subBtn = currentPage.find('.login-code-submit')[0];
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
        const { code } = data;
        if (1 == code) {
            keyCode = data['data'];
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
        } else if (0 == code) {
            f7.alert('验证码发送频繁，请稍后再试！', '提示');
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

    //User registration. return user login infomation.
    subBtn.onclick = () => {
        if (!isPass || isSend) {
            return;
        }
        f7.showPreloader('登录中...');
        nativeEvent.nativeLogin(phone, input.value);
    }

    //go to agreement of yudada.
    currentPage.find('.user-protocol').children('a')[0].onclick = () => {
        nativeEvent['goNewWindow'](`${mWebUrl}terms.html`);
    }

}

module.exports = {
    loginCodeInit
}
