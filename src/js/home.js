import config from '../config/';
import customAjax from '../middlewares/customAjax';
import {home} from '../utils/template';
import {html} from '../utils/string';
import {goUser} from '../utils/domListenEvent';
import nativeEvent from '../utils/nativeEvent';
import {getAll} from '../utils/locaStorage';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';

function homeInit(f7, view, page) {
    f7.hideIndicator();
    const {pageSize} = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);

    /*
    * 判断是否有数据缓存，如果有就直接显示缓存
    * */
    if (getAll().length) {
        $$('.ajax-content').show();
        $$('.home-loading').hide();
    }

    /*
    * 成交列表 render
    * */
    const dealListCallback = (data) => {
        const {code} = data;
        if (1 == code) {
            let dealHtml = '';
            $$.each(data.data, (index, item) => {
                dealHtml += home.dealInfo(item);
            })
            html($$('.home-deal-info-list'), dealHtml);
        }
    }
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'dealList',
        data: [1, pageSize],
        type: 'get'
    }, dealListCallback);

    /*
    * render 首页的信息列表
    * */
    const callback = (data, err, type) => {
        const {buyDemands, saleDemands} = data.data;
        if (saleDemands.length) {
            let catListHtml = '';
            $$.each(saleDemands, (index, item) => {
                catListHtml += home.cat(item);
            })
            html($$('.cat-list-foreach'), catListHtml, f7);
        }

        if (buyDemands.length) {
            let buyListHtml = '';
            $$.each(buyDemands, (index, item) => {
                buyListHtml += home.buy(item);
            })
            html($$('.buy-list-foreach'), buyListHtml, f7);
        }
        $$('.ajax-content').show(200);
        $$('.home-loading').hide(100);

        //pull to refresh done.
        f7.pullToRefreshDone();
        $$('img.lazy').trigger('lazy');
    }
    /*
    * 获取首页信息
    * */
    function getHomeListInfo () {
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'list',
            data: ['true'],
            val: {
                index: 'index'
            },
            type: 'get'
        }, callback);
    }
    getHomeListInfo();

    /*
    * 刷新首页列表数据
    * */
    const ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('refresh', getHomeListInfo);

    //go home page;
    $$('.href-go-user').off('click', goUser).on('click', goUser);
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        })
    })

    /*
    * 获取banner信息，并且render swiper.
    * */
    const bannerCallback = (res) => {
        const {code, data} = res;
        if (1 == code && data.length) {
            let bannerHtml = '';
            $$.each(data, (index, item) => {
                bannerHtml += home.banner(item);
            })
            bannerHtml && html($$('.home-slider .swiper-wrapper'), bannerHtml, f7);
            data.length > 1 && f7.swiper('.swiper-slow', {
                pagination: '.swiper-slow .swiper-pagination',
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
        type: 'get',
        noCache: true
    }, bannerCallback);

    /*
    * 点击活动banner，打开第三方webview.
    * */
    currentPage.find('.home-slider')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if ($$(ele).hasClass('swiper-slide-active') || ele.tagName == 'IMG') {
            const districtData = nativeEvent['getDistricInfo']() || '';
            if (districtData) {
                nativeEvent.setDataToNative('districtData', districtData);
            }
            if (!isLogin()) {
                f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow)
                return;
            }
            f7.showIndicator();
            const access_token = nativeEvent.getUserValue();
            const openUrl = $(ele).attr('data-href') || $(ele).parent().attr('data-href');
            window.location.href = openUrl + `/${access_token}`;
        }
    }

    /*
    * 调用微信登录
    * */
    if($$('.weixin-login-btn').length){
        $$('.weixin-login-btn')[0].onclick = nativeEvent.callWeixinLogin;
    }

    // //存储数据
    // $$('#shareToWeixin').children().eq(0)[0].onclick = () => {
    //     const a = {
    //         sk:123,
    //         jj: 'qwe',
    //         ok: 'klk'
    //     };
    //     // nativeEvent.setDataToNative('sk', a);
    //     nativeEvent.setUerInfoToNative(a);
    // }

    // $$('#shareToWeixin').children().eq(1)[0].onclick = () => {
    //     console.log(nativeEvent.getDataToNative('sk'));
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

    // $$('#wei-xin-login')[0].onclick = () => {
    //     nativeEvent.callWeixinLogin();
    // }
}

module.exports = {
    homeInit
}
