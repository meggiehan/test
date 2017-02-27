/**
 * Created by domicc on 24/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';
import {getToken} from '../../middlewares/loginMiddle';
import config from '../../config';

class UserModel {
    get(callback) {
        RestTemplate.get(`auth`, {"access-token": getToken()}, {}, callback);
    }

}

const userModel = new UserModel();
export default userModel;
