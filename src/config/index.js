import nativeEvent from '../utils/nativeEvent';

const configs = {
    version: '0.1.0',
    url: 'http://api.test.yudada.com/',
    backgroundImgUrl: './img/app_icon_108.png',
    timeout: 30000, //api timeout, unit: ms
    pageSize: 20,
    cacheMaxLen: 15,
    voiceCodeWaitTime: 60, //unit: m
    cacheUserinfoKey: 'userInfo',
    shareUrl: 'http://m.yudada.com/infoDetail.html',
    imgPath: (num) => {
        return `@1e_1c_2o_0l_${num*10}h_${num*10}w_90q.src`
    },

    identity: {
        individual: '@70h_107w_1e_1c_2o',
        company: '@90h_345w_1e_1c_2o'
    },
    servicePhoneNumber: 18115381185,
    'demandInfo': {
        'getDemandInfoList': [
            "fishTypeId",
            "cityId",
            "type",
            "keyvalue",
            "pageSize",
            "pageNo",
        ],
        'getFishTypeList/5': ['keyvalue'],
        'getDemandInfo': ['id'],
        'userAddDemandInfo': [],
        'getMyDemandInfoList': ['userId']
    },
    'fishType': {
        'getChildrenFishTypeList': ['id','release','type','keyvalue']
    },
    'userLogin': {
        'getPhoneCode': [],
        'subUserPass': ['phone_code','key'],
        'login': ['loginName', 'loginPass'],
    },
    'userInfo': {
        'getUserInfo': ['login_token'],
        'getUserCertificate': ['id'],
        'updateEnterpriseUserInfo': ['businessLicenseUrl', 'login_token'],
        'updatePersonalUserInfo': ['positiveIdUrl','otherSideIdUrl','holdIdUrl','login_token'],
        'updateUserInfo': ['id', 'nickname', 'imgUrl']
    }

}
export default configs;
