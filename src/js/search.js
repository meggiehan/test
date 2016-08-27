import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import store from '../utils/locaStorage';
import { search } from '../utils/template';
import { setHistory } from '../utils/viewsUtil/searchUtils';


function searchInit(f7, view, page) {
    console.log(page.name);
    const { pageSize, cacheHistoryKey } = config;
    const input = $$('.search-page-input');
    const clear = $$('b.searchbar-clear');
    const hideVal = $$('.search-val');
    const searchButton = $$('span.search-button');
    const list = $$('.search-return-list');
    const searchContent = $$('.search-content');
    let searchVal = '';
    trim(input.val()) && searchButton.addClass('on');

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
                hideVal.hide().find('span').html('');
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
    if (searchHistoryMetadata && searchHistoryMetadata.length) {
        let listStr = '';
        $$.each(searchHistoryMetadata, (index, item) => {
            if (!item) {
                return;
            }
            listStr += search.historyLink(item);
        })
        html($$('.search-history-list'), listStr, f7);
        listStr && !input.val() ? $$('.serch-history').show() : $$('.serch-history').hide();
        input.val() && searchContent.addClass('on');
        input.val() && (hideVal.find('span')[0].innerText = `“${trim(input.val())}”`);
    }
    //clear history cache;
    $$('.search-clear-history').on('click',() => {
        store.remove(cacheHistoryKey);
        $$('.serch-history').hide()
    })

    let isClick = false;
    let hrefFilterPage = () => {
        if(isClick){
            return;
        }
        isClick = true;
        const val = hideVal.find('span').html();
        searchContent.removeClass('on');
        const query = val ? `?keyvalue=${val}&type=2&pageSize=${pageSize}&search=true` : '';
        view.router.load({
            url: 'views/filter.html' + query,
            // reload: true,
            animatePages: true
        })
        setHistory(val);
        setTimeout(() => {isClick = false}, 100)
    }

    //load filter; 
    hideVal.click(hrefFilterPage);

    searchButton.click(hrefFilterPage);
    input[0].onkeypress = (event) => {
        const code = event.keyCode || event.which || event.charCode;
        if (code == 13) {
            input[0].blur();
            searchButton.trigger('click');
            return;
        }
    }
}

module.exports = {
    searchInit
}
