import customAjax from '../middlewares/customAjax';

function loginInit(f7, view, page) {
    const { phone } = page.query;
    f7.hideIndicator();
    const domIndex = $$('.login-phone>input').length - 1;
    const input = $$('.login-phone>input')[domIndex];
    const nextBtn = $$('.login-next>a')[domIndex];
    let isPass = false;
    let isSend = false;
    setTimeout(() => {
        $$('.login-phone-number input').focus();
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
        f7.hideIndicator();
        if (data.code == 1) {
            view.router.load({
                url: 'views/loginCode.html' + `?phone=${input.value}&key=${data.data}`
            })
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
