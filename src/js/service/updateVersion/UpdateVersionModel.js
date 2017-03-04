/**
 * Created by cash on 27/02/2017.
 */

import RestTemplate from '../../../middlewares/RestTemplate';
import {getToken} from '../../../middlewares/loginMiddle';
import store from '../../../utils/localStorage';

class UpdateVersionModel {
    get(callback) {
        const versionNumber = store.get('versionNumber');
        const apiStr = `appWabUpgrade/getAppWebNowVersionNumber/${currentDevice.android ? 1 : 2}/${versionNumber}`;
        RestTemplate.get(apiStr, {"access-token": getToken()}, {}, callback, true);
    }

}

const updateVersionModel = new UpdateVersionModel();
export default updateVersionModel;
