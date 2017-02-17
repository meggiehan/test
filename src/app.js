import Framework7 from './js/lib/framework7';
import version from './config/version.json';
import config from './config';
import {searchInit} from './js/search';
import {homeInit} from './js/home';
import {filterInit} from './js/filter';
import {selldetailInit} from './js/selldetail';
import {buydetailInit} from './js/buydetail';
import {releaseInit} from './js/release';
import {releaseInfoInit} from './js/releaseInfo';
import {loginInit} from './js/login';
import {loginCodeInit} from './js/loginCode';
import {userInit} from './js/user';
import {myCenterInit} from './js/myCenter';
import {identityAuthenticationInit} from './js/identityAuthentication';
import globalEvent from './utils/global';
import {otherIndexInit} from './js/otherIndex';
import {otherInfoInit} from './js/otherInfo';
import {otherListInit} from './js/otherList';
import {myListInit} from './js/myList';
import {fishCertInit} from './js/fishCert';
import {releaseSuccInit} from './js/releaseSucc';
import nativeEvent from './utils/nativeEvent';
import {getQuery, gerProvinceList, getCreateDriverListLabel} from './utils/string';
import {catIdentityStatusInit} from './js/catIdentityStatus';
import {editNameInit} from './js/editName';
import {inviteCodeInit} from './js/inviteCode';
import {inviteFriendsInit} from './js/inviteFriends';
import {inviteFriendsListInit} from './js/inviteFriendsList';
import {myCollectionInit} from './js/myCollection';
import {dealListInit} from './js/dealList';
import {releaseSelectTagInit} from './js/releaseSelectTag';
import {notFoundInit} from './js/notFound';
import {bindAccountInit} from './js/bindAccount';
import {fishCarInit} from './js/fishCar';
import {releaseFishCarDemandInit} from './js/releaseFishCarDemand'
import {postDriverAuthInit} from './js/postDriverAuth';
import {postDriverInfoInit} from './js/postDriverInfo';
import {fishCar} from './utils/template';
import {driverDemandInfoInit} from  './js/driverDemandInfo';

const deviceF7 = new Framework7();
const {device} = deviceF7;
const {android, androidChrome} = device;
const {timeout, fishCacheObj} = config;
console.log(`current app update time: ${version.date}!`);
let animatStatus = true;
android && (animatStatus = androidChrome);
window.isTipBack = false;
window.shraeInfo = {};
let isBack = false;

/*
 * 初始化f7的参数
 * */
let initAppConfig = {
    // swipeBackPage: false,
    // uniqueHistoryIgnoreGetParameters: true,
    // uniqueHistory: true,
    // preloadPreviousPage: true,
    activeState: false,
    imagesLazyLoadThreshold: 50,
    // pushStatePreventOnLoad: true,
    pushState: true,
    animateNavBackIcon: true,
    animatePages: animatStatus,
    preloadPreviousPage: true,
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
    // force: true,
    preprocess: (content, url, next) => {
        next(content);
        const query = getQuery(url);
        if (url.indexOf('search.html') > -1) {
            searchInit(f7, mainView, {query})
        }
    },
    /*
     * 返回上个页面的一些路由拦截操作
     * */
    preroute: (view, options) => {
        const {history} = view;
        const currentPage = options && options['url'];
        const len = history.length;
        const _currentPage = history[len - 1];
        var btns = document.getElementsByClassName('modal-button');
        if (!isTipBack && _currentPage && _currentPage.indexOf('releaseInfo.html') > -1 && btns.length && btns[0].innerText.indexOf("放弃发布") > -1) {
            return false;
        }
        if (!currentPage && len >= 1) {
            const backPage = history[len - 2];
            if (_currentPage.indexOf('home.html') > -1 || _currentPage.indexOf('user.html') > -1 || _currentPage.indexOf('releaseSucc.html') > -1) {
                return false;
            }

            if (_currentPage.indexOf('inviteFriends.html') > -1) {
                $$('.modal-overlay-invite-code').length > 0 && $$('.modal-overlay-invite-code').trigger('click');
            }

            if ($$('.modal-overlay-visible').length) {
                $$('.modal-overlay-visible').trigger('click');
                $$('.modal-button').length && $$('.modal-button')[0].click();
            }
            $$('div.footer').length && $$('div.footer').click();

            if (_currentPage.indexOf('filter.html') > -1 && backPage && backPage.indexOf('filter.html') > -1) {
                mainView.router.load({
                    url: 'views/home.html',
                    reload: true
                })
                return false;
            }
            $$('.release-select-model').removeClass('on');
            if (_currentPage.indexOf('releaseInfo.html') > -1 && !isTipBack && f7) {
                f7.modal({
                    title: '确定放弃这次发布吗？',
                    text: '亲，您已经填写了信息，还没发布呢，确定直接离开？发布一条信息，就有更大几率完成交易噢~',
                    buttons: [
                        {
                            text: '放弃发布',
                            onClick: () => {
                                window.isTipBack = true;
                                mainView.router.back();
                            }
                        },
                        {
                            text: '继续填写',
                            onClick: () => {
                            }
                        }
                    ]
                })
                return false;
            }

            /***避免低版本的安卓手机返回触发两次***/
            if (android && !androidChrome) {
                if (isBack) {
                    return false;
                }
                isBack = true;
                setTimeout(() => {
                    isBack = false;
                }, 300);
            }
        }
    }
}

