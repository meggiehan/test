/**
 * Created by cash on 24/03/2017.
 */

import RestTemplate from '../../../middlewares/RestTemplate';

class ShareBusinessCardModel {
    //上传base64
    post(data,callback){
        const apiStr = `shareImages`;
        RestTemplate.post(apiStr, {}, {}, data, callback, true);
    }
}

const shareBusinessCardModel = new ShareBusinessCardModel();
export default shareBusinessCardModel;
