import Framework7 from './js/lib/framework7';
import version from './config/version.json';
import config from './config';
import {searchInit} from './js/search';
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
import {getQuery} from './utils/string';
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
import {releaseFishCarDemandInit} from './js/releaseFishCarDemand';
import {postDriverAuthInit} from './js/postDriverAuth';
import {postDriverInfoInit} from './js/postDriverInfo';
import {driverDemandInfoInit} from './js/driverDemandInfo';
import {updateCtrl, updateClickEvent} from './js/service/updateVersion/updateVersionCtrl';
import {invitationAction} from './js/service/invitation/invitationCtrl';
import {JsBridge} from './middlewares/JsBridge';
import {releaseFishCarDemandSuccessInit} from './js/releaseFishCarDemandSuccess';
import {releaseFishCarTripInit} from './js/releaseFishCarTrip';
import {weixinModalEvent} from './js/modal/weixinModal';
import {
    fishCarModalJumpEvent
} from './js/modal/fishCarDriverSelectAddressModal';
import {fishCarTripListInit} from './js/fishCarTripList';
import {myFishCarDemandListInit} from './js/myFishCarDemandList';
import RefreshOldTokenModel from './js/model/RefreshOldTokenModel';
import store from './utils/localStorage';
import {shareMyTripInit} from './js/shareMyTrip';
import {aquaticClassroomInit} from './js/aquaticClassroom';
import {homeBuyInit} from './js/homeBuy';
import {strengthShowInit} from './js/strengthShow';
import {dealInfoInit} from './js/dealInfo';
import {releasePriceInit} from './js/releasePrice';
import {addInstructionInit} from './js/addInstruction';
import {chooseDateInit} from './js/chooseDate';
import {homeSellInit} from './js/homeSell';
import HomeModel from './js/model/HomeModel';
import InitApp from './js/model/InitApp';
import {submitDealSuccInit} from './js/submitDealSucc';
import {mvpListInit} from './js/mvpList';

const deviceF7 = new Framework7();
const {device} = deviceF7;
const {android, androidChrome} = device;
const {timeout, fishCacheObj, url, infoNumberKey} = config;
console.log(`current app update time: ${version.date}!${store.get('versionNumber')}`);
let animatStatus = true;
android && (animatStatus = androidChrome);
window.isTipBack = false;
window.shraeInfo = {};
let isBack = false;

/*
 * 初始化f7的参数
 * */