/*
 * 在低端安卓机中切换页面动画效果不流畅，所以判断在4.4以下的安卓机禁止启用动画
 * */
android && !androidChrome && (initAppConfig['swipeBackPage'] = false);
var f7 = new Framework7(initAppConfig);
const mainView = f7.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
})

/*
 * 抽离出登录视图
 * */
const loginView = f7.addView('.view-login', {
    dynamicNavbar: true,
    domCache: true
})

/*
 * 主视图初始化加载首页
 * */
mainView.router.load({
    url: 'views/home.html',
    animatePages: false,
    reload: true
})

window.$$ = Dom7;
window.jQuery = Dom7;
window.$ = Dom7;
window.mainView = mainView;
window.loginView = loginView;
globalEvent.init(f7);
window.currentDevice = f7.device;
nativeEvent['searchHistoryActions'](2, '');

/*
 * Trigger lazy load img.
 */
$$('img.lazy').trigger('lazy');
/*
 * some kinds of loading style.
 * 1: app.showIndicator()
 * 2: app.showPreloader()
 * 3: app.showPreloader('My text...')
 * hide: app.hide*
 */

/*
 * 页面加载完成后根据name执行相应的controller
 * */
const initApp = f7.onPageInit("*", (page) => {
    if (page.name !== 'home' && page.name) {
        f7.showIndicator();
    } else {
        f7.hideIndicator();
    }
    setTimeout(f7.hideIndicator, timeout);
    page.name === 'editName' && editNameInit(f7, mainView, page);
    page.name === 'catIdentityStatus' && catIdentityStatusInit(f7, mainView, page);
    page.name === 'login' && loginInit(f7, mainView, page);
    page.name === 'bindPhone' && loginInit(f7, mainView, page);
    page.name === 'loginCode' && loginCodeInit(f7, mainView, page);
    page.name === 'search' && searchInit(f7, mainView, page);
    page.name === 'filter' && filterInit(f7, mainView, page);
    page.name === 'selldetail' && selldetailInit(f7, mainView, page);
    page.name === 'buydetail' && buydetailInit(f7, mainView, page);
    page.name === 'release' && releaseInit(f7, mainView, page);
    page.name === 'releaseInfo' && releaseInfoInit(f7, mainView, page);
    page.name === 'myCenter' && myCenterInit(f7, mainView, page);
    page.name === 'identityAuthentication' && identityAuthenticationInit(f7, mainView, page);
    page.name === 'otherIndex' && otherIndexInit(f7, mainView, page);
    page.name === 'otherInfo' && otherInfoInit(f7, mainView, page);
    page.name === 'otherList' && otherListInit(f7, mainView, page);
    page.name === 'myList' && myListInit(f7, mainView, page);
    page.name === 'fishCert' && fishCertInit(f7, mainView, page);
    page.name === 'releaseSucc' && releaseSuccInit(f7, mainView, page);
    page.name === 'home' && homeInit(f7, mainView, page);
    page.name === 'user' && userInit(f7, mainView, page);
    page.name === 'inviteCode' && inviteCodeInit(f7, mainView, page);
    page.name === 'inviteFriends' && inviteFriendsInit(f7, mainView, page);
    page.name === 'inviteFriendsList' && inviteFriendsListInit(f7, mainView, page);
    page.name === 'myCollection' && myCollectionInit(f7, mainView, page);
    page.name === 'dealList' && dealListInit(f7, mainView, page);
    page.name === 'releaseSelectTag' && releaseSelectTagInit(f7, mainView, page);
    page.name === 'notFound' && notFoundInit(f7, mainView, page);
    page.name === 'bindAccount' && bindAccountInit(f7, mainView, page);
    page.name === 'fishCar' && fishCarInit(f7, mainView, page);
    page.name === 'releaseFishCarDemand' && releaseFishCarDemandInit(f7, mainView, page);
    page.name === 'driverDemandInfo' && driverDemandInfoInit(f7, mainView, page);

    /**
     * 上传司机信息页面
     * */
    page.name === 'postDriverAuth' && postDriverAuthInit(f7, mainView, page);
    page.name === 'postDriverInfo' && postDriverInfoInit(f7, mainView, page);
    page.name === 'recruitDriverSuccess' && f7.hideIndicator();
});

