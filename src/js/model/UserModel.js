/**
 * Created by domicc on 24/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class UserModel{
    get (callback){
        RestTemplate.get('auth', '', {}, callback, true);
    }

}

const userModel = new UserModel();
export default userModel;
