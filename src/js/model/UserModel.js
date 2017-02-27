/**
 * Created by domicc on 24/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';
import Auth from '../../middlewares/Auth';
import config from '../../config';

class UserModel {

    static get(callback) {
        RestTemplate.get(`${config.url}auth`, {"access-token": Auth.getToken()}, {}, callback);
    }

}

const userModel = new UserModel();
export default userModel;
