import framework7 from '../js/lib/framework7';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from './nativeEvent';
import config from '../config';
import store from './localStorage';
import customAjax from '../middlewares/customAjax';
import {alertTitleText} from '../utils/string'

const f7 = new framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示'
});
const {servicePhoneNumber} = config;
module.exports = {
    detailClickTip: () => {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        const lastHeader = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
        var popoverHTML = '<div class="popover detail-right-more" style="width:35%">' +
            '<div class="popover-inner">' +
            '<div class="list-block">' +
            '<ul>' +
            '<li><a href="#" class="item-link list-button" data-id="1">有奖转发</a></li>' +
            '<li><a href="#" class="item-link list-button" data-id="2">举报</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>'
        f7.popover(popoverHTML, lastHeader.find('span.iconfont'));
        const detailMoreEvent = (e) => {
            const dataId = e.target.getAttribute('data-id');
            if (1 == dataId) {
                f7.closeModal('.detail-right-more');
                apiCount('btn_info_nav_more_share');
                setTimeout(() => {
                    currentPage.find('div.icon-share').trigger('click');
                }, 500)
            } else if (2 == dataId) {
                apiCount('btn_infonav_more_report');
                f7.closeModal('.detail-right-more');
                f7.confirm('你确定举报该用户吗？', '举报虚假信息', () => {
                    f7.alert('举报成功！');
                })
            }
        }
        $$('.detail-right-more').off('click', detailMoreEvent).on('click', detailMoreEvent);
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
        if (isLogin()) {
            mainView.router.load({
                url: 'views/myCenter.html'
            })
        } else {
            loginViewShow();
        }
    },

    myListBuy: () => {
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
        } else {
            apiCount('btn_mysell');
            mainView.router.load({
                url: 'views/myList.html?type=1'
            })
        }
    },

    myListSell: () => {
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
        } else {
            apiCount('btn_mypurchase');
            mainView.router.load({
                url: 'views/myList.html?type=2'
            })
        }
    },

    uploadCert: () => {
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
        } else {
            apiCount('btn_certification');
            mainView.router.load({
                url: 'views/fishCert.html'
            })
        }
    },

    goIdentity: () => {
        const {cacheUserInfoKey, servicePhoneNumber} = config;
        let personalAuthenticationState, enterpriseAuthenticationState;
        let userInfomation = store.get(cacheUserInfoKey);
        if (userInfomation) {
            personalAuthenticationState = userInfomation['personalAuthenticationState'];
            enterpriseAuthenticationState = userInfomation['enterpriseAuthenticationState'];
        }
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
        } else {
            apiCount('btn_identity');
            const url = (-1 == personalAuthenticationState && -1 == enterpriseAuthenticationState) ?
                'views/identityAuthentication.html' : 'views/catIdentityStatus.html';
            mainView.router.load({
                url
            })
        }

    },

    contactUs: () => {
        apiCount('btn_contact');
        nativeEvent.contactUs(servicePhoneNumber);
    },

    cancleIndividual: () => {
        const {cacheUserInfoKey, servicePhoneNumber} = config;
        let userInfomation = store.get(cacheUserInfoKey);
        const cancleIndividualCallback = (data) => {
            const {code, message} = data;
            // f7.alert(message, '提示', () => {
            // f7.closeModal('.popup-individual-authentication');
            $$('page-identity-status').removeClass('individual-review');
            mainView.router.load({
                url: 'views/user.html',
                reload: true
            })
            // })
        }
        f7.confirm('你确定撤销身份认证审核吗？', '撤销审核', () => {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'cancelPersonalAuthentication',
                header: ['token'],
                paramsType: 'application/json',
                data: [],
                type: 'post',
                noCache: true,
            }, cancleIndividualCallback);
        })
    },

    canclCompany: () => {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        const cancleCompanyCallback = (data) => {
            currentPage.find('page-identity-status').removeClass('company-review');
            mainView.router.load({
                url: 'views/user.html',
                reload: true
            })
        }
        f7.confirm('你确定撤销企业认证审核吗？', '撤销审核', () => {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'cancelEnterpriseAuthentication',
                header: ['token'],
                paramsType: 'application/json',
                data: [],
                type: 'post',
                noCache: true,
            }, cancleCompanyCallback);
        })
    },

    fishCertAction: (e) => {
        const event = e || window.event;
        const ele = event.target;
        let classes = ele.className;
        const id = $$(ele).attr('data-id');
        const {cacheUserInfoKey} = config;
        const userInfo = store.get(cacheUserInfoKey);
        let dataIndex = ele.getAttribute('data-index');

        const deleteCallback = (data) => {
            const {code, message} = data;
            if (1 == code) {
                $$('.fish-cert-list>.col-50').length == 1 && $$('.fish-cert-content').removeClass('show');
                mainView.router.refreshPage();
                $$('span.user-verification-num').text($$('.fish-cert-list>.col-50').length);
                f7.hideIndicator();
            } else {
                f7.alert(message, '提示');
            }

        }

        if (classes.indexOf('cat-cert-faild-info') > -1) {
            const info = $$(ele).attr('data-info');
            f7.alert(info, '未通过原因');
        } else if (classes.indexOf('fish-cert-delete') > -1) {
            const sureCallback = () => {
                f7.showIndicator();
                customAjax.ajax({
                    apiCategory: 'userInfo',
                    header: ['token'],
                    // paramsType: 'application/json',
                    api: 'deleteUserFishCertificate',
                    data: [id],
                    val: {id},
                    type: 'post'
                }, deleteCallback);
            }

            f7.confirm('确定删除？', '删除证书', sureCallback)
        } else if (classes.indexOf('fish-cert-reupload') > -1) {
            nativeEvent.postPic(-1, id);
        } else if (ele.tagName == 'IMG') {
            const url = ele.getAttribute('src').split('@')[0];
            apiCount('cell_certificate');
            nativeEvent.catPic(url);
        }
    },

    veiwCert: (e) => {
        apiCount('cell_profile_certificate');
        const event = e || window.event;
        const ele = e.target;
        const classes = ele.className;
        if (classes.indexOf('open-cert-button') > -1) {
            const url = $$(ele).attr('data-url');
            nativeEvent.catPic(url);
        }
    },

    soundRelease: () => {
        nativeEvent.releaseVoiceInfo();
    },

    inviteFriends: () => {
        if (!isLogin()) {
            f7.alert(alertTitleText(), '温馨提示', loginViewShow)
        } else {
            apiCount('btn_myCenter_inviteFriends');
            mainView.router.load({
                url: 'views/inviteFriends.html'
            })
        }
    }
}
