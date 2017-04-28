/**
 * create time 2017/03/01
 * author cash
 * */
import {updateCtrl} from '../js/service/updateVersion/updateVersionCtrl';

function JsBridge (fnName, data, callback, f7){
    const handler = (fnName, data, callback) => {
        window.WebViewJavascriptBridge.callHandler(
            fnName,
            data,
            callback
        );
    };

    const {android} = window.currentDevice;
    if (window.WebViewJavascriptBridge){
        handler(fnName, data, callback);
    } else {
        if (android){
            window.document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function (){
                    window.WebViewJavascriptBridge.init(function (message, responseCallback){
                        var data = {
                            'Javascript Responds': '测试中文!'
                        };
                        responseCallback(data);
                    });

                    // app后台唤醒后js做的操作
                    window.WebViewJavascriptBridge.registerHandler('appWillEnterForeground', (data, responseCallback) => {
                        updateCtrl(f7);
                    });

                    handler(fnName, data, callback);
                },
                false
            );
        } else {
            let WVJBIframe = window.document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'https://__bridge_loaded__';
            window.WVJBCallbacks = [];
            window.document.documentElement.appendChild(WVJBIframe);
            setTimeout(function (){
                window.document.documentElement.removeChild(WVJBIframe);
                if (window.WebViewJavascriptBridge){
                    handler(fnName, data, callback);

                    // app后台唤醒后js做的操作
                    window.WebViewJavascriptBridge.registerHandler('appWillEnterForeground', () => {
                        updateCtrl(f7);
                    });
                }
            }, 30);
        }
    }
}

function registerHandler (fnName, callback){
    if (!window.bridge){
        console.log('bridge 未初始化！');
        return;
    }
    window.bridge.registerHandler(fnName, callback);
}

export {
    JsBridge,
    registerHandler
};
