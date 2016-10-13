import nativeEvent from '../utils/nativeEvent';

const configs = {
    version: '1.3 --- Thu Oct 13 2016 11:05:44 GMT+0800 (CST)',
    debug: false,
    /*
     *release branch change the api url to http://api.yudada.com
     */
    url: nativeEvent['getAPi']() || 'http://api.test.yudada.com/', 
    // url: '://192.168.20.109:8080/',
    backgroundImgUrl: './img/app_icon_108.png',
    timeout: 15000, //api timeout, unit: ms
    pageSize: 20,
    cacheMaxLen: 80,
    voiceCodeWaitTime: 60, //unit: m
    cacheUserinfoKey: 'userInfo',
    cacheHistoryKey: 'serachHistory',
    shareUrl: 'http://m.yudada.com/infoDetail.html',
    /*
     *release branch change the url to http://m.yudada.com
     */
    mWebUrl: 'http://m.test.yudada.com/',
    imgPath: (num) => {
        return `@1e_1c_2o_0l_${num*10}h_${num*10}w_90q.src`
    },

    identity: {
        individual: '@70h_107w_1e_1c_2o',
        company: '@90h_345w_1e_1c_2o',
        catCompany: '@190h_345w_1e_1c_2o',
    },
    servicePhoneNumber: '18115381185',
    demandInfo: {
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
        'getMyDemandInfoList': ['userId', 'pageSize', 'pageNo', 'type'],
        'deleteDemandInfo': ['id']
    },
    fishType: {
        'getChildrenFishTypeList': ['id','release','type','keyvalue']
    },
    userLogin: {
        'getPhoneCode': [],
        'subUserPass': ['phone_code','key'],
        'login': ['loginName', 'loginPass'],
    },
    userInfo: {
        'getUserInfo': ['login_token'],
        'getUserCertificate': ['id'],
        'updateEnterpriseUserInfo': ['businessLicenseUrl'],
        'updatePersonalUserInfo': ['positiveIdUrl','otherSideIdUrl','holdIdUrl'],
        'updateUserInfo': ['id', 'nickname', 'imgUrl', 'address', 'provinceId', 'cityId' , 'provinceName', 'cityName'],
        'getUserCertificate': ['userId'],
        'cancelPersonalAuthentication': [],
        'cancelEnterpriseAuthentication': [],
        'getUserFishCertificateList': [],
        'addUserFishCertificate': ['path', 'fishTypeName', 'fileSize'],
        'deleteUserFishCertificate': ['id']
    },
    auth: ['token'],
    inviteter: ['code'],
    invite: {
        'users': ['pageSize', 'pageNo']
    },
    favorite: {
        demandInfoList: ['token', 'pageSize', 'pageNo', 'demandType'],
        demandInfo: []
    }

}
export default configs;
