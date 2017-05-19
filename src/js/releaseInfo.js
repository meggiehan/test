import config from '../config/';
import customAjax from '../middlewares/customAjax';
import {
    html,
    getAddressIndex,
    getTagInfo,
    getProvinceId
} from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import store from '../utils/localStorage';
import { isEmailStr, saveSelectFishCache } from '../utils/string';
import Vue from 'vue';
import ObjectUtil from '../utils/ObjectUtils';

function releaseInfoInit (f7, view, page){
    f7.hideIndicator();
    const { type, fishId, fishName, parentFishId, parentFishName } = page.query;
    const currentPage = $$($$('.view-main .page-release-info')[$$('.view-main .page-release-info').length - 1]);
    const currentNav = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    const { cacheUserInfoKey, imgPath } = config;
    const userInfo = store.get(cacheUserInfoKey);
    const {androidChrome} = window.currentDevice;
    let provinceName, cityName, initProvinceName, initCityName;
    /**
     * [initAddress 定位到的地区信息]
     * @type {String}
     */
    let initAddress = '';

    if (window.addressObj){
        initProvinceName = window.addressObj.initProvinceName;
        initCityName = window.addressObj.initCityName;
    }

    if (window.selectedAddress && window.selectedAddress.provinceName){
        initAddress = window.selectedAddress.provinceName + window.selectedAddress.cityName;
        provinceName = window.selectedAddress.provinceName;
        cityName = window.selectedAddress.cityName;
    } else if (initProvinceName){
        initAddress = initProvinceName + initCityName;
        provinceName = initProvinceName;
        cityName = initCityName;
    }

    const {lng, lat} = getAddressIndex(provinceName, cityName);

    window.isTipBack = false;
    saveSelectFishCache({
        name: fishName,
        id: fishId,
        // eslint-disable-next-line
        parant_id: parentFishId,
        // eslint-disable-next-line
        parant_name: parentFishName
    });

    window.releaseVue = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            descriptionTagsBak: [],
            height: (($$(window).width() - 7) * 18.1 * 0.01).toFixed(2),
            sellTime: '',
            isClose: false,
            priceText: '',
            subInfo: {
                address: initAddress,
                cityId: getProvinceId(provinceName, cityName).cityId,
                cityName,
                contactName: userInfo ? (userInfo.personalAuthenticationState == 1 ? userInfo.name : userInfo.nickname) : '',
                demandInfoBuy: {
                    endTime: ''
                },
                demandInfoSale: {
                    expectedPrice: '',
                    fishCarService: false,
                    hasSpotGoods: false,
                    lowerPrice: '',
                    marketTime: ''
                },
                description: '',
                descriptionTags: [],
                fishParentTypeId: parentFishId,
                fishParentTypeName: parentFishName,
                fishTypeId: fishId,
                fishTypeName: fishName,
                imgs: [],
                latitude: lat || '',
                longitude: lng || '',
                provinceId: getProvinceId(provinceName, cityName).provinceId,
                provinceName,
                quantityTags: '水产苗种' == parentFishName ? getTagInfo()['specList'] : getTagInfo()['adultFishTags'],
                requirementPhone: userInfo ? userInfo.phone : '',
                specifications: '',
                stock: '',
                title: '',
                type
            }
        },
        methods: {
            imgPath: imgPath,
            deleteInfoPic (index){
                this.subInfo.imgs.splice(index, 1);
            },
            addInfoPic (){
                nativeEvent.postPic(5, '', '', 'postReleasePicCallback');
            },
            resetFish (){
                window.isTipBack = true;
                window.mainView.router.back();
            },
            checkText (type){
                this.subInfo[type] = isEmailStr(this.subInfo[type]);
            },
            selectquantityTag (item, index){
                $$.each(this.subInfo.quantityTags, (index, item) => {
                    item.selected = false;
                });
                this.subInfo.quantityTags[index].selected = !this.subInfo.quantityTags[index].selected;
                this.$set(this.subInfo.quantityTags, index, item);
            },
            selectAddress (){
                if (this.subInfo.provinceName && this.subInfo.cityName){
                    const {
                        provinceIndex,
                        cityIndex
                    } = getAddressIndex(this.subInfo.provinceName, this.subInfo.cityName);
                    nativeEvent.eventChooseAddress(0, provinceIndex, cityIndex);
                } else {
                    nativeEvent.eventChooseAddress(0, 0, 0);
                }
            },
            openOrClosePrice (){
                this.isClose = !this.isClose;
            },
            checkPhoneLength (){
                if(this.subInfo.requirementPhone && this.subInfo.requirementPhone.length > 11){
                    this.subInfo.requirementPhone = this.subInfo.requirementPhone.substring(0, 11);
                }
            }
        },
        computed: {
        }
    });

    new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            type,
            isSendInfo: false
        },
        methods: {
            subInfo (){
                window.apiCount('btn_text_post');
                const {err, data} = this.getDataMessage();
                console.log(data);
                if(err){
                    f7.alert(err);
                    return;
                }
                if (data && !data.quantityTags.length){
                    window.realeseInfomation = data;
                    view.router.load({
                        url: 'views/releaseSelectTag.html'
                    });
                    return;
                }

                if(this.isSendInfo){
                    f7.alert('发布中，请稍等...');
                    return;
                }
                f7.showIndicator();
                this.isSendInfo = true;
                customAjax.ajax({
                    apiCategory: 'demandInfoAdd',
                    header: ['token'],
                    paramsType: 'application/json',
                    data: data,
                    type: 'post',
                    isMandatory: true,
                    noCache: true
                }, this.subCallBack);
            },
            subCallBack (data){
                const { code, message } = data;
                if (1 == code){
                    window.releaseInfo = data.data;
                    view.router.load({
                        url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishId}&fishName=${fishName}&phone=${this.subInfo.requirementPhoneNumber}`
                    });
                } else {
                    console.log(message);
                    f7.hideIndicator();
                }
                this.isSendInfo = false;
            },
            getDataMessage (){
                let err = '';
                const buyTimeText = currentPage.find('.release-write-time').children('input').val();
                const subInfo = window.releaseVue.subInfo;
                let data = ObjectUtil.clone(subInfo);

                if(2 == type){
                    if(currentPage.find('.release-write-cargo').children('input').val() == ''){
                        err = '请选择是否有现货';
                    }else{
                        if('即将上市' == currentPage.find('.release-write-cargo').children('input').val()){
                            !data.demandInfoSale.marketTime && (err = '请选择上市时间');
                        }
                    }

                    if(!window.releaseVue.isClose){
                        !window.releaseVue.priceText && (err = '请填写价格');
                    }

                }else{
                    if(!buyTimeText){
                        err = '请选择求购时间';
                    }

                    if(!data.stock){
                        err = '请填写求购数量';
                    }
                }

                if(!data.address){
                    err = '请填选择地区！';
                }

                if(!data.requirementPhone || !(/^1[34578]\d{9}$/.test(data.requirementPhone))){
                    err = '请填写正确的手机号！';
                }
                // 求购数据
                if(1 == type){
                    delete data.demandInfoSale;

                    buyTimeText.indexOf('一') > -1 && (data.demandInfoBuy.endTime = this.getMoreMonth(1));
                    buyTimeText.indexOf('二') > -1 && (data.demandInfoBuy.endTime = this.getMoreMonth(2));
                    buyTimeText.indexOf('三') > -1 && (data.demandInfoBuy.endTime = this.getMoreMonth(3));
                }else{
                    delete data.demandInfoBuy;
                    data.demandInfoSale.hasSpotGoods = ('现在有货' == currentPage.find('.release-write-cargo').children('input').val());
                    data.demandInfoSale.fishCarService = ('提供鱼车服务' == currentPage.find('.release-write-service').children('input').val());
                    if(window.releaseVue.isClose){
                        data.demandInfoSale.lowerPrice = 0;
                        data.demandInfoSale.expectedPrice = 0;
                    }

                    if(!data.demandInfoSale.hasSpotGoods){
                        data.demandInfoSale.marketTime = window.releaseVue.sellTime;
                    }else{
                        data.demandInfoSale.marketTime = 0;
                    }
                }
                data.quantityTags = this.getQuantityTagss(subInfo.quantityTags);
                data.descriptionTags = this.getQuantityTagss(subInfo.descriptionTags);
                const {lng, lat} = getAddressIndex(data.provinceName, data.cityName);
                data.latitude = lat;
                data.longitude = lng;
                return {
                    err,
                    data
                };
            },
            getMoreMonth (n){
                let res = new Date().getTime() + 60 * 60 * 24 * 30 * n * 1000;
                return parseInt(res / 1000, 10);
            },
            getQuantityTagss (arr){
                let res = [];
                $$.each(arr, (index, item) => {
                    if(item.selected){
                        let obj = {};
                        obj.id = item.id;
                        obj.tagName = item.name;
                        res.push(obj);
                    }
                });
                return res;
            }
        }
    });

    // 是否有现货
    const selectIsStock = {
        input: currentPage.find('.release-write-cargo').children('input'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['现在有货', '即将上市']
            }
        ]
    };
    f7.picker(selectIsStock);

    // 是否有物流服务
    const selectIsLogistics = {
        input: currentPage.find('.release-write-service').children('input'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['提供鱼车服务', '不提供鱼车服务']
            }
        ]
    };
    f7.picker(selectIsLogistics);

    // 选择求购时间
    const selectIsBuyTime = {
        input: currentPage.find('.release-write-time').children('input'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['近一个月', '近两个月', '近三个月']
            }
        ]
    };
    f7.picker(selectIsBuyTime);

    if (2 == type){
        html(currentNav.find('.release-info-title'), '我要出售', f7);
    }
}
export {
    releaseInfoInit
};
