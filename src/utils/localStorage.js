import nativeEvent from './nativeEvent';
// import {JsBridge} from '../middlewares/JsBridge';

/**
 *优先使用native存储的数据，如果没有就用h5存储的数据
 * */
module.exports = {
    get: (key) => {
        if(window.JS_GetObjectWithKey || (window.yudada && window.JS_GetObjectWithKey)){
            return nativeEvent.getDataToNative(key);
        }else{
            if (!window.localStorage.getItem(key)) {
                return;
            }
            let value = window.localStorage.getItem(key);
            if(value.indexOf('{"') > -1 || value.indexOf('["') > -1){
                return JSON.parse(value);
            }else{
                return value
            }
        }
    },
    set: (key, val) => {
        if(!key){
            return;
        }
        if(window['JS_UMengToCount'] || window['yudada']) {
            nativeEvent.setDataToNative(key, val);
        }else{
            let value;
            if (typeof val == 'object') {
                value = JSON.stringify(val);
            } else {
                value = val;
            }
            window.localStorage.setItem(key, value)
        }
    },
    remove: (key) => {
        if(window['JS_UMengToCount'] || window['yudada']) {
            nativeEvent.setDataToNative(key, '');
        }else{
            window.localStorage.removeItem(key)
        }
    },
    clear: () => {
        window.localStorage.clear();
    },
    getAll: () => {
        return window.localStorage;
    }
}
