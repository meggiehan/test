import store from '../utils/localStorage';
import config from '../config/index';
import {logOut, isLogin} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import shareComponent from '../component/shareComponent';
import userUtils from '../utils/viewsUtil/userUtils';
import {shareBusinessCardCtrl} from './service/shareBusinessCard/shareBusinessCardCtrl';

function inviteFriendsInit(f7, view, page) {
    if (!isLogin()) {
        logOut();
    }
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {cacheUserInfoKey, imgPath} = config;
    const userInfo = store.get(cacheUserInfoKey);
    const {
        invitationCode,
        inviterNickname,
        inviterPhone,
        invitationLink,
        scanLink,
        imgUrl,
        registerCount,
        nickname,
        enterpriseAuthenticationState,
        enterpriseAuthenticationTime,
        personalAuthenticationState,
        personalAuthenticationTime
    } = userInfo || {};

    /**
     * vue的数据模型
     * */
    Vue.component('share-component', shareComponent);
    const vueInvite = new Vue({
        el: currentPage.find('.page-content')[0],
        data: {
            inviteData: userInfo,
            authText: userUtils.getAuthenticationText(
                enterpriseAuthenticationState,
                enterpriseAuthenticationTime,
                personalAuthenticationState,
                personalAuthenticationTime
            ).myCenterText
        },
        methods: {
            //跳转至用户已经邀请成功的列表
            imgPath: imgPath,
            goToInviteList: () => {
                apiCount('btn_inviteFriends_userlist');
                if (!registerCount) {
                    nativeEvent.nativeToast(0, '你还没有邀请过好友！');
                    return;
                }
                view.router.load({
                    url: 'views/inviteFriendsList.html'
                })
            },
            weixinShareFriend() {
                console.log(123)
            },
            weixinShareCircle() {
                console.log(234)
            }
        }
    });

    // nativeEvent.apiCount('btn_inviteFriends_share');
    // const title = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！`;
    // const str = `养得好不如卖的好，鱼大大实名认证水产交易平台`;
    // const messageTile = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！赶紧看看吧:${invitationLink}`;
    //
    // nativeEvent.shareInfo(title, str, invitationLink, messageTile, imgUrl || 'http://m.yudada.com/img/app_icon_108.png');

    /**
     * 生成二维码
     * */
    if (scanLink) {
        new QRCode(currentPage.find('.invite-user-code')[0], {
            text: scanLink,
            height: 180,
            width: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        const $qrCodePic = currentPage.find('.invite-user-code').children('img');
        const $qrCodeBg = currentPage.find('.bg-card-pic');
        const $qrCodeLevel = currentPage.find('.bg-card-level');
        const $headImg = currentPage.find('.head-img');

        shareBusinessCardCtrl(
            userInfo,
            $qrCodePic,
            $qrCodeBg,
            $qrCodeLevel,
            $headImg,
            currentPage
        );
    }

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
