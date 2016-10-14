import store from '../utils/locaStorage';
import config from '../config';
import { getName, trim } from '../utils/string';
import { getDate, timeDifference } from '../utils/time';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function inviteCodeInit(f7, view, page) {
	if(!isLogin()){
    	logOut();
    }
    f7.hideIndicator();
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const codeInput = currentPage.find('input');
    const subBtn = currentPage.find('a.button');
    let isPass = false;
    
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    const {
        inviterId,
        inviterNickname,
        inviterPhone,
        invitationTime,
    } = userInfo || { inviterId: false };

    if (inviterId) {
        //has filled in the information that was invited.
        $$('.invited-user-name').text(inviterNickname || inviterPhone || '***');
        $$('.invited-time').text(timeDifference(invitationTime*0.001) || '****年*月**日');
        $$('.page-invite-code>.page-content').addClass('invited');
    } else {
        $$('.page-invite-code>.page-content').addClass('inviting');
    }

    codeInput[0].oninput = function() {
        const val = trim(codeInput.val());
        if (val && val.length >= 4) {
            subBtn.addClass('pass');
            isPass = true;
        } else {
            subBtn.removeClass('pass');
            isPass = false;
        }
    }

    const callback = (data) => {
    	const {code, message} = data;
    	if(1 == code){
    		f7.alert('填写成功!', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/user.html',
                    animatePages: true
                })
            })
    	}else{
    		f7.alert('邀请码错误，请重新填写！', '温馨提示')
    		f7.hideIndicator();
    	}
    }

    subBtn[0].onclick = () => {
        if (!isPass) {
            return;
        }
        f7.showIndicator();
        customAjax.ajax({
            apiCategory: 'inviteter',
            data: [trim(codeInput.val())],
            header: ['token'],
            parameType: 'application/json',
            type: 'post',
            noCache: true,
        }, callback);
    }

}

module.exports = {
    inviteCodeInit
}
