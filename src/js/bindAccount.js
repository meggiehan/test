import customAjax from '../middlewares/customAjax';
import config from '../config';
import store from '../utils/locaStorage';
import nativeEvent from '../utils/nativeEvent';

function bindAccountInit(f7, view, page) {
    f7.hideIndicator();
    const { cacheUserinfoKey } = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const token = nativeEvent.getUserValue();
    const weixinData = nativeEvent.getDataToNative('weixinData');
    const userInfo = store.get(cacheUserinfoKey);
    if(token){
        currentPage.find('.bind-account-phone').addClass('bind');
        if(userInfo){
            const {loginName} = userInfo;
            const phoneText = loginName.subStr(0, 3) + '*****' + loginName.subStr(7, 11);
            currentPage.find('.bind-account-phone').children('.text').text(phoneText)
        }
    }else{
        currentPage.find('.bind-account-phone').addClass('unbind');
    }

    if(weixinData){
        const {nickName} = weixinData;
        currentPage.find('.bind-account-weixin').addClass('bind');
        currentPage.find('.text').children('i').text(nickName);
    }else{
        currentPage.find('.bind-account-weixin').addClass('unbind');
    }
}

module.exports = {
    bindAccountInit
}
