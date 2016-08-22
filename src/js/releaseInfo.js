import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { search } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/locaStorage';
import district from '../utils/district';

function releaseInfoInit(f7, view, page) {
    const $$ = Dom7;
    const { type, fishId, fishName, parentFishId, parentFishName } = page.query;
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    let title;
    const phoneNumber = userInfo && userInfo['phone'] || '';
    const token = userInfo && userInfo['token'] || '';
    let isRelease = false;

    if (type == 1) {
        title = `买【${fishName}】`;
        html($$('.release-info-title'), '我要买', f7);
        html($$('.release-sub-info'), '发布求购信息', f7);
    } else {
        title = `卖【${fishName}】`;
        html($$('.release-info-title'), '我要卖', f7);
        html($$('.release-sub-info'), '发布出售信息', f7);
    }
    html($$('.release-info-name'), title, f7);

    $$(".release-write-address").on('click', () => {
        // get address.
        nativeEvent.eventChooseAddress(0);
    })
    if (phoneNumber) {
        $$('.release-write-tell input').val(phoneNumber);
    }


    const callback = (data) => {
        isRelease = false;
        const { code, message } = data;
        if (1 == code) {
            view.router.load({
                url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishId}`
            })
        }else{
            f7.alert(message, '提示');
        }
    }
    const getCityId = (provinceName, cityName) => {
        const res = {};
        $$.each(district.province, (index, item) => {
            if (item.name == provinceName) {
                res['provinceId'] = item.postcode;
                $$.each(item.city, (_index, cityItem) => {
                    if (cityItem.name == cityName) {
                        res['cityId'] = cityItem.postcode;
                    }
                })
            }
        })
        return res;
    }

    const subInfoTest = () => {
            let provinceName, cityName, provinceId, cityId, longitude, latitude;
            if (window.addressObj) {
                provinceName = window.addressObj['province'];
                cityName = window.addressObj['city'];
                longitude = window.addressObj['longitude'];
                latitude = window.addressObj['latitude'];
                provinceId = getCityId(provinceName, cityName)['provinceId'];
                cityId = getCityId(provinceName, cityName)['cityId'];
            }
            const price = trim($$('.release-write-price input').val());
            const spec = trim($$('.release-write-spec input').val());
            const stock = trim($$('.release-write-stock input').val());
            const address = trim($$('.release-write-address input').val());
            const description = trim($$('.release-info-discription textarea').val().substr(0, 300));
            const name = trim($$('.release-write-contact input').val());
            const phone = trim($$('.release-write-tell input').val());
            let error;
            if (!/^1[3|4|5|7|8]\d{9}$/.test(phone)) {
                error = '请您输入正确的手机号码！';
            } else if (!trim(address)) {
                error = '请选择地区！';
            }

            return {
                error,
                fishParentTypeId: parentFishId,
                fishParentTypeName: parentFishName,
                fishTypeId: fishId,
                fishTypeName: fishName,
                requirementPhone: phone,
                type,
                price,
                specifications: spec,
                stock,
                address,
                longitude,
                latitude,
                describe: description,
                provinceId,
                cityId,
                provinceName,
                cityName,
                contactName: name,
                login_token: token
            }
        }
        // submit release infomation to server;
    $$('.release-sub-info').click(() => {
        if (isRelease) {
            return;
        }
        isRelease = true;
        const data = subInfoTest();
        if (data.error) {
            f7.alert(data.error);
        } else {
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'userAddDemandInfo',
                data: data,
                type: 'post',
                isMandatory: true,
                noCache: true
            }, callback);
        }
    })
}
module.exports = {
    releaseInfoInit,
}
