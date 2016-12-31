import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { home } from '../utils/template';
import { html } from '../utils/string';
import { goUser } from '../utils/domListenEvent';
import nativeEvent from '../utils/nativeEvent';
import { getAll } from '../utils/locaStorage';
import {isLogin} from '../middlewares/loginMiddle';
import store from '../utils/locaStorage';

function homeInit(f7, view, page) {
    f7.hideIndicator();
    const { pageSize, cacheUserinfoKey } = config;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    let catType = 2;
    if (getAll().length) {
        $$('.ajax-content').show();
        $$('.home-loading').hide();
    }

    const dealListCallback = (data) => {
        const {code} = data;
        if(1 == code){
            let dealHtml = '';
            $$.each(data.data, (index, item) => {
                dealHtml += home.dealInfo(item);
            })
            html($$('.home-deal-info-list'), dealHtml);
        }
    }
    //get deal list.
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'dealList',
        data: [1, pageSize],
        type: 'get'
    }, dealListCallback);

    /*
     *  When the type is equal to give a value.Execute the following method.
     */
    const callback = (data, err, type) => {
        //cat sell list
        const dataType = data.data.list[0]['type'];
        if (dataType == 2) {
            let catListHtml = '';
            $$.each(data.data.list, (index, item) => {
                catListHtml += home.cat(item);
            })

            html($$('.cat-list-foreach'), catListHtml, f7);
            $$('.ajax-content').show(200);
            $$('.home-loading').hide(100);
        }
        //cat buy list
        if (dataType == 1) {
            let buyListHtml = '';
            $$.each(data.data.list, (index, item) => {
                buyListHtml += home.buy(item);
            })

            html($$('.buy-list-foreach'), buyListHtml, f7);
        }
        if (data.data && data.data.list && catType === 2) {
            catType = 1;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfoList',
                data: ["", "", 1, "", 10, 1],
                type: 'get'
            }, callback);
        }
        //pull to refresh done.
        f7.pullToRefreshDone();
        $$('img.lazy').trigger('lazy');
    }

    /*
     * initialization home page and send ajax to get list data.
     */
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfoList',
        data: ["", "", 2, "", 10, 1],
        type: 'get'
    }, callback);

    // pull to refresh.
    const ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        catType = 2;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfoList',
            data: ["", "", 2, "", 10, 1],
            type: 'get',
            isMandatory
        }, callback);
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'dealList',
            data: [1, pageSize],
            type: 'get'
        }, dealListCallback);
    })

    //go home page;
    $$('.href-go-user').off('click', goUser).on('click', goUser);
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        })
    })

    //get banner date to server;
    const bannerCallback = (res) => {
        const {code, data} = res;
        if(1 == code && data.length){
            let bannerHtml = '';
            $$.each(data, (index, item) => {
                bannerHtml += home.banner(item);
            })
            bannerHtml && html($$('.home-slider .swiper-wrapper'), bannerHtml, f7);
            data.length > 1 && f7.swiper('.swiper-slow', {
                pagination:'.swiper-slow .swiper-pagination',
                speed: 400
            });
            setTimeout(() => {
                1 != data.length && $$('.home-slider .swiper-pagination span').show();
            }, 550)
            $$('.home-slider').show(200);
        }
    }
    customAjax.ajax({
        apiCategory: 'banners',
        data: [],
        type: 'get'
    }, bannerCallback);

    currentPage.find('.home-slider')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if($$(ele).hasClass('swiper-slide-active') || ele.tagName == 'IMG'){
            if(!isLogin()){
                f7.alert('此活动需要登录才能参加，请您先去登录！','提示', function(){
                    view.router.load({
                        url: 'views/login.html'
                    })
                })
                return;
            }
            f7.showIndicator();
            // const {loginName, id} = store.get(cacheUserinfoKey);
            const access_token = nativeEvent.getUserValue();
            const openUrl = $(ele).attr('data-href') || $(ele).parent().attr('data-href');
            window.location.href = openUrl + `/${access_token}`;
        }
    }

    nativeEvent.setDataToNative('appIndexUrl', window.location.href);

    // //存储数据
    // $$('#shareToWeixin').children().eq(0)[0].onclick = () => {
    //     const a = JSON.stringify([{sk: 123}]);
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.setDataToNative('sk', a);
    // }

    // $$('#shareToWeixin').children().eq(1)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     alert(nativeEvent.getDataToNative('sk'));
    // }

    // //分享
    // $$('#shareToWeixin').children().eq(2)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(0, 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png');
    // }

    // $$('#shareToWeixin').children().eq(3)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(1, 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png');
    // }

    // $$('#shareToWeixin').children().eq(4)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(2, 'http://baidu.com', 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png', '测试', '我是分享测试');
    // }

    // $$('#shareToWeixin').children().eq(5)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(3, 'http://baidu.com', 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png', '测试', '我是分享测试');
    // }

}

module.exports = {
    homeInit
}
