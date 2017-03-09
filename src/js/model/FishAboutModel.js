/**
 * Created by zhongliang.He on 09/03/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';
import nativeEvent from '../../utils/nativeEvent';

class FishAboutModel {
    /**
     * 获取司机发布的行程列表
     * @expired true 表示过期的, false表示进行中的
     * @callback ajax回调
     * */
    getMyFishTripList(data,expired, callback) {
        RestTemplate.get(
            `fishCarDriverDemands/mine?expired=${expired.expired}`,
            {},
            data,
            callback,
            false,
            nativeEvent.getNetworkStatus()
        );
    }

    /**
     * 获取用户发布过的需求列表
     * @expired true 表示过期的, false表示进行中的
     * @callback ajax回调
     * */
    getMyFishCarDemandList(data, callback) {
        RestTemplate.get('fishCarDemands/mine', {}, data, callback, false);
    }
}

const fishAboutModel = new FishAboutModel();
export default fishAboutModel;
