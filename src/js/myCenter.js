import store from '../utils/localStorage';
import config from '../config';
import { getName, getAddressIndex } from '../utils/string';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function myCenterInit(f7, view, page) {
    f7.hideIndicator();
    if (!isLogin()) {
        nativeEvent['nativeToast'](0, '您还没有登录，请先登录!');
        mainView.router.load({
            url: 'views/login.html',
            reload: true
        });
        return;
    }
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const { imgPath } = config;
    const userInfo = store.get(config['cacheUserInfoKey']);
    const {
        name,
        imgUrl,
        phone,
        nickname,
        provinceName,
        cityName,
    } = userInfo;
    currentPage.find('.my-center-phone span').text(phone);
    if (userInfo) {
        imgUrl && ($$('.my-center-head img').attr('src', imgUrl + imgPath(8)));
        provinceName && cityName && $$('.my-center-address span').text(`${provinceName} ${cityName}`);
        name && $$('.center-name span').text(getName(name));
        nickname && $$('.page-my-center .my-center-nickname span').text(nickname);
    }

    /**
     * 调用native组件获取图片信息上传到服务器
     * */
    currentPage.find('.my-center-head')[0].onclick = () => {
        nativeEvent.postPic(4);
    };

    /**
     * 选择所在地区
     * */
    currentPage.find('.my-center-address')[0].onclick = () => {
        const {
            provinceIndex,
            cityIndex
        } = getAddressIndex(provinceName, cityName);
        nativeEvent.eventChooseAddress(1, provinceIndex, cityIndex);
    };

    /**
     * 退出登录
     * */
    currentPage.find('.my-center-logout')[0].onclick = () => {
        logOut(f7);
    };

    /**
     * 跳转至修改昵称页面
     * */
    currentPage.find('.my-center-nickname')[0].onclick = () => {
        view.router.load({
            url: 'views/editName.html'
        })
    }
}

export {
    myCenterInit
}
