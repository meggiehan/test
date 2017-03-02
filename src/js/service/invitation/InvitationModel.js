/**
 * Created by domicc on 28/02/2017.
 */
import RestTemplate from '../../../middlewares/RestTemplate';
import {JsBridge} from '../../../middlewares/JsBridge';
import store from '../../../utils/localStorage';
import config from '../../../config';

class InvitationModel {

    init(f7) {
        this._f7 = f7;
    }

    acceptInvitation(code, callback) {
        RestTemplate.post("invite", {}, {}, {
            code
        }, (res) => {
            if (1 == res.code) {
                this._f7.alert("接受邀请成功");
                callback(res);
            } else {
                this._f7.alert(res.message);
            }
            this.clearInviterInfo();
        })
    }

    getInviterInfo(callback) {
        JsBridge('JS_GetInvitationInfo', '', (data) => {
            callback(data || '');
        })
    }

    /**
     * 清除邀请人信息
     * */
    clearInviterInfo() {
        const {
            cancelInvitationNumberKey,
            waitAddPointerKey,
            inviteInfoKey
        } = config;
        store.set(cancelInvitationNumberKey, 0);
        store.set(waitAddPointerKey, 0);
        store.set(inviteInfoKey, '');
    }

}

const invitationModel = new InvitationModel();
export default invitationModel;