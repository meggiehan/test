import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { search } from '../utils/template';


function searchInit(f7, view, page) {
    const $$ = Dom7;
    const {pageSize} = config;
    const input = $$('.search-page-input');
    const clear = $$('b.searchbar-clear');
    const hideVal = $$('.search-val');
    const searchButton = $$('span.search-button');
    const list = $$('.search-return-list');
    let searchVal = '';
    trim(input.val()) &&  hideVal.addClass('on');

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
        hideVal.removeClass('on').find('span').html('');
    })

    setTimeout(function() {
        input.focus();
    }, 500);
    input[0].oninput = () => {
        const val = input.val();
        if (trim(val) === '') {
            hideVal.removeClass('on').find('span').html('');
            clear.removeClass('on');
            html(list, '', f7);
        } else {
            hideVal.addClass('on').find('span').html(`“${val}”`);
            clear.addClass('on');
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

    const hrefFilterPage = () => {
        const val = hideVal.removeClass('on').find('span').html();

        const query = val ? `?keyvalue=${val}&type=2&pageSize=${pageSize}` : '';
        view.router.load({
            url: 'views/filter.html' + query,
            animatePages: true,
        }) 
    }

    //load filter; 
    hideVal.click(hrefFilterPage);

    searchButton.click(hrefFilterPage)
}

module.exports = {
    searchInit
}
