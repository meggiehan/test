import config from '../../config/';
import customAjax from '../../middlewares/customAjax';
import store from '../../utils/locaStorage';
import framework7 from '../../js/lib/framework7';

module.exports = {
    setHistory: (str) => {
        const { cacheHistoryKey } = config;
        const history = store.get(cacheHistoryKey) || [];
        // const val = encodeURI(str.replace(/[^\u4E00-\u9FA5]/g, ''));
        const val = str && str.replace('“','').replace('”', '');

        let isSame = false;
        if (!val) {
            return;
        }
        history.forEach((item) => {
        	item == val && (isSame = true);
        })
        if(isSame){
        	return;
        }
        history.push(val);
        store.set(cacheHistoryKey, history);
    }
}
