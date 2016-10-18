import customAjax from '../middlewares/customAjax';

function loginInit(f7, view, page) {
    const { phone } = page.query;
    f7.hideIndicator();
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const domIndex = $$('.login-phone>input').length - 1;
    const input = currentPage.find('.login-phone').children('input')[0];
    const nextBtn = currentPage.find('.login-next').children('a')[0];
    let isPass = false;
    let isSend = false;
    setTimeout(() => {
        currentPage.find('.login-phone').children('input').focus();
    }, 400);

    const inputChange = () => {
        const val = input.value ;
        let classes = nextBtn.className;
        if (/^1[3|4|5|7|8]\d{9}$/.test(val)) {
            classes += ' on';
            nextBtn.className = classes;
            isPass = true;
        } else {
            nextBtn.className = classes.replace(' on', '');
            isPass = false;
        }
    }
    if(phone){
        input.value = phone;
        inputChange();
    }
    input.oninput = () => {
        inputChange();
    };
    //listen
    input.onkeypress = (e) => {
        const event = e || window.event;
        const code = event.keyCode || event.which || event.charCode;
        if (code == 13) {
            nextBtn.click();
        }
    };
    const callback = (data) => {
        isSend = false;
        nextBtn.className += ' on';
        if (data.code == 1) {
            view.router.load({
                url: 'views/loginCode.html' + `?phone=${input.value}&key=${data.data}`
            })
        }else{
            f7.hideIndicator();
            f7.alert('验证码发送频繁，请稍后再试！', '提示');
        }
    };

    nextBtn.onclick = () => {
        inputChange();
        if (!isPass || isSend) {
            return;
        }
        isSend = true;
        nextBtn.className = nextBtn.className.replace(' on', '');
        f7.showIndicator();

        customAjax.ajax({
            apiCategory: 'userLogin',
            api: 'getPhoneCode',
            data: [],
            type: 'get',
            noCache: true,
            isMandatory: true,
            val: {
                type: 1,
                phone: input.value
            }
        }, callback);
    }

}

module.exports = {
    loginInit
};
