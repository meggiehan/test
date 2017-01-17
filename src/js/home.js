import customAjax from '../middlewares/customAjax';
import {home} from '../utils/template';
import {html} from '../utils/string';
import {goUser} from '../utils/domListenEvent';
import nativeEvent from '../utils/nativeEvent';
import {getAll} from '../utils/locaStorage';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';

function homeInit(f7, view, page) {
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    /*
     * 判断是否有数据缓存，如果有就直接显示缓存
     * */
    if (getAll().length) {
        currentPage.find('.ajax-content').show();
        currentPage.find('.home-loading').hide();
    }

    /*
     * 成交列表 render
     * 鱼种标签 render
     * 成交记录 render
     * */
    const renderDealList = (data) => {
        let dealHtml = '';
        $$.each(data, (index, item) => {
            dealHtml += home.dealInfo(item);
        })
        html($$('.home-deal-info-list'), dealHtml);
    }
    const renderBanners = (data) => {
        let bannerHtml = '';
        $$.each(data, (index, item) => {
            bannerHtml += home.banner(item);
        })
        bannerHtml && html($$('.home-slider .swiper-wrapper'), bannerHtml, f7);
        setTimeout(() => {
            data.length && f7.swiper('.swiper-slow', {
                pagination: '.swiper-slow .swiper-pagination',
                lazyLoading: true,
                initialSlide: 0,
                speed: 400,
                autoplay: 4000,
                loop: true,
                autoplayDisableOnInteraction: true,
            });
        }, 200)
        setTimeout(() => {
            1 != data.length && $$('.home-slider .swiper-pagination span').addClass('inline');
        }, 550)
        $$('.home-slider').show(210);
    }
    const renderFishTags = (tagList) => {
        console.log('render tag list!')
    }
    const initDataCallback = (data) => {
        const {banners, trades, fishTags} = data.data;
        if (1 == data.code) {
            banners.length && renderBanners(banners);
            trades.length && renderDealList(trades);
            fishTags.length && renderFishTags(fishTags);
            return;
        }
    }
    customAjax.ajax({
        apiCategory: 'initPage',
        data: [],
        type: 'get'
    }, initDataCallback);

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
    function getHomeListInfo() {
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'list',
            data: ['true'],
            val: {
                index: 'index'
            },
            type: 'get',
            isMandatory: nativeEvent.getNetworkStatus()
        }, callback);
    }

    getHomeListInfo();

    /*
     * 刷新首页列表数据
     * */
    const ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('refresh', getHomeListInfo);

    /*
     * 跳转页面
     * */
    $$('.href-go-user').off('click', goUser).on('click', goUser);
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        })
    })


    /*
     * 点击活动banner，打开第三方webview.
     * */
    currentPage.find('.home-slider')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if ($$(ele).hasClass('swiper-slide-active') || ele.tagName == 'IMG') {
            const isNeedLogin = $$(ele).attr('data-login') || $(ele).parent().attr('data-login');
            if (!!Number(isNeedLogin) && !isLogin()) {
                f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow)
                return;
            }
            const access_token = nativeEvent.getUserValue();
            let openUrl = $(ele).attr('data-href') || $(ele).parent().attr('data-href');
            isNeedLogin && (openUrl += `/${access_token}`);
            nativeEvent.goNewWindow(openUrl);
        }
    }

    /*
     * 调用微信登录
     * */
    if ($$('.weixin-login-btn').length) {
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
