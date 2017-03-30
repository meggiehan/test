import store from '../utils/localStorage';
import config from '../config/index';
import {activeLogout, isLogin} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import shareComponent from '../component/shareComponent';
import userUtils from '../utils/viewsUtil/userUtils';
import {shareBusinessCardCtrl} from './service/shareBusinessCard/shareBusinessCardCtrl';
import {JsBridge} from '../middlewares/JsBridge';

function shareMyTripInit(f7, view, page) {
    if (!isLogin()) {
        activeLogout();
    }
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {cacheUserInfoKey, timeout} = config;
    const userInfo = store.get(cacheUserInfoKey);
    let isHeadImgLoad = false;

    const {
        scanLink,
        imgUrl,
        registerCount,
        enterpriseAuthenticationState,
        enterpriseAuthenticationTime,
        personalAuthenticationState,
        personalAuthenticationTime
    } = userInfo || {};

    const authText = userUtils.getAuthenticationText(
        enterpriseAuthenticationState,
        enterpriseAuthenticationTime,
        personalAuthenticationState,
        personalAuthenticationTime
    ).myCenterText;

    /**
     * 生成二维码
     * */
    if (scanLink) {
        new QRCode(currentPage.find('.share-trip-user-code')[0], {
            text: scanLink,
            height: 180,
            width: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    const $qrCodeBg = currentPage.find('.bg-card-pic');
    const shareBaseAction = (callback) => {
        f7.showIndicator();
        const $qrCodeLevel = currentPage.find('.bg-card-level');
        const $qrCodePic = currentPage.find('.share-trip-user-code').children('img');

        const shareAction = () => {
            const $headImg = currentPage.find('.head-img');
            shareBusinessCardCtrl(
                userInfo,
                $qrCodePic,
                $qrCodeBg,
                $qrCodeLevel,
                $headImg,
                currentPage,
                authText,
                callback
            )
        };

        if (isHeadImgLoad) {
            const $headImg = currentPage.find('.head-img');
            shareBusinessCardCtrl(
                userInfo,
                $qrCodePic,
                $qrCodeBg,
                $qrCodeLevel,
                $headImg,
                currentPage,
                authText,
                callback
            );
        } else {
            let friendCount = 0;
            const interShareId = setInterval(() => {
                if (isHeadImgLoad) {
                    shareAction();
                    clearInterval(interShareId);
                }
                if (friendCount >= (timeout / 1000)) {
                    clearInterval(interShareId);
                    f7.hideIndicator();
                    f7.alert('您的网络不稳定，请稍后再试！');
                    console.log('用户头像下载失败！')
                }
                friendCount++;
            })
        }
    };

    /**
     * vue的数据模型
     * */
    Vue.component('share-component', shareComponent);
    setTimeout(() => {
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
                    view.router.load({
                        url: 'views/inviteFriendsList.html'
                    })
                },
                weixinShareFriend() {
                    apiCount('btn_inviteFriends_share');
                    shareBaseAction((res) => {
                        f7.hideIndicator();
                        const {
                            code,
                            data
                        } = res;
                        if (1 == code) {
                            nativeEvent.shareInfoToWeixin(0, data);
                        } else {
                            f7.alert('服务器繁忙，请稍后再试！');
                            console.log(code);
                        }
                    })
                },
                weixinShareCircle() {
                    apiCount('btn_inviteFriends_share');
                    shareBaseAction((res) => {
                        f7.hideIndicator();
                        const {
                            code,
                            data
                        } = res;
                        if (1 == code) {
                            nativeEvent.shareInfoToWeixin(1, data);
                        } else {
                            f7.alert('服务器繁忙，请稍后再试！');
                            console.log(code);
                        }
                    })
                },
                qqShareFriend() {
                    apiCount('btn_inviteFriends_share');
                    shareBaseAction((res) => {
                        f7.hideIndicator();
                        const {
                            code,
                            data
                        } = res;
                        if (1 == code) {
                            JsBridge('JS_QQSceneShare', {
                                type: '0',
                                imageUrl: data,
                                title: '鱼大大',
                                describe: "",
                                webUrl: ''
                            }, () => {
                                console.log('分享成功！')
                            });
                        } else {
                            f7.alert('服务器繁忙，请稍后再试！');
                            console.log(code);
                        }
                    })
                }
            }
        });
        const $headImg = currentPage.find('.head-img');
        $headImg[0].onload = () => {
            isHeadImgLoad = true;
        };
    }, 0);

    /**
     * 调用友盟分享
     * */
    // currentPage.find('.invite-friends-share-weixin')[0].onclick = () => {
    //     apiCount('btn_inviteFriends_share');
    //     const title = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！`;
    //     const str = `养得好不如卖的好，鱼大大实名认证水产交易平台`;
    //     const messageTile = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！赶紧看看吧:${invitationLink}`;
    //
    //     nativeEvent.shareInfo(title, str, invitationLink, messageTile, imgUrl || 'http://m.yudada.com/img/app_icon_108.png');
    // };

}

export {
    shareMyTripInit
}
