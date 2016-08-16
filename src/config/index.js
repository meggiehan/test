const configs = {
    url: 'http://api.test.yudada.com/',
    backgroundImgUrl: '../img/app_icon_108.png',
    timeout: 30000, //api timeout, unit: ms
    pageSize: 20,
    cacheMaxLen: 10,
    voiceCodeWaitTime: 60, //unit: m
    cacheUserinfoKey: 'userInfo',
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
        'getUserInfo': ['login_token']
    }

}
export default configs;
