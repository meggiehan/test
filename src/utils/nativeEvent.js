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
    contactUs(num) {
        const { ios, android } = this.device;
        ios && JS_MakeCall(id);
        android && window.yudada.JS_MakeCall(id);
    }
}

const nativeEvent = new CustomClass;
export default nativeEvent;
