/**
 * Created by zhongliang.He on 09/03/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class getInfoListModel{
    /**
     * 获取资讯列表
     * */
    getInfoList (isMandatory, data, callback){
        RestTemplate.get(
            'infos',
            {},
            data,
            callback,
            false,
            isMandatory
        );
    }

    /**
     * [GetInfoListModel ]
     * @type {getInfoListModel}
     */
    putInfoViews (id, callback){
        RestTemplate.put(
          `infos/${id}/views`,
          {},
          {},
          {},
          callback
      );
    }
}

// eslint-disable-next-line
const GetInfoListModel = new getInfoListModel();
export default GetInfoListModel;
