import config from '../config';

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
    eventChooseAddress(type){
        //pageType:0:release page  1:mycenter page
        const { ios, android } = window.currentDevice;
        ios && JS_ChooseAddress(type);
        android && window.yudada.JS_ChooseAddress(type);
    }

    //select pic
    postPic(mark, id){
        const { ios, android } = window.currentDevice;
        ios && JS_PictureSeletor(mark, id);
        android && window.yudada.JS_PictureSeletor(mark, "上传照片", id);
    }

    //get api from native.
    getApi(){
        const { ios, android } = window.currentDevice;
        ios && JS_BaseUrl();
        android && window.yudada.JS_BaseUrl();
    }

    //cat pic
    catPic(url){
        const { ios, android } = window.currentDevice;
        ios && JS_ShowOriginalImg(url);
        android && window.yudada.JS_ShowOriginalImg(url);
    }

    //weixin share infomation.
    shareInfo(title, html, url, message){
        const { ios, android } = window.currentDevice;
        ios && JS_ToShare(title, html, url, message);
        android && window.yudada.JS_ToShare(title, html, url, message);
    }

    //release voice info.
    releaseVoiceInfo(){
        const { ios, android } = window.currentDevice;
        ios && JS_RecordingModal();
        android && window.yudada.JS_RecordingModal();
    }

}

const nativeEvent = new CustomClass;
export default nativeEvent;
