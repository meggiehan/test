import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/localStorage';
import { timeDifference, centerShowTime, getMarketTimeStr } from '../utils/time';
import {
    saveSelectFishCache,
    getRange,
    getAddressIndex,
    alertTitleText,
    getCertInfo
} from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import { detailClickTip } from '../utils/domListenEvent';
import { isLogin, loginViewShow } from '../middlewares/loginMiddle';
import CountModel from './model/count';
import Vue from 'vue';
import InfoDetail from './model/InfoDetail.js';

function buydetailInit (f7, view, page){
    const { id } = page.query;
    const currentPage = $$($$('.view-main .pages>.page-buydetail')[$$('.view-main .pages>.page-buydetail').length - 1]);
    const lastHeader = $$($$('.view-main .navbar>div')[$$('.view-main .navbar>div').length - 1]);
    const { shareUrl, cacheUserInfoKey, mWebUrl, imgPath } = config;
    const locaUserId = store.get(cacheUserInfoKey) && store.get(cacheUserInfoKey).id;

    if(!window['addressObj']){
        nativeEvent.getAddress();
    }

    const collectionCallback = (data) => {
        const { code } = data;
        if (8 == code){
            nativeEvent['nativeToast'](0, '您已收藏过该资源!');
        } else if (1 !== code){
            const info = footVue.favorite ? '添加收藏失败，请重试！' : '取消收藏失败，请重试！';
            nativeEvent['nativeToast'](0, info);
            footVue.favorite = !footVue.favorite;
        } else {
            let info;
            let collectionNum = Number($$('.user-collection-num').text());
            if (footVue.favorite){
                info = '添加收藏成功！';
                $$('.user-collection-num').text(++collectionNum);
            } else {
                info = '取消收藏成功！';
                $$('.user-collection-num').text(--collectionNum);
                $$('div[data-page="myCollection"]').find('a[href="./views/buydetail.html?id=' + id + '"]').remove();
            }
            nativeEvent['nativeToast'](1, info);
        }
        f7.hideIndicator();
    };

    const footVue = new Vue({
        el: currentPage.find('.buydetail-footer')[0],
        data: {
            isMineInfo: false,
            userInfo: {},
            demandInfo: {},
            favorite: '',
            isReview: false,
            isVerify: false,
            isDelete: false,
            isLogin: isLogin(),
            isIos: window.currentDevice.ios
        },
        methods: {
            catRejectInfo (){
                window.apiCount('btn_rejectReason');
                f7.alert(this.demandInfo.refuseDescribe, '查看原因');
            },
            callPhone (){
                window.apiCount('btn_call');
                nativeEvent.contactUs(this.demandInfo.requirementPhone);
                CountModel.phoneCount({
                    entry: 1,
                    phone: this.demandInfo.requirementPhone
                }, (res) => {
                    const {code} = res;
                    if(1 !== code){
                        console.log('发送统计失败！');
                    }
                });
            },
            deleteInfo (){
                window.apiCount('btn_delete');
                f7.confirm('你确定删除出售信息吗？', '删除发布信息', () => {
                    f7.showIndicator();
                    customAjax.ajax({
                        apiCategory: 'demandInfo',
                        api: 'deleteDemandInfo',
                        header: ['token'],
                        paramsType: 'application/json',
                        val: {
                            id
                        },
                        type: 'DELETE',
                        noCache: true
                    }, (data) => {
                        const {code, message} = data;
                        f7.hideIndicator();
                        f7.alert(message || '删除成功', '提示', () => {
                            if (1 == code){
                                const sellNum = parseInt($$('.user-sell-num').eq($$('.user-sell-num').length - 1).text(), 10) - 1;
                                $$('.page-my-list a[href="./views/selldetail.html?id=' + id + '"]').next('div.list-check-status').remove();
                                $$('.page-my-list a[href="./views/selldetail.html?id=' + id + '"]').remove();
                                $$('.user-sell-num').text(sellNum <= 0 ? 0 : sellNum);
                                view.router.back();
                                view.router.refreshPage();
                            }
                        });
                    });
                });
            },
            shareInfo (){
                if (!store.get('isWXAppInstalled')){
                    f7.alert('分享失败');
                    return;
                }
                let title = '';
                const {
                    specifications,
                    stock,
                    provinceName,
                    cityName,
                    fishTypeName,
                    price,
                    imgePath,
                    description
                } = this.demandInfo;

                title += `【求购】${fishTypeName}, ${provinceName || ''}${cityName || ''}`;
                let descriptionText = title + '，';
                if(!this.demandInfo.title){
                    descriptionText += stock ? `${'求购数量： ' + stock}，` : '';
                    descriptionText += price ? `${'价格：' + price}，` : '';
                    descriptionText += specifications ? `${'规格：' + specifications}，` : '';
                    descriptionText += description ? description : '';
                    descriptionText += '点击查看更多信息~';
                }else{
                    descriptionText += this.demandInfo.title;
                }

                window.shareInfo = {
                    title,
                    webUrl: `${shareUrl}${id}`,
                    imgUrl: imgePath,
                    description: descriptionText
                };
                $$('.share-to-weixin-model').addClass('on');
            },
            collectionAction (){
                window.apiCount('btn_favorite');
                if (!nativeEvent['getNetworkStatus']()){
                    nativeEvent.nativeToast(0, '请检查您的网络！');
                    f7.pullToRefreshDone();
                    f7.hideIndicator();
                    return;
                }
                if (!isLogin()){
                    f7.alert(alertTitleText(), '温馨提示', loginViewShow);
                    return;
                }
                const httpType = this.favorite ? 'DELETE' : 'POST';
                this.favorite = !this.favorite;

                customAjax.ajax({
                    apiCategory: 'favorite',
                    api: 'demandInfo',
                    header: ['token'],
                    val: {
                        id
                    },
                    noCache: true,
                    type: httpType
                }, collectionCallback);
            },
            refreshInfo (){
                InfoDetail.refreshInfo(this.demandInfo.id, (res) => {
                    const {code} = res;
                    if(1 == code){
                        nativeEvent.nativeToast(1, '刷新成功！');
                    }else{
                        nativeEvent.nativeToast(0, '一条信息每天只能刷新一次哟！');
                    }
                });
            }
        },
        computed: {
        }
    });

    const buyVue = new Vue({
        el: currentPage.find('.buy-vue-box')[0],
        data: {
            isMineInfo: false,
            userInfo: {},
            demandInfo: {},
            favorite: '',
            isLogin: isLogin()
        },
        methods: {
            timeDifference: timeDifference,
            getCertInfo: getCertInfo,
            imgPath: imgPath,
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            getMarketTimeStr: getMarketTimeStr,
            catCert (url){
                nativeEvent.catPic(url);
            },
            goAuthPage (){
                view.router.load({
                    url: 'views/catIdentityStatus.html'
                });
            },
            pointUp (){
                if(!isLogin()){
                    f7.alert(alertTitleText(), loginViewShow);
                    return;
                }
                window.apiCount('btn_infoDetail_myMember');
                const userInfo = store.get(cacheUserInfoKey);
                window.mainView.router.load({
                    url: `${mWebUrl}user/member/${userInfo.id}?time=${new Date().getTime()}`
                });
            }
        },
        computed: {
            getRangeText (){
                const {lat, lng} = getAddressIndex(this.demandInfo.provinceName, this.demandInfo.cityName);
                const rangeText = getRange(lat, lng);
                let res = '';
                if (rangeText > -1){
                    res = rangeText;
                }
                return res;
            },
            getImgUrl (){
                let res = '';
                if(this.demandInfo.imgs && JSON.parse(this.demandInfo.imgs).length){
                    res += JSON.parse(this.demandInfo.imgs)[0];
                }else{
                    res += this.demandInfo.imgePath;
                }
                res += '?x-oss-process=image/resize,m_fill,h_200,w_400';
                return res;
            },
            specText (){
                let res = '';
                res += this.demandInfo.quantityTags && JSON.parse(this.demandInfo.quantityTags).length && (JSON.parse(this.demandInfo.quantityTags)[0]['tagName'] || '') || '';
                res && this.demandInfo.specifications && (res = `${res}，${this.demandInfo.specifications}`);
                (!res) && this.demandInfo.specifications && (res += this.demandInfo.specifications);
                return res;
            },
            descriptionTags (){
                let res = '';
                if(this.demandInfo.descriptionTags && JSON.parse(this.demandInfo.descriptionTags).length){
                    res = JSON.parse(this.demandInfo.descriptionTags);
                }
                return res;
            },
            isShowDeal (){
                let res = false;
                if(this.isMineInfo &&
                   !this.demandInfo.closed &&
                    (1 == this.demandInfo.state)){
                    res = true;
                    if((this.demandInfoSale && (this.demandInfoSale.marketTime * 1000 > new Date().getTime()))){
                        res = false;
                    }
                }
                return res;
            }
        }
    });

    /*
     * 拿到数据，编辑页面
     * */
    const callback = (data) => {
        if (data.data){
            const {
                userInfo,
                demandInfo,
                favorite
            } = data.data;
            buyVue.userInfo = userInfo;
            buyVue.demandInfo = demandInfo;
            buyVue.favorite = favorite;
            buyVue.isMineInfo = (locaUserId == userInfo.id);

            footVue.demandInfo = demandInfo;
            footVue.favorite = favorite;
            footVue.isMineInfo = (locaUserId == userInfo.id);
            if(0 == demandInfo.state){
                footVue.isReview = true;
            }

            if(2 == demandInfo.state){
                footVue.isVerify = true;
            }

            if(userInfo.id == locaUserId){
                footVue.isDelete = true;
            }
            const {
                fishTypeName,
                fishParentTypeName,
                fishTypeId,
                fishParentTypeId,
                state,
                requirementPhone
            } = demandInfo;
            const {
                personalAuthenticationState,
                enterpriseAuthenticationState,
                lastLoginTime
            } = userInfo;
            lastHeader.find('a.detail-more').show();

            if (state == 0 || state == 2){
                lastHeader.find('a.detail-more').hide();
                lastHeader.find('right').css('paddingRight', '3rem');
            }

            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && currentPage.addClass(addClassName);

            currentPage.find('.user-tell').children('b').text(requirementPhone);
            currentPage.find('.user-time').text(centerShowTime(lastLoginTime));

            if(personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1){
                currentPage.find('.user-name').css({
                    lineHeight: '5rem',
                    height: '5rem'
                });
            }

            /*
            * 存入最近使用鱼种
            * */
            saveSelectFishCache({
                name: fishTypeName,
                id: fishTypeId,
                // eslint-disable-next-line
                parant_id: fishParentTypeId,
                // eslint-disable-next-line
                parant_name: fishParentTypeName
            });
        }
        f7.hideIndicator(300);
        f7.pullToRefreshDone();
    };

    /*
     * 初始化获取数据跟刷新数据
     * */
    const ptrContent = currentPage.find('.buy-detail-refresh');
    const initData = () => {
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfo',
            data: [id],
            header: ['token'],
            val: {
                id
            },
            type: 'get',
            isMandatory: false
        }, callback);
    };
    ptrContent.on('refresh', initData);
    initData();

    /*
     * 点击右上角nav，选择分享或者举报
     * */
    lastHeader.find('.detail-more')[0].onclick = detailClickTip;
}

export {
    buydetailInit
};
