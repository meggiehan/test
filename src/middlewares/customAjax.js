import config from '../config/';
import store from '../utils/locaStorage';
import { logOut, activeLogout } from '../middlewares/loginMiddle';
import framework7 from '../js/lib/framework7';
import nativeEvent from '../utils/nativeEvent';

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
});
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
                if (i === len - 1 && !isDel && (key !== cacheUserinfoKey || key !== cacheHistoryKey)) {
                    store.remove(key);
                    isDel = true;
                } else if (i === len - 2 && !isDel && (key !== cacheUserinfoKey || key !== cacheHistoryKey)) {
                    store.remove(key);
                    isDel = true;
                } else if (i === len - 3 && !isDel && (key !== cacheUserinfoKey || key !== cacheHistoryKey)) {
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
        const { api, data, apiCategory, type, isMandatory, noCache, val, header, parameType } = obj;
        const key = api ? config[apiCategory][api] : config[apiCategory];
        const { timeout, cacheUserinfoKey } = config;
        const saveKey = api in ['login', 'getUserInfo'] ? cacheUserinfoKey : this.getKey(api, key, data);
        let newData = $$.isArray(data) ? this.getData(key, data) : data;

        let headers = {};
        let url = `${config.url}${apiCategory == 'inviteter' ? 'invite' : apiCategory}/${api ? api + '/' : ''}`;
        parameType && (newData = JSON.stringify(newData));

        if (val) {
            $$.each(val, (key, value) => {
                url += `${value}/`;
            })
        }

        if (header) {
            header.indexOf('token') > -1 && (headers['accessToken'] = nativeEvent['getUserValue']('token') || '');
            if(header.indexOf('login_token') > -1){
                headers['login_token'] = nativeEvent['getUserValue']('token') || '';
                url += `?login_token=${nativeEvent['getUserValue']('token') || ''}`;
            };
        }

        if (!noCache) {
            const cacheData = store.get(saveKey);
            cacheData && !isMandatory && callback(cacheData);
        }
        const _this = this;
        $$.ajax({
            type,
            url,
            timeout,
            headers,
            contentType: parameType || 'application/x-www-form-urlencoded',
            data: newData,
            cache: false,
            processData: true,
            crossDomain: true,
            error: function(err, status) {
                if (parseInt(status) >= 500) {
                    nativeEvent.nativeToast(0, '服务器繁忙，请稍后再试！');
                } else {
                    nativeEvent.nativeToast(0, '请检查您的网络！');
                }
                f7.pullToRefreshDone();
                f7.hideIndicator();
                // callback(null, err);
            },
            success: function(data, status) {
                const _data = JSON.parse(data);

                if (_data.code == 2 && _data.message) {
                    if (url.indexOf('userAddDemandInfo') > -1) {
                        const { type, fishTypeId, fishTypeName, requirementPhone } = newData;
                        const callback = (data) => {
                            f7.hideIndicator();
                            const { code, message } = data;
                            if (1 == code) {
                                $$('.release-sub-info').removeClass('pass');
                                mainView.router.load({
                                    url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishTypeId}&fishName=${fishTypeName}&phone=${requirementPhone}`,
                                    // reload: true
                                })
                            } else {
                                f7.alert(message, '提示');
                            }
                        }
                        newData['login_token'] = '';
                        _this.ajax({
                            apiCategory: 'demandInfo',
                            api: 'userAddDemandInfo',
                            data: newData,
                            type: 'post',
                            isMandatory: true,
                            noCache: true
                        }, callback);
                    } else {
                        f7.hideIndicator();

                        f7.alert(_data.message, '提示', () => {
                            activeLogout();
                        });
                    }

                } else if (0 == _data.code) {
                    f7.hideIndicator();

                    f7.alert(_data.message, '提示');
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
