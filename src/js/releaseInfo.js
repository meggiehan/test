import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html, getProvinceId, getCityId, getAddressIndex } from '../utils/string';
import { search } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/locaStorage';

function releaseInfoInit(f7, view, page) {
    f7.hideIndicator();
    const { ios } = currentDevice;
    const { type, fishId, fishName, parentFishId, parentFishName } = page.query;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const tellInput = currentPage.find('input[placeholder="请填写手机号"]');
    const addressInput = currentPage.find('.release-write-address').children('input');
    const priceInput = currentPage.find('.release-write-price').children('input');
    const specInput = currentPage.find('.release-write-spec').children('input');
    const stockInput = currentPage.find('.release-write-stock').children('input');
    const contactInput = currentPage.find('.release-write-contact').children('input');
    const subBtn = currentPage.find('.release-sub-info')[0];
    const { cacheUserinfoKey, debug } = config;
    const userInfo = store.get(cacheUserinfoKey);
    let title;
    const phoneNumber = userInfo && userInfo['phone'] || '';
    const token = userInfo && userInfo['token'] || '';
    const nickname = userInfo ? ((userInfo['personalAuthenticationState'] == 1 && userInfo['name']) || userInfo['nickname']) : '';
    const descriptInput = currentPage.find('textarea')[0];
    let provinceName, cityName, provinceId, cityId, longitude, latitude, initProvinceName, initCityName;
    let isSendInfo = false;

    if (window.addressObj) {
        longitude = window.addressObj['longitude'];
        latitude = window.addressObj['latitude'];
        initProvinceName = window.addressObj['initProvinceName'];
        initCityName = window.addressObj['initCityName'];
    }

    if(window['selectedAddress'] && window['selectedAddress']['provinceName']){
        addressInput[0] && (addressInput.val(window['selectedAddress']['provinceName'] + window['selectedAddress']['cityName']));
    }else if(initProvinceName){
        addressInput[0] && addressInput.val(initProvinceName + initCityName);
    }
    title = `“${fishName}”`;
    if (type == 1) {
        html($$('.release-info-title'), '我要买', f7);
        html($$('.release-sub-info'), '发布求购信息', f7);
    } else {
        html($$('.release-info-title'), '我要卖', f7);
        html($$('.release-sub-info'), '发布出售信息', f7);
    }
    html($$('.release-info-name'), title, f7);

    addressInput.on('click', () => {
        if (window.addressObj && window.addressObj['initProvinceName'] || window['selectedAddress']) {
            const provinceName =  window['selectedAddress'] ? window['selectedAddress']['provinceName'] : window.addressObj['initProvinceName'];
            const cityName =  window['selectedAddress'] ? window['selectedAddress']['cityName'] : window.addressObj['initCityName'];
            const {
                provinceIndex,
                cityIndex
            } = getAddressIndex(provinceName, cityName);
            nativeEvent.eventChooseAddress(0, provinceIndex, cityIndex);
        }else{
            // get address.
            nativeEvent.eventChooseAddress(0, 0, 0);
        }
    })
    phoneNumber && tellInput.val(phoneNumber);
    nickname && contactInput.val(nickname);

    const testRequireInfo = () => {
        const val = trim(tellInput[0].value);
        if (/^1[3|4|5|7|8]\d{9}$/.test(val) && addressInput[0].value) {
            $$('.release-sub-info').addClass('pass');
        } else {
            $$('.release-sub-info').removeClass('pass');
        }!tellInput[0] && clearInterval(intervalId);
    }

    //init verify, change submit button status;
    testRequireInfo();
    let intervalId = setInterval(testRequireInfo, 1500);
    setTimeout(() => { clearInterval(intervalId) }, 100000);
    addressInput[0].onclick = () => {
        setTimeout(testRequireInfo, 3000);
    }

    tellInput[0].oninput = () => {
        testRequireInfo();
    }

    const callback = (data) => {
        const { code, message } = data;
        if (1 == code) {
            const requirementPhoneNumber = trim(tellInput[0].value);
            $$('.release-sub-info').removeClass('pass');
            clearInterval(intervalId);
            view.router.load({
                url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishId}&fishName=${fishName}&phone=${requirementPhoneNumber}`,
                // reload: true
            })
        } else {
            f7.hideIndicator();
        }
    }

    descriptInput.oninput = () => {
        const val = trim(descriptInput.value);
        const len = val && val.length || 0;
        if (len >= 50) {
            $$('.release-info-number').addClass('desiable');
            descriptInput.value = val.substr(0, 49);
        } else {
            $$('.release-info-number').removeClass('desiable');
        }
        $$('.release-info-number').text(len);
    }

    const subInfoTest = () => {
        const _district = nativeEvent['getDistricInfo']();
        if (window.addressObj) {
            provinceName = window.addressObj['provinceName'];
            cityName = window.addressObj['cityName'];
            provinceId = window.addressObj['provinceId'];
            cityId = window.addressObj['cityId'];
            !provinceName && (provinceName = initProvinceName);
            !cityName && (cityName = initCityName);
            !provinceId && provinceName && (provinceId = getProvinceId(_district, provinceName));
            !cityId && (cityId = getCityId(_district, provinceName, cityName));
        }
        const price = trim(priceInput[0].value);
        const spec = trim(specInput[0].value);
        const stock = trim(stockInput[0].value);
        const address = trim(addressInput[0].value);
        const description = trim(descriptInput.value);
        const name = trim(contactInput[0].value);
        const phone = trim(tellInput[0].value);
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
            error = '数量最大长度为20位字符！'
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
            contactName: name
        }
    }


    // submit release infomation to server;
    subBtn.onclick = () => {
        apiCount('btn_text_post');
        const data = subInfoTest();
        const { error } = data;
        if (error) {
            f7.alert(error);
            return;
        }

        if(isSendInfo){
            return;
        }
        isSendInfo = true;
        setTimeout(() => {isSendInfo = false}, 300)
        f7.showIndicator();
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'userAddDemandInfo',
            header: ['token'],
            data: data,
            type: 'post',
            isMandatory: true,
            noCache: true
        }, callback);
    }

}
module.exports = {
    releaseInfoInit,
}
