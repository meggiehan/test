const configs = {
    url: 'http://api.test.yudada.com/',
    backgroundImgUrl: '../img/app_icon_108.png',
    timeout: 30000, //api timeout, unit: ms
    pageSize: 20,
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
        'getDemandInfo': ['id']
    }

}
export default configs;
