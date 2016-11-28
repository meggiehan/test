import nativeEvent from './nativeEvent';

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
        dom.length == undefined ? dom.innerHTML = str : dom.html(str);
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
        const arr = str.split('?').length > 1 ? str.split('?')[1].split('&') : str.split('?')[0].split('&');
        arr.forEach((item) => {
            const key = item.split('=')[0];
            const val = item.split('=')[1];
            if (key.indexOf('keyvalue') > -1) {
                obj['keyvalue'] = item.substr(9, 100);
            } else {
                obj[key] = val;
            }
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
        if (!src) {
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
        let certName = '';
        if (1 == type) {
            text = '苗种生产';
            label = '苗';
            classes = 'seedling';
            certName = '苗种生产许可证';
        } else if (2 == type) {
            text = '水产养殖';
            label = '水';
            classes = 'water';
            certName = '水产养殖许可证';
        } else if (3 == type) {
            text = '检验检疫';
            label = '检';
            classes = 'cert';
            certName = '检验检疫合格证';
        } else if (4 == type) {
            text = '无公害农产品产地';
            label = '证';
            classes = 'identity';
            certName = '无公害农产品产地认证证书';
        } else if (5 == type) {
            text = '绿色食品';
            label = '证';
            classes = 'identity';
            certName = '绿色食品证书';
        } else if (6 == type) {
            text = '有机产品';
            label = '证';
            classes = 'identity';
            certName = '有机产品认证证书';
        }
        return {
            label,
            text,
            classes,
            certName
        }
    },

    getAddressIndex(provinceName, cityName) {
        const district = nativeEvent['getDistricInfo']();
        let provinceIndex, cityIndex, currentProvince;
        $$.each(district['root']['province'], (index, item) => {
            if (item['name'] == provinceName) {
                provinceIndex = index;
                currentProvince = item;
                return;
            }
        })
        currentProvince && currentProvince['city'] && $$.each(currentProvince['city'], (index, item) => {
            if (item['name'] == cityName) {
                cityIndex = index;
                return;
            }
        })

        !provinceIndex && (provinceIndex = 0);
        !cityIndex && (cityIndex = 0);
        return {
            provinceIndex,
            cityIndex
        }
    },

    getTagInfo() {
        var tagList = [{
            id: 1,
            name: '水花',
            type: 0
        }, {
            id: 2,
            name: '<1000尾',
            type: 0
        }, {
            id: 3,
            name: '1000-100尾',
            type: 0
        }, {
            id: 4,
            name: '100-10尾',
            type: 0
        }, {
            id: 5,
            name: '10-1尾',
            type: 0
        }, {
            id: 6,
            name: '>1斤',
            type: 0
        }, {
            id: 7,
            name: '有来源证明',
            type: 1,
            category: 0
        }, {
            id: 8,
            name: '活力好',
            type: 1,
            category: 0
        }, {
            id: 9,
            name: '光泽度好',
            type: 1,
            category: 0
        }, {
            id: 10,
            name: '体型好',
            type: 1,
            category: 0
        }, {
            id: 11,
            name: '有检疫证明',
            type: 1,
            category: 0
        }, {
            id: 12,
            name: '交通方便',
            type: 1,
            category: 0
        }, {
            id: 13,
            name: '无病无伤',
            type: 1,
            category: 1
        }, {
            id: 14,
            name: '皮毛好',
            type: 1,
            category: 1
        }, {
            id: 15,
            name: '有检测报告',
            type: 1,
            category: 1
        }, {
            id: 16,
            name: '大水面养殖',
            type: 1,
            category: 1
        }, {
            id: 17,
            name: '已经停料',
            type: 1,
            category: 1
        }]
        let specList = [];
        $$.each(tagList, (index, item) => {
            0 == item.type && specList.push(item);
        })

        let discriptionList = [];
        $$.each(tagList, (index, item) => {
            1 == item.type && discriptionList.push(item);
        })
        return {
            specList,
            discriptionList
        }
    },

    /**
     * caculate the great circle distance
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */

    getRange: (lat1, lng1, lat2, lng2) => {
        const getRed = (d) => {
            return d * PI / 180.0;
        }

        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    },

    isEmailStr: (val) => {
        if(!val){
            return 0;
        }
        const isEmail = new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");   
        if(val.indexOf('\/') > -1){
            return 1;
        }

        if(/[,.!\u3002\uff0c]/.test(val)){
            return 0;
        }

        if(isEmail.test(val)){
            return 2;
        }
        return 0;
    }

}
