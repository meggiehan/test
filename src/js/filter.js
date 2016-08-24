import { trim, html } from '../utils/string';
import { home, filter } from '../utils/template';
import customAjax from '../middlewares/customAjax';
import district from '../utils/district';
import config from '../config';


function filterInit(f7, view, page) {
    const $$ = Dom7;
    const { keyvalue, release, type, id, cityId } = page.query;
    const searchBtn = $$('.filter-searchbar input');
    const { pageSize } = config;
    let allFishTypeChild;
    let searchValue = keyvalue ? keyvalue.replace(/[^\u4E00-\u9FA5]/g, '') : keyvalue;
    let currentFishId = id || '';
    let currentCityId = cityId || '';
    let pageNo = 1;
    let _type = type || '';
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;
    let releaseFishName;
    let parentFishInfo = {};
    /*
     * Three cases into the filter page.
     * 1: home -> filter. query: type
     * 2: search -> filter. query: searchVal or category id.
     * 3: releaseSelectType -> filter. query: release and type
     */
    trim(searchValue) && searchBtn.val(searchValue);

    /*
     * Ajax callback.
     */
    const listCallback = (data) => {
        const {code, message} = data;
        if(code !== 1){
            f7.alert(message, '提示');
            return;
        }
        let listHtml = '';
        if (_type == 1) {
            $$.each(data.data.list, (index, item) => {
                listHtml += home.buy(item);
            })
        } else {
            $$.each(data.data.list, (index, item) => {
                listHtml += home.cat(item);
            })
        }
        if (!listHtml) {
            listHtml += '';
        }
        if (isInfinite && !pullToRefresh) {
            $$('.filter-list').append(listHtml);
            loading = false;
        } else {
            html($$('.filter-list'), listHtml, f7);

        }
        //pull to refresh done.
        f7.pullToRefreshDone();
        pullToRefresh = false;
        $$('img.lazy').trigger('lazy');
    }

    const fishTypeRootCallback = (data) => {
        let typeHtml = `<span data-id="0" class="active-ele">全部鱼种</span>`;
        let fishTypeNameQuery;
        $$.each(data.data.list, (index, item) => {
            typeHtml += filter.fishType(item);
            !fishTypeNameQuery && currentFishId && (fishTypeNameQuery = item['id'] == currentFishId ? item['name'] : null);
        })
        fishTypeNameQuery && ($$('.filter-tab>.tab1>span')[0].innerText = fishTypeNameQuery);
        html($$('.filter-fish-type>.col-35'), typeHtml, f7);
    }

    const fishTypeChildCallback = (data) => {
        allFishTypeChild = data.data.list;
        let typeHtml = '';
        let fishTypeNameQuery;
        if(!release){
        	typeHtml += `<span data-postcode="" class="first ${!currentFishId && 'active-ele' || ''}">全部鱼种</span>`;
        }
        $$.each(data.data.list, (index, item) => {
            const classes = index % 3 === 0 && 'on' || '';
            typeHtml += filter.fishType(item, classes);
            !fishTypeNameQuery && currentFishId && (fishTypeNameQuery = item['id'] == currentFishId ? item['name'] : null);
        })
    
        fishTypeNameQuery && ($$('.filter-tab>.tab1>span')[0].innerText = fishTypeNameQuery);
        html($$('.filter-fish-type>.col-65'), typeHtml, f7);
    }


    /*
     * Ajax.
     */
    // get root fish type;
    customAjax.ajax({
        apiCategory: 'fishType',
        api: 'getChildrenFishTypeList',
        data: [0, release || '', _type, searchValue],
        val: {
            id: 0
        },
        type: 'get',
    }, fishTypeRootCallback);

    // get all fish type;
    customAjax.ajax({
        apiCategory: 'fishType',
        api: 'getChildrenFishTypeList',
        data: [id, release || '', _type, searchValue],
        type: 'get',
    }, fishTypeChildCallback);


    /*
     * Bind event to dom.
     */
    // select fish type child.
    $$('.filter-fish-type>.col-35').on('click', (e) => {
        const event = e || window.event;
        const ele = e.target;
        const rootId = ele.getAttribute('data-id');
        let categoryFish = [];
        let typeHtml = '';

        if (rootId === '0') {
            categoryFish = allFishTypeChild;
            typeHtml = release ? '' : `<span data-postcode="${rootId}" class="first">${ele.innerText}</span>`;
        } else {
            $$.each(allFishTypeChild, (index, item) => {
                item.parant_id === rootId && categoryFish.push(item);
            })
            typeHtml = release ? '' : `<span data-postcode="${rootId}" class="first">全部${ele.innerText}</span>`;
        }
        $$('.filter-fish-type span').removeClass('active-ele');
        ele.className = 'active-ele';
        $$.each(categoryFish, (index, item) => {
            const classes = index % 3 === 0 && 'on' || '';
            const select = `${classes}${item.id == currentFishId ? ' active-ele' : ''}`;
            typeHtml += filter.fishType(item, select);
        })
        html($$('.filter-fish-type>.col-65'), typeHtml, f7)
    })

    // filter tab event;
    $$('.filter-tab').on('click', (e) => {
        const event = e || window.event;
        let ele = event.target;
        let classes = ele.className;
        const clickTab = () => {
            if (classes.indexOf('active-ele') > -1) {
                ele.className = classes.replace('active-ele', '');
                $$('.winodw-mask').removeClass('on');
                $$('.filter-tabs-content').removeClass('on');
            } else {
                $$('.filter-tab>div').removeClass('active-ele');
                ele.className += ' active-ele';
                $$('.winodw-mask').addClass('on');
                $$('.filter-tabs-content').addClass('on');
                $$('.filter-tabs-content>div').removeClass('active');
                classes.indexOf('tab1') > -1 && $$('.filter-tabs-content>div').eq(0).addClass('active');
                classes.indexOf('tab2') > -1 && $$('.filter-tabs-content>div').eq(1).addClass('active');
                classes.indexOf('tab3') > -1 && $$('.filter-tabs-content>div').eq(2).addClass('active');
            }
        }
        if (ele.parentNode.className.indexOf('filter-tab-title') > -1) {
            ele = ele.parentNode;
            classes = ele.className;
            clickTab();
        } else if (classes.indexOf('filter-tab-title') > -1) {
            clickTab();
        }
    })

    // filter category and release infomation.
    if (!release) {

        // sell or buy active; default type = 1
        const type_ = _type == 2 ? 0 : 1;
        $$('.filter-info-type>p').eq(type_).addClass('active-ele');
        if (type_ == 1) {
            $$('.filter-list').removeClass('cat-list-info').addClass('buy-list-info');
            $$('.filter-tab-title').eq(2).find('span')[0].innerText = '求购';
            $$('.page-filter .tabbat-text span')[0].innerText = '我要买鱼';
        } else {
            $$('.filter-list').removeClass('buy-list-info').addClass('cat-list-info');
        }
        /*
         * initialization home page and send ajax to get list data.
         */
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfoList',
            data: [currentFishId, currentCityId, _type, searchValue, pageSize, pageNo, searchValue],
            type: 'get',
        }, listCallback);
        //root district render;
        let rootDistrict = '<span class="active-ele" data-postcode="0">全国</span>';
        $$.each(district.root.province, (index, item) => {
            rootDistrict += filter.districtRender(item);
        })
        html($$('.filter-district>.col-35'), rootDistrict, f7);
        html($$('.filter-district>.col-65'), '<span class="active-ele" data-postcode="">全国</span>', f7);
        //child district render
        $$('.filter-district>.col-35').on('click', (e) => {
                const event = e || window.event;
                const ele = e.target;
                const postcode = ele.getAttribute('data-postcode');
                $$('.filter-district span').removeClass('active-ele');
                ele.className = 'active-ele';
                let districtHtml = '';
                if (postcode !== '0') {
                	districtHtml += `<span data-postcode="${postcode}">全${ele.innerText}</span>`;
                    $$.each(district.root.province, (index, item) => {
                        if (item.postcode === postcode) {
                            $$.each(item.city, (index_, districtItem) => {
                                const select = item.postcode == currentCityId ? 'active-ele' : '';
                                districtHtml += filter.districtRender(districtItem, select);
                            })
                        }
                    })
                }else{
                	districtHtml += `<span data-postcode="">${ele.innerText}</span>`;
                }
                html($$('.filter-district>.col-65'), districtHtml, f7);
            })
        //change release type;
        $$('.filter-info-type').on('click', (e) => {
            const event = e || window.event;
            let ele = event.target;
            let classes = ele.className;
            if (classes.indexOf('active-ele') <= -1) {
                $$('.filter-info-type>p').removeClass('active-ele');
                ele.className += ' active-ele';
                const type_ = ele.getAttribute('data-type');
                const tabText = type_ == 1 ? '求购' : '出售';
                _type = _type == 2 ? 1 : 2;
                html($$('.filter-need-release span'), type_ == 1 ? '我要买鱼' : '我要卖鱼', f7);
                pageNo = 1;
                isInfinite = false;
                html($$('.filter-tab>.tab3>span'), tabText, f7)
                customAjax.ajax({
                    apiCategory: 'demandInfo',
                    api: 'getDemandInfoList',
                    data: [currentFishId, currentCityId, _type, searchValue, pageSize, pageNo, searchValue],
                    type: 'get'
                }, listCallback);
            }
            $$('.winodw-mask').removeClass('on');
            $$('.filter-tabs-content').removeClass('on');
            $$('.filter-tab>div').removeClass('active-ele');
        })

        // select city
        $$('.filter-district>.col-65').on('click', (e) => {
            const event = e || window.event;
            const ele = event.target;
            const classes = ele.className;
            const postcode = ele.getAttribute('data-postcode');
            $$('.filter-district>.col-65>span').removeClass('active-ele');
            if (classes.indexOf('active-ele') <= -1 && ele.parentNode.className === 'col-65') {
                const tabText = ele.innerText;
                html($$('.filter-tab>.tab2>span'), tabText, f7);
                ele.className += ' active-ele';
            }
            pageNo = 1;
            isInfinite = false;
            currentCityId = postcode;
            $$('.winodw-mask').removeClass('on');
            $$('.filter-tabs-content').removeClass('on');
            $$('.filter-tab>div').removeClass('active-ele');
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfoList',
                data: [currentFishId, currentCityId, _type, searchValue, pageSize, pageNo, searchValue],
                type: 'get'
            }, listCallback);
        })

        // Attach 'infinite' event handler
        $$('.infinite-scroll').on('infinite', function() {
            isInfinite = true;
            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;
            pageNo++;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfoList',
                data: [currentFishId, currentCityId, _type, searchValue, pageSize, pageNo, searchValue],
                type: 'get',
                isMandatory: true
            }, listCallback);
        });

        // pull to refresh.
        const ptrContent = $$('.pull-to-refresh-content');
        ptrContent.on('refresh', function(e) {
            pullToRefresh = true;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfoList',
                data: [currentFishId, currentCityId, _type, searchValue, pageSize, pageNo, searchValue],
                type: 'get',
                isMandatory: true
            }, listCallback);
        })

    } else {
        $$('.filter-navbar').addClass('filter-release-info');
        $$('.page-filter').addClass('filter-release-info');
        $$('.filter-tabs-content').addClass('on active');
        $$('.filter-fish-type').addClass('active');
        $$('.winodw-mask').addClass('on');
        $$('.filter-release-next').on('click', () => {
        	const text = _type == 1 ? '求购' : '出售';
        	if(!currentFishId){
        		f7.alert(`请选择您需要${text}鱼的种类`);
        		return;
        	}

            view.router.load({
                url: 'views/releaseInfo.html?' +
                `type=${_type}&fishId=${currentFishId}&fishName=${releaseFishName}&parentFishId=${parentFishInfo.id}&parentFishName=${parentFishInfo.name}`,
            })
        })
    }

    // select fish category;
    $$('.filter-fish-type>.col-65').on('click', (e) => {
        const event = e || window.event;
        const ele = event.target;
        const classes = ele.className;
        const childId = ele.getAttribute('data-id');
        $$('.filter-fish-type>.col-65>span').removeClass('active-ele');
        const tabText = ele.innerText;
        releaseFishName = ele.innerText;
        ele.className += ' active-ele';
        parentFishInfo['id'] = ele.getAttribute('data-parent-id');
        parentFishInfo['name'] = ele.getAttribute('data-parent-name');
        currentFishId = childId;
        if (!release) {
            html($$('.filter-tab>.tab1>span'), tabText, f7);
            $$('.winodw-mask').removeClass('on');
            $$('.filter-tabs-content').removeClass('on');
            $$('.filter-tab>div').removeClass('active-ele');
            searchValue = '';
            searchBtn.val('');
            isInfinite = false;
            pageNo = 1;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfoList',
                data: [currentFishId, currentCityId, _type, searchValue, pageSize, pageNo, searchValue],
                type: 'get'
            }, listCallback);

        }
    })

    //js location to other page
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        })
    })

    //if release page go to select fish type page, Calculation filter-tabs-content height;
    if(release){
        const winHeight = $$(window).height();
        const navbarHeight = $$('.navbar').height();
        const footerHeight = $$('.tabbar').height();
        $$('.filter-tabs-content').css({height: `${winHeight - navbarHeight - footerHeight}px`});
    }
}

module.exports = {
    filterInit
}
