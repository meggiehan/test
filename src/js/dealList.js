import store from '../utils/localStorage';
import config from '../config';
import { deal } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function dealListInit(f7, view, page) {
    const { pageSize, cacheUserInfoKey } = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const load = currentPage.find('.infinite-scroll-preloader');
    const showAllInfo = currentPage.find('.deal-show-all');
    const listBox = currentPage.find('.deal-list-info');

    let pageNo = 1;
    let isShowAll = false;
    let isInfinite = false;
    let pullToRefresh = false;
    let isSend = false;

    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            f7.pullToRefreshDone();
            return;
        }

        let dealStr = '';
        $$.each(data.data, (index, item) => {
            dealStr += deal.list(item);
        })
        if(1 == pageNo){
            html(listBox, dealStr, f7);
        }else{
            listBox.append(dealStr);
        }

        if(data.data.length < pageSize){
            isShowAll = true;
            load.hide();
            showAllInfo.show();
        }

        setTimeout(() => {
            $$('img.lazy').trigger('lazy');
        }, 400)
        f7.hideIndicator();
        f7.pullToRefreshDone();
        pullToRefresh = false;
        isInfinite = false;
        isSend = false;

    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'dealList',
        data: [pageNo, pageSize],
        type: 'get'
    }, callback);

    $$('.page-deal-list .infinite-scroll').on('infinite', function() {
        if (isShowAll || isSend) {
            return;
        }
        isSend = true;
        isInfinite = true;
        // Exit, if loading in progress
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        pullToRefresh = false;
        pageNo++;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'dealList',
            data: [pageNo, pageSize],
            type: 'get',
            isMandatory
        }, callback);
    });

    // pull to refresh.
    const ptrContent = $$('.page-deal-list .pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        pageNo = 1;
        pullToRefresh = true;
        showAllInfo.hide();
        load.show();
        isShowAll = false;
        isInfinite = false;
        isSend = false;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'dealList',
            data: [pageNo, pageSize],
            type: 'get',
            isMandatory
        }, callback);
    })
}

export {
    dealListInit
}
