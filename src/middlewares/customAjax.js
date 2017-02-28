import config from '../config/';
import store from '../utils/localStorage';
import {logOut, activeLogout} from '../middlewares/loginMiddle';
import framework7 from '../js/lib/framework7';
import nativeEvent from '../utils/nativeEvent';

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
});
class CustomClass {

    /**
     * 旧的方法api跟参数分开配置，参数为array
     * 新的方法就直接是object传进来
     * */
    getKey(apiCategory, api, key, val) {
        let res = `${apiCategory ? 'apiCategory_' : ''}${api || ''}`;
        if ($$.isArray(key)) {
            Dom7.each(key, (index, k) => {
                let value = '';
                if (val && (val[index] || (val[index] == 0))) {
                    value = val[index];
                }
                res += `_${k}_${value}`;
            })
        } else {
            Dom7.each(key, (k, v) => {
                let value = '';
                if (v || (v == 0)) {
                    value = v;
                }
                res += `_${k}_${value}`;
            })
        }
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
        const {cacheMaxLen, cacheUserinfoKey, cacheHistoryKey} = config;
        const len = store.getAll().length;
        let i = 1;
        let isDel = false;
        const disableDeleteArr = [cacheUserinfoKey, cacheHistoryKey];
        if (len >= cacheMaxLen) {
            Dom7.each(store.getAll(), (key, value) => {
                if (i === len - 1 && !isDel && (disableDeleteArr.indexOf(key) == -1)) {
                    store.remove(key);
                    isDel = true;
                } else if (i === len - 2 && !isDel && (disableDeleteArr.indexOf(key) == -1)) {
                    store.remove(key);
                    isDel = true;
                } else if (i === len - 3 && !isDel && (disableDeleteArr.indexOf(key) == -1)) {
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
        const {api, data, apiCategory, type, isMandatory, noCache, val, header, parameType, onlyUseCache} = obj;

        const key = api ? config[apiCategory][api] : config[apiCategory];
        const {timeout, cacheUserinfoKey} = config;
        const saveKey = api in ['login', 'getUserInfo'] ? cacheUserinfoKey : this.getKey(apiCategory, api, key, data);
        let newData = $$.isArray(data) ? this.getData(key, data) : data;

        let headers = {};
        let url = `${config.url}${apiCategory == 'inviteter' ? 'invite' : apiCategory}/${api ? api + '/' : ''}`;
        apiCategory == 'demandInfoAdd' && !api && (url = `${config.url}demandInfo`);
        url.indexOf('deleteDemandInfo') > -1 && (url = url.replace('demandInfo/deleteDemandInfo', 'demandInfo'));
        url.indexOf('demandInfo/refreshLog/') > -1 && (url = url.replace('demandInfo/refreshLog/', 'demandInfo/'));
        url.indexOf('userInformation') > -1 && (url = url.replace('userInformation', 'userInfo'));
        url.indexOf('listFiltered') > -1 && (url = url.replace('listFiltered', 'list/filtered'));
        url.indexOf('postFishCars') > -1 && (url = url.replace('postFishCars', 'fishCars'));

        /**
         * 不同type的API参数处理
         * 例如：post跟get的参数不同
         * */
        if ('fishCarDemands' == apiCategory && 'post' == type) {
            delete newData.pageNo;
            delete newData.pageSize;
        }

        parameType && (newData = JSON.stringify(newData));

        if (val) {
            $$.each(val, (key, value) => {
                url += `${value}/`;
            })
        }

        if (header) {
            header.indexOf('token') > -1 && (headers['access-token'] = store.get("accessToken") || '');
            // header.indexOf('token') > -1 && (headers['access-token'] = 'af75c855d3974d0cb76bb4f891cb1713');
        }

        if (!noCache) {
            const cacheData = store.get(saveKey);
            cacheData && !isMandatory && callback(cacheData);
        }
        const _this = this;

        /**
         * 没有网络的时候提示用户，且不向服务器发送请求
         * */
        if (!nativeEvent['getNetworkStatus']()) {
            nativeEvent.nativeToast(0, '请检查您的网络！');
            f7.pullToRefreshDone();
            f7.hideIndicator();
            return;
        }

        /**
         * 仅仅只使用缓存
         * 首页：先显示缓存，在触发下拉刷新逻辑
         * */
        if (onlyUseCache) {
            return;
        }

        /**
         * 在headr中添加设备信息
         * */
        const deviceInfo = nativeEvent['getDeviceInfomation']();
        $$.each(deviceInfo, (key, val) => {
            headers[key] = val;
        })

        $$.ajax({
            method: type,
            url,
            timeout,
            headers,
            contentType: parameType || 'application/x-www-form-urlencoded',
            data: newData,
            cache: false,
            processData: true,
            crossDomain: true,

            /**
             * 服务的回来的ajax，根据status处理失败请求
             * */
            error: function (err, status) {
                if (parseInt(status) >= 500) {
                    nativeEvent.nativeToast(0, '服务器繁忙，请稍后再试！');
                } else {
                    nativeEvent.nativeToast(0, '请检查您的网络！');
                }
                f7.pullToRefreshDone();
                f7.hideIndicator();

                if (url.indexOf('favorite/demandInfo/') > -1) {
                    callback(null, err);
                }
                // callback(null, err);
            },

            /**
             * 服务器回来的ajax根据不同的code进行处理。
             * */
            success: function (data, status) {
                const _data = JSON.parse(data);

                if (_data.code == 2 && _data.message) {
                    if (url.indexOf('userAddDemandInfo') > -1) {
                        const {type, fishTypeId, fishTypeName, requirementPhone} = newData;
                        const callback = (data) => {
                            f7.hideIndicator();
                            const {code, message} = data;
                            if (1 == code) {
                                $$('.release-sub-info').removeClass('pass');
                                window['releaseInfo'] = data['data'];
                                mainView.router.load({
                                    url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishTypeId}&fishName=${fishTypeName}&phone=${requirementPhone}`,
                                })
                            } else {
                                f7.alert(message, '提示');
                            }
                        }
                        _this.ajax({
                            apiCategory: 'demandInfoAdd',
                            header: ['token'],
                            parameType: 'application/json',
                            data: newData,
                            type: 'post',
                            isMandatory: true,
                            noCache: true
                        }, callback);
                    } else {
                        f7.hideIndicator();
                        f7.pullToRefreshDone();
                        activeLogout();
                        // f7.alert(_data.message, '提示');
                        return;
                    }
                } else if (0 == _data.code) {
                    f7.hideIndicator();
                    f7.alert(_data.message, '提示');
                } else if (-1 == _data.code) {
                    f7.hideIndicator();
                    nativeEvent.nativeToast(0, '服务器异常，请稍后再试！');
                } else if (4 == _data.code) {
                    f7.hideIndicator();
                    f7.alert(_data.message, '提示');
                    return;
                } else if (3 == _data.code) {
                    if (url.indexOf('/auth') > -1) {
                        f7.alert(_data.message);
                        activeLogout();
                        return;
                    }
                    f7.showIndicator();
                    setTimeout(() => {
                        mainView.router.load({
                            url: 'views/notFound.html?errInfo=' + _data.message,
                            reload: true
                        })
                    }, 400)
                    return;
                }
                if (3 !== _data.code && (-1 !== data.code)) {
                    if (!noCache && saveKey) {
                        _this.checkMaxLenAndDelete();
                        store.set(saveKey, data);
                    }
                    callback(JSON.parse(data), null, true);
                }
            }
        })
    }
}

const CustomAjax = new CustomClass();
export default CustomAjax;
