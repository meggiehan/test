import customAjax from '../middlewares/customAjax';

function loginInit(f7, view, page) {
    f7.hideIndicator();
    const input = $$('.login-phone>input');
    const nextBtn = $$('.login-next>a');
    let isPass = false;
    let isSend = false;
    setTimeout(() => {
        $$('.login-phone-number input').focus();
    }, 400);

    input[0].oninput = () => {
        const val = input.val();
        if (/^1[3|4|5|7|8]\d{9}$/.test(val)) {
            nextBtn.addClass('on');
            isPass = true;
        } else {
            nextBtn.removeClass('on');
            isPass = false;
        }
    };
    //listen
    input.keypress((e) => {
        const event = e || window.event;
        const code = event.keyCode || event.which || event.charCode;
        if (code == 13) {
            nextBtn.click();
        }
    });
    const callback = (data) => {
        isSend = false;
        nextBtn.addClass('on');
        f7.hideIndicator();
        if (data.code == 1) {
            view.router.load({
                url: 'views/loginCode.html' + `?phone=${input.val()}&key=${data.data}`
            })
        }
    };

    nextBtn.on('click', () => {
        if (!isPass || isSend) {
            return;
        }
        isSend = true;
        nextBtn.removeClass('on');
        f7.showIndicator('登录中...');

        customAjax.ajax({
            apiCategory: 'userLogin',
            api: 'getPhoneCode',
            data: [],
            type: 'get',
            noCache: true,
            isMandatory: true,
            val: {
                type: 1,
                phone: input.val()
            }
        }, callback);
    })

}

module.exports = {
    loginInit
};
