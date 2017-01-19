import store from '../utils/locaStorage';
import config from '../config';
import { home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import customAjax from '../middlewares/customAjax';
import {isLogin} from '../middlewares/loginMiddle';

function myListInit(f7, view, page) {
    if (!isLogin()) {
        nativeEvent['nativeToast'](0, '您还没有登录，请先登录!');
        mainView.router.load({
            url: 'views/login.html',
            reload: true
        })
        return;
    }
    let type = page.query['type'] || 2;
    const { pageSize, cacheUserinfoKey, shareUrl} = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const currentHeader = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);

    const { id, level } = store.get(cacheUserinfoKey) || { id: 1 };
    const sellLoad = currentPage.find('.sell-infinite-scroll-preloader');
    const buyLoad = currentPage.find('.buy-infinite-scroll-preloader');
    const showSellAllInfo = currentPage.find('.sell-collection-empty-info');
    const showBuyAllInfo = currentPage.find('.buy-collection-empty-info');

    const sellContent = currentPage.find('.sell-collection-list-info');
    const buyContent = currentPage.find('.buy-collection-list-info');
    const openGuide = nativeEvent.getDataToNative('refreshGuide');

    let sellDate = [];
    let buyDate = [];

    if(!openGuide){
        nativeEvent.setDataToNative('refreshGuide', 'true');
        $$('.my-list-guide-model').addClass('on');
    }

    /*
    * 关闭刷新信息引导
    * */
    $$('.my-list-guide-model')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if(ele.className.indexOf('my-list-guide-model') > -1 || ele.className.indexOf('footer') > -1){
            $$('.my-list-guide-model').removeClass('on');
        }
    }

    const sellEmpty = currentPage.find('.sell-collection-list-empty');
    const buyEmpty = currentPage.find('.buy-collection-list-empty');
    let emptyInfo = sellEmpty;

    let sellPageNo = 1;
    let buyPageNo = 1;

    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;

    const callback = (data) => {
        const { code, message } = data;
        let currentPageNo;
        f7.hideIndicator();
        f7.pullToRefreshDone();
        if (code !== 1) {
            console.log('获取我的发信息列表失败！error=' + (message || ''));
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

        $$.each(data.data.records, (index, item) => {
            if (2 == type) {
                sellDate.push(item);
                otehrHtml += home.cat(item, level,'', true);
            } else {
                buyDate.push(item);
                otehrHtml += home.buy(item, level, '', true);
            }
        })

        if (!pullToRefresh && data.data.records.length && (currentPageNo != 1)) {
            content.append(otehrHtml);
        } else {
            html(content, otehrHtml, f7);
        }

        if (data.data.records.length < pageSize || !data.data.records.length) {
            2 == type ? showSellAllInfo.show() : showBuyAllInfo.show();
            load.hide();
        }else{
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            load.show();
        }

        if (!listLength && !data.data.records.length) {
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
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        isInfinite = false;
        pullToRefresh = false;
        loading = false;

        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'mine',
            header: ['token'],
            data: [pageSize, pageNo, type],
            type: 'get',
            isMandatory: nativeEvent['getNetworkStatus']()
        }, callback);
    }

    //get list for service;
    getListInfo();
    currentPage.find('#tab1').on('show', function() {
        type = 2;
        currentHeader.find('.center').text('我的出售');
        !sellContent.children('a').length && getListInfo();
    });

    currentPage.find('#tab2').on('show', function() {
        type = 1;
        currentHeader.find('.center').text('我的求购');
        !buyContent.children('a').length && getListInfo();
    });

    f7.showTab(2 == type ? '#tab1' : '#tab2');
    const tabIndex = 2 == type ? 0 : 1;
    currentHeader.find('.tab-link').removeClass('active').eq(tabIndex).addClass('active');

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
            apiCategory: 'demandInfo',
            api: 'mine',
            header: ['token'],
            data: [pageSize, pageNo, type],
            type: 'get',
            isMandatory
        }, callback);
    });

    // pull to refresh.
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        type == 2 ? (sellPageNo = 1) : (buyPageNo = 1);
        type == 2 ? (sellDate = []) : (buyDate = []);
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        pullToRefresh = true;
        emptyInfo.hide();
        isInfinite = false;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'mine',
            header: ['token'],
            data: [pageSize, 1, type],
            type: 'get',
            isMandatory
        }, callback);
    })

    let activeInfoId = null;
    //refresh and share info.
    const refreshCallback = (data) => {
        const {code, message} = data;
        if(1 == code){
            $$('span.refresh-btn[data-id="'+ activeInfoId +'"]').addClass('disabled').text('今日已刷新');
            nativeEvent.nativeToast(1, `今天刷新信息次数还剩${data.data}次!`);
        }else{
            nativeEvent.nativeToast(0, message);
        }
    }

    // const {device} = f7;
    currentPage.find('.tabs.swiper-wrapper')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        //refresh info
        if(ele.className.indexOf('refresh-btn') > -1 && $(ele).attr('data-id') && ele.className.indexOf('disabled') == -1){
            const clickInfoId = $(ele).attr('data-id');
            activeInfoId = clickInfoId;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'refreshLog',
                header: ['token'],
                parameType: 'application/json',
                data: [clickInfoId, 'refresh'],
                val:{
                    id:clickInfoId,
                    action: 'refreshLog'
                },
                type: 'POST',
                isMandatory: true
            }, refreshCallback);
        }
        //share info
        if(ele.className.indexOf('sell-list-share') > -1 && $(ele).attr('data-id')){
            const infoType = $(ele).attr('data-type');
            const itemId = $(ele).attr('data-id');
            let listItem = null;
            $$.each(2 == infoType ? sellDate : buyDate, (index,item) => {
                item.id == itemId && (listItem = item);
            })

            let title = '';
            let description = '';
            let shareImg;

            const {
                specifications,
                stock,
                provinceName,
                cityName,
                fishTypeName,
                price,
                imgePath,
                imgs
            } = listItem;

            if(1 == infoType){
                shareImg = imgePath;
            }else{
                imgs && JSON.parse(imgs).length ? (shareImg = JSON.parse(imgs)[0]) : (shareImg = imgePath);
            }
            title += `【${2 == infoType ? '出售' : '求购'}】${fishTypeName}, ${provinceName||''}${cityName||''}`;
            if(!listItem.title){
                description += stock ? `${(2 == infoType ? '出售' : '求购') + '数量：' + stock}，` : '';
                description += price ? `${'价格：' + price}，` : '';
                description += specifications ? `${'规格：' + specifications}，` : '';
                description += '点击查看更多信息~';
            }else{
                description += listItem.title;
            }

            window.shareInfo = {
                title,
                webUrl: `${shareUrl}${listItem.id}`,
                imgUrl: shareImg,
                description
            }
            $$('.share-to-weixin-model').addClass('on')
        }
    }
}

module.exports = {
    myListInit
}