let initAppConfig = {
    activeState: false,
    imagesLazyLoadThreshold: 50,
    pushState: true,
    animateNavBackIcon: true,
    animatePages: animatStatus,
    preloadPreviousPage: true,
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
    preprocess: (content, url, next) => {
        next(content);
        $$('.fish-car-modal').removeClass('on');
        const query = getQuery(url);
        if (url.indexOf('search.html') > -1){
            searchInit(f7, window.mainView, {query});
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
        const btns = window.document.getElementsByClassName('modal-button');
        if (!window.isTipBack && _currentPage && _currentPage.indexOf('releaseInfo.html') > -1 && btns.length && btns[0].innerText.indexOf('放弃发布') > -1){
            return false;
        }

        if (!currentPage && len >= 1){
            const backPage = history[len - 2];
            if (_currentPage.indexOf('homeBuy.html') > -1 ||
             _currentPage.indexOf('user.html') > -1 ||
              _currentPage.indexOf('releaseSucc.html') > -1 ||
                _currentPage.indexOf('homeSell.html') > -1 ||
                _currentPage.indexOf('aquaticClassroom.html') > -1){
                return false;
            }

            if ($$('.modal-overlay-visible').length){
                $$('.modal-overlay-visible').trigger('click');
                $$('.modal-button').length && $$('.modal-button')[0].click();
            }
            $$('div.footer').length && $$('div.footer').click();

            if (_currentPage.indexOf('filter.html') > -1 && backPage && backPage.indexOf('filter.html') > -1){
                window.mainView.router.load({
                    url: 'views/homeBuy.html',
                    reload: true
                });
                return false;
            }
            $$('.release-select-model').removeClass('on');
            if (_currentPage.indexOf('releaseInfo.html') > -1 && !window.isTipBack && f7){
                f7.modal({
                    title: '确定放弃这次发布吗？',
                    text: '亲，您已经填写了信息，还没发布呢，确定直接离开？发布一条信息，就有更大几率完成交易噢~',
                    buttons: [
                        {
                            text: '放弃发布',
                            onClick: () => {
                                window.isTipBack = true;
                                window.mainView.router.back();
                            }
                        },
                        {
                            text: '继续填写',
                            onClick: () => {
                            }
                        }
                    ]
                });
                return false;
            }

            // 避免低版本的安卓手机返回触发两次
            if (android && !androidChrome){
                if (isBack){
                    return false;
                }
                isBack = true;
                setTimeout(() => {
                    isBack = false;
                }, 400);
            }
        }
    }
};

/*
 * 在低端安卓机中切换页面动画效果不流畅，所以判断在4.4以下的安卓机禁止启用动画
 * */
android && !androidChrome && (initAppConfig['swipeBackPage'] = false);
var f7 = new Framework7(initAppConfig);
window.mainView = f7.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

/*
 * 抽离出登录视图
 * */
window.loginView = f7.addView('.view-login', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * 鱼车相关发布需求
 * */
window.releaseView = f7.addView('.view-release-fish', {
    dynamicNavbar: true,
    domCache: true
});

/*
 * 主视图初始化加载首页
 * */
const isHomeSell = store.get('isHomeSell');
window.mainView.router.load({
    url: `views/${isHomeSell ? 'homeSell' : 'homeBuy'}.html`,
    animatePages: false,
    reload: true
});

window.$$ = window.Dom7;
window.jQuery = window.Dom7;
window.$ = window.Dom7;
globalEvent.init(f7);
window.currentDevice = f7.device;
window.f7 = f7;
nativeEvent['searchHistoryActions'](2, '');

if(android && !androidChrome){
    $$('html').addClass('android-4-min');
}else{
    /**
     * 初始化jsBrige
     * */
    JsBridge('JS_SaveInfomation', {jsBrigeTest: 123}, f7);
}

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
f7.onPageInit('*', (page) => {
    if (page.name){
        f7.showIndicator();
    }

    const hideLoadArr = ['recruitDriverSuccess', 'myMember', 'pageMvp', 'homeSell', 'homeBuy'];
    if(hideLoadArr.indexOf(page.name) > -1){
        f7.hideIndicator();
    }

    setTimeout(f7.hideIndicator, timeout);
    page.name === 'homeBuy' && homeBuyInit(f7, window.mainView, page);

    page.name === 'editName' && editNameInit(f7, window.mainView, page);
    page.name === 'catIdentityStatus' && catIdentityStatusInit(f7, window.mainView, page);
    page.name === 'login' && loginInit(f7, window.mainView, page);
    page.name === 'bindPhone' && loginInit(f7, window.mainView, page);
    page.name === 'loginCode' && loginCodeInit(f7, window.mainView, page);
    page.name === 'search' && searchInit(f7, window.mainView, page);
    page.name === 'filter' && filterInit(f7, window.mainView, page);
    page.name === 'selldetail' && selldetailInit(f7, window.mainView, page);
    page.name === 'buydetail' && buydetailInit(f7, window.mainView, page);
    page.name === 'release' && releaseInit(f7, window.mainView, page);
    page.name === 'releaseInfo' && releaseInfoInit(f7, window.mainView, page);
    page.name === 'myCenter' && myCenterInit(f7, window.mainView, page);
    page.name === 'identityAuthentication' && identityAuthenticationInit(f7, window.mainView, page);
    page.name === 'otherIndex' && otherIndexInit(f7, window.window.mainView, page);
    page.name === 'otherInfo' && otherInfoInit(f7, window.mainView, page);
    page.name === 'otherList' && otherListInit(f7, window.mainView, page);
    page.name === 'myList' && myListInit(f7, window.mainView, page);
    page.name === 'fishCert' && fishCertInit(f7, window.window.mainView, page);
    page.name === 'releaseSucc' && releaseSuccInit(f7, window.window.mainView, page);
    page.name === 'user' && userInit(f7, window.mainView, page);
    page.name === 'inviteCode' && inviteCodeInit(f7, window.mainView, page);
    page.name === 'inviteFriendsList' && inviteFriendsListInit(f7, window.mainView, page);
    (page.name === 'inviteFriends' || page.name === 'myShop') && inviteFriendsInit(f7, window.mainView, page);

    page.name === 'myCollection' && myCollectionInit(f7, window.mainView, page);
    page.name === 'dealList' && dealListInit(f7, window.mainView, page);
    page.name === 'releaseSelectTag' && releaseSelectTagInit(f7, window.mainView, page);
    page.name === 'notFound' && notFoundInit(f7, window.mainView, page);
    page.name === 'bindAccount' && bindAccountInit(f7, window.mainView, page);
    page.name === 'submitDealSucc' && submitDealSuccInit(f7, window.mainView, page);
    page.name === 'mvpList' && mvpListInit(f7, window.mainView, page);

    /**
     * 鱼车相关
     * */
    page.name === 'fishCar' && fishCarInit(f7, window.mainView, page);
    page.name === 'releaseFishCarDemand' && releaseFishCarDemandInit(f7, window.mainView, page);
    page.name === 'releaseFishCarTrip' && releaseFishCarTripInit(f7, window.mainView);
    page.name === 'driverDemandInfo' && driverDemandInfoInit(f7, window.mainView, page);
    page.name === 'releaseFishCarDemandSuccess' && releaseFishCarDemandSuccessInit(f7, window.mainView, page);
    page.name === 'fishCarTripList' && fishCarTripListInit(f7, window.mainView, page);
    page.name === 'myFishCarDemandList' && myFishCarDemandListInit(f7, window.mainView, page);
    page.name === 'shareMyTrip' && shareMyTripInit(f7, window.mainView, page);

    /**
     * 上传司机信息页面
     * */
    page.name === 'postDriverAuth' && postDriverAuthInit(f7, window.mainView, page);
    page.name === 'postDriverInfo' && postDriverInfoInit(f7, window.mainView, page);

    page.name === 'aquaticClassroom' && aquaticClassroomInit(f7, window.mainView, page);
    page.name === 'strengthShow' && strengthShowInit(f7, window.mainView, page);
    page.name === 'dealInfo' && dealInfoInit(f7, window.mainView, page);
    page.name === 'releasePrice' && releasePriceInit(f7, window.mainView, page);
    page.name === 'addInstruction' && addInstructionInit(f7, window.mainView, page);
    page.name === 'chooseDate' && chooseDateInit(f7, window.mainView, page);
    page.name === 'homeSell' && homeSellInit(f7, window.mainView, page);
});

/**
 * 返回动画完成之后调用
 * */
f7.onPageAfterBack('*', (page) => {
    const {name} = window.mainView.activePage;
    if ('homeBuy' == name){
        const fishCache = store.get(fishCacheObj.fishCacheKey) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
        if(fishCache.length){
            let dataArr = [];
            $$.each(fishCache, (index, item) => {
                let arr = {};
                arr.fishId = item.id;
                arr.fishName = item.name;
                arr.parentFishId = item.parant_id;
                arr.parentFishName = item.parant_name;
                dataArr.push(arr);
            });
            HomeModel.postFollowFishNumber({
                subscribedFishes: dataArr
            }, (res) => {
                const {code, data, message} = res;
                if(1 == code){
                    window.vueHome.selectCache = data;
                }else{
                    console.log(message);
                }

            });
        }
    }
});

/*
 * 关闭登录视图/发布需求信息视图
 * */
$$('.view-login>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    if ($$(ele).hasClass('login-view-close')){
        $$('.view-login').removeClass('show');
    }
    return;
});

