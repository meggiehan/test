import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { html, saveSelectFishCache } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import { detailClickTip, veiwCert, detailMoreEvent } from '../utils/domListenEvent';
import { isLogin } from '../middlewares/loginMiddle';

function selldetailInit(f7, view, page) {
    const { id } = page.query;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const lastHeader = $$($$('.navbar>div')[$$('.navbar>div').length - 1]);
    const certList = currentPage.find('.selldetail-cert-list');
    const collectionBtn = currentPage.find('.icon-collection-btn')[0];
    const shareBtn = currentPage.find('.icon-share')[0];
    const { shareUrl, cacheUserinfoKey, timeout } = config;
    let demandInfo_;
    let currentUserId;
    let errorInfo;

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
                fishParentTypeName,
                fishTypeId,
                fishParentTypeId,
                state,
                price,
                checkTime,
                imgePath,
                contactName,
                requirementPhone,
                refuseDescribe,
                title,
                descriptionTags,
                quantityTags,
                imgs
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
            lastHeader.find('a.detail-more').show();

            const showStyle = {
                display: '-webkit-box'
            }

            if (state == 0 || state == 2) {
                state == 0 && currentPage.find('.selldetail-footer').addClass('review');
                state == 2 && currentPage.find('.selldetail-footer').addClass('verify');
                lastHeader.find('a.detail-more').hide();
                lastHeader.find('right').css('paddingRight', '3rem');
            }
            id == locaUserId && currentPage.find('.selldetail-footer').addClass('delete');
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && currentPage.addClass(addClassName);
            currentUserId = userInfo['id'];
            // ajax back, edit html.
            const fileName = '?x-oss-process=image/resize,m_fill,h_200,w_400';
            currentPage.find('.sell-detail-img').children('img').attr('src', imgs && JSON.parse(imgs).length && (JSON.parse(imgs)[0] + fileName) || (imgePath + fileName));
            if (!imgs || !JSON.parse(imgs).length) {
                currentPage.find('.sell-detail-img-list').hide();
            }
            imgs && JSON.parse(imgs).length && currentPage.find('.sell-detail-img-list').show();
            currentPage.find('.goods-name').text(fishTypeName);
            currentPage.find('.info-release-time').text(timeDifference(checkTime));
            currentPage.find('.info-price').text(price || '价格面议');
            currentPage.find('.selldetail-price').text(price || '价格面议');
            currentPage.find('.selldetail-address').text(`${provinceName||''}${cityName||''}`);
            currentPage.find('.selldetail-name').text(fishTypeName);

            let specText = quantityTags && JSON.parse(quantityTags).length && (JSON.parse(quantityTags)[0]['tagName'] || '') || '';
            specText && specifications && (specText = `${specText}，${specifications}`);
            (!specText) && specifications && (specText += specifications);
            specText ? currentPage.find('.selldetail-spec').text(specText).parent().css(showStyle) : currentPage.find('.selldetail-spec').parent().hide();

            stock ? currentPage.find('.selldetail-stock').text(stock).parent().css(showStyle) : currentPage.find('.selldetail-stock').parent().hide();
            provinceName ? currentPage.find('.city-name').children('b').text(`${provinceName} ${cityName}`).parent().css(showStyle) : currentPage.find('.city-name').parent().hide();
            describe ? currentPage.find('.selldetail-description').text(describe).parent().css(showStyle) : currentPage.find('.selldetail-description').parent().hide();
            let certHtml = '';
            let tagHtml = '';
            descriptionTags && JSON.parse(descriptionTags).length && $$.each(JSON.parse(descriptionTags), (index, item) => {
                tagHtml += `<span class="iconfont icon-auto-end">${item.tagName}</span>`;
            })
            tagHtml ? html(currentPage.find('.info-tages-list'), tagHtml, f7) : currentPage.find('.info-tages-list').remove();

            $$.each(user_ishCertificate_list.list, (index, item) => {
                const { fish_type_name } = item;
                fishTypeName == fish_type_name && (certHtml += selldetail.cert(item));
            })
            certHtml ? html(certList, certHtml, f7) : certList.parent().remove();
            currentPage.find('.user-name').children('span').text(contactName || '匿名用户');
            level && currentPage.find('.user-name').children('i').addClass(`iconfont icon-v${level}`);
            currentPage.find('.user-tell').children('b').text(requirementPhone);
            currentPage.find('.user-time').text(centerShowTime(lastLoginTime));

            let imgHtml = '';
            imgs && JSON.parse(imgs).length && $$.each(JSON.parse(imgs), (index, item) => {
                imgHtml += `<img data-src="${item}?x-oss-process=image/resize,w_400" src="img/app_icon_108.png" class="lazy" />`
            })
            imgHtml && html(currentPage.find('.info-img-list'), imgHtml, f7);

            1 == enterpriseAuthenticationState && currentPage.find('.sell-detail-auth').children('span').eq(1).addClass('show');
            1 == personalAuthenticationState && currentPage.find('.sell-detail-auth').children('span').eq(0).addClass('show');
            if(personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1){
                currentPage.find('.user-name').css({
                    lineHeight: '5rem',
                    height: '5rem'
                });
                currentPage.find('.user-cert').remove();
                currentPage.find('.sell-detail-auth').remove();
            }
            imgUrl && currentPage.find('.selldetail-user-pic').children('img').attr('src', imgUrl + config['imgPath'](8));
            currentPage.find('.sell-detail-name').children('span').text(title || fishTypeName);
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
        f7.hideIndicator();
        f7.pullToRefreshDone();
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
        apiCount('btn_rejectReason');
        f7.alert(errorInfo, '查看原因');
    }

    currentPage.find('.selldetail-call-phone')[0].onclick = () => {
        const { requirementPhone } = demandInfo_;
        apiCount('btn_call');
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
            let info;
            let collectionNum = Number($$('.user-collection-num').text());
            if ($$(collectionBtn).hasClass('icon-collection-active')) {
                info = '添加收藏成功！';
                $$('.user-collection-num').text(++collectionNum);
            } else {
                info = '取消收藏成功！';
                $$('.user-collection-num').text(--collectionNum);
                $$('div[data-page="myCollection"]').find('a[href="./views/selldetail.html?id=' + id + '"]').remove();
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
                const sellNum = parseInt($$('.user-sell-num').text()) - 1;
                $$('.other-list-info>a[href="./views/selldetail.html?id=' + id + '"]').remove();
                $$('.user-sell-num').text(sellNum);
                view.router.back();
                view.router.refreshPage();
            }
        })
    }
    currentPage.find('.selldetail-delete-info')[0].onclick = () => {
        apiCount('btn_delete');
        f7.confirm('你确定删除出售信息吗？', '删除发布信息', () => {
            f7.showIndicator();
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'deleteDemandInfo',
                header: ['token'],
                parameType: 'application/json',
                val: {
                    id
                },
                type: 'DELETE',
                noCache: true
            }, deleteCallback);
        })
    }

    //View more current user information
    currentPage.find('.view-user-index').on('click', () => {
        view.router.load({
            url: 'views/otherIndex.html?id=' + `${id}&currentUserId=${currentUserId}`,
        })
    })

    //view cert of new window.
    $$('.selldetail-cert-list').off('click', veiwCert).on('click', veiwCert);

    //cat info list img;
    if (currentPage.find('.info-img-list')[0]) {
        currentPage.find('.info-img-list')[0].onclick = (e) => {
            const ele = e.target || window.event.target;
            if (ele.tagName !== 'IMG') {
                return;
            }
            const url = $$(ele).attr('src');
            nativeEvent.catPic(url.replace('400', '700'));
        }
    }

    //share
    shareBtn.onclick = () => {
        let title = '';
        let description = '';
        const shareImg = currentPage.find('.sell-detail-img>img').attr('src');
        const {
            specifications,
            stock,
            provinceName,
            cityName,
            fishTypeName,
            price,
        } = demandInfo_;

        title += `【出售】${fishTypeName}, ${provinceName||''}${cityName||''}`;
        description += stock ? `${'出售数量： ' + stock}，` : '';
        description += price ? `${'价格' + price}，` : '';
        description += specifications ? `${'规格' + specifications}，` : '';
        description += '点击查看更多信息~';
        window.shareInfo = {
            title,
            webUrl: `${shareUrl}${id}`,
            imgUrl: shareImg,
            description
        }
        $$('.share-to-weixin-model').addClass('on');
    }
    lastHeader.find('.right')[0].onclick = detailClickTip;
    // $$('.navbar-inner.detail-text .detail-more').off('click', detailClickTip).on('click', detailClickTip);
    $$('.detail-right-more').off('click', detailMoreEvent).on('click', detailMoreEvent);
}

module.exports = {
    selldetailInit,
}
