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
    const load = currentPage.find('.infinite-scroll-preloader');
    const showAllInfo = currentPage.find('.collection-empty-info');
    let pageNo = 1;
    let isShowAll = false;
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;
    load.hide();

    const callback = (data) => {
        const { code } = data;
    	f7.hideIndicator();
        if (code !== 1) {
            f7.alert('请求过于频繁，请稍后再试！', '提示');
            return;
        }
        let otehrHtml = '';
        $$.each(data.data, (index, item) => {
            if (2 == type) {
                otehrHtml += home.cat(item, level);
            } else {
                otehrHtml += home.buy(item, level);
            }
        })

        showAllInfo.hide();
        if (isInfinite && !pullToRefresh) {
            $$('.collection-list-info').append(otehrHtml);
            loading = false;
        } else {
            html($$('.collection-list-info'), otehrHtml, f7);
        }

        setTimeout(() => {
            $$('img.lazy').trigger('lazy');
        }, 400)
        f7.hideIndicator();
        f7.pullToRefreshDone();

        pullToRefresh = false;
        isInfinite = false;

        if ($$('.collection-list-info>a').length && data.data.length < pageSize || !$$('.collection-list-info>a').length) {
            isShowAll = true;
            load.hide();
            showAllInfo.show();
        } else {
            load.show();
        }
        if (!$$('.collection-list-info>a').length && !data.data.length) {
            $$('.collection-list-empty').show();
            showAllInfo.hide();
        } else {
            $$('.collection-list-empty').hide();
        }
    }

    customAjax.ajax({
        apiCategory: 'favorite',
        api: 'demandInfoList',
        header: ['token'],
        data: [token, pageSize, pageNo, type],
        type: 'get'
    }, callback);

    currentPage.find('.my-collection-tab')[0].onclick = (e) => {
        const event = e || window.event;
        if ($$(event.target).hasClass('my-collection-tab') || $$(event.target).hasClass('on')) {
            return;
        }
        type = event.target.innerHTML === '出售信息' ? 2 : 1;
        $$('.my-collection-tab>div').toggleClass('on');
        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: [token, pageSize, pageNo, type],
            type: 'get'
        }, callback);
    }

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
        pageNo++;
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
        pageNo = 1;
        pullToRefresh = true;
        showAllInfo.hide();
        isShowAll = false;
        isInfinite = false;
        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfoList',
            header: ['token'],
            data: [token, pageSize, pageNo, type],
            type: 'get',
            noCache: true
        }, callback);
    })
}

module.exports = {
    myCollectionInit,
}