$$('.view-release-fish>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    if($$(ele).hasClass('release-view-close')){
        $$('.view-release-fish').removeClass('show');
    }
    return;
});

/**
 * 调用native定位，获取当前定位信息
 * 1.8升级1.9 登录token兼容刷新
 * */
let interTime = 0;
if (!store.get('versionNumber')){
    const intervalId = setInterval(() => {
        interTime += 200;

        const versionNumber = store.get('versionNumber');
        if(versionNumber == 'V01_09_01_01' &&
            !store.get('isUpdateLarge') &&
            nativeEvent.getUserValue()){
            RefreshOldTokenModel.post((res) => {
                const {code, data, message} = res;
                if(1 == code){
                    nativeEvent.setNativeUserInfo();
                    store.set('accessToken', data);
                    store.set('isUpdateLarge', 1);
                }else{
                    console.log(message);
                }
            });
            clearInterval(intervalId);
        }

        if(interTime >= 20000 || !!versionNumber){
            clearInterval(intervalId);
        }

    }, 500);
}

/**
 * 一开始执行检查版本更新操作
 * 更新版本按钮操作事件
 * 初始化邀请model类
 * 邀请modal按钮操作
 * 微信modal操作
 * 鱼车选择地区modal操作
 * */
const interId = setInterval(() => {
    if(window.JS_GetObjectWithKey ||
        (window.yudada && window.yudada.JS_GetObjectWithKey)){
        updateCtrl(f7);
        nativeEvent.getAddress();
        clearInterval(interId);
    }
}, 100);
updateClickEvent(f7);
invitationAction();
weixinModalEvent();
// fishCarDriverSelectAddressModalEvent(f7);
fishCarModalJumpEvent(f7);

// 获取未读咨询数量
InitApp.getInfoNumber((res) => {
    const {data, message, code} = res;
    if(1 == code){
        store.set(infoNumberKey, data);
    }else{
        console.log(message);
    }
});

/**
 * 获取设备号
 */
setTimeout(() => {
    JsBridge('JS_GetUUid', {}, (data) => {
        window.uuid = data;
    });
}, 1500);

// 统计js报错
window.onload = function (){
    function handler (eventError){
        if(eventError.target.tagName == 'IMG'){
            return;
        }
        const data = {
            type: eventError.type,
            filename: eventError.filename,
            message: eventError.message,
            lineno: eventError.lineno
        };
        $$.ajax({
            timeout: 3000,
            cache: false,
            headers: {},
            crossDomain: true,
            method: 'POST',
            url: `${url}jsErrors`,
            data: JSON.stringify(data),
            contentType: 'application/json',
            error: function (data){
                console.log('错误发送失败！');
            },
            success: function (data){
                console.log('错误发送成功！');
            }
        });
        return true;
    }
    if (window.addEventListener){
        window.addEventListener('error', handler, true);
    } else if (window.attachEvent){
        window.attachEvent('onerror', handler);
    }
};

// 处理picker组件空白处滑动触发页面滚动
$$('body').touchmove((e) => {
    const ele = e.target || window.event.target;
    if(($$(ele).hasClass('picker-modal-inner') && $$(ele).hasClass('picker-items')) ||
    ($$(ele).hasClass('toolbar-inner') && $$(ele).parent().hasClass('toolbar'))){
        e.preventDefault();
        e.stopPropagation();
        return;
    }
});
