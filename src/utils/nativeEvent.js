import config from '../config';
import framework7 from '../js/lib/framework7';

window.currentDevice = new framework7()['device'];
class CustomClass {

    //The third party statistics.
    apiCount(id) {
        const { ios, android } = window.currentDevice;
        ios && JS_UMengToCount(id);
        android && window.yudada.JS_UMengToCount(id);
    }

    // contact us 
    contactUs(phone) {
        const { ios, android } = window.currentDevice;
        ios && JS_MakeCall(phone);
        android && window.yudada.JS_MakeCall(phone);
    }

    //choose address
    eventChooseAddress(type) {
        //pageType:0:release page  1:mycenter page
        const { ios, android } = window.currentDevice;
        ios && JS_ChooseAddress(type);
        android && window.yudada.JS_ChooseAddress(type);
    }

    //get current address.
    getAddress() {
        const { ios, android } = window.currentDevice;
        ios && JS_LocationOfDevice();
        android && window.yudada.JS_LocationOfDevice();
    }

    //select pic
    postPic(mark, id) {
        const { ios, android } = window.currentDevice;
        ios && JS_PictureSeletor(mark, id);
        android && window.yudada.JS_PictureSeletor(mark, "上传照片", id);
    }

    //get api from native.
    getApi() {
        const { ios, android } = window.currentDevice;
        ios && JS_BaseUrl();
        android && window.yudada.JS_BaseUrl();
    }

    //cat pic
    catPic(url) {
        const { ios, android } = window.currentDevice;
        ios && JS_ShowOriginalImg(url);
        android && window.yudada.JS_ShowOriginalImg(url);
    }

    //weixin share infomation.
    shareInfo(title, html, url, message) {
        const { ios, android } = window.currentDevice;
        ios && JS_ToShare(title, html, url, message);
        android && window.yudada.JS_ToShare(title, html, url, message);
    }

    //release voice info.
    releaseVoiceInfo() {
        const { ios, android } = window.currentDevice;
        ios && JS_RecordingModal();
        android && window.yudada.JS_RecordingModal();
    }

    //native alert style.
    nativeAlert(title, message, button1, button2) {
        const { ios, android } = window.currentDevice;
        ios && JS_ShowAlertWithTitles(title, message, button1, button2);
        android && window.yudada.JS_ShowAlertWithTitles(title, message, button1, button2);
    }

    //native login.
    nativeLogin(username, code) {
        const { ios, android } = window.currentDevice;
        const obj = {
            'tele': username,
            'pass': code
        }
        ios && JS_SetUserInfo(obj);
        android && window.yudada.JS_Login(obj.tele, obj.pass, null);
    }

    getUserValue(key) {
        const { ios, android } = window.currentDevice;
        const token = ios ? JS_PerferenceGetShared(key) : window.yudada.JS_Token();
        return token;
    }

    logOut() {
        const { ios, android } = window.currentDevice;
        ios && JS_UserExitLog();
        android && window.yudada.JS_UserExitLog();
    }

    getAPi() {
        const { ios, android } = window.currentDevice;
        if (!window['JS_BaseUrl'] && (!window['yudada'] || !window['yudada']['JS_BaseUrl'])) {
            return false;
        }
        return ios ? JS_BaseUrl() : window.yudada.JS_BaseUrl();
    }

    getDistricInfo() {
        const { ios, android } = window.currentDevice;
        if (!window['JS_DisTanceInfo'] && (!window['yudada'] || !window['yudada']['JS_DisTanceInfo'])) {
            return false;
        }
        ios ? JS_DisTanceInfo() : window.yudada.JS_DisTanceInfo();
    }

}

const nativeEvent = new CustomClass;
export default nativeEvent;
