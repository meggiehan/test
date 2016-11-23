import config from '../config';
import framework7 from '../js/lib/framework7';

window.currentDevice = new framework7()['device'];
class CustomClass {

    //The third party statistics.
    apiCount(id) {
        const { ios, android } = window.currentDevice;
        if (!window['JS_UMengToCount'] && (!window['yudada'] || !window['yudada']['JS_UMengToCount'])) {
            return false;
        }
        ios && JS_UMengToCount(id);
        android && window.yudada.JS_UMengToCount(id);
    }

    // contact us 
    contactUs(phone) {
        const { ios, android } = window.currentDevice;
        if (!window['JS_MakeCall'] && (!window['yudada'] || !window['yudada']['JS_MakeCall'])) {
            return false;
        }
        ios && JS_MakeCall(phone.toString());
        android && window.yudada.JS_MakeCall(phone.toString());
    }

    //choose address
    eventChooseAddress(type, provinceIndex, cityIndex) {
        //pageType:0:release page  1:mycenter page
        const { ios, android } = window.currentDevice;
        if (!window['JS_ChooseAddress'] && (!window['yudada'] || !window['yudada']['JS_ChooseAddress'])) {
            return false;
        }
        ios && JS_ChooseAddress(type, provinceIndex || 0, cityIndex || 0);
        android && window.yudada.JS_ChooseAddress(type, provinceIndex || 0, cityIndex || 0);
    }

    //get current address.
    getAddress() {
        const { ios, android } = window.currentDevice;
        if (!window['JS_LocationOfDevice'] && (!window['yudada'] || !window['yudada']['JS_LocationOfDevice'])) {
            return false;
        }
        ios && JS_LocationOfDevice();
        android && window.yudada.JS_LocationOfDevice();
    }

    //select pic
    postPic(mark, id, path, functionName) {
        const { ios, android } = window.currentDevice;
        if (!window['JS_PictureSeletor'] && (!window['yudada'] || !window['yudada']['JS_PictureSeletor'])) {
            return false;
        }
        if(5 == mark){
            ios && JS_PictureSeletor(5, '', id, path || '', functionName || '');
            android && window.yudada.JS_PictureSeletor(5, "上传照片", id, path || '', functionName || '');
            return;
        }

        const _mark = Number(mark) > -4 ? mark : 4;
        ios && JS_PictureSeletor(_mark, '',  id, '', '');
        android && window.yudada.JS_PictureSeletor(_mark, "上传照片", id, '', '');
    }

    //cat pic
    catPic(url) {
        const { ios, android } = window.currentDevice;
        if (!window['JS_ShowOriginalImg'] && (!window['yudada'] || !window['yudada']['JS_ShowOriginalImg'])) {
            return false;
        }
        ios && JS_ShowOriginalImg(url);
        android && window.yudada.JS_ShowOriginalImg(url);
    }

    //weixin share infomation.
    shareInfo(title, html, url, message) {
        const { ios, android } = window.currentDevice;
        if (!window['JS_ToShare'] && (!window['yudada'] || !window['yudada']['JS_ToShare'])) {
            return false;
        }
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
        if (!window['JS_ShowAlertWithTitles'] && (!window['yudada'] || !window['yudada']['JS_ShowAlertWithTitles'])) {
            return false;
        }
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
        if (!window['JS_SetUserInfo'] && (!window['yudada'] || !window['yudada']['JS_Login'])) {
            return false;
        }
        ios && JS_SetUserInfo(obj);
        android && window.yudada.JS_Login(obj.tele, obj.pass);
    }

    getUserValue() {
        const { ios, android } = window.currentDevice;
        if (!window['JS_Token'] && (!window['yudada'] || !window['yudada']['JS_Token'])) {
            return false;
        }
        const token = ios ? JS_Token() : window.yudada.JS_Token();
        return token;
    }

