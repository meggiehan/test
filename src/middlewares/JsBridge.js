/**
 * create time 2017/03/01
 * author cash
 * */
import {invitationInit} from '../js/service/invitation/invitationCtrl'


function JsBridge(fnName, data, callback, f7) {
    const handler = (fnName, data, callback) => {
        WebViewJavascriptBridge.callHandler(
            fnName,
            data,
            callback
        );
    };

    const {android} = window.currentDevice;
    if (window.WebViewJavascriptBridge) {
        handler(fnName, data, callback);
    } else {
        if (android) {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function () {
                    WebViewJavascriptBridge.init(function (message, responseCallback) {
                        var data = {
                            'Javascript Responds': '测试中文!'
                        };
                        responseCallback(data);
                    });

                    //app后台唤醒后js做的操作
                    const $updateModal = $$('.update-app-modal');
                    WebViewJavascriptBridge.registerHandler('appWillEnterForeground', (data, responseCallback) => {
                        (!$updateModal.hasClass('large') && !$updateModal.hasClass('small') && !$updateModal.hasClass('force')) &&
                        invitationInit(f7, mainView);
                        alert('唤醒');
                    });

                    handler(fnName, data, callback);
                },
                false
            );
        } else {
            let WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'https://__bridge_loaded__';
            window.WVJBCallbacks = [];
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
                document.documentElement.removeChild(WVJBIframe);
                if (window.WebViewJavascriptBridge) {
                    handler(fnName, data, callback);

                    //app后台唤醒后js做的操作
                    const $updateModal = $$('.update-app-modal');
                    WebViewJavascriptBridge.registerHandler('appWillEnterForeground', () => {
                        (!$updateModal.hasClass('large') && !$updateModal.hasClass('small') && !$updateModal.hasClass('force')) &&
                        invitationInit(f7, mainView);
                    });
                }
            }, 30);
        }
    }
}


function registerHandler(fnName, callback) {
    if (!bridge) {
        console.log('bridge 未初始化！');
        return;
    }
    bridge.registerHandler(fnName, callback);
}

export {
    JsBridge,
    registerHandler
};
