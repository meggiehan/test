import Framework7 from './js/lib/framework7';
// import _ from 'lodash';
import store from './utils/locaStorage';
import config from './config';
import customAjax from './middlewares/customAjax';
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
import { loginSucc } from './middlewares/loginMiddle';
import { otherIndexInit } from './js/otherIndex';
import { otherInfoInit } from './js/otherInfo';
import { otherListInit } from './js/otherList';
import { myListInit } from './js/myList';
import { fishCertInit } from './js/fishCert';
import { releaseSuccInit } from './js/releaseSucc';
import nativeEvent from './utils/nativeEvent';
import { getQuery } from './utils/string';


const deviceF7 = new Framework7();
const { device } = deviceF7;
const { ios, android, androidChrome, osVersion } = device;
const { version, debug } = config;

console.log(`current app version: ${version}!`);
// alert(osVersion + '--' + androidChrome);
let animatStatus = true;
android && (animatStatus = androidChrome);
// init f7
const f7 = new Framework7({
    // swipeBackPage: true,
    uniqueHistoryIgnoreGetParameters: true,
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
    force: true,
    // cacheIgnore: ['views/search.html', 'views/login.html', 'views/loginCode.html'],


    // cacheIgnore: ['search.html'],
    // preprocess: (content, url, next) => {
    //     console.log(url);
    //     next(content)
    // },
    preroute: (view, options) => {
        const goPage = view['url'];
        const { history, loadPage } = view;
        const currentPage = options['url'];
        // console.log(`gopage:${goPage}--currentpage:${currentPage}`,history )
        //if router back, doing.
        // if(!currentPage){
        //     const len = history.length;
        //     const backPage = history[len - 1];
        //     const {search} = getQuery(goPage);
        //     if(backPage.indexOf('filter.html') > -1 && search){
        //         window.history.go(-2)
        //         return false;
        //     }else if(backPage.indexOf('releaseSucc.html') > -1){
        //         window.history.go(-2)
        //         return false;
        //     }else if(backPage.indexOf('loginCode.html') > -1){
        //         window.history.go(-2)
        //         return false;
        //     }
        // }
        return;

    }
});
const mainView = f7.addView('.view-main', {
        dynamicNavbar: true,
        domCache: false
    })
    // load index
mainView.router.load({
    url: 'views/home.html',
    animatePages: false,
    reload: true
})

window.$$ = Dom7;
window.mainView = mainView;
globalEvent.init(f7);
window.currentDevice = f7.device;
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

const animatePage = 'search filter selldetail  login loginCode buydetail release releaseInfo myCenter identityAuthentication otherIndex otherInfo otherList myList fishCert releaseSucc';
const initEvent = f7.onPageBeforeAnimation(animatePage, (page) => {
    // show loading.
    // if (page.name !== 'home' && page.name) {
    //     // f7.showIndicator();
    // } else {
    //     f7.hideIndicator();
    // } 
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
});
let isSendXhr = false;
f7.onPageInit('home user', (page) => {
    if (isSendXhr || page['url'].indexOf('home.html') < -1 || page['url'].indexOf('user.html') < -1) {
        return;
    }
    isSendXhr = true;
    setTimeout(() => {
        page.name === 'home' && homeInit(f7, mainView, page);
        page.name === 'user' && userInit(f7, mainView, page);
        isSendXhr = false
    }, 100)

})