    logOut() {
        const { ios, android } = window.currentDevice;
        if (!window['JS_UserExitLog'] && (!window['yudada'] || !window['yudada']['JS_UserExitLog'])) {
            return false;
        }
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
        if (!window['JS_AreaInfo'] && (!window['yudada'] || !window['yudada']['JS_AreaInfo'])) {
            return false;
        }
        return ios ? JSON.parse(JS_AreaInfo()) : JSON.parse(window.yudada.JS_AreaInfo());
    }

    nativeToast(type, message) {
        //type: 0 faild, 1 succ;
        const { ios, android } = window.currentDevice;
        if (!window['JS_ShowHUD_AutoDisappear'] && (!window['yudada'] || !window['yudada']['JS_ShowHUD_AutoDisappear'])) {
            return false;
        }
        ios ? JS_ShowHUD_AutoDisappear(type, message) : window.yudada.JS_ShowHUD_AutoDisappear(type, message);
    }

    setNativeUserInfo() {
        //clear user info on native.
        const { ios, android } = window.currentDevice;
        if (!window['JS_PerferenceSetShared'] && (!window['yudada'] || !window['yudada']['JS_PerferenceSetShared'])) {
            return false;
        }
        ios ? JS_PerferenceSetShared() : window.yudada.JS_PerferenceSetShared('token', '');
    }

    nativeGoBack(){
        window.yudada.JS_GoBack();
    }

    getNetworkStatus(){
        const { ios, android } = window.currentDevice;
        if (!window['JS_GetNetWorkStates'] && (!window['yudada'] || !window['yudada']['JS_GetNetWorkStates'])) {
            return true;
        }
        const status = ios ? JS_GetNetWorkStates() : window.yudada.JS_GetNetWorkStates();
        return Number(status);
    }

    getDeviceInfomation(){
        const { ios, android } = window.currentDevice;
        if (!window['JS_VersionInfo'] && (!window['yudada'] || !window['yudada']['JS_VersionInfo'])) {
            return false;
        }
        return ios ? JSON.parse(JS_VersionInfo()) : JSON.parse(window.yudada.JS_VersionInfo());
    }

    setClipboardValue(val){
        const { ios, android } = window.currentDevice;
        if (!window['JS_CopyResult'] && (!window['yudada'] || !window['yudada']['JS_CopyResult'])) {
            return false;
        }
        ios ? JS_CopyResult(val) : window.yudada.JS_CopyResult(val);
    }

    goNewWindow(url){
        const { ios, android } = window.currentDevice;
        if (!window['JS_JumpToThirdWeb'] && (!window['yudada'] || !window['yudada']['JS_JumpToThirdWeb'])) {
            return false;
        }
        ios ? JS_JumpToThirdWeb(url) : window.yudada.JS_JumpToThirdWeb(url);
    }

    searchHistoryActions(type, val) {
        /*
         *  type == 1: save search history;
         *  type == 2: get search history;
         *  type == 3: clear search history.
         */
        const { ios, android } = window.currentDevice;
        if (!window['JS_SearchRecord'] && (!window['yudada'] || !window['yudada']['JS_SearchRecord'])) {
            return false;
        }
        ios ? JS_SearchRecord(type, val) : window.yudada.JS_SearchRecord(type, val);
    }

    getDataToNative(key){
        const { ios, android } = window.currentDevice;
        if (!window['JS_GetObjectWithKey'] && (!window['yudada'] || !window['yudada']['JS_GetObjectWithKey'])) {
            return false;
        }
        ios ? JS_GetObjectWithKey(key) : window.yudada.JS_GetObjectWithKey(key);
    }

    setDataToNative(key, val){
        const { ios, android } = window.currentDevice;
        if (!window['JS_SaveObjectWithKey'] && (!window['yudada'] || !window['yudada']['JS_SaveObjectWithKey'])) {
            return false;
        }
        ios ? JS_SaveObjectWithKey(key, val) : window.yudada.JS_SaveObjectWithKey(key, val);
    }

}

const nativeEvent = new CustomClass;
export default nativeEvent;
