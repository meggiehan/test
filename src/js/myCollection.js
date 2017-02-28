import store from '../utils/localStorage';
import config from '../config';
import { home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import { isLogin } from '../middlewares/loginMiddle';
import customAjax from '../middlewares/customAjax';

function myCollectionInit(f7, view, page) {
    if (!isLogin()) {
        nativeEvent['nativeToast'](0, '您还没有登录，请先登录!');
        mainView.router.load({
            url: 'views/login.html',
            reload: true
        })
        return;
    }
    let type = 2; //default: 2
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);

    const { pageSize, cacheUserinfoKey } = config;
    const { id, level } = store.get(cacheUserinfoKey) || { id: 1 };
    const sellLoad = currentPage.find('.sell-infinite-scroll-preloader');
    const buyLoad = currentPage.find('.buy-infinite-scroll-preloader');
    const showSellAllInfo = currentPage.find('.sell-collection-empty-info');
    const showBuyAllInfo = currentPage.find('.buy-collection-empty-info');

    const sellContent = currentPage.find('.sell-collection-list-info');
    const buyContent = currentPage.find('.buy-collection-list-info');


    const sellEmpty = currentPage.find('.sell-collection-list-empty');
    const buyEmpty = currentPage.find('.buy-collection-list-empty');
    let emptyInfo = sellEmpty;

    let sellPageNo = 1;
    let buyPageNo = 1;

    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;

    const callback = (data) => {
        const { code } = data;
        let currentPageNo;
        f7.hideIndicator();
        f7.pullToRefreshDone();
        if (code !== 1) {
            // f7.alert('请求过于频繁，请稍后再试！', '提示');
            return;
        }

        let otehrHtml = '';
        let content, listLength, load;
        if (2 == type) {
            content = sellContent;
            load = sellLoad;
            currentPageNo = sellPageNo;
        } else {
            content = buyContent;
            load = buyLoad;
            currentPageNo = buyPageNo;
        }
        listLength = content.children('a').length;

        $$.each(data.data, (index, item) => {
            if (2 == type) {
                otehrHtml += home.cat(item, level);
            } else {
                otehrHtml += home.buy(item, level);
            }
        })

        if (!pullToRefresh && data.data.length && (currentPageNo != 1)) {
            content.append(otehrHtml);
        } else {
            html(content, otehrHtml, f7);
        }

        if (data.data.length < pageSize || !data.data.length) {
            2 == type ? showSellAllInfo.show() : showBuyAllInfo.show();
            load.hide();
        }else{
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            load.show();
        }

        if (!listLength && !data.data.length) {
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            emptyInfo.show();
        } else {
            emptyInfo.hide();
        }
        pullToRefresh = false;
        isInfinite = false;
        loading = false;
        setTimeout(() => {
                $$('img.lazy').trigger('lazy');
        }, 400)
    }

    const getListInfo = () => {
        const pageNo = type == 2 ? sellPageNo : buyPageNo;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        isInfinite = false;
        pullToRefresh = false;
        loading = false;

        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: ['', pageSize, pageNo, type],
            type: 'get',
            isMandatory
        }, callback);
    }

    //get list for service;
    getListInfo();
    currentPage.find('#tab1').on('show', function() {
        type = 2;
        !sellContent.children('a').length && getListInfo();
    });

    currentPage.find('#tab2').on('show', function() {
        type = 1;
        !buyContent.children('a').length && getListInfo();
    });

    currentPage.find('.infinite-scroll').on('infinite', function() {
        if (2 == type ? showSellAllInfo.css('display') == 'block' :
             showBuyAllInfo.css('display') == 'block') {
            return;
        }
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        isInfinite = true;
        // Exit, if loading in progress
        if (loading) return;

        // Set loading flag
        loading = true;
        pullToRefresh = false;
        type == 2 ? sellPageNo++ : buyPageNo++;
        const pageNo = type == 2 ? sellPageNo : buyPageNo;
        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: ['', pageSize, pageNo, type],
            type: 'get',
            isMandatory
        }, callback);
    });

    // pull to refresh.
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        sellPageNo = 1;
        buyPageNo = 1;
        const load = type == 2 ? sellLoad : buyLoad;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        pullToRefresh = true;
        emptyInfo.hide();
        isInfinite = false;
        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: ['', pageSize, 1, type],
            type: 'get',
            isMandatory
        }, callback);
    })
}

export {
    myCollectionInit,
}
