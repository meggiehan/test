import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html, getProvinceId, getCityId } from '../utils/string';
import { search } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/locaStorage';
import district from '../utils/district';

function releaseInfoInit(f7, view, page) {
    const { type, fishId, fishName, parentFishId, parentFishName } = page.query;
    const { cacheUserinfoKey, debug } = config;
    const userInfo = store.get(cacheUserinfoKey);
    let title;
    const phoneNumber = userInfo && userInfo['phone'] || '';
    const token = userInfo && userInfo['token'] || '';
    const descriptInput = $$('.release-info-discription>textarea');
    let provinceName, cityName, provinceId, cityId, longitude, latitude, initProvinceName, initCityName;
    let isRelease = false;

    if (window.addressObj) {
        longitude = window.addressObj['longitude'];
        latitude = window.addressObj['latitude'];
        initProvinceName = window.addressObj['initProvinceName'];
        initCityName = window.addressObj['initCityName'];
    }

    $$('.release-write-address>input').length && initProvinceName && ($$('.release-write-address>input').val(initProvinceName + initCityName));
    title = `“${fishName}”`;
    if (type == 1) {
        html($$('.release-info-title'), '我要买', f7);
        html($$('.release-sub-info'), '发布求购信息', f7);
    } else {
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

    const testRequireInfo = () => {
            const val = trim($$('.release-write-tell input').val());
            if (/^1[3|4|5|7|8]\d{9}$/.test(val) && $$('.release-write-address input').val()) {
                $$('.release-sub-info').addClass('pass');
            } else {
                $$('.release-sub-info').removeClass('pass');
            }
        }
        //init verify, change submit button status;
    testRequireInfo();
    $$('.release-write-address input')[0].oninput = () => {
        testRequireInfo();
    }

    $$('.release-write-tell input')[0].oninput = () => {
        testRequireInfo();
    }

    const callback = (data) => {
        isRelease = false;
        const { code, message } = data;
        if (1 == code) {
            view.router.load({
                url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishId}&fishName=${fishName}`
            })
        } else {
            f7.alert(message, '提示');
        }
    }

    descriptInput[0].oninput = () => {
        const val = trim(descriptInput.val());
        const len = val && val.length || 0;
        if (len >= 50) {
            $$('.release-info-number').addClass('desiable');
            descriptInput.val(val.substr(0, 49));
        } else {
            $$('.release-info-number').removeClass('desiable');
        }
        $$('.release-info-number')[0].innerText = len;
    }

    const subInfoTest = () => {
        if (window.addressObj) {
            provinceName = window.addressObj['provinceName'];
            cityName = window.addressObj['cityName'];
            provinceId = window.addressObj['provinceId'];
            cityId = window.addressObj['cityId'];
            !provinceName && (provinceName = initProvinceName);
            !cityName && (cityName = initCityName);
            !provinceId && (provinceId = getProvinceId(district, provinceName));
            !cityId && (cityId = getCityId(district, provinceName, cityName));
        }
        const price = trim($$('.release-write-price input').val());
        const spec = trim($$('.release-write-spec input').val());
        const stock = trim($$('.release-write-stock input').val());
        const address = trim($$('.release-write-address input').val());
        const description = trim($$('.release-info-discription textarea').val());
        const name = trim($$('.release-write-contact input').val());
        const phone = trim($$('.release-write-tell input').val());
        let error;
        if (!/^1[3|4|5|7|8]\d{9}$/.test(phone)) {
            error = '请您输入正确的手机号码！';
        } else if (!trim(address)) {
            error = '请选择地区！';
        } else if (price && price.length > 20) {
            error = '价格最大长度为20位字符！'
        } else if (spec && spec.length > 20) {
            error = '规格最大长度为20位字符！'
        } else if (stock && stock.length > 20) {
            error = '数量最大长度为50位字符！'
        } else if (description && description.length > 50) {
            error = '补充说明最大长度为50位字符！'
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
    $$('.release-sub-info')[0].onclick = () => {
        const data = subInfoTest();
        const { error } = data;
        if (isRelease && error) {
            return;
        }
        if (error) {
            f7.alert(error);
        } else {
            isRelease = true;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'userAddDemandInfo',
                data: data,
                type: 'post',
                isMandatory: true,
                noCache: true
            }, callback);
        }
    }
}
module.exports = {
    releaseInfoInit,
}
