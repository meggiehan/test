import config from '../../config/';
import store from '../localStorage';
import nativeEvent from '../nativeEvent';

module.exports = {
    setHistory: (str) => {
        const { cacheHistoryKey } = config;
        const history = store.get(cacheHistoryKey) || [];
        // const val = encodeURI(str.replace(/[^\u4E00-\u9FA5]/g, ''));
        const val = str && str.replace('“', '').replace('”', '');

        let isSame = false;
        if (!val){
            return;
        }
        history.forEach((item) => {
            item == val && (isSame = true);
        });
        if(isSame){
            return;
        }
        // console.log(val)
        history.push(val);
        store.set(cacheHistoryKey, history);
        nativeEvent['searchHistoryActions'](1, str);
    }
};
