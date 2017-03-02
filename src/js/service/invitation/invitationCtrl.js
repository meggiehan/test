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
    let count = store.get("count-invitation");
    const {
        cancelInvitationNumberKey,
        waitAddPointerKey,
        inviteInfoKey
    } = config;


    $cancelBtn.click(() => {
        const cancelInvitationNumber = store.get(cancelInvitationNumberKey);
        store.set(cancelInvitationNumberKey, ++count);
        3 <= cancelInvitationNumber && $modalBgInvitation.removeClass("show");
    });
    invitationModel.f7 = f7;

    const callback = (inviterInfo) => {
        inviterInfo && store.set(cancelInvitationNumberKey, 0);
        const inviteInfoCache = store.get(inviteInfoKey);
        if ((inviterInfo && inviterInfo.inviterId) || (inviteInfoCache && inviteInfoCache.inviterId)) {
            store.set(inviteInfoKey, inviterInfo);
            if (isLogin()) {
                $confirmBtn.text("接受邀请");
                $cancelBtn.text("我再想想");
                $text.text("接收邀请之后, 你和好友都将获得靠谱指数5分的奖励");
                $confirmBtn.click(() => {
                    invitationModel.acceptInvitation(inviterInfo.code);
                    $modalBgInvitation.removeClass("show");
                });
            } else {
                $confirmBtn.text("现在去登录");
                $cancelBtn.text("我再想想");
                $text.text("登录之后，你和好友都将获得靠谱指数5分的奖励");
                $confirmBtn.click(() => {
                    store.set(waitAddPointerKey, 1);
                    $modalBgInvitation.removeClass("show");
                    loginViewShow();
                })
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

export {invitationInit}
