/**
 * Created by domicc on 28/02/2017.
 */
import RestTemplate from '../../../middlewares/RestTemplate';

class InvitationModel {

    set f7(f7) {
        this._f7 = f7;
    }

    acceptInvitation(code, callback) {
        RestTemplate.post("invite", {}, {}, {
            code: code
        }, (res) => {
            if (1 == res.code) {
                this._f7.alert("接受邀请成功");
                this.clearInviterInfo();
                callback(res);
            } else {
                console.warn(res.message);
            }
        })
    }

    getInviterInfo() {
        return {code: 123456};
    }

    clearInviterInfo() {

    }

}

const invitationModel = new InvitationModel();
export default invitationModel;