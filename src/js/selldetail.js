import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/locaStorage';
import { selldetail } from '../utils/template';
import { timeDifference, centerShowTime } from '../utils/time';
import { home } from '../utils/template';
import { html } from '../utils/string';

function selldetailInit(f7, view, page) {
    const $$ = Dom7;
    const { id } = page.query;
    let isReleaseForMe = false;
    const certList = $$('.selldetail-cert-list');
    // let certUrl;
    const callback = (data) => {
        if (data.data) {
            const {
                userInfo,
                business_license_url,
                demandInfo,
                user_ishCertificate_list
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
                imgePath,
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
                fishTypeName === fish_type_name && (certHtml += selldetail.cert(item));
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
    $$('.selldetail-call-delete').click(() => {
        if (isReleaseForMe) {
            console.log('deleter info!');
            return;
        }
        console.log('call number!')
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
