import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import { detailClickTip, veiwCert, detailMoreEvent } from '../utils/domListenEvent';
import { isLogin } from '../middlewares/loginMiddle';

function selldetailInit(f7, view, page) {
    const { id } = page.query;
    let isReleaseForMe = false;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const certList = currentPage.find('.selldetail-cert-list');
    const collectionBtn = currentPage.find('.icon-collection-btn')[0];
    const shareBtn = currentPage.find('.icon-share')[0];
    const { shareUrl, cacheUserinfoKey, timeout } = config;
    let demandInfo_;
    let currentUserId;
    let errorInfo;
    // let certUrl;
    const callback = (data) => {
        if (data.data) {
            const {
                userInfo,
                business_license_url,
                demandInfo,
                user_ishCertificate_list,
                favorite
            } = data.data;
            const locaUserId = store.get(cacheUserinfoKey) && store.get(cacheUserinfoKey)['id'];
            const {
                specifications,
                stock,
                provinceName,
                describe,
                cityName,
                fishTypeName,
                state,
                price,
                checkTime,
                imgePath,
                contactName,
                requirementPhone,
                refuseDescribe
            } = demandInfo;
            const {
                id,
                enterpriseAuthenticationTime,
                personalAuthenticationState,
                enterpriseAuthenticationState,
                lastLoginTime,
                imgUrl,
                level
            } = userInfo;
            demandInfo_ = demandInfo;            
            currentPage.find('.selldetail-footer').removeClass('review');
            currentPage.find('.selldetail-footer').removeClass('verify');
            currentPage.find('.selldetail-footer').removeClass('delete');
            const lastHeader = $$($$('.navbar>div')[$$('.navbar>div').length - 1]);
            lastHeader.find('a.detail-more').show();

            if (state == 0 || state == 2) {
                // currentPage.find('.selldetail-footer').addClass('delete');
                state == 0 && currentPage.find('.selldetail-footer').addClass('review');
                state == 2 && currentPage.find('.selldetail-footer').addClass('verify');
                lastHeader.find('a.detail-more').hide();
            }
            id == locaUserId && currentPage.find('.selldetail-footer').addClass('delete');
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && ($$('.page-selldetail').addClass(addClassName));
            currentUserId = userInfo['id'];
            1 == state && ($$('.page-selldetail').addClass('active'));
            // ajax back, edit html.
            $$('.selldetail-info>.first img').attr('src', imgePath + config['imgPath'](11));
            html($$('.page-selldetail .goods-name'), fishTypeName, f7);
            html($$('.page-selldetail .goods-create-time'), timeDifference(checkTime), f7);
            html($$('.selldetail-price'), price || '面议', f7);
            specifications ? html($$('.selldetail-spec'), specifications, f7) : $$('.selldetail-spec').parent().remove();
            stock ? html($$('.selldetail-stock'), stock, f7) : $$('.selldetail-stock').parent().remove();
            provinceName ? html($$('.selldetail-address'), `${provinceName} ${cityName}`, f7) : $$('.selldetail-address').parent().remove();
            describe ? html($$('.selldetail-description'), describe, f7) : $$('.selldetail-description').parent().remove();
            let certHtml = '';
            $$.each(user_ishCertificate_list.list, (index, item) => {
                const { fish_type_name } = item;
                fishTypeName == fish_type_name && (certHtml += selldetail.cert(item));
            })
            certHtml ? html(certList, certHtml, f7) : certList.parent().remove();
            html($$('.page-selldetail .user-name>span'), contactName || '匿名用户', f7);
            level && $$('.page-selldetail .user-name>i').addClass(`iconfont icon-v${level}`);
            html($$('.page-selldetail .user-tell>b'), requirementPhone, f7);
            html($$('.page-selldetail .user-time'), centerShowTime(lastLoginTime), f7);
            1 == enterpriseAuthenticationState && $$('.selldetail-cert-info').addClass('company-identity').show();
            1 == personalAuthenticationState && $$('.selldetail-cert-info').addClass('individual-identity').show();
            personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1 && currentPage.find('.user-cert').remove();

            imgUrl && $$('.selldetail-userinfo img').attr('src', imgUrl + config['imgPath'](8));
            if (isLogin()) {
                if (favorite) {
                    $$(collectionBtn).removeClass('icon-collection').addClass('icon-collection-active');
                } else {
                    $$(collectionBtn).addClass('icon-collection').removeClass('icon-collection-active');
                }
            }

            html($$('.tabbar-price'), price || '面议', f7);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfo',
        data: [id],
        header: ['token'],
        val: {
            id
        },
        type: 'get'
    }, callback);

    // pull to refresh.
    const ptrContent = currentPage.find('.sell-detail-refresh');
    ptrContent.on('refresh', function(e) {
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfo',
            data: [id],
            header: ['token'],
            isMandatory: true,
            val: {
                id
            },
            type: 'get'
        }, callback);
    })

    // dom event;
    currentPage.find('.sell-detail-verify-faild ')[0].onclick = () => {
        f7.alert(errorInfo, '查看原因');
    }

    currentPage.find('.selldetail-call-phone')[0].onclick = () => {
        const { requirementPhone } = demandInfo_;
        requirementPhone && nativeEvent.contactUs(requirementPhone);
    }

    const collectionCallback = (data) => {
        const { code } = data;
        if (8 == code) {
            nativeEvent['nativeToast'](0, '您已收藏过该资源!');
        } else if (1 !== code) {
            const info = $$(collectionBtn).hasClass('icon-collection-active') ? '添加收藏失败，请重试！' : '取消收藏失败，请重试！';
            nativeEvent['nativeToast'](0, info);
            $$(collectionBtn).toggleClass('icon-collection-active').toggleClass('icon-collection');
        } else {
            const info = $$(collectionBtn).hasClass('icon-collection-active') ? '添加收藏成功！' : '取消收藏成功！';
            nativeEvent['nativeToast'](1, info);
        }
        f7.hideIndicator();
    }

    collectionBtn.onclick = () => {
        if (!nativeEvent['getNetworkStatus']()) {
            nativeEvent.nativeToast(0, '请检查您的网络！');
            f7.pullToRefreshDone();
            f7.hideIndicator();
            return;
        }
        if (!isLogin()) {
            f7.alert('您还没登录，请先登录。', '温馨提示', () => {
                mainView.router.load({
                    url: 'views/login.html',
                })
            })
            return;
        }
        const httpType = $$(collectionBtn).hasClass('icon-collection-active') ? 'DELETE' : 'POST';
        $$(collectionBtn).toggleClass('icon-collection-active').toggleClass('icon-collection');

        customAjax.ajax({
            apiCategory: 'favorite',
            api: 'demandInfo',
            header: ['token'],
            val: {
                id
            },
            noCache: true,
            type: httpType
        }, collectionCallback);
    }

    //delete release infomation.
    const deleteCallback = (data) => {
        const { code, message } = data;
        f7.hideIndicator();
        f7.alert(message || '删除成功', '提示', () => {
            if (1 == code) {
                const sellNum = parseInt($$('.user-sell-num').text()) - 1;
                $$('.other-list-info>a[href="./views/selldetail.html?id=' + id + '"]').remove();
                $$('.user-sell-num').text(sellNum);
                view.router.back();
            }
        })
    }
    currentPage.find('.selldetail-delete-info')[0].onclick = () => {
        const token = store.get(cacheUserinfoKey)['token'];
        f7.confirm('你确定删除出售信息吗？', '删除发布信息', () => {
            f7.showIndicator();
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'deleteDemandInfo',
                header: ['token'],
                parameType: 'application/json',
                data: [id],
                val: {
                    id
                },
                type: 'post'
            }, deleteCallback);
        })
    }

    //View more current user information
    $$('.selldetail-user-title').on('click', () => {
        view.router.load({
            url: 'views/otherIndex.html?id=' + `${id}&currentUserId=${currentUserId}`,
        })
    })

    //view cert of new window.
    $$('.selldetail-cert-list').off('click', veiwCert).on('click', veiwCert);

    //share
    shareBtn.onclick = () => {
        let title = '';
        let html = '';
        let messageTile = '';
        const url_ = `${shareUrl}?id=${id}`;
        const {
            specifications,
            stock,
            provinceName,
            describe,
            cityName,
            fishTypeName,
            price,
            createTime,
            contactName,
            requirementPhone
        } = demandInfo_;

        title += `【出售】${fishTypeName}, ${provinceName||''}${cityName||''}`;
        messageTile += `我在鱼大大看到出售信息${fishTypeName}，`;
        messageTile += stock ? `${'库存 ' + stock}，` : '';
        messageTile += price ? `${'价格' + price}，` : '';
        messageTile += specifications ? `${'规格' + specifications}` : '';
        messageTile += `，对你很有用，赶紧看看吧: ${url_}`;
        html += `出售 ${fishTypeName}，`;
        html += stock ? `${'库存 ' + stock}，` : '';
        html += price ? `${'价格' + price}，` : '';
        html += specifications ? `${'规格' + specifications}，` : '';
        html += '点击查看更多信息~';
        nativeEvent.shareInfo(title, html, url_, messageTile);
    }

    $$('.navbar-inner.detail-text .detail-more').off('click', detailClickTip).on('click', detailClickTip);
    $$('.detail-right-more').off('click', detailMoreEvent).on('click', detailMoreEvent);
}

module.exports = {
    selldetailInit,
}
