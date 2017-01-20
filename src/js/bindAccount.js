import customAjax from '../middlewares/customAjax';
import config from '../config';
import store from '../utils/locaStorage';
import nativeEvent from '../utils/nativeEvent';
import {loginViewShow, isLogin} from '../middlewares/loginMiddle';

function bindAccountInit(f7, view, page) {
    f7.hideIndicator();
    const {cacheUserinfoKey} = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const token = nativeEvent.getUserValue();
    const weixinData = nativeEvent.getDataToNative('weixinData');
    const userInfo = store.get(cacheUserinfoKey);

    if (!token && !weixinData) {
        mainView.router.load({
            url: 'views/user.html',
            reload: true
        })
    }

    currentPage.find('.bind-account-phone').removeClass('bind unbind');
    currentPage.find('.bind-account-weixin').removeClass('bind unbind');

    function editWeixin(data) {
        const {nickname} = data;
        nickname && currentPage.find('.bind-account-weixin').addClass('bind');
        nickname && currentPage.find('.text').children('i').text(nickname);
    }

    const bindListCallback = (data) => {
        if (1 == data.code) {
            if (data.data.length) {
                editWeixin(data.data[0]);
            } else {
                currentPage.find('.bind-account-weixin').addClass('unbind');
            }
        }
    }

    function getThirdPlatformsList() {
        customAjax.ajax({
            apiCategory: 'thirdPlatforms',
            api: 'mine',
            header: ['token'],
            type: 'get',
            noCache: true
        }, bindListCallback);
    }

    if (token) {
        currentPage.find('.bind-account-phone').addClass('bind');
        if (userInfo) {
            const {loginName} = userInfo;
            const phoneText = loginName.substring(0, 3) + '*****' + loginName.substring(7, 11);
            currentPage.find('.bind-account-phone').children('.text').text(phoneText)
        }
        getThirdPlatformsList();
    } else {
        currentPage.find('.bind-account-phone').addClass('unbind');
        if (weixinData) {
            editWeixin(JSON.parse(weixinData));
        } else {
            currentPage.find('.bind-account-weixin').addClass('unbind');
        }
    }

    currentPage.find('.col-50.phone')[0].onclick = () => {
        if (currentPage.find('.bind-account-phone').hasClass('unbind')) {
            loginViewShow();
            apiCount('btn_bind_phone');
        }
        ;
    };

    /*
     * 解绑微信号
     * */
    const unbindCallback = (data) => {
        const {code, message} = data;
        if (1 == code) {
            nativeEvent.setDataToNative('weixinData', '');
            nativeEvent.setUerInfoToNative({unionId: 0});
            mainView.router.load({
                url: 'views/user.html',
                reload: true
            })
            return;
        }
        f7.alert('温馨提示', message);
    }

    currentPage.find('.col-50.weixin')[0].onclick = () => {
        if (currentPage.find('.bind-account-weixin').hasClass('unbind')) {
            apiCount('btn_bind_bindwechat');
            nativeEvent.callWeixinLogin();
        } else {
            apiCount('btn_bind_unbindwechat');
            //解绑微信
            if (currentPage.find('.bind-account-phone').hasClass('unbind')) {
                //未绑定手机号时解绑微信
                f7.modal({
                    title: '解绑账号',
                    text: '该账号是你登录鱼大大的唯一方式，绑定手机号之后可以解绑该账号！',
                    buttons: [
                        {
                            text: '我再想想',
                            onClick: () => {
                            }
                        },
                        {
                            text: '绑定手机号',
                            onClick: loginViewShow
                        },
                        {
                            text: '退出微信号',
                            onClick: () => {
                                unbindCallback({
                                    code: 1
                                });
                            }
                        }
                    ]
                })
                setTimeout(() => {
                    $$('.modal-in').length && $$('.modal-in').addClass('yudada-style');
                    $$('.modal-in').css('marginTop', '-115px')
                }, 50)
            } else {
                //已经绑定手机号时解绑微信
                f7.modal({
                    title: '解绑账号',
                    text: '解绑了之后就无法使用微信登录本账号了，是否仍要解绑？',
                    buttons: [
                        {
                            text: '我再想想',
                            onClick: () => {
                            }
                        },
                        {
                            text: '确定解绑',
                            onClick: () => {
                                customAjax.ajax({
                                    apiCategory: 'thirdPlatform',
                                    api: 'weChat',
                                    header: ['token'],
                                    parameType: 'application/json',
                                    type: 'DELETE',
                                    noCache: true
                                }, unbindCallback);
                            }
                        }
                    ]
                })
            }
        }
    };
}

module.exports = {
    bindAccountInit
}
