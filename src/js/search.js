import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html } from '../utils/string';
import { search } from '../utils/template';


function searchInit(f7, view, page) {
    const $$ = Dom7;
    const input = $$('.search-page-input');
    const clear = $$('b.searchbar-clear');
    const hideVal = $$('.search-val');
    const list = $$('.search-return-list');
    let searchVal = '';

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
    }, 900);
    input.on('keyup', () => {
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
    })

    //load filter; 
    hideVal.click(() => {
        f7.showIndicator();
        const val = hideVal.removeClass('on').find('span').html();
        view.router.load({
            url: './views/filter.html',
            animatePages: true,
            query:{
                keyvalue: val
            }
        }) 
    })
}

module.exports = {
    searchInit
}
