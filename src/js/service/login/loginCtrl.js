import {isLogin} from '../../../middlewares/loginMiddle';
import loginModel from '../../../js/service/login/LoginModel';
import {JsBridge} from '../../../middlewares/JsBridge';
import store from '../../../utils/localStorage';
import nativeEvent from '../../../utils/nativeEvent';

function weixinAction(){
    JsBridge('JS_WeChatLoginWithBridge', '',(weixinCode) => {
        if(weixinCode){
            if(isLogin()){
                //绑定微信号
                loginModel.put({
                    code: weixinCode
                }, (res) => {
                    const {code, data, message} = res;
                    if(1 == code){
                        nativeEvent.nativeToast(1, '账号绑定成功！');
                        mainView.refreshPage();
                    }else if(102 == code){
                        window.weixinBindFaild();
                    }else{
                        alert(message);
                    }
                })
            }else{
                //微信登录
                loginModel.post({
                    code: weixinCode
                }, (res) => {
                    const {code, data, message} = res;
                    if(1 == code){
                        if(data.token){
                            nativeEvent.setDataToNative("accessToken", data.token);
                            store.set("accessToken", data.token);
                            getKey(data.token, '', '', 0);
                        }else{
                            data.userInfoView.unionId && store.set('weixinUnionId', data.userInfoView.unionId);
                            data.userInfoView && store.set("weixinData", data.userInfoView);
                            nativeEvent.nativeToast(1, '微信登录成功！');
                            getWeixinDataFromNative(data.userInfoView);
                        }
                    }else{
                        nativeEvent.nativeToast(0, message)
                    }
                })
            }
        }
    }, '');
}


export {
    weixinAction
}