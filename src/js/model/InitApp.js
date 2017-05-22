/**
 * Created by zhongliang.He on 15/05/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class InitApp{
    /**
     * [getInfoNumber 获取资讯列表的未读数量]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getInfoNumber (callback){
        RestTemplate.get(
            'infos/new/count',
            {},
            {
                lastViewTime: parseInt(new Date().getTime() / 1000, 10)
            },
            callback,
            true,
            true
        );
    }
}

const initApp = new InitApp();
export default initApp;
