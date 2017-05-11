import customAjax from '../middlewares/customAjax';
import {home} from '../utils/template';
import {html, getName} from '../utils/string';
import config from '../config';
import {goUser} from '../utils/domListenEvent';
import nativeEvent from '../utils/nativeEvent';
import {getAll} from '../utils/localStorage';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import {releaseFishViewShow} from '../js/releaseView/releaseFishViews';
import {getDealTime} from '../utils/time';
import Vue from 'vue';
import {JsBridge} from '../middlewares/JsBridge';
import store from '../utils/localStorage';
import HomeModel from './model/HomeModel';
import tabbar from '../component/tabbar';

function homeBuyInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {fishCacheObj, cacheUserInfoKey} = config;
    const userInfo = isLogin() ? (store.get(cacheUserInfoKey) || {}) : {};
    const fishCarDriverId = userInfo.fishCarDriverId || '';
    /**
     * vue的数据模型
     * */
    Vue.component('tab-bar-component', tabbar);

     // 底部tabbar组件
    new Vue({
        el: currentPage.find('.toolbar')[0]
    });

    const vueHome = new Vue({
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
            isHasCache: getAll().length
        },
        methods: {
            getName: getName,
            getDealTime: getDealTime,
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
                vueHome.fishCarTripInfo = data || '';
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
            vueHome.homeData = data.data;
            if(data.data.ads && data.data.ads.length){
                if(data.data.ads.length % 2 == 0){
                    vueHome.homeData.adsTop = data.data.ads;
                }else{
                    vueHome.homeData.adsBottom = [data.data.ads.pop(), data.data.ads.pop(), data.data.ads.pop()];
                    vueHome.homeData.adsBottom.reverse();
                    vueHome.homeData.adsTop = data.data.ads;
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
     * render 最近使用鱼种
     * */
    setTimeout(() => {
        const fishCacheData = store.get(fishCacheObj.fishCacheKey);
        if (fishCacheData && fishCacheData.length){
            let str = '';
            $$.each(fishCacheData.reverse(), (index, item) => {
                if (index <= 5){
                    str += home.renderFishList(item, index);
                }
            });
            currentPage.find('.fish-cache-list').html(str);
            str ? currentPage.find('.home-fish-cache-list').show() : currentPage.find('.home-fish-cache-list').hide();
        }
    }, 400);

    /**
     * render 首页的信息列表
     * */
    const callback = (data, err, type) => {
        const {buyDemands, saleDemands} = data.data;
        if (saleDemands.length){
            let catListHtml = '';
            $$.each(saleDemands, (index, item) => {
                catListHtml += home.cat(item);
            });
            html(currentPage.find('.cat-list-foreach'), catListHtml, f7);
        }

        if (buyDemands.length){
            let buyListHtml = '';
            $$.each(buyDemands, (index, item) => {
                buyListHtml += home.buy(item);
            });
            html(currentPage.find('.buy-list-foreach'), buyListHtml, f7);
        }
        vueHome.isHasCache = true;
        // pull to refresh done.
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
    };
    /*
     * 获取首页信息
     * */
    function getHomeListInfo (bool, onlyUseCache){
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'list',
            data: ['true'],
            val: {
                index: 'index'
            },
            type: 'get',
            isMandatory: bool,
            onlyUseCache
        }, callback);
    }

    getHomeListInfo(false, true);

    /*
     * 刷新首页列表数据
     * */
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', () => {
        getHomeListInfo(nativeEvent.getNetworkStatus());
    });
    setTimeout(() => {
        f7.pullToRefreshTrigger(ptrContent);
    }, 50);

    /*
     * 跳转页面
     * */
    $$('.href-go-user').off('click', goUser).on('click', goUser);
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });

    /**
     *当前登录角色通过司机审核时,之间跳转至需求列表
     *如果有选择历史,优先选择历史的选择
     * */
    currentPage.find('.callFishCar').click(() => {
        const userInfo = store.get(cacheUserInfoKey);
        const {driverState} = userInfo || {};
        const isFishCar = store.get('isFishCar');

        if (isFishCar || 0 === isFishCar){
            window.mainView.router.load({
                url: `views/fishCar.html?isFishCar=${isFishCar}`
            });
            return;
        }

        if (isLogin() && (1 == driverState)){
            window.mainView.router.load({
                url: 'views/fishCar.html?isFishCar=1'
            });
            return;
        }
        $$('.fish-car-modal').addClass('on');
    });

    if(!window.uuid){
        setTimeout(() => {
            JsBridge('JS_GetUUid', {}, (data) => {
                window.uuid = data;
            });
        }, 4000);
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
