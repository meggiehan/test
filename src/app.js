import Framework7 from 'framework7';
// import _ from 'lodash';
import store from './utils/locaStorage'
import customAjax from './middlewares/customAjax';
import { homeInit } from './js/home';
import { searchInit } from './js/search';
import { filterInit } from './js/filter';
import { selldetailInit } from './js/selldetail';
import { buydetailInit } from './js/buydetail'


// init f7
const f7 = new Framework7();
const $$ = Dom7;

const mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    })
    // load index
mainView.router.load({
    url: './views/home.html'
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
})




