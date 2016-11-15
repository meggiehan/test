import Framework7 from './js/lib/framework7';
// import _ from 'lodash';
import store from './utils/locaStorage';
import config from './config';
import { homeInit } from './js/home';
import { searchInit } from './js/search';
import { filterInit } from './js/filter';
import { selldetailInit } from './js/selldetail';
import { buydetailInit } from './js/buydetail';
import { releaseInit } from './js/release';
import { releaseInfoInit } from './js/releaseInfo';
import { loginInit } from './js/login';
import { loginCodeInit } from './js/loginCode';
import { userInit } from './js/user';
import { myCenterInit } from './js/myCenter';
import { identityAuthenticationInit } from './js/identityAuthentication';
import globalEvent from './utils/global';
import { otherIndexInit } from './js/otherIndex';
import { otherInfoInit } from './js/otherInfo';
import { otherListInit } from './js/otherList';
import { myListInit } from './js/myList';
import { fishCertInit } from './js/fishCert';
import { releaseSuccInit } from './js/releaseSucc';
import nativeEvent from './utils/nativeEvent';
import { getQuery } from './utils/string';
import { isLogin } from './middlewares/loginMiddle';
import { catIdentityStatusInit } from './js/catIdentityStatus';
import { editNameInit } from './js/editName';
import { inviteCodeInit } from './js/inviteCode';
import { inviteFriendsInit } from './js/inviteFriends';
import { inviteFriendsListInit } from './js/inviteFriendsList';
import { myCollectionInit } from './js/myCollection';



const deviceF7 = new Framework7();
const { device } = deviceF7;
const { ios, android, androidChrome, osVersion } = device;
const { version, timeout } = config;

console.log(`current app version: ${version}!`);
let animatStatus = true;
android && (animatStatus = androidChrome);

let isBack = false;
// init f7
let initAppConfig = {
    // swipeBackPage: false,
    // uniqueHistoryIgnoreGetParameters: true,
    // uniqueHistory: true,
    // preloadPreviousPage: true,
    imagesLazyLoadThreshold: 50,
    // pushStatePreventOnLoad: true,
    pushState: true,
    animateNavBackIcon: true,
    // pushStateSeparator: '?#!/',
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
            searchInit(f7, mainView, { query })
        }
    },
    preroute: (view, options) => {
        const goPage = view['url'];
        const { history, loadPage } = view;
        const currentPage = options && options['url'];

        //if router back, doing.
        const len = history.length;
        if (!currentPage && len >= 1) {
            const _currentPage = history[len - 1];
            const backPage = history[len - 2];
            // the current page is prohibited to back prev page.
            if (_currentPage.indexOf('home.html') > -1 || _currentPage.indexOf('user.html') > -1 || _currentPage.indexOf('releaseSucc.html') > -1) {
                return false;
            }

            if (_currentPage.indexOf('inviteFriends.html') > -1) {
                $$('.modal-overlay-invite-code').length > 0 && $$('.modal-overlay-invite-code').trigger('click');
            } 

            if($$('.modal-overlay-visible').length){
                $$('.modal-overlay-visible').trigger('click');
                $$('.modal-button').length && $$('.modal-button')[0].click();
            }

            if (_currentPage.indexOf('filter.html') > -1 && backPage && backPage.indexOf('filter.html') > -1) {
                mainView.router.load({
                    url: 'views/home.html',
                    reload: true
                })
                return false;
            }
            if (android && !androidChrome) {
                if (isBack) {
                    return false;
                }
                // nativeEvent['nativeGoBack']();
                isBack = true;
                setTimeout(() => {
                    isBack = false;
                }, 300);
            }
        }
    }
}

android && !androidChrome && (initAppConfig['swipeBackPage'] = false);
const f7 = new Framework7(initAppConfig);
const mainView = f7.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
})

// load index
mainView.router.load({
    url: 'views/home.html',
    animatePages: false,
    reload: true
})

window.$$ = Dom7;
window.jQuery = Dom7;
window.$ = Dom7;

window.mainView = mainView;
globalEvent.init(f7);
window.currentDevice = f7.device;

//get search history form native.
nativeEvent['searchHistoryActions'](2, '');

//get curren address cache in object on window.
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

const initApp = f7.onPageInit("*", (page) => {
    // show loading.
    if (page.name !== 'home' && page.name) {
        f7.showIndicator();
    } else {
        f7.hideIndicator();
    }
    setTimeout(f7.hideIndicator, timeout);
    page.name === 'editName' && editNameInit(f7, mainView, page);
    page.name === 'catIdentityStatus' && catIdentityStatusInit(f7, mainView, page);
    page.name === 'login' && loginInit(f7, mainView, page);
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
});
