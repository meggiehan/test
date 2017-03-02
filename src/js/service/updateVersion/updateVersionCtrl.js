"use strict";
import store from '../../../utils/localStorage';
import UpdateVersionMode from './UpdateVersionModel';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';
import {JsBridge} from '../../../middlewares/JsBridge';
import {invitationInit} from '../../service/invitation/invitationCtrl'


/**
 * @param returnCode
 * value: 1  无更新
 * value: 2  大版本更新
 * value: 3  小版本更新
 * */
function updateCtrl(f7) {
    const {waitAddPointerKey} = config;
    store.set(waitAddPointerKey, 0);
    const $updateInfoText = $$('.update-content-text');
    const $updateModalBox = $$('.update-app-modal .update-content');
    const $updateModal = $$('.update-app-modal');
    const $body = $('body');

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
            /* 初始化邀请码 */
            invitationInit(f7, mainView);
            return;
        }else{
            $body.attr('data-update-version', versionNumber);
        }

        //有大版本更新
        if(2 == returnCode){
            $updateInfoText.html(describe.split("\n").join("<br />"));
            $updateModalBox.css(
                'margin-top', `-${$updateModalBox.height()*0.5 + 10}px`
            );

            if(force && window.device.android && (5 != window.yudada.JS_GetNetWorkStates())){
                $updateModal.addClass('large');
                force && $updateModal.addClass('force');
                $body.attr('data-update-url', filePath);
            }else{
                JsBridge('JS_Download', {
                    filePath,
                    name: 'webapp.apk'
                }, (data) => {
                    if(1 == data){
                        $updateModal.addClass('large');
                        force && $updateModal.addClass('force');
                    }else{
                        nativeEvent.nativeToast(0, '下载失败！');
                    }
                })
            }
            return;
        }

        //有小版本更新
        if(3 == returnCode){
            $updateInfoText.html(describe.split("\n").join("<br />"));
            $updateModalBox.css(
                'margin-top', `-${$updateModalBox.height()*0.5 + 10}px`
            )
            JsBridge('JS_Download', {
                filePath,
                name: 'webapp.zip'
            }, (data) => {
                if(1 == data){
                    $updateModal.addClass('small');
                }else{
                    nativeEvent.nativeToast(0, '下载失败！');
                }
            });
            return;
        }
    };
    UpdateVersionMode.get(updateCallback);
}

function updateClickEvent(){
    /**
     * 小版本更新
     * */
    $$('.small-version-update').click(() => {
        JsBridge('JS_WebAppUpdate', 'yudada.zip',() => {})
    })

    /**
     * 大版本更新
     * 非强制更新/强制更新
     * */
    $$('.large-version-update').click(() => {
        if (android) {
            if (!$$('.update-app-modal').hasClass('force') && (5 != window.yudada.JS_GetNetWorkStates())) {
                f7.showIndicator();
                JsBridge('JS_Download', $('body').attr('data-update-url'), (data) => {
                    if(1 == data){
                        JsBridge('JS_WebAppUpdate', 'yudada.apk', (data) => {})
                    }else{
                        nativeEvent.nativeToast(0, '下载失败！');
                    }
                })
            }else{
                JsBridge('JS_WebAppUpdate', 'yudada.apk', (data) => {});
            }
        } else {
            JsBridge('JS_WebAppUpdate', 'yudada.apk', (data) => {})
        }
    })
}

export {
    updateCtrl,
    updateClickEvent
};