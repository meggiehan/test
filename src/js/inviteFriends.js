import store from '../utils/localStorage';
import config from '../config';
import { getName, trim } from '../utils/string';
import { getDate } from '../utils/time';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';
import Vue from 'vue';
import shareComponent from '../component/shareComponent';

function inviteFriendsInit(f7, view, page) {
    if(!isLogin()){
       	logOut();
    }
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const { cacheUserInfoKey } = config;
    const userInfo = store.get(cacheUserInfoKey);
    const {
        invitationCode,
        inviterNickname,
        inviterPhone,
        invitationLink,
        scanLink,
        imgUrl,
        registerCount,
        nickname
    } = userInfo || {};

    /**
     * vue的数据模型
     * */
    Vue.component('share-component',  shareComponent);
    const vueInvite = new Vue({
        el: currentPage.find('.page-content')[0],
        data: {
            inviteData: userInfo
        },
        methods: {
            goToInviteList: () => {
                apiCount('btn_inviteFriends_userlist');
                if(!registerCount){
                    nativeEvent.nativeToast(0, '你还没有邀请过好友！');
                    return;
                }
                view.router.load({
                    url: 'views/inviteFriendsList.html'
                })
            }
        }
    });

    /**
     * 调用友盟分享
     * */
    return;
    currentPage.find('.invite-friends-share-weixin')[0].onclick = () => {
        apiCount('btn_inviteFriends_share');
        const title = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！`;
        const str = `养得好不如卖的好，鱼大大实名认证水产交易平台`;
        const messageTile = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！赶紧看看吧:${invitationLink}`;

        nativeEvent.shareInfo(title, str, invitationLink, messageTile, imgUrl || 'http://m.yudada.com/img/app_icon_108.png');
    };

}

export {
    inviteFriendsInit
}
