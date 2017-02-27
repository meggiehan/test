import userUtils from '../utils/viewsUtil/userUtils';
import { cancleIndividual, canclCompany } from '../utils/domListenEvent';
import store from '../utils/localStorage';
import config from '../config';
import customAjax from '../middlewares/customAjax';
import { trim, html, getTagInfo } from '../utils/string';
import { search, releaseInfo } from '../utils/template';

function releaseSelectTagInit(f7, view, page) {
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    let isSend = false;
    f7.hideIndicator();

    let specListHtml = '';
    if(window.realeseInfomation.fishParentTypeName == '水产苗种'){
        $$.each(getTagInfo()['specList'], (index, item) => {
            specListHtml += releaseInfo.tag(item);
        })
    }else{
        $$.each(getTagInfo()['adultFishTags'], (index, item) => {
            specListHtml += releaseInfo.tag(item);
        })
    }

    html(currentPage.find('.tag-list'), specListHtml, f7);

    currentPage.find('.tag-list')[0].onclick = (e) => {
        apiCount('btn_text_tagCheck_select')
        const ele = e.target || window.event.target;
        if (ele.tagName !== 'SPAN') {
            return;
        }
        currentPage.find('.tag-list').children('span').removeClass('on');
        ele.className = 'on';
        window.realeseInfomation.quantityTags[0] = {};
        window.realeseInfomation.quantityTags[0].id = Number($$(ele).attr('data-id'));
        window.realeseInfomation.quantityTags[0].tagName = $$(ele).text();
    }

    const callback = (data) => {
        const { code, message } = data;
        const {type, fishTypeId, fishTypeName, requirementPhone} = window.realeseInfomation;
        apiCount('btn_text_tagCheck_next');
        if (1 == code) {
            window['releaseInfo'] = data['data'];
            view.router.load({
                url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishTypeId}&fishName=${fishTypeName}&phone=${requirementPhone}`,
            })
        } else {
            f7.hideIndicator();
        }
    }

    currentPage.find('.release-tag-sub')[0].onclick = () => {
    	if(isSend){
    		return;
    	}
    	isSend = true;
    	setTimeout(() => {isSend = false}, 500);

    	f7.showIndicator();
        customAjax.ajax({
            apiCategory: 'demandInfoAdd',
            header: ['token'],
            parameType: 'application/json',
            data: window.realeseInfomation,
            type: 'post',
            isMandatory: true,
            noCache: true
        }, callback);
    }
}

module.exports = {
    releaseSelectTagInit,
}
