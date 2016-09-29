import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import { detailClickTip, veiwCert, detailMoreEvent } from '../utils/domListenEvent';

function selldetailInit(f7, view, page) {
    const { id } = page.query;
    let isReleaseForMe = false;
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const certList = currentPage.find('.selldetail-cert-list');
    const shareBtn = $$('.selldetail-footer .icon-share');
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
                user_ishCertificate_list
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

            if (state == 0 || state == 2) {
                $$('.page-selldetail .selldetail-footer').addClass('delete');
                const lastHeader = $$($$('.navbar>div')[$$('.navbar>div').length - 1]);
                lastHeader.find('a.detail-more').hide();
            }
            id == locaUserId && $$('.page-selldetail .selldetail-footer').addClass('share-delete');
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
            html($$('.tabbar-price'), price || '面议', f7);
        }
        f7.hideIndicator();
    }

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfo',
        data: [id],
        val: {
            id
        },
        type: 'get'
    }, callback);

    // dom event;
    currentPage.find('.sell-detail-verify-faild ')[0].onclick = () => {
        f7.alert(errorInfo, '查看原因');
    }

    currentPage.find('.selldetail-call-phone')[0].onclick = () => {
            const { requirementPhone } = demandInfo_;
            requirementPhone && nativeEvent.contactUs(requirementPhone);
        }
        //delete release infomation.
    const deleteCallback = (data) => {
        const { code, message } = data;
        f7.hideIndicator();
        f7.alert(message || '删除成功', '提示', () => {
            if (1 == code) {
                const sellNum = parseInt($$('.user-sell-num').text()) - 1;
                $$('.other-list-info>a[href="./views/selldetail.html?id='+id+'"]').remove();
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
                data: [id, token],
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
    shareBtn.on('click',() => {
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
    })

    $$('.navbar-inner.detail-text .detail-more').off('click', detailClickTip).on('click', detailClickTip);
    $$('.detail-right-more').off('click', detailMoreEvent).on('click', detailMoreEvent);
    //
    // const popupWindow = f7.photoBrowser({
    //     photos: [{
    //         url: 'http://yumaimai.img-cn-qingdao.aliyuncs.com/img/enterprise_authentication/20160727/1469585379903_8431.jpg',
    //         caption: ''
    //     }],
    //     theme: 'dark',
    //     type: 'popup'

    // })
    // $$('.open-cert-button').on('click', () => {
    //     certUrl = 'http://yumaimai.img-cn-qingdao.aliyuncs.com/img/enterprise_authentication/20160727/1469585379903_8431.jpg';
    //     popupWindow.open();
    // })
}

module.exports = {
    selldetailInit,
}
