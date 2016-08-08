import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { home } from '../utils/template';
import { html } from '../utils/string';

function homeInit(f7, view, page) {
    const { pageSize } = config;
    const $$ = Dom7;
    let catType = 2;

    /*
     *  When the type is equal to give a value.Execute the following method.
     */

    const callback = (data, err, type) => {
        if (err) {
            f7.alert('请求失败,请重新发送请求!');
            return;
        }
        //cat sell list
        if (catType === 2) {
            let catListHtml = '';
            $$.each(data.data.list, (index, item) => {
                catListHtml += home.cat(item);
            })

            html($$('.cat-list-foreach'), catListHtml, f7);
            $$('.ajax-content').show(200);
            $$('.home-loading').hide(100);
        }
        //cat buy list
        if (catType === 1) {
            let butListHtml = '';
            $$.each(data.data.list, (index, item) => {
                butListHtml += home.buy(item);
            })

            html($$('.buy-list-foreach'), butListHtml, f7);
        }
        if (data.data && data.data.list && type && catType === 2) {
            catType = 1;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfoList',
                data: ["", "", 1, "", 10, 1],
                type: 'get'
            }, callback);
        }

        //pull to refresh done.
        f7.pullToRefreshDone();
        $$('img.lazy').trigger('lazy');
    }

    /*
     * initialization home page and send ajax to get list data.
     */
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'getDemandInfoList',
        data: ["", "", 2, "", 10, 1],
        type: 'get'
    }, callback);

    // pull to refresh.
    const ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        catType = 2;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfoList',
            data: ["", "", 2, "", 10, 1],
            type: 'get',
            isMandatory: true
        }, callback);
    })

    //load filter; 
    $$('.home-chushou').click(() => {
        f7.showIndicator();
        view.router.load({
            url: './views/filter.html',
            animatePages: true,
            query:{
                pageSize,
                type: 2
            }
        }) 
    })


}

module.exports = {
    homeInit
}
