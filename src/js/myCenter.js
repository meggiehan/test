import store from '../utils/locaStorage';
import config from '../config';
import { getName, getAddressIndex } from '../utils/string';
import { logOut } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function myCenterInit(f7, view, page) {
    f7.hideIndicator();
    const { imgPath } = config;
    const nameInput = $$('.center-edit-name-input');
    const userInfo = store.get(config['cacheUserinfoKey']);
    const editUserNameSubBtn = $$('.center-submit-name');
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
        cityName,
        id,
        provinceId,
        cityId
    } = userInfo;
    $$('.my-center-phone span').text(phone);
    if (userInfo) {
        imgUrl && ($$('.my-center-head img').attr('src', imgUrl + imgPath(8)));
        provinceName && cityName && $$('.my-center-address span').text(`${provinceName} ${cityName}`);
        name && $$('.center-name span').text(getName(name));
        nickname && $$('.page-my-center .my-center-nickname span').text(nickname);
    }

    //upload user img.
    $$('.my-center-head').off('click', nativeEvent.postPic).on('click', nativeEvent.postPic);

    //Choose Address.
    $$('.my-center-address').on('click', () => {
        const {
            provinceIndex,
            cityIndex
        } = getAddressIndex(provinceName, cityName);
        nativeEvent.eventChooseAddress(1, provinceIndex, cityIndex);
    })

    //user click logout button.
    $$('.my-center-logout').off('click', logOut).on('click', logOut);

    //edit user nickname, open popup.
    $$('.my-center-nickname').on('click', () => {
        view.router.load({
            url: 'views/editName.html'
        })
    })

}

module.exports = {
    myCenterInit
}
