import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { home } from '../utils/template';
import { html } from '../utils/string';
import { goUser } from '../utils/domListenEvent';
import nativeEvent from '../utils/nativeEvent';
import { getAll } from '../utils/locaStorage';

function homeInit(f7, view, page) {
    f7.hideIndicator();
    const { pageSize } = config;
    let catType = 2;
    if (getAll().length) {
        $$('.ajax-content').show();
        $$('.home-loading').hide();
    }
    /*
     *  When the type is equal to give a value.Execute the following method.
     */
    const callback = (data, err, type) => {
        //cat sell list
        if (catType === 2) {
            if(data.data.list[0]['type'] !== 2){
                return;
            }
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
            if(data.data.list[0]['type'] !== 1){
                return;
            }
            let buyListHtml = '';
            $$.each(data.data.list, (index, item) => {
                buyListHtml += home.buy(item);
            })

            html($$('.buy-list-foreach'), buyListHtml, f7);
        }
        if (data.data && data.data.list && catType === 2) {
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

    //go home page;
    $$('.href-go-user').off('click', goUser).on('click', goUser);
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        })
    })
}

module.exports = {
    homeInit
}
