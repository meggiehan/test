import store from '../utils/locaStorage';
import config from '../config';
import { selldetail, home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function otherListInit(f7, view, page) {
    const load = $$('.page-other-list .infinite-scroll-preloader');
    const { type, id } = page.query;
    const { pageSize } = config;
    const showAllInfo = $$('.page-other-list .filter-search-empty-info');
    let pageNo = 1;
    let isShowAll = false;
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;
    $$('.other-list-title').text(2 == type ? '正在出售' : '正在求购');

    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            return;
        }
        let otehrHtml = '';
        $$.each(data.data.list, (index, item) => {
            if (2 == type) {
                otehrHtml += home.cat(item);
            } else {
                otehrHtml += home.buy(item);
            }
        })
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

        if ($$('.other-list-info>a').length && data.data.list.length < pageSize) {
            isShowAll = true;
            load.hide();
            showAllInfo.show();
        }

    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getMyDemandInfoList',
        data: [id, pageSize, pageNo, '', type],
        type: 'get',
        val: { id: 1 }
    }, callback);

    // Attach 'infinite' event handler
    $$('.page-other-list .infinite-scroll').on('infinite', function() {
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
            data: [id, pageSize, pageNo, '', type],
            type: 'get',
            val: { id: 1 }
        }, callback);
    });

    // pull to refresh.
    const ptrContent = $$('.page-other-list .pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        pageNo = 1;
        pullToRefresh = true;
        showAllInfo.hide();
        isShowAll = false;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getMyDemandInfoList',
            data: [id, pageSize, pageNo, '', type],
            type: 'get',
            noCache: true,
            val: { id: 1 }
        }, callback);
    })

}

module.exports = {
    otherListInit,
}
