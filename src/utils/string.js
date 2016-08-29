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
        if (str && str.toString().indexOf('<script') > -1) {
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
        arr.forEach(() => {
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
        if (!str) {
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
        if (str.length <= 4) {
            return str;
        }
        const res = str.substr(0, 4);
        return res + '...';
    },

    getProvinceId: (district, provinceName) => {
        if (!provinceName) {
            return;
        }
        let id;
        district['root']['province'].forEach((item) => {
            item['name'] == provinceName && (id = item['postcode']);
        })
        return id;
    },

    getCityId: (district, provinceName, cityName) => {
        if (!provinceName) {
            return;
        }
        let id;
        district['root']['province'].forEach((item) => {
            if (item['name'] == provinceName) {
                item['city'].forEach(val => {
                    val['name'] == cityName && (id = val['postcode']);
                })
            }
        })
        return id;
    },

    imgIsUpload: (src) => {
        if(!src){
            return false;
        }
        let img = document.createElement('img');
        img.src = src; 
        return img.complete ? `<img src="${src}" alt="图片" />` : null;
    },

    getCertInfo: (type) => {
        let text = '';
        let label = '';
        let classes = '';
        if(1 == type){
            text = '苗种生产';
            label = '苗';
            classes = 'seedling';
        }else if(2 == type){
            text = '水产养殖';
            label = '水';
            classes = 'water';
        }else if(3 == type){
            text = '检验检疫';
            label = '检';
            classes = 'cert';
        }else if(4 == type){
            text = '无公害农产品产地';
            label = '无';
            classes = 'water';
        }else if(5 == type){
            text = '绿色食品';
            label = '绿';
            classes = 'water';
        }else if(6 == type){
            text = '有机产品';
            label = '有';
            classes = 'water';
        }
        return {
            label,
            text,
            classes
        }
    }

}
