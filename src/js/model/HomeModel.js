/**
 * Created by zhongliang.He on 09/03/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class HomeModel {
    /**
     * 获取司机发布的最近的一条计划中的行程
     * */
    getMyFishRecentTrip(callback) {
        RestTemplate.get(
            'fishCarDriverDemands/recent',
            {},
            {},
            callback,
            true,
            true
        );
    }

    /**
     * 首页banner统计
     * */
    postBannerCount(data, callback){
        RestTemplate.post(
            'bannerScanLogs',
            {},
            {},
            data,
            callback
        );
    }
}

const homeModel = new HomeModel();
export default homeModel;
