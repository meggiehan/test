import store from '../utils/locaStorage';
import config from '../config';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function myCollectionInit(f7, view, page) {
    let type = 2; //default: 2
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);

    const { pageSize, cacheUserinfoKey } = config;
    const { id, token, level } = store.get(cacheUserinfoKey) || { id: 1 };
    const sellLoad = currentPage.find('.sell-infinite-scroll-preloader');
    const buyLoad = currentPage.find('.buy-infinite-scroll-preloader');
    const showSellAllInfo = currentPage.find('.sell-collection-empty-info');
    const showBuyAllInfo = currentPage.find('.buy-collection-empty-info');

    const sellContent = currentPage.find('.sell-collection-list-info');
    const buyContent = currentPage.find('.buy-collection-list-info');

    const sellEmpty = currentPage.find('.sell-collection-list-empty');
    const buyEmpty = currentPage.find('.buy-collection-list-empty');

    let sellPageNo = 1;
    let buyPageNo = 1;

    let isSellShowAll = false;
    let isBuyShowAll = false;

    let isShowAll = isSellShowAll;
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;
    let showAllInfo = showSellAllInfo;
    let emptyInfo = sellEmpty;
    sellLoad.hide();
    buyLoad.hide();

    const callback = (data) => {
        const { code } = data;
        f7.hideIndicator();
        if (code !== 1) {
            // f7.alert('请求过于频繁，请稍后再试！', '提示');
            f7.pullToRefreshDone();
            return;
        }
        let otehrHtml = '';
        let content, listLength, load;
        if(2 == type){
            content = sellContent;
            load = sellLoad;
            listLength = $$('.sell-collection-list-info>a').length;
        }else{
            content = buyContent;
            load = buyLoad;
            listLength = $$('.buy-collection-list-info>a').length;
        }
        

        $$.each(data.data, (index, item) => {
            if (2 == type) {
                otehrHtml += home.cat(item, level);
            } else {
                otehrHtml += home.buy(item, level);
            }
        })

        showAllInfo.hide();
        if (isInfinite && !pullToRefresh) {
            content.append(otehrHtml);
            loading = false;
        } else {
            html(content, otehrHtml, f7);
        }

        setTimeout(() => {
            $$('img.lazy').trigger('lazy');
        }, 400)
        f7.hideIndicator();
        f7.pullToRefreshDone();

        pullToRefresh = false;
        isInfinite = false;

        if (listLength && data.data.length < pageSize || !listLength) {
            isShowAll = true;
            load.hide();
            showAllInfo.show();
        } else {
            load.show();
        }
        if (!listLength && !data.data.length) {
            emptyInfo.show();
            showAllInfo.hide();
        } else {
            emptyInfo.hide();
        }

        type == 2 ? (isSellShowAll = isShowAll) : (isBuyShowAll = isShowAll);
    }

    const getListInfo = () => {
        const pageNo = type == 2 ? sellPageNo : buyPageNo;
        showAllInfo = type == 2 ? showSellAllInfo: showBuyAllInfo;
        emptyInfo = type == 2 ? sellEmpty: buyEmpty;
        isShowAll = type == 2 ? isSellShowAll: isBuyShowAll;
        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: [token, pageSize, pageNo, type],
            type: 'get'
        }, callback);
    }

    //get list for service;
    getListInfo();
    currentPage.find('#tab1').on('show', function() {
        type = 2;
        getListInfo();
    });

    currentPage.find('#tab2').on('show', function() {
        type = 1;
        getListInfo();
    });

    currentPage.find('.infinite-scroll').on('infinite', function() {
        if (isShowAll) {
            return;
        }
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
            data: [token, pageSize, pageNo, type],
            type: 'get',
            noCache: true
        }, callback);
    });

    // pull to refresh.
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        type == 2 ? (sellPageNo = 1) : (buyPageNo = 1);
        pullToRefresh = true;
        showAllInfo.hide();
        isShowAll = false;
        isInfinite = false;
        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: [token, pageSize, 1, type],
            type: 'get',
            noCache: true
        }, callback);
    })
}

module.exports = {
    myCollectionInit,
}