/**
 * 返回动画完成之后调用
 * */
f7.onPageAfterBack('*', (page) => {
    const {name} = mainView.activePage;
    setTimeout(() => {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        if('home' == name){
            const fishCacheData = nativeEvent.getDataToNative(fishCacheObj.fishCacheKey);
            if(fishCacheData && fishCacheData.length){
                let str = '';
                $$.each(fishCacheData.reverse(), (index, item) => {
                    if(index <= 2){
                        str += home.renderFishList(item, index);
                    }
                })
                currentPage.find('.fish-cache-list').html(str);
                str ? currentPage.find('.home-fish-cache-list').show() : currentPage.find('.home-fish-cache-list').hide();
            }
        }
    }, 100)
})

/*
 * 关闭微信分享model
 * */
$$('.share-to-weixin-model')[0].onclick = (e) => {
    const ele = e.target || window.event.target;
    const classes = ele.className;
    if (classes.indexOf('footer') > -1 || classes.indexOf('share-to-weixin-model') > -1) {
        $$('.share-to-weixin-model').removeClass('on');
    }
}

/*
 * 微信分享给朋友
 * */
$$('.share-to-friends')[0].onclick = () => {
    const {webUrl, imgUrl, description, title} = window.shareInfo;
    let url = imgUrl ? (imgUrl.split('@')[0].split('?')[0] + '?x-oss-process=image/resize,m_fill,h_100,w_100') : '';
    url = url ? encodeURI(url) : 'http://m.yudada.com/img/app_icon_108.png';
    nativeEvent.shareInfoToWeixin(2, webUrl, url, description, title);
}

/*
 * 微信分享到朋友圈
 * */
$$('.share-to-friends-circle')[0].onclick = () => {
    const {webUrl, imgUrl, description, title} = window.shareInfo;
    let url = imgUrl ? (imgUrl.split('@')[0].split('?')[0] + '?x-oss-process=image/resize,m_fill,h_100,w_100') : '';
    url = url ? encodeURI(url) : 'http://m.yudada.com/img/app_icon_108.png';
    nativeEvent.shareInfoToWeixin(3, webUrl, url, description, title);
}

/*
 * 关闭登录视图
 * */
$$('.view-login>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    if ($$(ele).hasClass('login-view-close')) {
        $$('.view-login').removeClass('show');
    }
    return;
})

/**
 * 调用native定位，获取当前定位信息
 * */
if (!window['addressObj']) {
    nativeEvent.getAddress();
}

/**
 * 省内运输跟跨省运输切换
 * */
$$('.edit-driver-address-model .province-address-select>div').click((e) => {
    const ele = e.target || widnow.event.target;
    let currentItem = $$(ele);
    if(ele.tagName == 'SPAN'){
        currentItem = $$(ele).parent();
    }
    if(currentItem.hasClass('on')){
        return;
    }

    if(currentItem.hasClass('pull-left')){
        $$('.edit-driver-address-model .province-address-select>div').removeClass('on').eq(0).addClass('on');
        $$('.edit-driver-address-model .province-select-item').removeClass('on').eq(0).addClass('on');
    }else{
        $$('.edit-driver-address-model .province-address-select>div').removeClass('on').eq(1).addClass('on');
        $$('.edit-driver-address-model .province-select-item').removeClass('on').eq(1).addClass('on');
    }
})

/**
 * picker绑定省份数据（司机添加或者修改路线）
 * 因为只执行一次，所以放在入口文件
 * */
