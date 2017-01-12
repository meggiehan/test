import store from '../utils/locaStorage';
import config from '../config';
import { getName, trim, html } from '../utils/string';
import { invite } from '../utils/template';
import { getDate } from '../utils/time';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function inviteFriendsListInit(f7, view, page) {
    if (!isLogin()) {
        logOut();
    }
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const { cacheUserinfoKey } = config;
    const pageSize = config['pageSize'];
    let pageNo = 1;
    const userInfo = store.get(cacheUserinfoKey);
    const callback = (data) => {
    	const {code, message} = data;
        if(1 == code){
        	let str = '';
        	$$.each(data.data.records, (index, item) => {
        		str += invite.inviteList(item, data.data.records.length-1 === index);
        	})
        	$$('.invite-friends-total').text(data.data.records.length);
        	html($$('.invite-friends-list'), str, f7);
        }else{
        	f7.alert(message, '温馨提示');
        }
    }

    customAjax.ajax({
        apiCategory: 'invite',
        api: 'users',
        data: ['', ''],
        header: ['token'],
        // parameType: 'application/json',
        type: 'get',
        noCache: true,
    }, callback);

}

module.exports = {
    inviteFriendsListInit
}
