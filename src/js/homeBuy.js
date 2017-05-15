import customAjax from '../middlewares/customAjax';
import {home} from '../utils/template';
import {html, getName} from '../utils/string';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import {releaseFishViewShow} from '../js/releaseView/releaseFishViews';
import {getDealTime} from '../utils/time';
import Vue from 'vue';
import {JsBridge} from '../middlewares/JsBridge';
import store from '../utils/localStorage';
import HomeModel from './model/HomeModel';
import tabbar from '../component/tabbar';
import { myListBuy } from '../utils/domListenEvent';

function homeBuyInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {fishCacheObj, cacheUserInfoKey, pageSize} = config;
    const userInfo = isLogin() ? (store.get(cacheUserInfoKey) || {}) : {};
    const fishCarDriverId = userInfo.fishCarDriverId || '';
    let fishCache = store.get(fishCacheObj.fishCacheKey) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
    let pageNo = 1;
    let isRefresh = false;
    let isInfinite = false;
    /**
     * vue的数据模型
     * */
    Vue.component('tab-bar-component', tabbar);

     // 底部tabbar组件
    new Vue({
        el: currentPage.find('.toolbar')[0]
    });

    window.vueHome = new Vue({
        el: currentPage.find('.home-vue-box')[0],
        data: {
            homeData: {
                trades: '',
                banners: [],
                fishTags: '',
                adsTop: [],
                adsBottom: []
            },
            fishCarTripInfo: '',
            fishCarDriverId: fishCarDriverId,
            userInfo: userInfo,
            bigerBuyInfo: '',
            selectCache: [],
            showAll: false
        },
        methods: {
            getName: getName,
            getDealTime: getDealTime,
            myListBuy: myListBuy,
            shareTrip (){
                window.apiCount(this.fishCarTripInfo ? 'btn_home_driver_shareRoute' : 'btn_home_driver_postRoute');
                if (this.fishCarTripInfo){
                    window.mainView.router.load({
                        url: 'views/shareMyTrip.html',
                        query: {
                            contactName: this.fishCarTripInfo.contactName,
                            date: this.fishCarTripInfo.appointedDate,
                            departureProvinceName: this.fishCarTripInfo.departureProvinceName,
                            destinationProvinceName: this.fishCarTripInfo.destinationProvinceName,
                            id: this.fishCarTripInfo.id
                        }
                    });
                } else {
                    window.releaseView.router.load({
                        url: 'views/releaseFishCarTrip.html',
                        reload: true
                    });
                    releaseFishViewShow();
                }
            },
            goThreeWindow (e){
                const ele = e || window.event;
                const $ele = ele.target.tagName == 'DIV' ? $$(ele.target) : $$(ele.target).parent();
                const loginRequired = $ele.attr('data-login');
                const link = $ele.attr('data-href');
                const type = $ele.attr('data-type');
                const id = $ele.attr('data-id');

                if (!!Number(loginRequired) && !isLogin()){
                    f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow);
                    return;
                }
                const accessToken = store.get('accessToken');
                let openUrl = link;
                if (0 == type){
                    loginRequired && (openUrl += `/${accessToken}`);
                    nativeEvent.goNewWindow(openUrl);
                }

                if (1 == type){
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                if (2 == type){
                    f7.showIndicator();
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                // banner统计
                HomeModel.postBannerCount({
                    bannerId: id
                }, (data) => {
                    console.log(data);
                });
            },

            clickAds (item){
                const {
                    loginRequired,
                    type,
                    link
                } = item;
                if (!!Number(loginRequired) && !isLogin()){
                    f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow);
                    return;
                }
                const accessToken = store.get('accessToken');
                let openUrl = link;
                if (0 == type){
                    loginRequired && (openUrl += `/${accessToken}`);
                    nativeEvent.goNewWindow(openUrl);
                }

                if (1 == type){
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                if (2 == type){
                    f7.showIndicator();
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
            },
            goMyBuyList (){
                window.apiCount('btn_home_tutor');
                view.router.load({
                    url: 'views/filter.html?type=1&release=true'
                });
            }
        },
        computed: {
            tripDate (){
                if (!this || !this.fishCarTripInfo){
                    return '';
                }
                let res = '';
                const arr = this.fishCarTripInfo.appointedDate.split('-');

                res += Number(arr[1]) >= 10 ? arr[1] : arr[1].replace('0', '');
                res += '月';
                res += Number(arr[2]) >= 10 ? arr[2] : arr[2].replace('0', '');
                res += '日';
                return res;
            }
        }
    });

    /**
     * 初始化slider
     * */
    const initSlider = () => {
        /*
         * 开始注销掉swiper实例（场景： 在用户中心跟首页切换的时候不注销可能产生多个实例互相影响）
         * */
        if (window.yudadaSwiper){
            window.yudadaSwiper.destroy && window.yudadaSwiper.destroy(false, false);
        }
        window.yudadaSwiper = f7.swiper('.swiper-slow', {
            pagination: currentPage.find('.swiper-pagination'),
            lazyLoading: true,
            paginationClickable: true,
            initialSlide: 0,
            speed: 400,
            autoplay: 4000,
            centeredSlides: true,
            loop: true,
            autoplayDisableOnInteraction: true,
            onTouchStart: (swiper, e) => {
                if ($$.isArray(window.yudadaSwiper)){
                    window.yudadaSwiper[window.yudadaSwiper.length - 1].stopAutoplay();
                } else {
                    window.yudadaSwiper.stopAutoplay();
                }
            },
            onTouchEnd: (swiper, e) => {
                /*
                 * 为了解决手动滑动后，焦点选择错误以及自动滚动关闭的bug
                 * */
                setTimeout(() => {
                    const index = currentPage.find('.swiper-slide-active').attr('data-swiper-slide-index');
                    currentPage.find('.swiper-pagination').children('span').removeClass('swiper-pagination-bullet-active').eq(index).addClass('swiper-pagination-bullet-active');
                    if ($$.isArray(window.yudadaSwiper)){
                        window.yudadaSwiper[window.yudadaSwiper.length - 1].startAutoplay();
                    } else {
                        window.yudadaSwiper.startAutoplay();
                    }
                }, 80);
            }
        });
    };

    /**
     * 获取司机最新的一条信息
     * */
    if (fishCarDriverId && isLogin()){
        HomeModel.getMyFishRecentTrip((res) => {
            const {code, message, data} = res;
            if (1 == code){
                window.vueHome.fishCarTripInfo = data || '';
            } else {
                console.log(message);
            }
        });
    }

    // const renderFishTags = (tagList) => {
    //     console.log('render tag list!');
    // };

    /**
     * 绑定部分vue的数据源
     * slider列表数据、成交记录列表、鱼种分类列表
     * */
    const initDataCallback = (data) => {
        // const {banners, trades, fishTags} = data.data;
        const {banners} = data.data;
        if (1 == data.code){
            window.vueHome.homeData = data.data;
            if(data.data.ads && data.data.ads.length){
                if(data.data.ads.length % 2 == 0){
                    window.vueHome.homeData.adsTop = data.data.ads;
                }else{
                    window.vueHome.homeData.adsBottom = [data.data.ads.pop(), data.data.ads.pop(), data.data.ads.pop()];
                    window.vueHome.homeData.adsBottom.reverse();
                    window.vueHome.homeData.adsTop = data.data.ads;
                }
            }
            banners && banners.length && setTimeout(initSlider, 100);
            return;
        } else {
            console.log(data.message);
        }
    };

    customAjax.ajax({
        apiCategory: 'initPage',
        data: ['3'],
        type: 'get'
    }, initDataCallback);

    /**
     * render 首页的信息列表
     * */
    const callback = (res) => {
        const {code, message, data} = res;
        if(1 == code){
            if (data.length){
                let catListHtml = '';
                $$.each(data, (index, item) => {
                    catListHtml += home.cat(item);
                });
                if(1 == pageNo){
                    html(currentPage.find('.cat-list-foreach'), catListHtml, f7);
                }else{
                    currentPage.find('.cat-list-foreach').append(catListHtml);
                }
            }
            window.vueHome.showAll = (data.length < pageSize);
        }else{
            console.log(message);
        }
        // pull to refresh done.
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
        setTimeout(() => {
            isRefresh = false;
            isInfinite = false;
        }, 100);
    };
    /*
     * 获取首页信息
     * */
    function getHomeListInfo (){
        let fishIds = [];
        fishCache = store.get(fishCacheObj.fishCacheKey) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
        $$.each(fishCache, (index, val) => {
            fishIds.push(val.id);
        });
        HomeModel.postFollowSaleList({
            fishIds,
            pageNo,
            pageSize
        }, callback);
    }

    /*
     * 下啦刷新首页列表数据
     * 上啦加载更多
     * */
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', () => {
        if(isRefresh || isInfinite){
            f7.pullToRefreshTrigger(ptrContent);
            return;
        }
        window.vueHome.showAll = false;
        isRefresh = true;
        isInfinite = false;
        pageNo = 1;
        getHomeListInfo();
    });
    setTimeout(() => {
        f7.pullToRefreshTrigger(ptrContent);
    }, 50);

    ptrContent.on('infinite', () => {
        if(isRefresh || isInfinite){
            return;
        }
        isRefresh = false;
        isInfinite = true;
        pageNo++;
        getHomeListInfo();
    });

    /*
     * 跳转页面
     * */
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });

    // /**
    //  *当前登录角色通过司机审核时,之间跳转至需求列表
    //  *如果有选择历史,优先选择历史的选择
    //  * */
    // currentPage.find('.callFishCar').click(() => {
    //     const userInfo = store.get(cacheUserInfoKey);
    //     const {driverState} = userInfo || {};
    //     const isFishCar = store.get('isFishCar');
    //
    //     if (isFishCar || 0 === isFishCar){
    //         window.mainView.router.load({
    //             url: `views/fishCar.html?isFishCar=${isFishCar}`
    //         });
    //         return;
    //     }
    //
    //     if (isLogin() && (1 == driverState)){
    //         window.mainView.router.load({
    //             url: 'views/fishCar.html?isFishCar=1'
    //         });
    //         return;
    //     }
    //     $$('.fish-car-modal').addClass('on');
    // });

    if(!window.uuid){
        setTimeout(() => {
            JsBridge('JS_GetUUid', {}, (data) => {
                window.uuid = data;
            });
        }, 4000);
    }

    // 获取当前用户本周浏览求购最多的一条信息（浏览次数超过100的）
    if(isLogin()){
        HomeModel.getBiggerBuyInfo((res) => {
            const {code, data, message} = res;
            if(1 == code){
                window.vueHome.bigerBuyInfo = data;
            }else{
                console.log(message);
            }
        });
    }

    // 获取关心鱼种发布的条数
    if(fishCache.length){
        let dataArr = [];
        $$.each(fishCache, (index, item) => {
            let arr = {};
            arr.fishId = item.id;
            arr.fishName = item.name;
            arr.parentFishId = item.parant_id;
            arr.parentFishName = item.parant_name;
            dataArr.push(arr);
        });
        HomeModel.postFollowFishNumber({
            subscribedFishes: dataArr
        }, (res) => {
            const {code, data, message} = res;
            if(1 == code){
                window.vueHome.selectCache = data;
            }else{
                console.log(message);
            }

        });
    }

    // // //存储数据
    // $$('#shareToWeixin').children().eq(0)[0].onclick = () => {
    //     const a = {
    //         sk:123,
    //         jj: 'qwe',
    //         ok: 'klk'
    //     };
    //     // nativeEvent.setDataToNative('sk', a);
    //     nativeEvent.setUerInfoToNative(a);
    // }
    //
    // $$('#shareToWeixin').children().eq(1)[0].onclick = () => {
    //     console.log(nativeEvent.getDataToNative('sk'));
    // }
    //
    // //分享
    // $$('#shareToWeixin').children().eq(2)[0].onclick = () => {
    //     nativeEvent.shareInfoToWeixin(0, 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png');
    // }
    //
    // $$('#shareToWeixin').children().eq(3)[0].onclick = () => {
    //     nativeEvent.shareInfoToWeixin(1, 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png');
    // }
    //
    // $$('#shareToWeixin').children().eq(4)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(2, 'http://baidu.com', 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png', '测试', '我是分享测试');
    // }
    //
    // $$('#shareToWeixin').children().eq(5)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(3, 'http://baidu.com', 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png', '测试', '我是分享测试');
    // };
    //
    // $$('#shareToWeixin').children().eq(6)[0].onclick = () => {
    //     JsBridge('JS_GetUUid', '', (data) => {
    //         alert(`设备号：${data}`)
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(7)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 0,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(8)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 1,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(9)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 2,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(10)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 3,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#wei-xin-login')[0].onclick = () => {
    //     nativeEvent.callWeixinLogin();
    // }
}

export {
    homeBuyInit
};
