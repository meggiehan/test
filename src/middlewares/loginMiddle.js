import config from '../config/';
import store from '../utils/localStorage';
import {trim, html} from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
const {cacheUserinfoKey} = config;

/*
 * 判断用户是否登录
 * */
function isLogin() {
    const nativeToken = store.get("accessToken");
    const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
    if (!nativeToken) {
        store.remove(cacheUserinfoKey);

        //更新用户中心登录状态
        if ('user' == mainView.activePage.name &&
            currentPage.find('.login-succ').length && !nativeEvent.getDataToNative('weixinData')) {
            mainView.router.refreshPage();
        }
        return false;
    } else {
        return true;
    }
}

/*
 * native通知h5登出，清除h5用户信息
 * */
function logOut(f7) {
    f7.modal({
        title: '退出登录',
        text: '确认退出登录?',
        buttons: [
            {
                text: '确认',
                onClick: () => {
                    store.remove(cacheUserinfoKey);
                    store.remove("accessToken");
                    nativeEvent.setDataToNative('weixinData', '');
                    nativeEvent.setUerInfoToNative({
                        inviterId: 0
                    });
                    nativeEvent.setUerInfoToNative({
                        unionId: ''
                    });
                    mainView.router.load({
                        url: "views/user.html"
                    });
                }
            },
            {
                text: '取消',
                onClick: () => {}
            }
        ]
    });
}

/**
 * 主动登出，清除h5用户信息并且通知native清除用户信息
 * */
function activeLogout() {
    store.remove(cacheUserinfoKey);
    nativeEvent.setNativeUserInfo();
    nativeEvent.setDataToNative('weixinData', '');
    nativeEvent.setUerInfoToNative({
        inviterId: 0
    });
    nativeEvent.setUerInfoToNative({
        unionId: ''
    });
    mainView.router.load({
        url: 'views/user.html'
    })
}

/**
 * 登录成功之后对user页面的信息刷新
 * */
function loginSucc(data, callback) {
    const {imgPath} = config;
    const {
        imgUrl,
        nickname,
        name,
        loginName,
        point,
        level,
        favoriteCount
    } = data;
    $$('.user-header').addClass('login-succ');
    $$('.user-tell-number').text(`手机号：${loginName || ''}`);
    imgUrl && ($$('.user-pic img').attr('src', `${imgUrl}${imgPath(8)}`));
    imgUrl && $$('.user-pic img').addClass('active');
    favoriteCount && $$('.user-collection-num').text(favoriteCount);
    nickname && $$('.page-user .user-name>span').text(nickname);
    point && $$('.user-member-number').text(point);
    $$('.user-name>i').addClass(`iconfont icon-v${level || 0}`);
    callback(data);
}

/**
 * 显示登录模块。
 * 1：当有没有token并且没有微信数据的时候，是正常的登录流程，load登录页面
 * 2：当有微信数据而没有token时，就是绑定手机号流程，load绑定个手机号页面
 * 3: 在发布成功页面登录，带来手机号自动填入
 * */
function loginViewShow(phone) {
    const token = nativeEvent.getUserValue();
    const weixinData = nativeEvent.getDataToNative('weixinData');
    let url;
    if (!token && !weixinData) {
        url = Number(phone) ? ('views/login.html?phone=' + phone) : 'views/login.html';
    }

    if (!token && weixinData) {
        url = 'views/bindPhone.html';
    }
    loginView.router.load({
        url,
        reload: true
    });
    $$('.view-login').addClass('show');
}

function getToken() {
    return store.get("accessToken");
};

function setToken(accessToken) {
    store.set("accessToken", accessToken);
}

/**
 * 隐藏登录页面
 * */
function loginViewHide() {
    $$('.view-login').removeClass('show');
}

module.exports = {
    isLogin,
    logOut,
    loginSucc,
    activeLogout,
    loginViewShow,
    loginViewHide,
    getToken,
    setToken
};
