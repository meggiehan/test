import {html, getName, alertTitleText} from '../utils/string';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import {releaseFishViewShow} from '../js/releaseView/releaseFishViews';
import {getDealTime} from '../utils/time';
import Vue from 'vue';
import store from '../utils/localStorage';
import HomeModel from './model/HomeModel';
import tabbar from '../component/tabbar';

function homeSellInit (f7, view, page){
    f7.hideIndicator();
    const {infoNumberKey, cacheUserInfoKey} = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const userInfo = store.get(cacheUserInfoKey);

    /**
     * vue的数据模型
     * */
    Vue.component('tab-bar-component', tabbar);
    // 底部tabbar组件
    new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            infoNumberKey: store.get(infoNumberKey) || 0
        }
    });

    const vueHomeSell = new Vue({
        el: currentPage.find('.home-vue-box')[0],
        data: {
            listData: '',
            userInfo,
            showAll: false,
            isLogin: isLogin()
        },
        methods: {
            goMymember (){
                view.router.load({
                    url: `http://m.test.yudada.com/user/member/${userInfo.id}?time=${new Date().getTime()}`
                });
            },
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            goMySellList (){
                view.router.load({
                    url: 'views/myList.html?type=2'
                });
            },
            goMyShop (){
                view.router.load({
                    url: `views/otherIndex.html?currentUserId=${userInfo.id}`
                });
            }
        },
        computed: {
        }
    });

    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });
}

export {
    homeSellInit
};
