import store from '../utils/locaStorage';
import config from '../config';
import { getName } from '../utils/string';
import {logOut} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import {trim} from '../utils/string';

function myCenterInit(f7, view, page) {
    const $$ = Dom7;
    const { imgPath } = config;
    const nameInput = $$('.center-edit-name-input');
    const userInfo = store.get(config['cacheUserinfoKey']);
    const {
        name,
        imgUrl,
        identificationCard,
        businessLicenseNo,
        phone,
        enterpriseAuthenticationState,
        personalAuthenticationState,
        nickname,
        provinceName,
        cityName
    } = userInfo;
    $$('.my-center-phone span')[0].innerText = phone;
    if (userInfo) {
        imgUrl && ($$('.my-center-head img').attr('src', imgUrl + imgPath(8)));
        provinceName && cityName && ($$('.my-center-address span')[0].innerText = `${provinceName} ${cityName}`);
        name && ($$('.center-name span')[0].innerText = getName(name));
    } else {

    }

    //upload user img.
    $$('.my-center-head').on('click', () => {
    	nativeEvent.postPic();
    })

    //edit user nickname, open popup.
    $$('.my-center-nickname').on('click', () => {
    	f7.popup('.popup-edit-name');
    })
    nameInput[0].oninput = () => {
    	const val = trim(nameInput.val());
    	if(val.length > 5){
    		f7.alert('名字最大长度为5位','提示');
    		$$('.center-submit-name').removeClass('pass');
    	}else if(0 < val.length <= 5){
    		$$('.center-submit-name').addClass('pass');
    	}else{
    		$$('.center-submit-name').removeClass('pass');
    	}
    }

    //Choose Address.
    $$('.my-center-address').on('click', () => {
    	nativeEvent.eventChooseAddress();
    })

    //user click logout button.
    $$('.my-center-logout').on('click', () => {
    	logOut();
    }) 

}

module.exports = {
    myCenterInit
}
