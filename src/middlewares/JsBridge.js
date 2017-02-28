
function JsBridge(fnName, data, callback){

    const handler = (fnName, data, callback) => {
        WebViewJavascriptBridge.callHandler(
            fnName,
            data,
            callback
        );
    }

    if (window.WebViewJavascriptBridge) {
        handler();
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                bridge.init(function(message, responseCallback) {
                    console.log('JS got a message', message);
                    var data = {
                        'Javascript Responds': 'Wee!'
                    };
                    responseCallback(data);
                });
                handler();
            },
            false
        );
    }
}

export {JsBridge};
