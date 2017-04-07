import store from '../utils/localStorage';
import config from '../config';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import {getCurrentDay, alertTitleText, getAuthText} from '../utils/string';
import UserModel from './model/UserModel';
import Vue from 'vue';
import {timeDifference} from '../utils/time';

import {
    goHome,
    goMyCenter,
    myListBuy,
    myListSell,
    uploadCert,
    contactUs,
    goIdentity,
    inviteFriends
} from '../utils/domListenEvent';

function userInit(f7, view, page) {
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-user')[$$('.view-main .pages>.page-user').length - 1]);
    const {
        cacheUserInfoKey,
        imgPath,
        mWebUrl
    } = config;
    let userInformation = store.get(cacheUserInfoKey);
    // view.hideNavbar();
    $$('.view-main>.navbar').hide();

    const userVue = new Vue({
        el: currentPage.find('.vue-model')[0],
        data: {
            userInfo: {},
            recentDemands: [],
            isLogin: false
        },
        methods: {
            contactUs: contactUs,
            timeDifference: timeDifference,
            imgPath: imgPath,
            contactUs: contactUs,
            myListBuy: myListBuy,
            myListSell: myListSell,
            uploadCert: uploadCert,
            inviteFriends: inviteFriends,
            goIdentity: goIdentity,//前往实名认证
            goMyCenter: goMyCenter,
            login(){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            //打开帮助中心
            helpCenter(){
                apiCount('btn_help');
                nativeEvent['goNewWindow'](`${mWebUrl}helpCenter.html`);
            },
            goMyMember(){
                apiCount('btn_myCenter_myLevel');
                mainView.router.load({
                  url: `${mWebUrl}user/member/${this.userInfo.id}`
                })
            },
            goMyCollection(){
                apiCount('btn_favoriteList');
                mainView.router.load({
                    url: 'views/myCollection.html'
                })
            },
            //发布信息
            releaseInfo(){
                apiCount('btn_tabbar_post');
                if (this.weixinData && !this.isLogin) {
                    this.login();
                    return;
                }
                view.router.load({
                    url: 'views/release.html'
                })
            },
            //刷新或者发布信息
            releaseOrRefresh(){
                if(!this.isLogin){
                    this.releaseInfo();
                }else{
                    if(!this.recentDemands.length){
                        this.releaseInfo();
                        return;
                    }
                    this.myListSell();
                }
            },
            //绑定账号
            bindAccount(){
                if (!this.isLogin && !this.weixinData) {
                    f7.alert('您还没登录，请先登录!', '温馨提示', loginViewShow);
                    return;
                }
                apiCount('btn_bindAccounts');
                mainView.router.load({
                    url: 'views/bindAccount.html'
                })
            },
            //前往鱼车需求
            goFishDemand(){
                apiCount('btn_myCenter_fishcarDemands');
                view.router.load({
                    url: 'views/myFishCarDemandList.html'
                })
            },
            //查看拒绝原因
            catRejectInfo(msg){
                f7.modal({
                    title: '抱歉',
                    text: `您的鱼车信息审核未通过，原因是：${msg}`,
                    buttons: [
                        {
                            text: '重新报名',
                            onClick: () => {
                                view.router.load({
                                    url: `views/postDriverAuth.html?id=${userVue.userInfo.fishCarDriverId}`
                                })
                            }
                        },
                        {
                            text: '我知道了',
                            onClick: () => {}
                        }
                    ]
                });
            },
            //冻结提示
            frozenMsg(){
                apiCount('btn_myCenter_editDriverInfo');
                f7.modal({
                    title: '抱歉',
                    text: '您的鱼车司机账号已被冻结，请联系客服！',
                    buttons: [
                        {
                            text: '联系客服',
                            onClick: contactUs
                        },
                        {
                            text: '我知道了',
                            onClick: () => {}
                        }
                    ]
                });
            },
            //分享我的店铺
            shareMyShop(){
                if (!this.isLogin && !this.weixinData) {
                    this.login();
                    return;
                }
                mainView.router.load({
                    url: `views/otherIndex.html?currentUserId=${userInformation.id}`
                })
            },
            fishCarCheckIng(){
                f7.modal({
                    title: '司机审核中',
                    text: '请耐心等待审核结果，审核通过后就可以发布行程了',
                    buttons: [
                        {
                            text: '我知道了',
                            onClick: () => {}
                        }
                    ]
                });
            },
            driverBtnClick(){
                if(this && this.userInfo && this.userInfo.driverState > -2){
                    if(1 !== this.userInfo.driverState){
                        if (0 == this.userInfo.driverState) {
                            this.fishCarCheckIng();
                        } else if (2 == this.userInfo.driverState) {
                            this.catRejectInfo(this.userInfo.driverRefuseDescribe);
                        } else if (3 == this.userInfo.driverState) {
                            this.frozenMsg();
                        }
                    }else{
                        mainView.router.load({
                            url: `views/postDriverAuth.html?id=${this.userInfo.fishCarDriverId}`
                        })
                    }
                }else{
                    if (!this.isLogin && !this.weixinData) {
                        this.login();
                        return;
                    }
                    apiCount('btn_myCenter_registerDriver');
                    view.router.load({
                        url: 'views/postDriverAuth.html'
                    })
                }
            },
            authCheckInfo(){
                f7.alert('正在审核中，请耐心等待');
            },
            goMyShop(){
                apiCount('btn_identity');
                this.shareMyShop();
            },
            //查看企业审核不通过理由
            showAuthRejectInfo(msg, type){
                f7.modal({
                    title: '抱歉',
                    text: `您的${type ? '企业' : '个人'}认证未通过，原因是：${msg}`,
                    buttons: [
                        {
                            text: '我知道了',
                            onClick: () => {}
                        },
                        {
                            text: '重新提交',
                            onClick: () => {
                                view.router.load({
                                    url: 'views/identityAuthentication.html'
                                })
                            }
                        },

                    ]
                });
            }
        },
        computed: {
            //获取司机入口文案
            driverBtnText(){
                let res = '司机登记';
                if(this && this.userInfo && this.userInfo.driverState > -2){
                    0 === this.userInfo.driverState && (res = '审核中');
                    1 === this.userInfo.driverState && (res = '修改司机信息');
                    2 === this.userInfo.driverState && (res = '审核不通过');
                    3 === this.userInfo.driverState && (res = '司机被冻结');
                }
                return res;
            },
            isShowGoAuth(){
                return (1 !== this.userInfo.enterpriseAuthenticationState && 1 !== this.userInfo.personalAuthenticationState);
            },
            authText(){
                return getAuthText(this.userInfo.enterpriseAuthenticationState,this.userInfo.personalAuthenticationState);
            },
            weixinData(){
                if(this.isLogin){
                    return '';
                }
                return store.get('weixinData');
            },
            versionNumber(){
                const versionNumber = store.get('versionNumber');
                let currentVersion = '';
                if(versionNumber){
                    const currentVersionArr = versionNumber.replace('V', '').split('_');
                    currentVersionArr && $$.each(currentVersionArr, (index, item) => {
                        if(Number(item) < 10){
                            currentVersion += item.replace('0', '');
                        }else{
                            currentVersion += item;
                        }
                        index < (currentVersionArr.length -1) && (currentVersion += '.');
                    });
                }
                return currentVersion;
            }
        }
    });

    const loginCallback = (data) => {
        f7.hideIndicator();
        const {code, message} = data;
        if (code == 1) {
            store.set(cacheUserInfoKey, data.data);
            userVue.userInfo = data.data;
            userVue.recentDemands = data.data.recentDemands;
            userVue.isLogin = true;

            const oldDate = store.get('oldDate');
            !oldDate && store.set('oldDate', getCurrentDay());
            if (!oldDate || (new Date(oldDate).getTime() < new Date(getCurrentDay()).getTime())) {
                const {
                    nickname,
                    personalAuthenticationState
                } = userInformation;
                store.set('oldDate', getCurrentDay());
                if (!nickname) {
                    f7.modal({
                        title: '提示',
                        text: '你还没填写你的名字，填写完整有助于交易成交~',
                        buttons: [
                            {
                                text: '现在去填写',
                                onClick: () => {
                                    mainView.router.load({
                                        url: 'views/editName.html',
                                    })
                                }
                            },
                            {
                                text: '取消',
                                onClick: () => {
                                }
                            }
                        ]
                    });
                    return;
                }
                if (1 != personalAuthenticationState) {
                    f7.modal({
                        title: '提示',
                        text: '实名认证有助于交易成交，交易额翻番不是梦~',
                        buttons: [
                            {
                                text: '现在去认证',
                                onClick: goIdentity
                            },
                            {
                                text: '取消',
                                onClick: () => {
                                }
                            }
                        ]
                    });
                    return;
                }
            }
        } else {
            f7.alert(message);
        }
        setTimeout(() => {
            currentPage.css({
                borderBottom: '1px solid #efeff4'
            })
        }, 1000)
    };

    /*
     * 判断登录状态
     * 已登录：微信登录/手机号登录
     * */
    if (isLogin()) {
        userVue.isLogin = true;
        if (userInformation && userInformation.recentDemands) {
            userVue.userInfo = userInformation;
            userVue.recentDemands = userInformation.recentDemands;
        }else{
            f7.showIndicator();
        }
        UserModel.get(loginCallback);
    }
    window.userVue = userVue;
    setTimeout(() => {
        currentPage.css({
            borderBottom: '1px solid #efeff4'
        })
    }, 1000);

    /*
     * 回到首页
     * */
    currentPage.find('.href-go-home')[0].onclick = goHome;

    /*
     * 前往发布信息页面
     * */
    currentPage.find('.to-release-page')[0].onclick = userVue.releaseInfo;
}

export {
    userInit
}
