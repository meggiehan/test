import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { search } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import {get, set } from '../utils/locaStorage';
import district from '../utils/district';

function releaseInfoInit(f7, view, page) {
    nativeEvent.init();
    const $$ = Dom7;
    const { type, fishId, fishName, parentFishId, parentFishName } = page.query;
    let coordinate;
    let title;
    let provinceName;
    let cityName;
    const phoneNumber = get('phoneNumber');

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

    //take address ,longitude,latitude for native location.
    window.getAdreesSys = (province, city, longitude, latitude) => {
        if (province == "" || province == null) {
            return;
        }
        const address = province + city;
        provinceName = province;
        cityName = city;
        $(".release-write-address>input").val(address);
        coordinate = { longitude, latitude }
    }
    $$(".release-write-address").on('click', () => {
        // get address.
        nativeEvent.eventChooseAddress();
    })
    if (phoneNumber) {
        $$('.release-write-tell input').val(phoneNumber);
    }


    const callback = (data) => {

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
            const price = trim($$('.release-write-price input').val());
            const spec = trim($$('.release-write-spec input').val());
            const stock = trim($$('.release-write-stock input').val());
            const address = trim($$('.release-write-address input').val());
            const description = trim($$('.release-info-discription textarea').val());
            const name = trim($$('.release-write-contact input').val());
            const phone = trim($$('.release-write-tell input').val());
            const { provinceId, cityId } = getCityId(provinceName, cityName);
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
                specifications: spec,
                contactName: name,
                longitude: coordinate && coordinate['longitude'],
                latitude: coordinate && coordinate['latitude'],
                address,
                price,
                stock,
                provinceId,
                cityId,
                provinceName,
                cityName,
                type
            }
        }
    // submit release infomation to server;
    $$('.release-sub-info').click(() => {
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
