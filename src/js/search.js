import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import store from '../utils/locaStorage';
import { search } from '../utils/template';
import { setHistory } from '../utils/viewsUtil/searchUtils';


function searchInit(f7, view, page) {
    const { type } = page.query;
    const release = page.query['release'] && (page.query['release'] === 'false' ? false : page.query['release']);
    const { pageSize, cacheHistoryKey } = config;
    const input = $$('.search-page-input');
    const clear = $$('b.searchbar-clear');
    const hideVal = $$('.search-val');
    const searchButton = $$('span.search-button');
    const list = $$('.search-return-list');
    const searchContent = $$('.search-content');
    const emptyInfo = $$('.search-empty-result');
    const searchHistoryMetadata = store.get(cacheHistoryKey);
    let searchVal = '';
    !release && trim(input.val()) && searchButton.addClass('on');

    const callback = (data) => {
        let listHtml = '';
        release && input.val() && (!data.data.length ? emptyInfo.show() : emptyInfo.hide());
        if (!data.data.length) {
            html(list, listHtml, f7);
            return;
        }

        $$.each(data.data, (index, item) => {
            listHtml += search.link(item, release, type);
        })
        html(list, listHtml, f7);

    }

    clear.on('click', () => {
        input.val('');
        clear.removeClass('on');
        hideVal.find('span').html('');
        searchContent.removeClass('on');
        html(list, '', f7);
        emptyInfo.hide();
        searchHistoryMetadata && searchHistoryMetadata.length && !release && $$('.serch-history').show();
    })

    setTimeout(function() {
        input.focus();
    }, 500);

    input[0].oninput = () => {
        const val = input.val();
        if (!trim(val)) {
            clear.trigger('click');
            !release && $$('.serch-history').show();
            html(list, '', f7);
        } else {
            hideVal.find('span').html(`“${val}”`);
            !release && searchContent.addClass('on');
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

    //search list render;
    if (searchHistoryMetadata && searchHistoryMetadata.length) {
        let listStr = '';
        $$.each(searchHistoryMetadata, (index, item) => {
            if (!item) {
                return;
            }
            listStr += search.historyLink(item);
        })
        html($$('.search-history-list'), listStr, f7);
        !release && listStr && !input.val() ? $$('.serch-history').show() : $$('.serch-history').hide();
        !release && input.val() && searchContent.addClass('on');
        input.val() && (hideVal.find('span')[0].innerText = `“${trim(input.val())}”`);
    }
    //clear history cache;
    $$('.search-clear-history').on('click', () => {
        store.remove(cacheHistoryKey);
        $$('.serch-history').hide()
    })

    let isClick = false;
    let hrefFilterPage = () => {
        if (isClick) {
            return;
        }
        isClick = true;
        const val = hideVal.find('span').html();
        searchContent.removeClass('on');
        const query = val ? `?keyvalue=${val}&type=2&pageSize=${pageSize}&search=true` : '';
        view.router.load({
            url: 'views/filter.html' + query,
            animatePages: true
        })
        setHistory(val);
        setTimeout(() => { isClick = false }, 100)

    }

    //load filter; 
    hideVal.click(hrefFilterPage);

    searchButton.click(hrefFilterPage);

    input[0].onkeypress = (e) => {
        const event = e || window.event;
        const code = event.keyCode || event.which || event.charCode;
        if (code == 13) {
            event.preventDefault();
            if (release) {
                return;
            }
            input[0].blur();
            searchButton.trigger('click');
            return;
        }
    }

    //From the release page to jump over the processing;
    if (release) {
        $$('.search-header').addClass('release-select');
    }

}

module.exports = {
    searchInit
}
