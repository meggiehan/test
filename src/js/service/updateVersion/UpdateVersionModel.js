/**
 * Created by cash on 27/02/2017.
 */

import RestTemplate from '../../../middlewares/RestTemplate';
import {getToken} from '../../../middlewares/loginMiddle';

class UpdateVersionModel {
    get(callback) {
        const version = 'V01_08_03_01';
        const apiStr = `appWabUpgrade/getAppWebNowVersionNumber/${currentDevice.android ? 1 : 2}/${version}`;
        RestTemplate.get(apiStr, {"access-token": getToken()}, {}, callback, true);
    }

}

const updateVersionModel = new UpdateVersionModel();
export default updateVersionModel;
