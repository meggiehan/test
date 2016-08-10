import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';

function buydetailInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    let isReleaseForMe = false;
    const callback = (data) => {
        if (data.data) {
            const {
                userInfo,
                demandInfo,
            } = data.data;
            const locaUserId = store.get('userId');
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
            } = demandInfo;
            const {
                id,
                enterpriseAuthenticationTime,
                personalAuthenticationState,
                enterpriseAuthenticationState,
                imgUrl
            } = userInfo;
            if (id === locaUserId) {
                isReleaseForMe = true;
                $$('.selldetail-call-delete')
                    .removeClass('icon-share')
                    .html('删除')
                    .addClass('icon-delete');
            }
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

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfo',
        data: [id],
        val: {
            id
        },
        type: 'get'
    }, callback);

    $$('.buydetail-call-delete').click(() => {
        if (isReleaseForMe) {
            console.log('deleter info!');
            return;
        }
        console.log('call number!')
    })
}

module.exports = {
    buydetailInit,
}
