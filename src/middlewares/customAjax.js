import config from '../config/';
import store from '../utils/locaStorage';
import { logOut } from '../middlewares/loginMiddle';
import framework7 from '../js/lib/framework7';

class CustomClass {
    getKey(api, key, val) {
        let res = `${api}`;
        Dom7.each(key, (index, k) => {
            const str = `_${k}_${val[index] || ''}`;
            res += str;
        })
        return res;
    }
    getData(key, val) {
        let obj = {};
        Dom7.each(key, (index, k) => {
            obj[k] = val[index] || '';
        })
        return obj;
    }
    checkMaxLenAndDelete() {
            const { cacheMaxLen, cacheUserinfoKey, cacheHistoryKey } = config;
            const storage = window.localStorage;
            const len = storage.length;
            let i = 1;
            let isDel = false;
            if (len >= cacheMaxLen) {
                Dom7.each(storage, (key, value) => {
                    if (i === len - 1 && !isDel && (key !== cacheUserinfoKey || key !==  cacheHistoryKey)) {
                        store.remove(key);
                        isDel = true;
                    } else if (i === len - 2 && !isDel && (key !== cacheUserinfoKey || key !==  cacheHistoryKey)) {
                        store.remove(key);
                        isDel = true;
                    } else if (i === len - 3 && !isDel && (key !== cacheUserinfoKey || key !==  cacheHistoryKey)) {
                        store.remove(key);
                        isDel = true;
                    }
                    i++;
                })
            }
        }
        /*
         *   isMandatory: Whether it is mandatory to refresh ，default:false
         *   noCache: Local storage is not required, default: false
         */
    ajax(obj, callback) {
        const $$ = Dom7;
        const { api, data, apiCategory, type, isMandatory, noCache, val } = obj;
        const key = config[apiCategory][api];
        const { timeout, cacheUserinfoKey } = config;
        const saveKey = api in ['login', 'getUserInfo'] ? cacheUserinfoKey : this.getKey(api, key, data);
        let url = `${config.url}${apiCategory}/${api}/`;
        if (val) {
            $$.each(val, (key, value) => {
                url += `${value}/`;
            })
        }
        const newData = $$.isArray(data) ? this.getData(key, data) : data;
        if (!noCache) {
            const cacheData = store.get(saveKey);
            cacheData && !isMandatory && callback(cacheData);
        }
        const _this = this;
        $$.ajax({
            type,
            url,
            timeout,
            data: newData,
            cache: false,
            // headers: {
            //     "Access-Control-Allow-Origin": "*",
            //     "Access-Control-Allow-Headers": "X-Requested-With",
            //     "Access-Control-Allow-Methods": "GET,POST"
            // },
            error: function(err) {
                const f7 = new framework7();
                f7.alert('网络错误','提示');
                // callback(null, err);
            },
            success: function(data) {
                const _data = JSON.parse(data);
                if (_data.code !== 1 && _data.message) {
                    const f7 = new framework7();
                    _data.code == 2 && f7.alert(_data.message, '提示', () => {
                        logOut();
                    });
                    _data.code !== 2 && f7.alert(_data.message,'提示');
                }
                if (!noCache) {
                    _this.checkMaxLenAndDelete();
                    store.set(saveKey, data);
                }
                callback(JSON.parse(data), null, true);
            }
        })
    }
}

const CustomAjax = new CustomClass();



export default CustomAjax;
