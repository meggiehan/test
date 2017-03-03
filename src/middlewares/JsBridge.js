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
    }

    if (window.WebViewJavascriptBridge) {
        handler(fnName, data, callback);
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
                WebViewJavascriptBridge.registerHandler('appWillEnterForeground', () => {
                    invitationInit(f7, mainView);
                });
            }
        }, 30);
        // document.addEventListener(
        //     'WebViewJavascriptBridgeReady'
        //     , function() {
        //         bridge.init(function(message, responseCallback) {
        //             console.log('JS got a message', message);
        //             var data = {
        //                 'Javascript Responds': 'Wee!'
        //             };
        //             responseCallback(data);
        //         });
        //         handler(fnName, data, callback);
        //     },
        //     false
        // );
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
