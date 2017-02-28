/**
 * 邀请码
 * Created by domicc on 27/02/2017.
 */

import {getToken, isLogin, loginViewShow} from '../../../middlewares/loginMiddle';
import store from '../../../utils/localStorage';
import invitationModel from './invitationModel';

function invitationInit(f7, view) {
    console.log("init invitation modal");
    const $modalBgInvitation = $$(".modal-bg-invitation");
    const $confirmBtn = $$(".modal-bg-invitation .btn.confirm");
    const $cancelBtn = $$(".modal-bg-invitation .btn.cancel");
    const $text = $$('.modal-bg-invitation .text');
    let count = store.get("count-invitation");
    $cancelBtn.click(() => {
        $modalBgInvitation.removeClass("show");
        store.set("count-invitation", ++count);
    });
    invitationModel.f7 = f7;
    const inviterInfo = invitationModel.getInviterInfo();
    if (inviterInfo) {
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
                store.set("login-invitation", 1);
                $modalBgInvitation.removeClass("show");
                loginViewShow();
            })
        }
        $modalBgInvitation.addClass("show");
    }
}

export {invitationInit}
