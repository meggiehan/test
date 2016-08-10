import config from '../config/';
import store from '../utils/locaStorage'

class CustomClass {
    getKey(api, key, val) {
        let res = `${api}`;
        Dom7.each(key, (index, k) => {
            const str = `_${k}_${val[index]}`;
            res += str;
        })
        return res;
    }
    getData(key, val){
    	let obj = {};
    	Dom7.each(key, (index, k) => {
            obj[k] = val[index];
        })
        return obj;
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
                !noCache && store.set(saveKey, data);
                callback(JSON.parse(data),null,true);
            }
        })
    }
}

const CustomAjax = new CustomClass();



export default CustomAjax;
