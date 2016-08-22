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
import { releaseSelectTypeInit } from './js/releaseSelectType';
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


const deviceF7 = new Framework7();
const { device } = deviceF7;
const { ios, android, androidChrome, osVersion } = device;
const { version } = config;

console.log(`current app version: ${version}!`);
// alert(osVersion + '--' + androidChrome);
let animatStatus = true;
android && (animatStatus = androidChrome);
// init f7
const f7 = new Framework7({
    // swipeBackPage: true,
    imagesLazyLoadThreshold: 50,
    pushState: true,
    animateNavBackIcon: true,
    animatePages: animatStatus,
    fastClicks: true,
    modalTitle: 'Yudada'
});
const $$ = Dom7;
const mainView = f7.addView('.view-main', {
        dynamicNavbar: true,
        domCache: false
    })
    // load index
mainView.router.load({
    url: 'views/home.html',
    animatePages: false
})

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

const initEvent = f7.onPageInit('*', (page) => {
    globalEvent.init(f7);
    window.currentDevice = f7.device;
    // show loading.
    if (page.name !== 'home' && page.name) {
        // f7.showIndicator();
    } else {
        f7.hideIndicator();
    }
    //global back event;
    $$('.link-back').on('click', () => {
        mainView.router.back({
            animatePages: animatStatus
        });
    })

    setTimeout(function() {
        page.name === 'home' && homeInit(f7, mainView, page);
        page.name === 'search' && searchInit(f7, mainView, page);
        page.name === 'filter' && filterInit(f7, mainView, page);
        page.name === 'selldetail' && selldetailInit(f7, mainView, page);
        page.name === 'buydetail' && buydetailInit(f7, mainView, page);
        page.name === 'release' && releaseInit(f7, mainView, page);
        page.name === 'releaseSelectType' && releaseSelectTypeInit(f7, mainView, page);
        page.name === 'releaseInfo' && releaseInfoInit(f7, mainView, page);
        page.name === 'login' && loginInit(f7, mainView, page);
        page.name === 'user' && userInit(f7, mainView, page);
        page.name === 'loginCode' && loginCodeInit(f7, mainView, page);
        page.name === 'myCenter' && myCenterInit(f7, mainView, page);
        page.name === 'identityAuthentication' && identityAuthenticationInit(f7, mainView, page);
        page.name === 'otherIndex' && otherIndexInit(f7, mainView, page);
        page.name === 'otherInfo' && otherInfoInit(f7, mainView, page);
        page.name === 'otherList' && otherListInit(f7, mainView, page);
        page.name === 'myList' && myListInit(f7, mainView, page);
    }, 0)


})
