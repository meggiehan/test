import customAjax from '../middlewares/customAjax';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {html, getProvinceId} from '../utils/string';
import {fishCar, filter} from '../utils/template';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import store from '../utils/locaStorage';

function fishCarInit(f7, view, page) {
    const {pageSize, cacheUserinfoKey} = config;
    const _district = nativeEvent['getDistricInfo']() || {root: {province: []}};
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const currentNavbar = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    const contentBox = currentPage.find('.page-list-view').children('.list');
    const showAllText = currentPage.find('.filter-search-empty-info');
    const downLoading = currentPage.find('.infinite-scroll-preloader');
    const emptyContent = currentPage.find('.filter-empty-search-result');
    f7.hideIndicator();
    let provinceId = '';
    let pageNo = 1;
    let isFishCarList = true;
    let isInfinite = false;
    let isShowAll = false;
    let isRefresh = false;

    if (window.addressObj) {
        if (window.addressObj.initProvinceName) {
            provinceId = getProvinceId(window.addressObj.initProvinceName)['provinceId'];
        }
    }

    /**
     * 初始化render省份信息
     * */
    let rootDistrict = '<span class="active-ele" data-postcode="0">全国</span>';
    $$.each(_district.root.province, (index, item) => {
        rootDistrict += filter.districtRender(item);
    })
    html(currentPage.find('.district-model').children('.list-item'), rootDistrict, f7);
    if (!!provinceId) {
        currentPage.find('.list-item').children('span').removeClass('active-ele');
        currentPage.find('span[data-postcode="' + provinceId + '"]').addClass('active-ele');
        currentPage.find('.select-city').children().find('span').text(window.addressObj.initProvinceName);
    }

    /**
     * 调用f7选择组件
     * */
    const provinceArr = ['全国'];
    $$.each(_district.root.province, (index, item) => {
        provinceArr.push(item.name);
    })

    let pickerObj = {
        input: currentPage.find('#select-city-input'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        onOpen: (p) => {
            $$('.link.close-picker')[0].onclick = () => {
                const name = currentPage.find('#select-city-input').val();
                currentPage.find('.select-city').children().find('span').text(name);
                provinceId = getProvinceId(name)['provinceId'];
                pageNo = 1;
                getList(false);
            }
        },
        cols: [
            {
                textAlign: 'center',
                values: provinceArr
            }
        ]
    }
    if(window.addressObj && window.addressObj.initProvinceName){
        provinceArr.indexOf(window.addressObj.initProvinceName) > -1 &&
        (pickerObj.value = [window.addressObj.initProvinceName]);
    }
    f7.picker(pickerObj);

    function callback(res, type) {
        const {code, message, data} = res;
        if (1 == code) {
            if (data && data.length) {
                emptyContent.hide();
                let str = '';
                $$.each(data, (index, item) => {
                    if ('demandInfo' == type) {
                        str += fishCar.demandList(item);
                    } else {
                        str += fishCar.list(item);
                    }
                })

                if (isRefresh || (1 == pageNo)) {
                    currentPage.find('.page-content').scrollTop(0);
                    contentBox.html('');
                }

                str && contentBox.append(str);

                //显示全部
                if (data.length < pageSize) {
                    isShowAll = true;
                    downLoading.hide();
                    showAllText.show();
                }else{
                    downLoading.show();
                    showAllText.hide();
                    isShowAll = false;
                }
            }else if (pageNo == 1) {
                contentBox.html('');
                emptyContent.show();
                isShowAll = true;
                downLoading.hide();
                showAllText.hide();
            }

            f7.pullToRefreshDone();
            if(isRefresh){
                currentNavbar.find('.filter-tab').hide();
            }
            isRefresh = false;
            isInfinite = false;
            currentPage.find('img.lazy').trigger('lazy');
        }
    }

    /**
     * 获取鱼车列表相关操作
     * */
    function getFishCarList(bool) {
        customAjax.ajax({
            apiCategory: 'fishCars',
            data: [provinceId, pageSize, pageNo],
            type: 'get',
            isMandatory: bool
        }, (data) => {
            callback(data, 'list');
        });
    }

    /**
     * 获取鱼车需求列表相关操作
     * */
    function getFishCarDemandList(bool) {
        customAjax.ajax({
            apiCategory: 'fishCarDemands',
            data: ['', pageSize, pageNo],
            type: 'get',
            isMandatory: bool
        }, (data) => {
            callback(data, 'demandInfo');
        });
    }

    /**
     * 数据最终请求
     * */
    function getList(bool) {
        if (isFishCarList) {
            getFishCarList(bool);
        } else {
            getFishCarDemandList(bool);
        }
    }

    getList(false);

    /**
     * 上啦加载
     * */
    currentPage.find('.infinite-scroll').on('infinite', function () {
        if (isInfinite || isShowAll) {
            return;
        }
        downLoading.show();
        showAllText.hide();
        isInfinite = true;
        pageNo++;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        getList(isMandatory);
    })

    /**
     * 下拉刷新
     * */
    currentPage.find('.pull-to-refresh-content').on('refresh', function () {
        isRefresh = true;
        isShowAll = false;
        pageNo = 1;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        currentNavbar.find('.filter-tab').hide();
        getList(isMandatory);
    })

    /**
     * 点击找司机
     * */
    const driverList = () => {
        isFishCarList = true;
        currentPage.find('.select-city').show();
        currentPage.find('.tabbat-text').children('span').text('发布叫鱼车信息');
        apiCount('btn_fishcar_tab_drivers');
        pageNo = 1;
        currentPage.find('.filter-tab').children('div').removeClass('on').eq(0).addClass('on');
        currentNavbar.find('.filter-tab').children('div').removeClass('on').eq(0).addClass('on');
        getList(false);
    }

    /**
     * 点击我要拉货
     * */
    const getDemandInfo = () => {
        isFishCarList = false;
        currentPage.find('.select-city').hide();
        currentPage.find('.tabbat-text').children('span').text('鱼车司机登记');
        apiCount('btn_fishcar_tab_demands');
        pageNo = 1;
        currentPage.find('.filter-tab').children('div').removeClass('on').eq(1).addClass('on');
        currentNavbar.find('.filter-tab').children('div').removeClass('on').eq(1).addClass('on');
        getList(false);
    }

    currentNavbar.find('.filter-tab-title').click((e) => {
        const ele = e.target || window.event.target;
        if($$(ele).text() == '找司机'){
            driverList();
        }else{
            getDemandInfo();
        }
    })

    /**
     * 切换鱼车跟需求列表
     * */
    currentPage.find('.filter-tab')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if (!$$(ele).hasClass('filter-tab-title')) {
            return;
        }
        if ($$(ele).hasClass('on')) {
            return;
        }
        contentBox.html('');

        pageNo = 1;
        isInfinite = false;
        isShowAll = false;
        isRefresh = false;
        emptyContent.hide();
        downLoading.show();
        showAllText.hide();

        const text = $$(ele).text();
        isFishCarList = '找司机' == text;
        if (isFishCarList) {
            driverList();
        } else {
            getDemandInfo();
        }
    }

    /**
     * 列表滚动监听
     * */
    currentNavbar.find('.filter-tab').hide();
    currentPage.find('.page-content').scroll(() => {
        const top = currentPage.find('.page-content').scrollTop();
        if (top > 100) {
            currentNavbar.find('.filter-tab').show();
            currentPage.find('.filter-tab').hide();
            currentPage.find('.page-content').css('padding-top', '9.4rem');
        } else {
            currentNavbar.find('.filter-tab').hide();
            currentPage.find('.filter-tab').show();
            currentPage.find('.page-content').css('padding-top', '5.4rem');
        }
    })

    /**
     * 拨打电话
     * */
    currentPage.find('.page-list-view').children('.list')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if (!$$(ele).attr('data-phone')) {
            return;
        }
        apiCount('btn_fishcar_demandCall');
        nativeEvent.contactUs($$(ele).attr('data-phone'));
    }

    /**
     * 叫司机/发布需求
     * */
    currentPage.find('.fish-car-release')[0].onclick = () => {
        if (isFishCarList) {
            if (!isLogin()) {
                f7.alert('手机号登录后才能发布需求，请您先登录！', '温馨提示', loginViewShow);
                return;
            }
            mainView.router.load({
                url: 'views/releaseFishCarDemand.html'
            })
        } else {
            apiCount('btn_fishcar_registerDriver');
            if (!isLogin()) {
                f7.alert('手机号登录后才能进行司机登录流程，请您先登录！', '温馨提示', loginViewShow);
                return;
            }

            if(store.get(cacheUserinfoKey) && store.get(cacheUserinfoKey)['fishCarDriverId']){
                f7.alert('您已经登记过司机了！');
                return;
            }
            view.router.load({
                url: 'views/postDriverAuth.html'
            })
        }
    }
}

module.exports = {
    fishCarInit,
}
