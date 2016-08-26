import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import store from '../utils/locaStorage';
import { search } from '../utils/template';
import {setHistory} from '../utils/viewsUtil/searchUtils';


function searchInit(f7, view, page) {
    const $$ = Dom7;
    const {pageSize, cacheHistoryKey} = config;
    const input = $$('.search-page-input');
    const clear = $$('b.searchbar-clear');
    const hideVal = $$('.search-val');
    const searchButton = $$('span.search-button');
    const list = $$('.search-return-list');
    const searchContent = $$('.search-content');
    let searchVal = '';
    trim(input.val()) &&  searchButton.addClass('on');

    const callback = (data) => {
        let listHtml = '';
        if (!data.data.length) {
            html(list, listHtml, f7);
            return;
        }

        $$.each(data.data, (index, item) => {
            listHtml += search.link(item);
        })
        html(list, listHtml, f7);
    }

    clear.on('click', () => {
        input.val('');
        clear.removeClass('on');
        hideVal.find('span').html('');
        searchContent.removeClass('on');
        $$('.serch-history').show();
    })

    setTimeout(function() {
        input.focus();
    }, 500);
    input[0].oninput = () => {
        const val = input.val();
        if (!trim(val)) {
            hideVal.find('span').html('');
            $$('.serch-history').show();
            clear.removeClass('on');
            html(list, '', f7);
        } else {
            hideVal.find('span').html(`“${val}”`);
            searchContent.addClass('on');
            clear.addClass('on');
            $$('.serch-history').hide();
        }

        if (trim(searchVal) !== trim(val) && trim(val) !== '') {
            searchVal = val;

            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getFishTypeList/5',
                data: [val],
                type: 'get',
                noCache: true
            }, callback)
        }
    }
    // input.on('propertychange', () => {
        
    // })
    //search list render;
    const searchHistoryMetadata = store.get(cacheHistoryKey);
    if(searchHistoryMetadata && searchHistoryMetadata.length){
        let listStr = '';
        $$.each(searchHistoryMetadata, (index, item) => {
            if(!item){
                return;
            }
            listStr += search.historyLink(item);
        })
        html($$('.search-history-list'), listStr, f7);
        listStr ? $$('.serch-history').show() : $$('.serch-history').hide();
    }
    //clear history cache;
    $$('.search-clear-history')[0].onclick = () => {
        store.remove(cacheHistoryKey);
        $$('.serch-history').hide()
    }

    const hrefFilterPage = () => {
        const val = hideVal.find('span').html();
        searchContent.removeClass('on');
        const query = val ? `?keyvalue=${val}&type=2&pageSize=${pageSize}` : '';
        view.router.load({
            url: 'views/filter.html' + query,
        }) 
        setHistory(val);
    }

    //load filter; 
    hideVal.click(hrefFilterPage);

    searchButton.click(hrefFilterPage)
}

module.exports = {
    searchInit
}
