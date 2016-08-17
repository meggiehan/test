const configs = {
    url: 'http://api.test.yudada.com/',
    backgroundImgUrl: '../img/app_icon_108.png',
    timeout: 30000, //api timeout, unit: ms
    pageSize: 20,
    cacheMaxLen: 10,
    voiceCodeWaitTime: 60, //unit: m
    cacheUserinfoKey: 'userInfo',
    imgPath: (num) => {
        return `@1e_1c_2o_0l_${num*10}h_${num*10}w_90q.src`
    },
    identity: {
        individual: '@70h_107w_1e_1c_2o',
        company: '@90h_345w_1e_1c_2o'
    },
    'demandInfo': {
        'getDemandInfoList': [
            "fishTypeId",
            "cityId",
            "type",
            "keyvalue",
            "pageSize",
            "pageNo",
            "keyvalue"
        ],
        'getFishTypeList/5': ['keyvalue'],
        'getDemandInfo': ['id'],
        'userAddDemandInfo': []
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
        'getUserCertificate': ['token']
    }

}
export default configs;
