/**
 * Created by cash on 27/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';
import {getToken} from '../../middlewares/loginMiddle';

class UpdateVersionModel {
    get(callback) {
        // ${currentDevice.android ? 1 : 2}
        const apiStr = `appWabUpgrade/getAppWebNowVersionNumber/1/V01_08_03_01`;
        RestTemplate.get(apiStr, {"access-token": getToken()}, {}, callback, true);
    }

}

const updateVersionModel = new UpdateVersionModel();
export default updateVersionModel;
