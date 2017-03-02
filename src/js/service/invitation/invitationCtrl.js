/**
 * 邀请码
 * Created by domicc on 27/02/2017.
 */

import {isLogin, loginViewShow} from '../../../middlewares/loginMiddle';
import store from '../../../utils/localStorage';
import invitationModel from './InvitationModel';
import config from '../../../config';

function invitationInit(f7, view) {
    const $modalBgInvitation = $$(".modal-bg-invitation");
    const $confirmBtn = $$(".modal-bg-invitation .btn.confirm");
    const $cancelBtn = $$(".modal-bg-invitation .btn.cancel");
    const $text = $$('.modal-bg-invitation .text');
    const $headUrl = $modalBgInvitation.find('.img-user');
    const $nickname = $modalBgInvitation.find('.div-nickname').children('inviter');

    const {
        cancelInvitationNumberKey,
        inviteInfoKey
    } = config;
    let count = store.get(cancelInvitationNumberKey) || 0;

    $cancelBtn.click(() => {
        const cancelInvitationNumber = store.get(cancelInvitationNumberKey);
        store.set(cancelInvitationNumberKey, ++count);
        2 <= cancelInvitationNumber && $modalBgInvitation.removeClass("show");
    });
    invitationModel.f7 = f7;

    const callback = (inviterInfo) => {
        if(inviterInfo && inviterInfo.invitationCode){
            store.set(inviteInfoKey, inviterInfo);
            store.set(cancelInvitationNumberKey, 0);
        }

        const {
            invitationCode,
            inviter,
            headerUrl
        } = store.get(inviteInfoKey) || {};
        if (invitationCode) {
            $headUrl.attr('src', headerUrl);
            $nickname.text(inviter);

            if (isLogin()) {
                $confirmBtn.text("接受邀请");
                $cancelBtn.text("我再想想");
                $text.text("接收邀请之后, 你和好友都将获得靠谱指数5分的奖励");
            } else {
                $confirmBtn.text("现在去登录");
                $cancelBtn.text("我再想想");
                $text.text("登录之后，你和好友都将获得靠谱指数5分的奖励");
            }
            $modalBgInvitation.addClass("show");
        }
        return;
    }

    /**
     * 获取魔窗传递的邀请信息
     * */
    invitationModel.getInviterInfo(callback);
}

function invitationAction() {
    const $confirmBtn = $$(".modal-bg-invitation .btn.confirm");
    const $modalBgInvitation = $$(".modal-bg-invitation");
    $confirmBtn.click(() => {
        const {
            waitAddPointerKey,
            inviteInfoKey
        } = config;
        const inviteInfoCache = store.get(inviteInfoKey) || {};
        const {
            invitationCode
        } = inviteInfoCache;
        if (isLogin()) {
            invitationModel.acceptInvitation(invitationCode, () => {});
            $modalBgInvitation.removeClass("show");
        } else {
            store.set(waitAddPointerKey, 1);
            $modalBgInvitation.removeClass("show");
            loginViewShow();
        }
    })
}

export {invitationInit, invitationAction}
