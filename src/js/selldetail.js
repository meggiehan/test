import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/localStorage';
import {selldetail} from '../utils/template';
import {timeDifference, centerShowTime} from '../utils/time';
import {html, saveSelectFishCache, getRange, getAddressIndex, alertTitleText} from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import {detailClickTip, veiwCert} from '../utils/domListenEvent';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';

function selldetailInit (f7, view, page){
    const {id} = page.query;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const lastHeader = $$($$('.view-main .navbar>div')[$$('.view-main .navbar>div').length - 1]);
    const certList = currentPage.find('.selldetail-cert-list');
    const collectionBtn = currentPage.find('.icon-collection-btn')[0];
    const shareBtn = currentPage.find('.icon-share')[0];
    const {shareUrl, cacheUserInfoKey, mWebUrl} = config;
    let demandInfo_;
    let currentUserId;
    let errorInfo;

    if(!window['addressObj']){
        nativeEvent.getAddress();
    }

    /*
    * 拿到数据，编辑页面
    * */
    const callback = (data) => {
        if (data.data){
            const {
                userInfo,
                demandInfo,
                // eslint-disable-next-line
                user_ishCertificate_list,
                favorite
            } = data.data;
            const locaUserId = store.get(cacheUserInfoKey) && store.get(cacheUserInfoKey)['id'];
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
                imgePath,
                contactName,
                requirementPhone,
                refuseDescribe,
                title,
                descriptionTags,
                quantityTags,
                imgs,
                sort,
                userId
            } = demandInfo;
            const {
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
            };

            const {lat, lng} = getAddressIndex(provinceName, cityName);
            const rangeText = getRange(lat, lng);
            if (rangeText > -1){
                rangeText > 200
                    ? currentPage.find('.city-distance').addClass('show').html(`| 距离你<i>${rangeText}</i>公里`)
                    : currentPage.find('.city-distance').addClass('show').text('| 离你很近');
            }

            if (state == 0 || state == 2){
                state == 0 && currentPage.find('.selldetail-footer').addClass('review');
                state == 2 && currentPage.find('.selldetail-footer').addClass('verify');
                lastHeader.find('a.detail-more').hide();
                lastHeader.find('right').css('paddingRight', '3rem');
            }
            userId == locaUserId && currentPage.find('.selldetail-footer').addClass('delete');
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && currentPage.addClass(addClassName);
            currentUserId = userInfo['id'];
            // ajax back, edit html.
            const fileName = '?x-oss-process=image/resize,m_fill,h_200,w_400';
            currentPage.find('.sell-detail-img').children('img').attr('src', imgs && JSON.parse(imgs).length && (JSON.parse(imgs)[0] + fileName) || (imgePath + fileName));
            if (!imgs || !JSON.parse(imgs).length){
                currentPage.find('.sell-detail-img-list').hide();
            }
            imgs && JSON.parse(imgs).length && currentPage.find('.sell-detail-img-list').show();
            currentPage.find('.goods-name').text(fishTypeName);
            currentPage.find('.info-release-time').text(timeDifference(sort));
            currentPage.find('.info-price').text(price || '价格面议');
            currentPage.find('.selldetail-price').text(price || '价格面议');
            currentPage.find('.selldetail-address').text(`${provinceName || ''}${cityName || ''}`);
            currentPage.find('.selldetail-name').text(fishTypeName);

            let specText = quantityTags && JSON.parse(quantityTags).length && (JSON.parse(quantityTags)[0]['tagName'] || '') || '';
            specText && specifications && (specText = `${specText}，${specifications}`);
            (!specText) && specifications && (specText += specifications);
            specText ? currentPage.find('.selldetail-spec').text(specText).parent().css(showStyle) : currentPage.find('.selldetail-spec').parent().hide();

            stock ? currentPage.find('.selldetail-stock').text(stock).parent().css(showStyle) : currentPage.find('.selldetail-stock').parent().hide();
            provinceName ? currentPage.find('.city-name').children('b').text(`${provinceName} ${cityName}`).parent().css({display: 'inline-block'}) : currentPage.find('.city-name').parent().hide();
            describe ? currentPage.find('.selldetail-description').text(describe).parent().css(showStyle) : currentPage.find('.selldetail-description').parent().hide();
            let certHtml = '';
            let tagHtml = '';
            descriptionTags && JSON.parse(descriptionTags).length && $$.each(JSON.parse(descriptionTags), (index, item) => {
                tagHtml += `<span class="iconfont icon-auto-end">${item.tagName}</span>`;
            });
            tagHtml ? html(currentPage.find('.info-tages-list'), tagHtml, f7) : currentPage.find('.info-tages-list').remove();

            // eslint-disable-next-line
            $$.each(user_ishCertificate_list.list, (index, item) => {
                // eslint-disable-next-line
                const {fish_type_name} = item;
                // eslint-disable-next-line
                fishTypeName == fish_type_name && (certHtml += selldetail.cert(item));
            });
            certHtml ? html(certList, certHtml, f7) : certList.parent().remove();
            currentPage.find('.user-name').children('span').text(contactName || '匿名用户');
            level && currentPage.find('.user-name').children('i').addClass(`iconfont icon-v${level}`);
            currentPage.find('.user-tell').children('b').text(requirementPhone);
            currentPage.find('.user-time').text(centerShowTime(lastLoginTime));

            let imgHtml = '';
            imgs && JSON.parse(imgs).length && $$.each(JSON.parse(imgs), (index, item) => {
                imgHtml += `<img data-src="${item}?x-oss-process=image/resize,w_400" src="img/app_icon_108.png" class="lazy" />`;
            });
            imgHtml && html(currentPage.find('.info-img-list'), imgHtml, f7);

            1 == enterpriseAuthenticationState && currentPage.find('.sell-detail-auth').children('span').eq(1).addClass('show');
            1 == personalAuthenticationState && currentPage.find('.sell-detail-auth').children('span').eq(0).addClass('show');
            if (personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1){
                currentPage.find('.user-name').css({
                    lineHeight: '5rem',
                    height: '5rem'
                });
                currentPage.find('.user-cert').remove();
                currentPage.find('.sell-detail-auth').remove();
            }
            imgUrl && currentPage.find('.selldetail-user-pic').children('img').attr('src', imgUrl + config['imgPath'](8));
            currentPage.find('.sell-detail-name').children('span').text(title || fishTypeName);
            if (isLogin()){
                if (favorite){
                    $$(collectionBtn).removeClass('icon-collection').addClass('icon-collection-active');
                } else {
                    $$(collectionBtn).addClass('icon-collection').removeClass('icon-collection-active');
                }
            }

            /*
             * 存入最近使用鱼种
             * */
            saveSelectFishCache({
                name: fishTypeName,
                id: fishTypeId,
                // eslint-disable-next-line
                parant_id: fishParentTypeId,
                // eslint-disable-next-line
                parant_name: fishParentTypeName
            });
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
    };

    /*
    * 样式兼容
    * */
    const {ios} = window.currentDevice;
    ios && (currentPage.find('.selldetail-footer').addClass('safira'));

    /*
    * 初始化获取数据跟刷新数据
    * */
    const ptrContent = currentPage.find('.sell-detail-refresh');
    const initData = () => {
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfo',
            data: [id],
            header: ['token'],
            val: {
                id
            },
            type: 'get',
            isMandatory: false
        }, callback);
    };
    initData();
    ptrContent.on('refresh', initData);

    /*
    * 查看审核不通过message
    * */
    currentPage.find('.sell-detail-verify-faild ')[0].onclick = () => {
        apiCount('btn_rejectReason');
        f7.alert(errorInfo, '查看原因');
    };

    /*
    * 点击打电话，判断是否登录状态
    * */
    currentPage.find('.selldetail-call-phone')[0].onclick = () => {
        // if (!isLogin()) {
        //     f7.modal({
        //         title: '友情提示',
        //         text: weixinData ? '绑定手机号后，可以使用全部功能!' : '为了保证信息安全，请登录后拨打电话',
        //         buttons: [
        //             {
        //                 text: '我再想想',
        //                 onClick: () => {
        //                 }
        //             },
        //             {
        //                 text: '安全登录',
        //                 onClick: loginViewShow
        //             }
        //         ]
        //     })
        //     return;
        // }
        const {requirementPhone} = demandInfo_;
        apiCount('btn_call');
        requirementPhone && nativeEvent.contactUs(requirementPhone);
    };

    /*
    * 点击收藏信息
    * */
    const collectionCallback = (data) => {
        const {code} = data;
        if (8 == code){
            nativeEvent['nativeToast'](0, '您已收藏过该资源!');
        } else if (1 !== code){
            const info = $$(collectionBtn).hasClass('icon-collection-active') ? '添加收藏失败，请重试！' : '取消收藏失败，请重试！';
            nativeEvent['nativeToast'](0, info);
            $$(collectionBtn).toggleClass('icon-collection-active').toggleClass('icon-collection');
        } else {
            let info;
            let collectionNum = Number($$('.user-collection-num').text());
            if ($$(collectionBtn).hasClass('icon-collection-active')){
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
    };

    collectionBtn.onclick = () => {
        apiCount('btn_favorite');
        if (!nativeEvent['getNetworkStatus']()){
            nativeEvent.nativeToast(0, '请检查您的网络！');
            f7.pullToRefreshDone();
            f7.hideIndicator();
            return;
        }
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
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
    };

    /*
    * 删除自己发布的信息
    * */
    const deleteCallback = (data) => {
        const {code, message} = data;
        f7.hideIndicator();
        f7.alert(message || '删除成功', '提示', () => {
            if (1 == code){
                const sellNum = parseInt($$('.user-sell-num').eq($$('.user-sell-num').length - 1).text(), 10) - 1;
                $$('.page-my-list a[href="./views/selldetail.html?id=' + id + '"]').next('div.list-check-status').remove();
                $$('.page-my-list a[href="./views/selldetail.html?id=' + id + '"]').remove();
                $$('.user-sell-num').text(sellNum <= 0 ? 0 : sellNum);
                view.router.back();
                view.router.refreshPage();
            }
        });
    };
    currentPage.find('.selldetail-delete-info')[0].onclick = () => {
        apiCount('btn_delete');
        f7.confirm('你确定删除出售信息吗？', '删除发布信息', () => {
            f7.showIndicator();
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'deleteDemandInfo',
                header: ['token'],
                paramsType: 'application/json',
                val: {
                    id
                },
                type: 'DELETE',
                noCache: true
            }, deleteCallback);
        });
    };

    /*
    * 跳转至个人主页
    * */
    currentPage.find('.view-user-index').on('click', () => {
        view.router.load({
            url: 'views/otherIndex.html?id=' + `${id}&currentUserId=${currentUserId}`
        });
    });

    /*
    * 查看鱼类资质证书
    * */
    currentPage.find('.selldetail-cert-list').off('click', veiwCert).on('click', veiwCert);

    /*
    * 查看上传的图片，调用native组件，可放大缩小
    * */
    if (currentPage.find('.info-img-list')[0]){
        currentPage.find('.info-img-list')[0].onclick = (e) => {
            const ele = e.target || window.event.target;
            if (ele.tagName !== 'IMG'){
                return;
            }
            const url = $$(ele).attr('src');
            nativeEvent.catPic(url.replace('400', '700'));
        };
    }

    /*
    * 分享信息
    * */
    shareBtn.onclick = () => {
        if (!store.get('isWXAppInstalled')){
            f7.alert('分享失败');
            return;
        }
        let title = '';
        let description = '';
        const shareImg = currentPage.find('.sell-detail-img>img').attr('src');
        const {
            specifications,
            stock,
            provinceName,
            cityName,
            fishTypeName,
            price
        } = demandInfo_;

        title += `【出售】${fishTypeName}, ${provinceName || ''}${cityName || ''}`;
        if (!demandInfo_.title){
            description += stock ? `${'出售数量： ' + stock}，` : '';
            description += price ? `${'价格：' + price}，` : '';
            description += specifications ? `${'规格：' + specifications}，` : '';
            description += '点击查看更多信息~';
        } else {
            description += demandInfo_.title;
        }
        window.shareInfo = {
            title,
            webUrl: `${shareUrl}${id}`,
            imgUrl: shareImg,
            description
        };
        $$('.share-to-weixin-model').addClass('on');
    };

    /*
    * 点击右上角nav，选择分享或者举报
    * */
    lastHeader.find('.detail-more')[0].onclick = detailClickTip;

    /**
     * 提升靠谱指数
     */
    currentPage.find('.info-detail-go-member').find('span').click(() => {
        if(!isLogin()){
            f7.alert(alertTitleText(), loginViewShow);
            return;
        }
        apiCount('btn_infoDetail_myMember');
        const userInfo = store.get(cacheUserInfoKey);
        mainView.router.load({
            url: `${mWebUrl}user/member/${userInfo.id}?time=${new Date().getTime()}`
        });
    });
}

export {
    selldetailInit
};
