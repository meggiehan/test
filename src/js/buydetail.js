import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import { detailClickTip, veiwCert, timeout, detailMoreEvent } from '../utils/domListenEvent';
import { isLogin } from '../middlewares/loginMiddle';

function buydetailInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const shareBtn = currentPage.find('.icon-share')[0];
    const collectionBtn = currentPage.find('.icon-collection-btn')[0];
    let demandInfo_;
    const { shareUrl, cacheUserinfoKey } = config;
    let currentUserId;
    let errorInfo;

    const callback = (data) => {
        if (data.data) {
            const {
                userInfo,
                demandInfo,
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
                price,
                checkTime,
                state,
                contactName,
                requirementPhone,
                refuseDescribe
            } = demandInfo;
            const {
                id,
                enterpriseAuthenticationTime,
                personalAuthenticationState,
                enterpriseAuthenticationState,
                imgUrl,
                lastLoginTime,
                level
            } = userInfo;
            demandInfo_ = demandInfo;
            currentPage.find('.selldetail-footer').removeClass('review');
            currentPage.find('.selldetail-footer').removeClass('verify');
            currentPage.find('.selldetail-footer').removeClass('delete');
            const lastHeader = $$($$('.navbar>div')[$$('.navbar>div').length - 1]);
            lastHeader.find('a.detail-more').show();

            if (state == 0 || state == 2) {
                state == 0 && currentPage.find('.selldetail-footer').addClass('review');
                state == 2 && currentPage.find('.selldetail-footer').addClass('verify');
                lastHeader.find('a.detail-more').hide();
            }
            id == locaUserId && currentPage.find('.selldetail-footer').addClass('delete')
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && currentPage.addClass(addClassName);
            currentUserId = userInfo['id'];
            currentPage.find('.goods-name').text(fishTypeName);
            currentPage.find('.goods-create-time').text(timeDifference(checkTime));
            currentPage.find('.selldetail-price').text(price || '面议');
            specifications ? currentPage.find('.selldetail-spec').text(specifications) : currentPage.find('.selldetail-spec').parent().remove();
            currentPage.find('.user-name').children('span').text(contactName || '匿名用户');
            // stock ? currentPage.find('.selldetail-stock').text(stock) : currentPage.find('.selldetail-stock').parent().remove();
            provinceName ? currentPage.find('.selldetail-address').text(`${provinceName} ${cityName}`) : currentPage.find('.selldetail-address').parent().remove();
            describe ? currentPage.find('.selldetail-description').text(describe) : $$('.selldetail-description').parent().remove();
            level && currentPage.find('.user-name').children('i').addClass(`iconfont icon-v${level}`);
            currentPage.find('.user-tell').children('b').text(requirementPhone);
            currentPage.find('.user-time').text(centerShowTime(lastLoginTime));

            1 == enterpriseAuthenticationState && currentPage.find('.buydetail-cert-info').addClass('company-identity').show();
            1 == personalAuthenticationState && currentPage.find('.buydetail-cert-info').addClass('individual-identity').show();

            personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1 && currentPage.find('.user-cert').remove();
            imgUrl && currentPage.find('.selldetail-user-pic').children('img').attr('src', imgUrl + config['imgPath'](8));

            if (isLogin()) {
                if(favorite){
                    $$(collectionBtn).removeClass('icon-collection').addClass('icon-collection-active');
                }else{
                    $$(collectionBtn).addClass('icon-collection').removeClass('icon-collection-active');
                }
            }
        }
        f7.hideIndicator(300);
        f7.pullToRefreshDone();
    }

    currentPage.find('.buy-detail-verify-faild')[0].onclick = () => {
        f7.alert(errorInfo, '查看原因');
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
    const ptrContent = currentPage.find('.buy-detail-refresh');
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

    const collectionCallback = (data) => {
        const {code} = data;
        if(8 == code){
            nativeEvent['nativeToast'](0, '您已收藏过该资源!');
        }else if(1 !== code){
            const info = $$(collectionBtn).hasClass('icon-collection-active') ? '添加收藏失败，请重试！' : '取消收藏失败，请重试！';
            nativeEvent['nativeToast'](0, info);
            $$(collectionBtn).toggleClass('icon-collection-active').toggleClass('icon-collection');
        }else{
            const info = $$(collectionBtn).hasClass('icon-collection-active') ? '添加收藏成功！' : '取消收藏成功！';
            nativeEvent['nativeToast'](1, info);
        }
        f7.hideIndicator();
    }

    collectionBtn.onclick = () => {
        if(!nativeEvent['getNetworkStatus']()){
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
                const buyNum = parseInt($$('.user-buy-num').text()) - 1;
                $$('.other-list-info>a[href="./views/buydetail.html?id=' + id + '"]').remove();
                $$('.user-buy-num').text(buyNum);
                view.router.back()
            }
        })
    }
    currentPage.find('.buydetail-delete-info')[0].onclick = () => {
        const token = store.get(cacheUserinfoKey)['token'];
        f7.confirm('你确定删除求购信息吗？', '删除发布信息', () => {
            f7.showIndicator();
            customAjax.ajax({
                apiCategory: 'demandInfo',
                header: ['token'],
                parameType: 'application/json',
                api: 'deleteDemandInfo',
                data: [id],
                val: {
                    id
                },
                type: 'post'
            }, deleteCallback);
        })

    }

    //View more current user information
    currentPage.find('.selldetail-user-title')[0].onclick = () => {
        view.router.load({
            url: 'views/otherIndex.html?id=' + `${id}&currentUserId=${currentUserId}`,
        })
    }

    currentPage.find('.buydetail-call-phone')[0].onclick = () => {
        const { requirementPhone } = demandInfo_;
        requirementPhone && nativeEvent.contactUs(requirementPhone);
    }

    //view cert of new window.
    $$('.selldetail-cert-list').off('click', veiwCert).on('click', veiwCert);

    //share
    shareBtn.onclick = () => {
        let title = '';
        let messageTile = '';
        let html = '';
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

        title += `【求购】${fishTypeName}, ${provinceName||''}${cityName||''}`;
        messageTile += `我在鱼大大看到求购信息${fishTypeName||''}，`;
        messageTile += stock ? `${'库存 ' + stock}，` : '';
        messageTile += price ? `${'价格' + price}，` : '';
        messageTile += specifications ? `${'规格' + specifications}，` : '';
        messageTile += `，对你很有用，赶紧看看吧: ${url_}`;
        html += `求购${fishTypeName},`;
        html += stock ? `${'库存 ' + stock}，` : '';
        html += price ? `${'价格' + price}，` : '';
        html += specifications ? `${'规格' + specifications}，` : '';
        html += '点击查看更多信息~';
        nativeEvent.shareInfo(title, html, url_, messageTile);
    }

    $$('.navbar-inner.detail-text .detail-more').off('click', detailClickTip).on('click', detailClickTip);
}

module.exports = {
    buydetailInit,
}
