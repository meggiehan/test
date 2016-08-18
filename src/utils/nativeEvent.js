class CustomClass {
    
    //The third party statistics.
    apiCount(id) {
        const { ios, android } = window.currentDevice;
        ios && JS_UMengToCount(id);
        android && window.yudada.JS_UMengToCount(id);
    }

    // contact us 
    contactUs(id) {
        const { ios, android } = window.currentDevice;
        ios && JS_MakeCall(id);
        android && window.yudada.JS_MakeCall(id);
    }

    //choose address
    eventChooseAddress(){
        const { ios, android } = window.currentDevice;
        ios && JS_ChooseAddress();
        android && window.yudada.JS_ChooseAddress();
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
}

const nativeEvent = new CustomClass;
export default nativeEvent;
