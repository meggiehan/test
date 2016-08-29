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
    // swipeBackPage: false,
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
    // force: true,
    // cacheIgnore: ['views/search.html', 'views/login.html', 'views/loginCode.html'],


    // cacheIgnore: ['search.html'],
    // preprocess: (content, url, next) => {
    //     console.log(url);
    //     next(content)
    // },
    preroute: (view, options) => {
        if(!options){
            return;
        }
        const goPage = view['url'];
        const { history, loadPage } = view;
        const currentPage = options['url'];
        // console.log(`gopage:${goPage}--currentpage:${currentPage}`,history )
        //if router back, doing.
            const len = history.length;

        if (!currentPage && len >= 2) {
            const _currentPage = history[len - 1];
            const backPage = history[len - 2];
            const reBackPag = history[len - 3];
            // const { search } = getQuery(goPage);
            if (backPage.indexOf('home.html') > -1 || backPage.indexOf('user.html') > -1) {
                view.router.load({
                    url: backPage,
                    reload: true
                })
                return false;
            } else if (_currentPage.indexOf('releaseSucc.html') > -1) {
                return false;
            }
        }
    }
});
const mainView = f7.addView('.view-main', {
        dynamicNavbar: true,
        // domCache: true
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


const initEvent = f7.onPageInit("*", (page) => {
    // show loading.
    if (page.name !== 'home' && page.name) {
        f7.showIndicator();
    } else {
        f7.hideIndicator();
    } 
    // const url = page['view']['url'];
    // const name = url.split('.html')[0].split('views/')[1];
    // const query = getQuery(url.split('?')[1]);

    // if ((!page.name || page.name !== name) && url) {
    //     page['query'] = query;
    //     page['name'] = name;

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
    page.name === 'home' && homeInit(f7, mainView, page);
    page.name === 'user' && userInit(f7, mainView, page);
});

