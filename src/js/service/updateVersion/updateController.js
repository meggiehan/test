"use strict";
import store from '../../../utils/localStorage';
import updateVersionMode from '../../model/UpdateVersionModel';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';
import {JsBridge} from '../../../middlewares/JsBridge';

/**
 * @param returnCode
 * value: 1  无更新
 * value: 2  大版本更新
 * value: 3  小版本更新
 * */
function updateCtrl(f7) {
    const {isOpenInviteNumberKey, isInvitePointNumberKey} = config;
    store.set(isOpenInviteNumberKey, 0);
    store.set(isInvitePointNumberKey, 0);
    const updateCallback = (res) => {
        const {
            describe,
            filePath,
            force,
            returnCode,
            versionNumber
        } = res;
        //没有更新，进入邀请流程
        if(1 == returnCode){
            return;
        }

        //有大版本更新
        if(2 == returnCode){
            nativeEvent.downLoadApp(filePath);

            $$('.update-content-text').html(describe.split("\n").join("<br />"));
            $$('.update-app-modal .update-content').css(
                'margin-top', `-${$$('.update-app-modal .update-content').height()*0.5 + 10}px`
            );

            if(force && window.device.android && (5 != window.yudada.JS_GetNetWorkStates())){
                $$('.update-app-modal').addClass('large');
                force && $$('.update-app-modal').addClass('force');
                $('body').attr('data-update-url', filePath);
            }else{
                JsBridge('JS_Download', filePath, (data) => {
                    if(1 == data){
                        $$('.update-app-modal').addClass('large');
                        force && $$('.update-app-modal').addClass('force');
                    }else{
                        nativeEvent.nativeToast(0, '下载失败！');
                    }
                })
            }
            return;
        }

        //有小版本更新
        if(3 == returnCode){
            nativeEvent.downLoadApp(filePath);

            $$('.update-content-text').html(describe.split("\n").join("<br />"));
            $$('.update-app-modal .update-content').css(
                'margin-top', `-${$$('.update-app-modal .update-content').height()*0.5 + 10}px`
            )
            JsBridge('JS_Download', filePath, (data) => {
                if(1 == data){
                    $$('.update-app-modal').addClass('small');
                }else{
                    nativeEvent.nativeToast(0, '下载失败！');
                }
            })
            return;
        }
    }
    updateVersionMode.get(updateCallback);
}

module.exports = {
    updateCtrl
};