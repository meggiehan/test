import store from '../utils/locaStorage';
import config from '../config';
import { getName, trim } from '../utils/string';
import { getDate } from '../utils/time';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function inviteFriendsInit(f7, view, page) {
    // if(!isLogin()){
    //    	logOut();
    // }
    f7.hideIndicator();
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    const {
        invitationCode,
        inviterNickname,
        inviterPhone,
        invitationLink,
        imgUrl,
        registerCount
    } = userInfo || {
        invitationCode: 'Driver Cai',
        inviterNickname: 'Driver Cai',
        inviterPhone: 13000000000,
        invitationLink: 'http://baidu.com'
    };
    registerCount && ($$('.invite-friends-number').text(registerCount));
    invitationCode && $$('.invite-friends-code-val').text(invitationCode);
    const codeUrl = `http://qr.topscan.com/api.php?text=${invitationLink}${imgUrl ? '&logo=' + imgUrl + config['imgPath'](8) : ''}`;
    const overlay = '<div class="modal-overlay modal-overlay-visible modal-overlay-invite-code"></div>';

    $$('.picker-invite-code-img>img').attr('src', codeUrl);
    const closeInviteModal = () => {
        f7.closeModal('.picker-invite-code');
        $$('.modal-overlay-invite-code').remove();
    }

    //open invite qr code.
    currentPage.find('.invite-friends-share')[0].onclick = () => {
        $$('body').append(overlay);
        f7.pickerModal('.picker-invite-code');
        $$('.modal-overlay-invite-code').on('click', closeInviteModal)
    };
    //close invite qr code.
    $$('.close-picker-invite-code')[0].onclick = closeInviteModal;

    //share to QQ or weixin, message.
    currentPage.find('.invite-friends-share-weixin')[0].onclick = () => {
        const title = '养得好不如卖的好，鱼大大实名认证水产交易平台';
        const messageTile = `好友${inviterNickname || ''}给您的神奇卖鱼工具！对你很有用，赶紧看看吧: ${invitationLink}`;
        const html = '点击查看更多信息！';
        nativeEvent.shareInfo(title, html, invitationLink, messageTile);
    };

    currentPage.find('a.go-invite-friends-list')[0].onclick = () => {
    	if(!registerCount){
    		nativeEvent.nativeToast(0, '你还没有邀请过好友！');
    		return;
    	}
    	view.router.load({
    		url: 'views/inviteFriendsList.html'
    	})
    }
}

module.exports = {
    inviteFriendsInit
}
