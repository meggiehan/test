/**
 * create time 2017/03/01
 * author cash
 * */
function JsBridge(fnName, data, callback){

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
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe);
            window.WebViewJavascriptBridge && handler(fnName, data, callback);
        }, 30)
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

export {JsBridge};
