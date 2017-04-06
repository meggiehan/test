import store from '../utils/localStorage';
import config from '../config/index';
import {activeLogout, isLogin} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import shareComponent from '../component/shareComponent';
import userUtils from '../utils/viewsUtil/userUtils';
import {JsBridge} from '../middlewares/JsBridge';
import {getShareTripImgUrl} from '../utils/string';

function shareMyTripInit(f7, view, page) {
    f7.hideIndicator();
    if (!isLogin()) {
        activeLogout();
    }
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {cacheUserInfoKey, timeout} = config;
    const userInfo = store.get(cacheUserInfoKey);
    const shareImgUrl = getShareTripImgUrl(userInfo, page.query);

    const {
        scanLink,
        imgUrl,
        registerCount,
        enterpriseAuthenticationState,
        enterpriseAuthenticationTime,
        personalAuthenticationState,
        personalAuthenticationTime
    } = userInfo || {};

    const authText = userUtils.getAuthenticationText(enterpriseAuthenticationState, enterpriseAuthenticationTime, personalAuthenticationState, personalAuthenticationTime).myCenterText;

    /**
     * vue的数据模型
     * */
    Vue.component('share-component', shareComponent);

    const inviteVue = new Vue({
        el: currentPage.find('.page-content')[0],
        data: {
            imgUrl: imgUrl,
            query: page.query,
            level: userInfo.level
        },
        methods: {
            //跳转至用户已经邀请成功的列表
            goToInviteList() {
                apiCount('btn_inviteFriends_userlist');
                if (!registerCount) {
                    nativeEvent.nativeToast(0, '你还没有邀请过好友！');
                    return;
                }
                view.router.load({url: 'views/inviteFriendsList.html'})
            },
            weixinShareFriend() {
                apiCount('btn_inviteFriends_share');
                nativeEvent.shareInfoToWeixin('0', shareImgUrl);
            },
            weixinShareCircle() {
                apiCount('btn_inviteFriends_share');
                nativeEvent.shareInfoToWeixin('1', shareImgUrl);
            },
            qqShareFriend() {
                apiCount('btn_inviteFriends_share');
                JsBridge('JS_QQSceneShare', {
                    type: '0',
                    imageUrl: shareImgUrl,
                    title: '鱼大大',
                    describe: "",
                    webUrl: ''
                }, () => {
                    console.log('分享成功！')
                });
            }
        }
    });
}

export {shareMyTripInit}
