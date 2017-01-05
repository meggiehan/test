import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { timeDifference, centerShowTime } from '../utils/time';
import { html, saveSelectFishCache, getRange, getAddressIndex } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import { detailClickTip, veiwCert, timeout, detailMoreEvent } from '../utils/domListenEvent';
import { isLogin } from '../middlewares/loginMiddle';

function buydetailInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const lastHeader = $$($$('.navbar>div')[$$('.navbar>div').length - 1]);
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
                fishParentTypeName,
                fishTypeId,
                fishParentTypeId,
                price,
                checkTime,
                state,
                contactName,
                requirementPhone,
                refuseDescribe,
                descriptionTags,
                quantityTags,
                sort,
                latitude,
                longitude
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
            lastHeader.find('a.detail-more').show();

            if (state == 0 || state == 2) {
                state == 0 && currentPage.find('.selldetail-footer').addClass('review');
                state == 2 && currentPage.find('.selldetail-footer').addClass('verify');
                lastHeader.find('a.detail-more').hide();
                lastHeader.find('right').css('paddingRight', '3rem');
            }
            const showStyle = {
                display: '-webkit-box'
            }

            const {lat,lng} = getAddressIndex(provinceName, cityName);
            const rangeText = getRange(lat, lng);
            rangeText > -1 && currentPage.find('.city-distance').addClass('show').find('i').text(rangeText);

            let tagHtml = '';
            descriptionTags && JSON.parse(descriptionTags).length && $$.each(JSON.parse(descriptionTags), (index, item) => {
                tagHtml += `<span class="iconfont icon-auto-end">${item.tagName}</span>`;
            })
            tagHtml ? html(currentPage.find('.info-tages-list'), tagHtml, f7) : currentPage.find('.info-tages-list').hide();

            id == locaUserId && currentPage.find('.selldetail-footer').addClass('delete')
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && currentPage.addClass(addClassName);
            currentUserId = userInfo['id'];
            currentPage.find('.buy-goods-name').text(describe || fishTypeName);
            currentPage.find('.goods-create-time').text(timeDifference(sort));
            currentPage.find('.selldetail-price').children('b').text(stock && `${stock}` || '大量');
            currentPage.find('.buy-detail-price').text(price && `${price}` || '面议');
            
            let specText = quantityTags ? (JSON.parse(quantityTags).length && JSON.parse(quantityTags)[0]['tagName'] || '') : '';
            specText && specifications && (specText = `${specText}，${specifications}`);
            (!specText && specifications) && (specText += specifications);    
            specText ? currentPage.find('.selldetail-spec').text(specText).parent().css(showStyle) : currentPage.find('.selldetail-spec').parent().hide();
            currentPage.find('.user-name').children('span').text(contactName || '匿名用户');
            currentPage.find('.budetail-fish-name').text(fishTypeName);
            currentPage.find('.buydetail-stock').css(showStyle).text(stock || '大量');
            currentPage.find('.icon-map').next('b').text(`${provinceName} ${cityName}`);
            provinceName ? currentPage.find('.selldetail-address').text(`${provinceName} ${cityName}`).parent().css(showStyle) : currentPage.find('.selldetail-address').parent().hide();
            describe ? currentPage.find('.selldetail-description').text(describe).parent().css(showStyle) : $$('.selldetail-description').parent().hide();
            level && currentPage.find('.user-name').children('i').addClass(`iconfont icon-v${level}`);
            currentPage.find('.user-tell').children('b').text(requirementPhone);
            currentPage.find('.user-time').text(centerShowTime(lastLoginTime));

            1 == enterpriseAuthenticationState && currentPage.find('.auth-company').addClass('show');
            1 == personalAuthenticationState && currentPage.find('.auth-individual').addClass('show');

            if(personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1){
                currentPage.find('.user-name').css({
                    lineHeight: '5rem',
                    height: '5rem'
                });
                currentPage.find('.user-cert').hide();
                currentPage.find('.buy-detail-auth').hide();
            }
            imgUrl && currentPage.find('.selldetail-user-pic').children('img').attr('src', imgUrl + config['imgPath'](8));

            if (isLogin()) {
                if (favorite) {
                    $$(collectionBtn).removeClass('icon-collection').addClass('icon-collection-active');
                } else {
                    $$(collectionBtn).addClass('icon-collection').removeClass('icon-collection-active');
                }
            }

            saveSelectFishCache({
                name: fishTypeName,
                id: fishTypeId,
                parant_id: fishParentTypeId,
                parant_name: fishParentTypeName
            })
        }
        f7.hideIndicator(300);
        f7.pullToRefreshDone();
    }

    currentPage.find('.buy-detail-verify-faild')[0].onclick = () => {
        apiCount('btn_rejectReason');
        f7.alert(errorInfo, '查看原因');
    }

    const { ios } = window.currentDevice;
    ios && (currentPage.find('.selldetail-footer').addClass('safira'));

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
        const { code } = data;
        if (8 == code) {
            nativeEvent['nativeToast'](0, '您已收藏过该资源!');
        } else if (1 !== code) {
            const info = $$(collectionBtn).hasClass('icon-collection-active') ? '添加收藏失败，请重试！' : '取消收藏失败，请重试！';
            nativeEvent['nativeToast'](0, info);
            $$(collectionBtn).toggleClass('icon-collection-active').toggleClass('icon-collection');
        } else {
            let info;
            let collectionNum = Number($$('.user-collection-num').text());
            if ($$(collectionBtn).hasClass('icon-collection-active')) {
                info = '添加收藏成功！';
                $$('.user-collection-num').text(++collectionNum);
            } else {
                info = '取消收藏成功！';
                $$('.user-collection-num').text(--collectionNum);
                $$('div[data-page="myCollection"]').find('a[href="./views/buydetail.html?id=' + id + '"]').remove();
            }
            nativeEvent['nativeToast'](1, info);
        }
        f7.hideIndicator();
    }

    collectionBtn.onclick = () => {
        apiCount('btn_favorite');
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
                const buyNum = parseInt($$('.user-buy-num').text()) - 1;
                $$('.other-list-info>a[href="./views/buydetail.html?id=' + id + '"]').remove();
                $$('.user-buy-num').text(buyNum);
                view.router.back();
                view.router.refreshPage();
            }
        })
    }
    currentPage.find('.buydetail-delete-info')[0].onclick = () => {
        apiCount('btn_delete');
        f7.confirm('你确定删除求购信息吗？', '删除发布信息', () => {
            f7.showIndicator();
            customAjax.ajax({
                apiCategory: 'demandInfo',
                header: ['token'],
                parameType: 'application/json',
                api: 'deleteDemandInfo',
                type: 'DELETE',
                val: {
                    id
                },
                noCache: true
            }, deleteCallback);
        })

    }

    //View more current user information
    currentPage.find('.selldetail-userinfo')[0].onclick = () => {
        view.router.load({
            url: 'views/otherIndex.html?id=' + `${id}&currentUserId=${currentUserId}`,
        })
    }

    currentPage.find('.buydetail-call-phone')[0].onclick = () => {
        const { requirementPhone } = demandInfo_;
        apiCount('btn_call');
        requirementPhone && nativeEvent.contactUs(requirementPhone);
    }

    //view cert of new window.
    $$('.selldetail-cert-list').off('click', veiwCert).on('click', veiwCert);

    //share
    // const {device} = f7;
    shareBtn.onclick = () => {
        let title = '';
        let description = '';
        const {
            specifications,
            stock,
            provinceName,
            cityName,
            fishTypeName,
            price,
            imgePath
        } = demandInfo_;

        title += `【求购】${fishTypeName}, ${provinceName||''}${cityName||''}`;
        if(!demandInfo_.title){
            description += stock ? `${'求购数量： ' + stock}，` : '';
            description += price ? `${'价格：' + price}，` : '';
            description += specifications ? `${'规格：' + specifications}，` : '';
            description += '点击查看更多信息~';
        }else{
            description += demandInfo_.title;
        }

        window.shareInfo = {
            title,
            webUrl: `${shareUrl}${id}`,
            imgUrl: imgePath,
            description
        }
        // device.ios ? $$('.share-to-weixin-model').addClass('on') : window.yudada.JS_ToShare.shareInfo(title, description, `${shareUrl}${id}`, title + ',' + description + `${shareUrl}${id}`);
        $$('.share-to-weixin-model').addClass('on');
    }
    lastHeader.find('.right')[0].onclick = detailClickTip;
    // $$('.navbar-inner.detail-text .detail-more').off('click', detailClickTip).on('click', detailClickTip);
}

module.exports = {
    buydetailInit,
}
