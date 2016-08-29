import framework7 from '../js/lib/framework7';
import { isLogin } from '../middlewares/loginMiddle';
import nativeEvent from './nativeEvent';

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
});

module.exports = {
    filterTabClick: (e) => {
        const event = e || window.event;
        let ele = event.target;
        let classes = ele.className;
        const clickTab = () => {
            if (classes.indexOf('active-ele') > -1) {
                ele.className = classes.replace('active-ele', '');
                $$('.winodw-mask').removeClass('on');
                $$('.filter-tabs-content').removeClass('on');
            } else {
                $$('.filter-tab>div').removeClass('active-ele');
                ele.className += ' active-ele';
                $$('.winodw-mask').addClass('on');
                $$('.filter-tabs-content').addClass('on');
                $$('.filter-tabs-content>div').removeClass('active');
                classes.indexOf('tab1') > -1 && $$('.filter-tabs-content>div').eq(0).addClass('active');
                classes.indexOf('tab2') > -1 && $$('.filter-tabs-content>div').eq(1).addClass('active');
                classes.indexOf('tab3') > -1 && $$('.filter-tabs-content>div').eq(2).addClass('active');
            }
        }
        if (ele.parentNode.className.indexOf('filter-tab-title') > -1) {
            ele = ele.parentNode;
            classes = ele.className;
            clickTab();
        } else if (classes.indexOf('filter-tab-title') > -1) {
            clickTab();
        }
    },

    detailClickTip: () => {
        f7.confirm('你确定举报吗？', '举报虚假信息', () => {
            f7.alert('举报成功！');
        })
    },

    otherIndexClickTip: () => {
        f7.confirm('你确定举报该用户吗？', '举报虚假信息', () => {
            f7.alert('举报成功！');
        })
    },

    goHome: () => {
        mainView.router.load({
            url: 'views/home.html',
            reload: true
        })
    },

    goUser: () => {
        mainView.router.load({
            url: 'views/user.html',
            reload: true
        })
    },
    goMyCenter: () => {
        const url = isLogin() ? 'views/myCenter.html' : 'views/login.html';
        mainView.router.load({
            url
        })
    },

    myListBuy: () => {
        if (!isLogin()) {
            f7.alert('您还没登录，请先登录。', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/login.html',
                })
            })
        } else {
            mainView.router.load({
                url: 'views/myList.html?type=1'
            })
        }
    },

    myListSell: () => {
        if (!isLogin()) {
            f7.alert('您还没登录，请先登录。', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/login.html',
                })
            })
        } else {
            mainView.router.load({
                url: 'views/myList.html?type=2'
            })
        }
    },

    uploadCert: () => {
        if (!isLogin()) {
            f7.alert('您还没登录，请先登录。', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/login.html',
                })
            })
        } else {
            mainView.router.load({
                url: 'views/fishCert.html',
            })
        }
    },

    contactUs: () => {
        nativeEvent.contactUs(servicePhoneNumber);
    }

}
