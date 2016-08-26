import customAjax from '../middlewares/customAjax';

function loginInit(f7, view, page) {
    const $$ = Dom7;
    const input = $$('.login-phone>input');
    const nextBtn = $$('.login-next>a');
    let isPass = false;
    let isSend = false;
    setTimeout(() => {
        $$('.login-phone-number input').focus();
    },400);

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
        if(event && event.keyCode == 13){
            nextBtn.click();
        }
    });
    const callback = (data) => {
        isSend = false;
        nextBtn.addClass('on');
        if (data.code == 1) {
            view.router.load({
                url: 'views/loginCode.html' + `?phone=${input.val()}&key=${data.data}`,
            })
        }
    };

    nextBtn.on('click', () => {
        if (!isPass || isSend) {
            return;
        }
        isSend = true;
        nextBtn.removeClass('on');
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
