/**
 * Created by zhongliang.He on 09/03/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class HomeModel{
    /**
     * 获取司机发布的最近的一条计划中的行程
     * */
    getMyFishRecentTrip (callback){
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
    postBannerCount (data, callback){
        RestTemplate.post(
            'bannerScanLogs',
            {},
            {},
            data,
            callback
        );
    }

    // 获取我要买中最近浏览超过100的信息
    getBiggerBuyInfo (callback){
        RestTemplate.get(
            'buying/state',
            {},
            {},
            callback,
            true,
            true
        );
    }

    // 获取关心的鱼种发布信息的条数
    postFollowFishNumber (data, callback){
        RestTemplate.post(
            'subscribedFishes',
            {},
            {},
            data,
            callback
        );
    }

    // 获取根据关心鱼种删选出来的出售列表
    postFollowSaleList (data, callback){
        RestTemplate.post(
            'demands/sale/recommendation',
            {},
            {},
            data,
            callback
        );
    }
}

const homeModel = new HomeModel();
export default homeModel;