setTimeout(() => {
    /*省内选择*/
    f7.picker({
        input: $$('.edit-driver-address-model .province-select').find('input'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'center',
                values: gerProvinceList()
            }
        ]
    });

    /*跨省出发地*/
    f7.picker({
        input: $$('.edit-driver-address-model .provinces-select').find('input').eq(0),
        toolbarCloseText: '确定',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'center',
                values: gerProvinceList()
            }
        ]
    });

    /*跨省目的地*/
    f7.picker({
        input: $$('.edit-driver-address-model .provinces-select').find('input').eq(1),
        toolbarCloseText: '确定',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'center',
                values: gerProvinceList()
            }
        ]
    });
}, 1000)

/**
 * 以下是司机选择路线的操作
 * 1：关闭model
 * 2：添加路线
 * 3：编辑保存路线
 * 4：删除路线
 * */
$$('.edit-driver-address-model-cancel').click(() => {
    $$('.edit-driver-address-model').removeClass('add edit');
});

$$('.edit-driver-address-model-add').click(() => {
    let address;
    if($$('.province-address-select .pull-left').hasClass('on')){
        //省内运鱼

        if('请选择' == $$('.province-select').find('input').val()){
            f7.alert('请选择省份！');
            return;
        }
        address = `${$$('.province-select').find('input')
            .val()}内`;
    }else{
        //跨省运鱼
        if('请选择' == $$('.provinces-select').find('input').eq(0).val()){
            f7.alert('请选择出发省份！');
            return;
        }

        if('请选择' == $$('.provinces-select').find('input').eq(1).val()){
            f7.alert('请选择目的地省份！');
            return;
        }

        if($$('.provinces-select').find('input').eq(0).val() == $$('.provinces-select').find('input').eq(1).val()){
            f7.alert('跨省路线中出发省份不能跟目的地省份相同！');
            return;
        }
        const startVal = $$('.provinces-select').find('input').eq(0).val();
        const endVal = $$('.provinces-select').find('input').eq(1).val();
        address = `${startVal}-${endVal}`;
    }
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const length = currentPage.find('.post-select-address').length;
    currentPage.find('.add-address-click-box').remove();
    currentPage.find('.post-driver-select').append(fishCar.selectAddress(length, address));
    if(currentPage.find('.post-select-address').length < 5){
        currentPage.find('.post-driver-select').append(fishCar.addBtn());
    }
    $$('.edit-driver-address-model').removeClass('add edit');
})

$$('.edit-driver-address-model-save').click(() => {
    let address;
    if($$('.province-address-select .pull-left').hasClass('on')){
        //省内运鱼

        if('请选择' == $$('.province-select').find('input').val()){
            f7.alert('请选择省份！');
            return;
        }
        address = `${$$('.province-select').find('input').val()}内`;
    }else{
        //跨省运鱼
        if('请选择' == $$('.provinces-select').find('input').eq(0).val()){
            f7.alert('请选择出发省份！');
            return;
        }

        if('请选择' == $$('.provinces-select').find('input').eq(1).val()){
            f7.alert('请选择目的地省份！');
            return;
        }

        if($$('.provinces-select').find('input').eq(0).val() == $$('.provinces-select').find('input').eq(1).val()){
            f7.alert('跨省路线中出发省份不能跟目的地省份相同！');
            return;
        }
        const startVal = $$('.provinces-select').find('input').eq(0).val();
        const endVal = $$('.provinces-select').find('input').eq(1).val();
        address = `${startVal}-${endVal}`;
    }
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    currentPage.find('.post-select-address').find('input').eq(window.addressIndex)
        .val(address).attr('placeholder', address);
    $$('.edit-driver-address-model').removeClass('add edit');
})

$$('.edit-driver-address-model-delete').click(() => {
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    currentPage.find('.post-select-address').eq(window.addressIndex).remove();
    const itemLen = currentPage.find('.post-select-address').length;
    for(let i=0;i<itemLen;i++){
        if(i <= (itemLen - window.addressIndex)){
            currentPage.find('.post-select-address').eq(i)
                .find('.item-title').text(`路线${getCreateDriverListLabel(i)}`).attr('data-index', i);
        }
    }
    if(!currentPage.find('.add-address-click-box').length){
        currentPage.find('.post-driver-select').append(fishCar.addBtn());
    }
    $$('.edit-driver-address-model').removeClass('add edit');
})