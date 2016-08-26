import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function selldetailInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    let isReleaseForMe = false;
    const certList = $$('.selldetail-cert-list');
    const shareBtn = $$('.selldetail-footer .icon-share');
    const { shareUrl, cacheUserinfoKey } = config;
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
                createTime,
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
                imgUrl
            } = userInfo;
            demandInfo_ = demandInfo;

            if (id == locaUserId || state == 0 || state == 2) {
                $$('.page-selldetail .selldetail-footer').addClass('delete');
            }
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && ($$('.page-selldetail').addClass(addClassName));
            currentUserId = userInfo['id'];
            1 == state && ($$('.page-selldetail').addClass('active'));
            // ajax back, edit html.
            $$('.selldetail-info>.first img').attr('src', imgePath + config['imgPath'](11));
            html($$('.page-selldetail .goods-name'), fishTypeName, f7);
            html($$('.page-selldetail .goods-create-time'), timeDifference(createTime), f7);
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
            html($$('.page-selldetail .user-name'), contactName || '匿名用户', f7);
            html($$('.page-selldetail .user-tell>b'), requirementPhone, f7);
            html($$('.page-selldetail .user-time'), centerShowTime(enterpriseAuthenticationTime), f7);
            personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1 && $$('.user-cert').remove();
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
    $$('.sell-detail-verify-faild ')[0].onclick = () => {
        f7.alert(errorInfo, '提示');
    }

    $$('.selldetail-call-phone')[0].onclick = () => {
        const { requirementPhone } = demandInfo_;
        requirementPhone && nativeEvent.contactUs(requirementPhone);
    }
    //delete release infomation.
    const deleteCallback = (data) => {
        const {code, message} = data;
        f7.alert(message, '提示', () => {
            if(1 == code){
                view.router.load({
                    url: "views/user.html",
                    // reload: true
                })
            }
        })
    }
    $$('.selldetail-delete-info')[0].onclick = () => {
        const token = store.get(cacheUserinfoKey)['token'];
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'deleteDemandInfo',
            data: [id, token],
            val: {
                id
            },
            type: 'post'
        }, deleteCallback);

    }

    //View more current user information
    $$('.cat-user-info').on('click', () => {
        view.router.load({
            url: 'views/otherIndex.html?id=' + `${id}&currentUserId=${currentUserId}`,
        })
    })

    //view cert of new window.
    $$('.selldetail-cert-list').on('click', (e) => {
        const event = e || window.event;
        const ele = e.target;
        const classes = ele.className;
        if (classes.indexOf('open-cert-button') > -1) {
            const url = $$(ele).attr('data-url');
            nativeEvent.catPic(url);
        }
    })

    //share
    shareBtn.on('click', () => {
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

        title += `【求购】${fishTypeName}, ${provinceName||''}${cityName||''}`;
        messageTile += `我在鱼大大看到求购信息${fishTypeName}，`;
        messageTile += stock ? `${'库存 ' + stock}，` : '';
        messageTile += price ? `${'价格' + price}，` : '';
        messageTile += specifications ? `${'规格' + specifications}` : '';
        messageTile += `，对你很有用，赶紧看看吧: ${url_}`;
        html += `求购 ${fishTypeName}，`;
        html += stock ? `${'库存 ' + stock}，` : '';
        html += price ? `${'价格' + price}，` : '';
        html += specifications ? `${'规格' + specifications}，` : '';
        html += '点击查看更多信息~';
        nativeEvent.shareInfo(title, html, url_, messageTile);
    })

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
