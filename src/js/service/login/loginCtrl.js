import {isLogin} from '../../../middlewares/loginMiddle';
import loginModel from '../../../js/service/login/LoginModel';
import {JsBridge} from '../../../middlewares/JsBridge';
import store from '../../../utils/localStorage';
import nativeEvent from '../../../utils/nativeEvent';
import {getCurrentDay, getVersionSetTag} from '../../../utils/string';
import config from '../../../config';
import invitationModel from '../../service/invitation/InvitationModel';

function weixinAction(f7){
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
                        mainView.router.load({
                            url: 'views/user.html'
                        });
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
                        const {
                            waitAddPointerKey,
                            inviteInfoKey,
                            cacheUserInfoKey
                        } = config;
                        if(data.token){
                            store.set("accessToken", data.token);
                            getKey(data.token, '', '', 0);

                            //设置别名
                            JsBridge('JS_SetTagsWithAlias', {
                                tags: [
                                    getCurrentDay().replace('/', '').replace('/', ''),
                                    getVersionSetTag()
                                ],
                                alias: `${data.userInfoView.id}`
                            }, () => {}, f7);

                            if (1 == store.get(waitAddPointerKey)) {
                                const {invitationCode} = store.get(inviteInfoKey);
                                invitationModel.acceptInvitation(invitationCode);
                            }

                            if(data.userInfoView.fishCarDriverId || data.fishCarDriverId){
                                store.set('isFishCar', 1);
                            }
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