import Framework7 from 'framework7';
// import _ from 'lodash';
import store from './utils/locaStorage'
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
import {identityAuthenticationInit} from './js/identityAuthentication'; 


// init f7
const f7 = new Framework7({
    swipeBackPage: true,
    imagesLazyLoadThreshold: 300,
    pushState: true,
    animateNavBackIcon: true,
    modalTitle: 'Yudada'
});
const $$ = Dom7;
window.currentDevice = f7.device;
const mainView = f7.addView('.view-main', {
        dynamicNavbar: true,
    })
    // load index
mainView.router.load({
    url: 'views/home.html'
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
    // show loading.
    if (page.name !== 'home' && page.name) {
        // f7.showIndicator();
    }else{
        f7.hideIndicator();
    }
    // if(page.name in ['home', 'search', 'filter']){
    //     mainView.hideNavbar();
    // }
    $$('.link-back').on('click', () => {
        mainView.router.back({
            animatePages: true
        });
    })
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
    page.name === 'identityAuthentication' && identityAuthenticationInit(f7, mainView, page);

})
