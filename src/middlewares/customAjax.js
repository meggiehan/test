import config from '../config/';
import store from '../utils/locaStorage'

class CustomClass {
    getKey(api, key, val) {
        let res = `${api}`;
        Dom7.each(key, (index, k) => {
            const str = `_${k}_${val[index] || ''}`;
            res += str;
        })
        return res;
    }
    getData(key, val){
    	let obj = {};
    	Dom7.each(key, (index, k) => {
            obj[k] = val[index] || '';
        })
        return obj;
    }
    checkMaxLenAndDelete(){
        const {cacheMaxLen} = config;
        const storage = window.localStorage;
        const len = storage.length;
        let i = 1;
        if(len >= cacheMaxLen){
            Dom7.each(storage, (key, value) => {
                i === 1 && (store.remove(key));
                i++;
            })
        }
    }
    /*
    *   isMandatory: Whether it is mandatory to refresh ，default:false
    *   noCache: Local storage is not required, default: false
    */
    ajax(obj, callback) {
        const { api, data, apiCategory, type, isMandatory, noCache, val } = obj;
        const key = config[apiCategory][api];
        const {timeout} = config;
        const saveKey = this.getKey(api, key, data);
        let url = `${config.url}${apiCategory}/${api}/`;
        val && (url += `${val.id}`)
        const newData = this.getData(key, data);
        if(!noCache){
            const cacheData = store.get(saveKey);
            cacheData &&  !isMandatory && callback(cacheData);
        }
        const _this = this;
        Dom7.ajax({
        	type,
            url,
            timeout,
            data: newData,
            cache: false,
            error: function(err){
                callback(null, err)
            },
            success: function(data){
                if(!noCache){
                    _this.checkMaxLenAndDelete();
                    store.set(saveKey, data);
                }
                callback(JSON.parse(data),null,true);
            }
        })
    }
}

const CustomAjax = new CustomClass();



export default CustomAjax;
