class CustomClass {
    init() {
        this.$$ = Dom7;
        this.device = window.currentDevice;
    }

    //The third party statistics.
    apiCount(id) {
        const { ios, android } = this.device;
        ios && JS_UMengToCount(id);
        android && window.yudada.JS_UMengToCount(id);
    }

    // contact us 
    contactUs(id) {
        const { ios, android } = this.device;
        ios && JS_MakeCall(id);
        android && window.yudada.JS_MakeCall(id);
    }

    eventChooseAddress(){
        const { ios, android } = this.device;
        ios && JS_ChooseAddress();
        android && window.yudada.JS_ChooseAddress();
    }
}

const nativeEvent = new CustomClass;
export default nativeEvent;
