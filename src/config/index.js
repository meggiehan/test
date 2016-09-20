import nativeEvent from '../utils/nativeEvent';

const configs = {
    version: '1.1',
    debug: false,
    url: nativeEvent['getAPi']() || 'http://api.test.yudada.com/',
    // url: '://192.168.20.109:8080/',
    backgroundImgUrl: './img/app_icon_108.png',
    timeout: 15000, //api timeout, unit: ms
    pageSize: 20,
    cacheMaxLen: 50,
    voiceCodeWaitTime: 60, //unit: m
    cacheUserinfoKey: 'userInfo',
    cacheHistoryKey: 'serachHistory',
    shareUrl: 'http://m.yudada.com/infoDetail.html',
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
        'getMyDemandInfoList': ['userId', 'pageSize', 'pageNo', 'login_token', 'type'],
        'deleteDemandInfo': ['id', 'login_token']
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
        'updateEnterpriseUserInfo': ['businessLicenseUrl', 'login_token'],
        'updatePersonalUserInfo': ['positiveIdUrl','otherSideIdUrl','holdIdUrl','login_token'],
        'updateUserInfo': ['id', 'nickname', 'imgUrl', 'address', 'provinceId', 'cityId' , 'provinceName', 'cityName'],
        'getUserCertificate': ['userId'],
        'cancelPersonalAuthentication': ['login_token'],
        'cancelEnterpriseAuthentication': ['login_token'],
        'getUserFishCertificateList': ['login_token'],
        'addUserFishCertificate': ['login_token', 'path', 'fishTypeName', 'fileSize'],
        'deleteUserFishCertificate': ['login_token', 'id']
    }

}
export default configs;
