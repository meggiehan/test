module.exports = {
    trim: (str) => {
        if (!str) {
            return;
        }
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    /*
     * Prevent script injection attacks.
     */
    html: (dom, str, f7) => {
        if (str && str.indexOf('<script') > -1) {
            f7 && f7.alert('请求错误,请重新发送请求!')
            return;
        }
        dom.html(str);
    },

    // mycenter get user name: return 何＊＊
    getName: (name) => {
        let arr = name.split('');
        let res = arr[0];
        arr.shift();
        arr.forEach(() =>{
            res += '*';
        })
        return res;
    },

    getBusinessLicenseNumber: (str) => {
        const arr = str.split('');
        let res = arr[0];
        const lastStr = arr.pop();
        arr.shift;
        arr.forEach(() => {
            res += '*';
        })
        res += lastStr;
        return res;
    },

    getQuery: (str) => {
        let obj = {};
        if(!str){
            return obj;
        }
        const arr = str.split('&');
        arr.forEach((item) => {
            const key = item.split('=')[0];
            const val = item.split('=')[1];
            obj[key] = val;
        })
        return obj;
    },

    getTabStr: (str) => {
        if(str.length <= 4){
            return str;
        }
        const res = str.substr(0, 4);
        return res + '...';
    },

    getProvinceId: (district, provinceName) => {
        if(!provinceName){
            return;
        }
        let id;
        district['root'].forEach((item) => {
            item['name'] == provinceName && (id = item['id']);
        })
        return id;
    },

    getProvinceId: (district, provinceName, cityName) => {
        if(!provinceName){
            return;
        }
        let id;
        district['root'].forEach((item) => {
            if(item['name'] == provinceName){
                item['name'].forEach(val => {
                    val['name'] == cityName && (id = val['id']);
                })
            }
        })
        return id;
    },
    
}
