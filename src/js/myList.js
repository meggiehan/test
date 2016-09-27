import store from '../utils/locaStorage';
import config from '../config';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function myListInit(f7, view, page) {
    const { type } = page.query;
    const { pageSize, cacheUserinfoKey } = config;
    const { id, token, level } = store.get(cacheUserinfoKey);
    const load = $$('.page-my-list .infinite-scroll-preloader');
    const showAllInfo = $$('.page-my-list .filter-search-empty-info');
    let pageNo = 1;
    let isShowAll = false;
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;
    $$('.my-list-title').text(2 == type ? '我的出售' : '我的求购');
    load.hide();

    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            return;
        }
        let otehrHtml = '';
        $$.each(data.data.list, (index, item) => {
            if (2 == type) {
                otehrHtml += home.cat(item, level);
            } else {
                otehrHtml += home.buy(item, level);
            }
        })
        if (!$$('.other-list-info>a').length) {
            2 == type ? $$('.my-sell-list-empty').show() : $$('.my-buy-list-empty').show();
        }
        showAllInfo.hide();
        if (isInfinite && !pullToRefresh) {
            $$('.other-list-info').append(otehrHtml);
            loading = false;
        } else {
            html($$('.other-list-info'), otehrHtml, f7);
        }

        setTimeout(() => {
            $$('img.lazy').trigger('lazy');
        }, 400)
        f7.hideIndicator();
        f7.pullToRefreshDone();

        pullToRefresh = false;
        $$('.other-list-info>a').length && $$('.my-sell-list-empty').hide();
        $$('.other-list-info>a').length && $$('.my-buy-list-empty').hide();
        if ($$('.other-list-info>a').length && data.data.list.length < pageSize || !$$('.other-list-info>a').length) {
            isShowAll = true;
            load.hide();
            showAllInfo.show();
        }else{
            load.show();
        }
        !$$('.other-list-info>a').length && showAllInfo.hide();
    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [id, pageSize, pageNo, token, type],
        type: 'get'
    }, callback);

    $$('.page-my-list .infinite-scroll').on('infinite', function() {
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
            apiCategory: 'demandInfo',
            api: 'getMyDemandInfoList',
            data: [id, pageSize, pageNo, token, type],
            type: 'get'
        }, callback);
    });

    // pull to refresh.
    const ptrContent = $$('.page-my-list .pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        pageNo = 1;
        pullToRefresh = true;
        showAllInfo.hide();
        isShowAll = false;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getMyDemandInfoList',
            data: [id, pageSize, pageNo, token, type],
            type: 'get',
            noCache: true
        }, callback);
    })
}

module.exports = {
    myListInit,
}
