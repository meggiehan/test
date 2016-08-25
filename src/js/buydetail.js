import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';

function buydetailInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    const shareBtn = $$('.selldetail-footer .icon-share');
    let isReleaseForMe = false;
    let demandInfo_;
    const { shareUrl, cacheUserinfoKey } = config;
    let currentUserId;
    let errorInfo;

    const callback = (data) => {
        if (data.data) {
            const {
                userInfo,
                demandInfo,
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
                createTime,
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
                imgUrl
            } = userInfo;
            demandInfo_ = demandInfo;
            if (id == locaUserId || state == 0 || state == 2) {
                $$('.page-buydetail .selldetail-footer').addClass('delete');
            }
            errorInfo = refuseDescribe;
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && ($$('.page-buydetail').addClass(addClassName));
            currentUserId = userInfo['id'];
            html($$('.page-buydetail .goods-name'), fishTypeName, f7);
            html($$('.page-buydetail .goods-create-time'), timeDifference(createTime), f7);
            html($$('.page-buydetail .selldetail-price'), price || '面议', f7);
            specifications ? html($$('.selldetail-spec'), specifications, f7) : $$('.selldetail-spec').parent().remove();
            stock ? html($$('.selldetail-stock'), stock, f7) : $$('.selldetail-stock').parent().remove();
            provinceName ? html($$('.selldetail-address'), `${provinceName} ${cityName}`, f7) : $$('.selldetail-address').parent().remove();
            describe ? html($$('.selldetail-description'), describe, f7) : $$('.selldetail-description').parent().remove();
            html($$('.page-buydetail .user-name'), contactName || '匿名用户', f7);
            html($$('.page-buydetail .user-tell>b'), requirementPhone, f7);
            html($$('.page-buydetail .user-time'), centerShowTime(enterpriseAuthenticationTime), f7);
            personalAuthenticationState !== 1 && enterpriseAuthenticationState !== 1 && $$('.user-cert').remove();
            imgUrl && $$('.selldetail-userinfo img').attr('src', imgUrl);
            html($$('.tabbar-price'), price || '面议', f7);
        }
        f7.hideIndicator(300);
    }

    $$('.buy-detail-verify-faild ')[0].onclick = () => {
        f7.alert(errorInfo, '提示');
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
    $$('.buydetail-delete-info')[0].onclick = () => {
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

    $$('.buydetail-call-phone')[0].onclick = () => {
        const { requirementPhone } = demandInfo_;
        requirementPhone && nativeEvent.contactUs(requirementPhone);
    }

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

        title += `【出售】${fishTypeName}, ${provinceName||''}${cityName||''}`;
        messageTile += `我在鱼大大看到出售信息${fishTypeName||''}，` +
            stock ? `${'库存 ' + stock}，` : '' +
            price ? `${'价格' + price}，` : '' +
            specifications ? `${'规格' + specifications}，`  : ''+
            `，对你很有用，赶紧看看吧: ${url_}`;
        html += `出售${fishTypeName},` +
                stock ? `${'库存 ' + stock}，` : '' +
                price ? `${'价格' + price}，` : '' +
                specifications ? `${'规格' + specifications}，` : '' +
                '点击查看更多信息~';
        nativeEvent.shareInfo(title, html, url_, messageTile);
    })
}

module.exports = {
    buydetailInit,
}
