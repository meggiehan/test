import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html, getSingleProvinceId, getCityId, getAddressIndex, getTagInfo } from '../utils/string';
import { search, releaseInfo } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/localStorage';
import { isEmailStr, saveSelectFishCache } from '../utils/string';

function releaseInfoInit(f7, view, page) {
    f7.hideIndicator();
    // const { ios } = currentDevice;
    const { type, fishId, fishName, parentFishId, parentFishName } = page.query;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const currentNav = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    const tellInput = currentPage.find('input[placeholder="请填写手机号"]');
    const addressInput = currentPage.find('.release-write-address').children('input');
    const priceInput = currentPage.find('.release-write-price').children('input');
    const specInput = currentPage.find('.release-write-spec').children('input');
    const stockInput = currentPage.find('.release-write-stock').children('input');
    const contactInput = currentPage.find('.release-write-contact').children('input');
    const subBtn = currentPage.find('.release-sub-info')[0];
    const { cacheUserInfoKey, debug } = config;
    const userInfo = store.get(cacheUserInfoKey);
    const phoneNumber = userInfo && userInfo['phone'] || '';
    const nickname = userInfo ? ((userInfo['personalAuthenticationState'] == 1 && userInfo['name']) || userInfo['nickname']) : '';
    const descriptInput = currentPage.find('textarea')[0];

    window.isTipBack = false;

    saveSelectFishCache({
        name: fishName,
        id: fishId,
        parant_id: parentFishId,
        parant_name: parentFishName
    });

    const specBox = currentPage.find('.release-spec-list-box');
    const descriptBox = currentPage.find('.release-discription-list-box');

    let provinceName, cityName, provinceId, cityId, initProvinceName, initCityName;
    let isSendInfo = false;

    if (window.addressObj) {
        initProvinceName = window.addressObj['initProvinceName'];
        initCityName = window.addressObj['initCityName'];
    }

    currentPage.find('.release-info-pic-list').append(releaseInfo.addPicBtn());
    currentPage.find('.release-back-select-fish').children('.back')[0].onclick = () => {
        window.isTipBack = true;
        mainView.router.back();
    };

    if (window['selectedAddress'] && window['selectedAddress']['provinceName']) {
        addressInput[0] && (addressInput.val(window['selectedAddress']['provinceName'] + window['selectedAddress']['cityName']));
    } else if (initProvinceName) {
        addressInput[0] && addressInput.val(initProvinceName + initCityName);
    }
    if (type == 1) {
        html(currentPage.find('.release-sub-info'), '发布求购信息', f7);
        currentPage.find('.release-info-discription-label').text('具体要求');
        currentPage.find('.release-text-tag-box').remove();
        currentPage.find('.release-type').text('求购品种');
        currentPage.find('.release-info-pic-tip').remove();
        currentPage.find('.release-info-header').remove();
        currentPage.find('.release-infomation').css('marginTop', 0);
        currentPage.find('.release-totle-number').text('求购数量');
    } else {
        html(currentNav.find('.release-info-title'), '我要出售', f7);
        html(currentPage.find('.release-sub-info'), '发布出售信息', f7);
    }
    currentPage.find('.release-fish-name').text(fishName);

    /**
    * render 鱼种规格标签
    * */
    let specListHtml = '';
    if(parentFishName == '水产苗种'){
        $$.each(getTagInfo()['specList'], (index, item) => {
            specListHtml += releaseInfo.tag(item);
        })
    }else{
        $$.each(getTagInfo()['adultFishTags'], (index, item) => {
            specListHtml += releaseInfo.tag(item);
        })
    }

    html(specBox, specListHtml, f7);
    !specListHtml && currentPage.find('.release-spec-list').hide().prev().removeClass('border-none');

    /**
    * render补充说明标签
    * */
    let discriptListHtml = '';
    $$.each(getTagInfo()['discriptionList'], (index, item) => {
        if (parentFishName == '水产苗种') {
            !item.category && (discriptListHtml += releaseInfo.tag(item));
        } else if (item.category) {
            discriptListHtml += releaseInfo.tag(item);
        }
    })
    html(descriptBox, discriptListHtml, f7);
    !discriptListHtml && currentPage.find('.release-discription-list').hide();

    /**
    * 选择鱼种规格标签
    * */
    let specTag = {};
    currentPage.find('.release-spec-list-box')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if (ele.tagName !== 'SPAN') {
            return;
        }
        currentPage.find('.release-spec-list-box').children('span').removeClass('on');
        ele.className = 'on';
        specTag.id = Number($$(ele).attr('data-id'));
        specTag.tagName = $$(ele).text();
    }

    /**
    * 选择补充说明标签
    * */
    let descriptTags = [];
    currentPage.find('.release-discription-list-box')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if (ele.tagName !== 'SPAN') {
            return;
        }
        const obj = {
            id: Number($$(ele).attr('data-id')),
            tagName: $$(ele).text()
        };
        $$(ele).toggleClass('on');
        if (descriptTags.length) {
            let i = -1;
            $$.each(descriptTags, (index, item) => {
                obj.id == item.id && (i = index);
            })
            if (i > -1) {
                descriptTags.splice(i, 1);
            } else {
                if (descriptTags.length == 3) {
                    $$(ele).toggleClass('on');
                    nativeEvent.nativeToast(0, '最多只能选择三个标签！');
                    return;
                } else {
                    descriptTags.push(obj)
                }
            }
        } else {
            descriptTags.push(obj)
        }
    }

    /**
    * 选择地区调用native组件
    * */
    addressInput.on('click', () => {
        if (window.addressObj && window.addressObj['initProvinceName'] || window['selectedAddress']) {
            const provinceName = window['selectedAddress'] ? window['selectedAddress']['provinceName'] : window.addressObj['initProvinceName'];
            const cityName = window['selectedAddress'] ? window['selectedAddress']['cityName'] : window.addressObj['initCityName'];
            const {
                provinceIndex,
                cityIndex
            } = getAddressIndex(provinceName, cityName);
            nativeEvent.eventChooseAddress(0, provinceIndex, cityIndex);
        } else {
            // get address.
            nativeEvent.eventChooseAddress(0, 0, 0);
        }
    })
    phoneNumber && tellInput.val(phoneNumber);
    nickname && contactInput.val(nickname);

    /**
    * 手机号码效验
    * */
    const testRequireInfo = () => {
        const val = trim(tellInput[0].value);
        if (/^1[3|4|5|7|8]\d{9}$/.test(val) && addressInput[0].value) {
            currentPage.find('.release-sub-info').addClass('pass');
        } else {
            currentPage.find('.release-sub-info').removeClass('pass');
        }

        !tellInput[0] && clearInterval(intervalId);
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
            currentPage.find('.release-sub-info').removeClass('pass');
            clearInterval(intervalId);
            window['releaseInfo'] = data['data'];
            view.router.load({
                url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishId}&fishName=${fishName}&phone=${requirementPhoneNumber}`,
                // reload: true
            })
        } else {
            f7.hideIndicator();
        }
    }

    descriptInput.onkeyup = () => {
        const val = trim(descriptInput.value);
        let len = 0;

        const filterVal = isEmailStr(val);
        if (filterVal) {
            descriptInput.value = filterVal;
            len = filterVal.length;
        }else{
            len = val ? val.length : 0;
        }
        if (len >= 50) {
            currentPage.find('.release-info-number').addClass('desiable');
            descriptInput.value = filterVal ? filterVal.substr(0, 49) : val.substr(0, 49);
        } else {
            currentPage.find('.release-info-number').removeClass('desiable');
        }
        currentPage.find('.release-info-number').text(len);
        return;

    }

    /**
    * 添加/删除出售信息自定义图片
    * */
    if (currentPage.find('.release-info-pic').length) {
        currentPage.find('.release-info-pic')[0].onclick = (e) => {
            const ele = e.target || window.event.target;
            const classes = ele.className;
            const len = currentPage.find('.release-info-pic-list').children('span').length;
            classes.indexOf('add') > -1 && nativeEvent['postPic'](5, '', '', 'postReleasePicCallback');
            //remove img.
            if (classes.indexOf('remove-release-img-btn') > -1) {
                if (!$$(ele).parent().prev().length && $$(ele).parent().nextAll().length > 1) {
                    $$(ele).parent().next().children('span').show();
                }
                $$(ele).parent('span').remove();
                !currentPage.find('.release-info-pic-add').length && currentPage.find('.release-info-pic-list').append(releaseInfo.addPicBtn());
            }
        }
    }

    /**
    * 获取自定义图片的路径
    * */
    const getImgListUrl = () => {
        let res = [];
        $$.each(currentPage.find('.release-info-img'), (index, item) => {
            res.push($$(item).attr('src').split('@')[0]);
        })
        return res;
    }

    /**
     * 监听检查标题输入
     * */
    if (currentPage.find('.release-info-header-title').length) {
        currentPage.find('.release-info-header-title').children()[0].onkeyup = () => {
            const val = trim(currentPage.find('.release-info-header-title').children().eq(0).val());
            const filterVal = isEmailStr(val);
            let len = 0;
            if (filterVal) {
                len = filterVal.length;
                currentPage.find('.release-info-header-title').children().eq(0).val(filterVal);
            }else{
                len = val.length;
            }
            // currentPage.find('.release-info-header-title').children().eq(1).text(10 - filterVal.length + 1)
            // if (val && val.length >= 7) {
            //     currentPage.find('.release-info-header-title').children().eq(1).addClass('check-miss');
                if (len >= 10) {
                    currentPage.find('.release-info-header-title').children().eq(0).
                    val(filterVal ? filterVal.substr(0, 10) : val.substr(0, 10));
                }
            // } else {
            //     currentPage.find('.release-info-header-title').children().eq(1).removeClass('check-miss');
            // }
        }
    }

    /**
     * 价格输入框监听
     * */
    priceInput[0].onkeyup = () => {
        const val = priceInput[0].value;
        const filterVal = isEmailStr(val);
        if (filterVal) {
            priceInput[0].value = filterVal.substr(0, 8);
        }else{
            if(val.length > 8){
                priceInput[0].value = val.substr(0, 8);
            }
        }

    }

    /**
     * 规格输入框监听
     * */
    specInput[0].onkeyup = () => {
        const val = specInput[0].value;
        const filterVal = isEmailStr(val);
        if (filterVal) {
            specInput[0].value = filterVal.substr(0, 20);
        }else{
            if(val.length > 20){
                specInput[0].value = val.substr(0, 20);
            }
        }
    }

    /**
     * 供货数量输入框监听
     * */
    stockInput[0].onkeyup = () => {
        const val = stockInput[0].value;
        const filterVal = isEmailStr(val);
        if (filterVal) {
            stockInput[0].value = filterVal.substr(0, 20);
        }else{
            if(val.length > 20){
                stockInput[0].value = val.substr(0, 20);
            }
        }

    }

    /**
     * 联系姓名输入框监听
     * */
    contactInput[0].onkeyup = () => {
        const val = contactInput[0].value;
        const filterVal = isEmailStr(val);
        if(filterVal){
            contactInput[0].value = filterVal;
        }
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
            !provinceId && provinceName && (provinceId = getSingleProvinceId(_district, provinceName));
            !cityId && (cityId = getCityId(_district, provinceName, cityName));
        }
        const price = trim(priceInput[0].value);
        const spec = trim(specInput[0].value);
        const stock = trim(stockInput[0].value);
        const address = trim(addressInput[0].value);
        const description = trim(descriptInput.value);
        const name = trim(contactInput[0].value);
        const phone = isEmailStr(trim(tellInput[0].value)) || trim(tellInput[0].value);
        const title = trim(currentPage.find('.release-info-header-title').children().val());
        let error;
        if (title && title.length > 10) {
            error = '标题最大长度为10位字符！'
        } else if (!/^1[3|4|5|7|8]\d{9}$/.test(phone)) {
            error = '请您输入正确的手机号码！';
        } else if (!trim(address)) {
            error = '请选择地区！';
        } else if (price && price.length > 8) {
            error = '价格最大长度为8位字符！'
        } else if (spec && spec.length > 20) {
            error = '规格最大长度为20位字符！'
        } else if (stock && stock.length > 20) {
            error = '数量最大长度为20位字符！'
        } else if (description && description.length > 50) {
            error = '补充说明最大长度为50位字符！'
        } else if(name && name.length > 8){
            error = '联系人姓名最大长度为8位字符！'
        }

        const {lng, lat} = getAddressIndex(provinceName, cityName);

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
            longitude: lng || '',
            latitude: lat || '',
            description,
            provinceId,
            cityId,
            provinceName,
            cityName,
            contactName: name,
            title,
            imgs: getImgListUrl()
        }
    }

    /**
    * 点击发布按钮提交发布信息
    * */
    subBtn.onclick = () => {
        apiCount('btn_text_post');
        let data = subInfoTest();
        if (data.error) {
            f7.alert(data.error);
            return;
        }

        data.quantityTags = specTag.tagName ? [specTag] : [];
        data.descriptionTags = descriptTags;
        //If the user does not select the specification, jump to the selection page.
        if (currentPage.find('.release-spec-list-box').children('span').length && !specTag.tagName) {
            window.realeseInfomation = data;
            view.router.load({
                url: 'views/releaseSelectTag.html',
            })
            return;
        }

        if (isSendInfo) {
            return;
        }
        isSendInfo = true;
        setTimeout(() => { isSendInfo = false }, 500);
        f7.showIndicator();
        customAjax.ajax({
            apiCategory: 'demandInfoAdd',
            header: ['token'],
            paramsType: 'application/json',
            data: data,
            type: 'post',
            isMandatory: true,
            noCache: true
        }, callback);
    }

}
export {
    releaseInfoInit
}
