import {trim, html, getTabStr, saveSelectFishCache} from '../utils/string';
import {home, filter} from '../utils/template';
import customAjax from '../middlewares/customAjax';
import config from '../config';
import {filterTabClick} from '../utils/domListenEvent';
import nativeEvent from '../utils/nativeEvent';
import {loginSucc, isLogin, loginViewShow} from '../middlewares/loginMiddle';

function filterInit(f7, view, page) {
    const _district = nativeEvent['getDistricInfo']() || {root:{province: []}};
    const {keyvalue, release, type, id, cityId, search, fishTagName, assurance} = page.query;
    const member = page['query']['member'] || false;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const currentNavbar = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    const searchBtn = $$('.filter-searchbar input');
    const emptyTemp = currentPage.find('.filter-empty-search-result');
    const load = currentPage.find('.infinite-scroll-preloader');
    const showAllInfo = currentPage.find('p.filter-search-empty-info');
    const {pageSize, fishCacheObj} = config;
    let allFishTypeChild;
    let isShowAll = false;
    let tabChange = false;
    let fuzzyFishTypeName = keyvalue && keyvalue.replace('“', '').replace('”', '');
    let currentFishId = id || '';
    let currentCityId = cityId || '';
    let fishTagId = page.query['fishTagId'] || '';
    let pageNo = 1;
    let _type = type || 2;
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;
    let releaseFishName;
    let parentFishInfo = {};
    const weixinData = nativeEvent.getDataToNative('weixinData');

    const ptrContent = currentPage.find('.pull-to-refresh-content');
    window.contentScrollTop = 0;
    /*
     * Three cases into the filter page.
     * 1: home -> filter. query: type
     * 2: search -> filter. query: searchVal or category id.
     * 3: releaseSelectType -> filter. query: release and type
     * 4: member -> member . get member user list.
     */
    trim(fuzzyFishTypeName) && searchBtn.val(fuzzyFishTypeName);

    /**
     * 担保交易跟靠谱专区
     * */
    if (member || assurance) {
        currentPage.find('.filter-member-img').show();
        currentPage.find('.winodw-mask').addClass("has-img");
        currentPage.find('.filter-tabs-content').addClass('has-img');
    }

    /**
     * 针对等不筛选滚动固定效果单独处理。
     * */
    currentPage.find('.page-content').scroll(() => {
        const top = currentPage.find('.page-content').scrollTop();
        if(member || assurance){
            if(top > 70){
                currentPage.find('.filter-tab').addClass('fix-tab');
                currentPage.find('.page-content').addClass('filter-fix-tab');
            }else{
                currentPage.find('.filter-tab').removeClass('fix-tab');
                currentPage.find('.page-content').removeClass('filter-fix-tab');
            }
            window.contentScrollTop = top;
        }else{
            currentPage.find('.filter-tab').addClass('fix-tab');
            currentPage.find('.page-content').addClass('filter-fix-tab');
        }

        if(window.contentScrollTop > 3){
            f7.destroyPullToRefresh(ptrContent);
            f7.pullToRefreshDone();
        }else if(window.contentScrollTop <= 3){
            f7.initPullToRefresh(ptrContent);
        }
    })

    /*
     * Ajax callback.
     */
    const listCallback = (data) => {
        const {code, message} = data;
        if (code !== 1) {
            f7.alert(message, '提示');
            f7.pullToRefreshDone();
            return;
        }
        let listHtml = '';
        if (_type == 1) {
            $$.each(data.data, (index, item) => {
                item && (listHtml += home.buy(item));
            })
        } else {
            $$.each(data.data, (index, item) => {
                item && (listHtml += home.cat(item));
            })
        }
        showAllInfo.hide();
        if (isInfinite && !pullToRefresh) {
            currentPage.find('.filter-list').append(listHtml);
            loading = false;
        } else {
            currentPage.find('.filter-list').text('');
            html(currentPage.find('.filter-list'), listHtml, f7);
        }
        //pull to refresh done.
        f7.pullToRefreshDone();
        $$('img.lazy').trigger('lazy');
        currentPage.find('.tabbar').show();
        const listLength = currentPage.find('.filter-list').children('a').length;
        if (!listHtml) {
            !listLength && emptyTemp.show();
            if (search && !listLength) {
                currentPage.find('.tabbar').hide();
            }
            load.hide();
        } else {
            emptyTemp.hide();
            load.show();
        }
        tabChange && listLength && pageNo == 1 && currentPage.find('.page-content').scrollTop(0);
        if (listLength && data.data.length < pageSize) {
            isShowAll = true;
            load.hide();
            showAllInfo.show();
        }

        f7.hideIndicator();
        pullToRefresh = false;
        isInfinite = false;
    }


    //init fish category and tag render.
    const fishTypeRootCallback = (data) => {
        let typeHtml = '';
        const cacheFish = nativeEvent.getDataToNative(fishCacheObj.fishCacheKey);
        cacheFish && cacheFish.length && (typeHtml += `<span data-id="-1">最近使用鱼种</span>`);
        if (!release) {
            typeHtml += `<span data-id="0" class="${fishTagId ? '' : 'active-ele'}">全部鱼种</span>`;
            let fishTypeNameQuery;
            $$.each(data.data, (index, item) => {
                typeHtml += filter.fishType(item, fishTagId == item.id ? 'active-ele' : '');
                // !fishTagId && !fishTypeNameQuery && currentFishId && (fishTypeNameQuery = item['id'] == currentFishId ? `全部${item['name']}` : null);
                fishTagId && (fishTypeNameQuery = fishTagName)
            })
            fishTypeNameQuery && $$('.filter-tab>.tab1>span').text(getTabStr(fishTypeNameQuery));
        } else {
            typeHtml += `<span data-id="0" class="${'active-ele'}">全部鱼种</span>`;
            $$.each(data.data.list, (index, item) => {
                typeHtml += filter.fishType(item);
            })
        }
        html(currentPage.find('.filter-fish-type').children('.col-35'), typeHtml, f7);
    }

    const fishTypeChildCallback = (data) => {
        allFishTypeChild = data.data.list;
        let typeHtml = '';
        let fishTypeNameQuery;

        // const cacheFish = nativeEvent.getDataToNative(fishCacheObj.fishCacheKey) || [];
        // !fishTagId && cacheFish.length && $$.each(cacheFish.reverse(), (index, item) => {
        //     const classes = index % 3 === 0 && 'on' || '';
        //     typeHtml += filter.fishType(item, classes);
        // })

        // if (!typeHtml) {
            if (!release) {
                let fishArr = [];
                !fishTagId && (typeHtml += `<span data-postcode="" class="first ${!currentFishId && 'active-ele' || ''}">全部鱼种</span>`);
                fishTagId && $$.each(data.data.list, (index, item) => {
                    fishTagId == item.fish_tag_id && fishArr.push(item);
                })
                fishTagId && (typeHtml += `<span data-postcode="${fishTagId}" class="first ${currentFishId ? '' : 'active-ele'}">全部${fishTagName}</span>`);
                $$.each(!!fishTagId ? fishArr : data.data.list, (index, item) => {
                    let classes = index % 3 === 0 && 'on' || '';
                    item['id'] == currentFishId && (classes += ' active-ele');
                    typeHtml += filter.fishType(item, classes);
                    !fishTypeNameQuery && currentFishId && (fishTypeNameQuery = item['id'] == currentFishId ? item['name'] : null);
                })
            } else {
                typeHtml += `<span data-postcode="" class="first ${!currentFishId && 'active-ele' || ''}">全部鱼种</span>`;
                $$.each(data.data.list, (index, item) => {
                    const classes = index % 3 === 0 && 'on' || '';
                    typeHtml += filter.fishType(item, classes);
                    !fishTypeNameQuery && currentFishId && (fishTypeNameQuery = item['id'] == currentFishId ? item['name'] : null);
                })

            }
        // }

        fishTypeNameQuery && currentPage.find('.tab1').children('span').text(getTabStr(fishTypeNameQuery));
        html(currentPage.find('.filter-fish-type').children('.col-65'), typeHtml, f7);
        currentFishId && $$('.filter-fish-type span[data-id="' + currentFishId + '"]').trigger('click');
    }


    /*
     * Ajax.
     */
    // get root fish type;
    release && customAjax.ajax({
        apiCategory: 'fishType',
        api: 'getChildrenFishTypeList',
        data: [0, release || '', _type, fuzzyFishTypeName],
        val: {
            id: 0
        },
        type: 'get',
    }, fishTypeRootCallback);

    // get all fish type;
    customAjax.ajax({
        apiCategory: 'fishType',
        api: 'getChildrenFishTypeList',
        data: [id, release || '', _type, fuzzyFishTypeName],
        type: 'get',
    }, fishTypeChildCallback);


    /*
     * Bind event to dom.
     */
    // select fish type child.
    currentPage.find('.filter-fish-type').children('.col-35')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if (ele.tagName !== 'SPAN') {
            return;
        }
        apiCount(!release ? 'btn_filter_fishtype_item1' : 'btn_text_fishType_fishParent');
        const rootId = ele.getAttribute('data-id');
        let categoryFish = [];
        let typeHtml = '';

        if (rootId == '0') {
            categoryFish = allFishTypeChild;
            typeHtml = release ? '' : `<span data-postcode="${rootId}" class="first ${!currentFishId && !fishTagId && 'active-ele'}">${ele.innerText}</span>`;
        } else if (-1 == rootId) {
            const cacheFish = nativeEvent.getDataToNative(fishCacheObj.fishCacheKey);
            if (cacheFish) {
                $$.each(cacheFish.reverse(), (index, item) => {
                    categoryFish.push(item);
                })
            }
        } else {
            if (!release) {
                $$.each(allFishTypeChild, (index, item) => {
                    item.fish_tag_id == rootId && categoryFish.push(item);
                })
            } else {
                $$.each(allFishTypeChild, (index, item) => {
                    item.parant_id == rootId && categoryFish.push(item);
                })
            }
            typeHtml = release ? '' : `<span data-postcode="${rootId}" class="first ${((currentFishId && currentFishId == rootId) || (fishTagId && rootId == fishTagId)) && 'active-ele'}">全部${ele.innerText}</span>`;
        }
        $$('.filter-fish-type span').removeClass('active-ele');
        ele.className = 'active-ele';
        $$.each(categoryFish, (index, item) => {
            const classes = index % 3 === 0 && 'on' || '';
            const select = `${classes}${item.id == currentFishId ? ' active-ele' : ''}`;
            typeHtml += filter.fishType(item, select);
        })
        html(currentPage.find('.filter-fish-type').children('.col-65'), typeHtml, f7)
    }

    $$('.filter-tab').off('click', filterTabClick).on('click', filterTabClick);

    // filter category and release infomation.
    if (!release) {

        // sell or buy active; default type = 1
        const eleIndex = _type == 2 ? 0 : 1;
        currentPage.find('.filter-info-type').children('p').eq(eleIndex).addClass('active-ele');
        if (_type == 1) {
            currentPage.find('.filter-list').removeClass('cat-list-info').addClass('buy-list-info');
            currentPage.find('.filter-tab-title').eq(2).find('span').text('求购');
            currentPage.find('.tabbat-text').children('span').text('我要买鱼');
        } else {
            currentPage.find('.filter-list').removeClass('buy-list-info').addClass('cat-list-info');
        }
        /*
         * initialization filter page and send ajax to get list data.
         */
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'list',
            data: [currentFishId, currentCityId, _type, fuzzyFishTypeName, pageSize, pageNo, member, fishTagId],
            type: 'get',
        }, listCallback);
        //root district render;
        let rootDistrict = '<span class="active-ele" data-postcode="0">全国</span>';
        $$.each(_district.root.province, (index, item) => {
            rootDistrict += filter.districtRender(item);
        })
        html($$('.filter-district>.col-35'), rootDistrict, f7);
        html($$('.filter-district>.col-65'), '<span class="active-ele" data-postcode="">全国</span>', f7);
        //child district render
        currentPage.find('.filter-district').children('.col-35')[0].onclick = (e) => {
            const event = e || window.event;
            const ele = e.target;
            if (ele.tagName !== 'SPAN') {
                return;
            }
            const postcode = ele.getAttribute('data-postcode');
            $$('.filter-district span').removeClass('active-ele');
            ele.className = 'active-ele';
            let districtHtml = '';
            if (postcode !== '0') {
                districtHtml += `<span data-postcode="${postcode}" class="${currentCityId == postcode && 'active-ele'}">全${ele.innerText}</span>`;
                $$.each(_district.root.province, (index, item) => {
                    if (item.postcode === postcode) {
                        $$.each(item.city, (index_, districtItem) => {
                            const select = districtItem.postcode == currentCityId ? 'active-ele' : '';
                            districtHtml += filter.districtRender(districtItem, select);
                        })
                    }
                })
            } else {
                districtHtml += `<span data-postcode="">${ele.innerText}</span>`;
            }
            html(currentPage.find('.filter-district').children('.col-65'), districtHtml, f7);
        }

        //change release type;
        currentPage.find('.filter-info-type')[0].onclick = (e) => {
            isShowAll = false;
            tabChange = true;
            const event = e || window.event;
            let ele = event.target;
            let classes = ele.className;
            if (ele.tagName !== 'P') {
                return;
            }
            if (classes.indexOf('active-ele') <= -1) {
                currentPage.find('.filter-info-type').children('p').removeClass('active-ele');
                ele.className += ' active-ele';
                const type_ = ele.getAttribute('data-type');
                const tabText = type_ == 1 ? '求购' : '出售';
                _type = type_;
                currentPage.find('.tabbat-text').children('span').text(_type == 1 ? '我要买鱼' : '我要卖鱼')
                pageNo = 1;
                isInfinite = false;
                currentPage.find('.tab3').children('span').text(tabText);
                customAjax.ajax({
                    apiCategory: 'demandInfo',
                    api: 'list',
                    data: [currentFishId, currentCityId, _type, fuzzyFishTypeName, pageSize, pageNo, member, fishTagId],
                    type: 'get'
                }, listCallback);
            }
            currentPage.find('.winodw-mask').removeClass('on');
            currentPage.find('.filter-tabs-content').removeClass('on');
            currentPage.find('.filter-tab').children('div').removeClass('active-ele');
            currentPage.find('.page-content').removeClass('over-hide');
            currentPage.find('.winodw-mask').css('transform', 'translate3d(0, -100% ,0)');
        }

        // select city
        currentPage.find('.filter-district').children('.col-65')[0].onclick = (e) => {
            const event = e || window.event;
            const ele = event.target;
            const classes = ele.className;
            if (ele.tagName !== 'SPAN') {
                return;
            }
            tabChange = true;
            const postcode = ele.getAttribute('data-postcode');
            isShowAll = false;
            $$(currentPage.find('.filter-district').children('.col-65')[0]).children('span').removeClass('active-ele');
            if (classes.indexOf('active-ele') <= -1) {
                const districtText = ele.innerText;
                // const districtText = $$(ele).parent('.col-65').find('span')[0].innerText;
                // const tabText = districtText == '全国' ? districtText : districtText.substring(1, 100);
                currentPage.find('.tab2').children('span').text(getTabStr(districtText));
                ele.className += ' active-ele';
            }
            pageNo = 1;
            isInfinite = false;
            currentCityId = postcode;
            currentPage.find('.winodw-mask').removeClass('on');
            currentPage.find('.filter-tabs-content').removeClass('on');
            currentPage.find('.filter-tab').children('div').removeClass('active-ele');
            currentPage.find('.page-content').removeClass('over-hide');
            currentPage.find('.winodw-mask').css('transform', 'translate3d(0, -100% ,0)');
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'list',
                data: [currentFishId, currentCityId, _type, fuzzyFishTypeName, pageSize, pageNo, member, fishTagId],
                type: 'get'
            }, listCallback);
        }

        /**
         * 上拉加载更多
         * */
        currentPage.find('.infinite-scroll').on('infinite', function () {
            if (isShowAll) {
                return;
            }
            isInfinite = true;
            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;
            pageNo++;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'list',
                data: [currentFishId, currentCityId, _type, fuzzyFishTypeName, pageSize, pageNo, member, fishTagId],
                type: 'get',
                isMandatory: true
            }, listCallback);
        });

        /**
         * 下拉列表刷新
         * */
        const refreshFunc = () => {
            if(window.contentScrollTop > 3){
                f7.pullToRefreshDone();
            }
            const isMandatory = !!nativeEvent['getNetworkStatus']();
            pullToRefresh = true;
            isShowAll = false;
            pageNo = 1;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'list',
                data: [currentFishId, currentCityId, _type, fuzzyFishTypeName, pageSize, pageNo, member, fishTagId],
                type: 'get',
                isMandatory
            }, listCallback);
        }
        ptrContent.on('refresh', refreshFunc);

        //get all tag name;
        customAjax.ajax({
            apiCategory: 'fishType',
            api: 'tags',
            data: [],
            type: 'get'
        }, fishTypeRootCallback);

    } else {
        f7.hideIndicator();
        currentFishId = null;
        currentPage.addClass('filter-release-info');
        currentPage.find('.filter-tabs-content').addClass('on active');
        currentPage.find('.filter-fish-type').addClass('active');
        currentPage.find('.winodw-mask').addClass('on');
        currentPage.find('.toolbar').hide();
    }

    // select fish category;
    currentPage.find('.filter-fish-type').children('.col-65')[0].onclick = (e) => {
        const event = e || window.event;
        const ele = event.target;
        const classes = ele.className;
        if (ele.tagName !== 'SPAN') {
            return;
        }
        apiCount(!release ? 'btn_filter_fishtype_item2' : 'btn_text_fishType_fishType');
        tabChange = true;
        const childId = ele.getAttribute('data-id') || ele.getAttribute('data-postcode');
        $$('.filter-fish-type>.col-65>span').removeClass('active-ele');
        $$('.filter-release-next').addClass('pass');
        const tabText = ele.innerText;
        releaseFishName = ele.innerText;
        ele.className += ' active-ele';
        parentFishInfo['id'] = ele.getAttribute('data-parent-id');
        parentFishInfo['name'] = ele.getAttribute('data-parent-name');
        currentFishId = childId;
        if (!release) {
            tabText && html($$('.filter-tab>.tab1>span'), getTabStr(tabText), f7);
            currentPage.find('.winodw-mask').removeClass('on');
            $$('.filter-tabs-content').removeClass('on');
            $$('.filter-tab>div').removeClass('active-ele');
            isShowAll = false;
            fuzzyFishTypeName = '';
            searchBtn.val('');
            isInfinite = false;
            pageNo = 1;
            if (ele.getAttribute('data-postcode')) {
                currentFishId = '';
                fishTagId = ele.getAttribute('data-postcode');
            }
            if (ele.innerText == '全部鱼种') {
                fishTagId = '';
            }
            if (childId && !ele.getAttribute('data-postcode')) {
                fishTagId = '';
            }
            //统计最近使用鱼种点击情况
            if(currentPage.find('.col-35').children('.active-ele').text() == '最近使用鱼种'){
                apiCount('btn_filter_fishtype_recentUsed');
            }

            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'list',
                data: [currentFishId, currentCityId, _type, fuzzyFishTypeName, pageSize, pageNo, member, fishTagId],
                type: 'get'
            }, listCallback);
            !ele.getAttribute('data-postcode') && $$(ele).attr('data-id') && saveSelectFishCache({
                name: $$(ele).text(),
                id: $$(ele).attr('data-id'),
                parant_id: $$(ele).attr('data-parent-id'),
                parant_name: $$(ele).attr('data-parent-name')
            })

            currentPage.find('.page-content').removeClass('over-hide');
            currentPage.find('.winodw-mask').css('transform', 'translate3d(0, -100% ,0)');
        } else {
            view.router.load({
                url: 'views/releaseInfo.html?' +
                `type=${_type}&fishId=${currentFishId}&fishName=${releaseFishName}&parentFishId=${parentFishInfo.id}&parentFishName=${parentFishInfo.name}`,
            })
        }
    }

    //js location to other page
    currentNavbar.find('.home-search-mask').on('click', () => {
        const currentHistory = view['history'];
        let isHasFilterPage = 0;
        $$.each(currentHistory, (index, item) => {
            item.indexOf('filter') > -1 && (isHasFilterPage++);
        })
        const reload = !release && isHasFilterPage > 1;
        apiCount(!release ? 'textfield_search_list' : 'btn_text_fishType_search');
        view.router.load({
            url: `views/search.html?release=${release}&type=${_type}&keyvalue＝${fuzzyFishTypeName}`,
            reload
        })
    })

    //if release page go to select fish type page, Calculation filter-tabs-content height;
    if (release) {
        setTimeout(() => {
            const winHeight = $$(window).height();
            const navbarHeight = $$('.navbar').height();
            currentPage.find('.filter-tabs-content').css({height: `${winHeight - navbarHeight}px`});
        }, 0)
    }

    /*
    * 进入发布信息页面
    * */
    currentPage.find('.filter-need-release')[0].onclick = () => {
        apiCount('btn_post');
        if(!isLogin() && weixinData){
            f7.alert('绑定手机号后，可以使用全部功能!','温馨提示', loginViewShow);
            return;
        }
        view.router.load({
            url: 'views/release.html'
        })
    }
}

module.exports = {
    filterInit
}
