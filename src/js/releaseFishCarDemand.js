import customAjax from '../middlewares/customAjax';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import store from '../utils/locaStorage';

function releaseFishCarDemandInit(f7, view, page) {
    f7.hideIndicator();
    const {cacheUserinfoKey} = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    if (!isLogin()) {
        f7.alert('登录后才能发布需求，请您先登录！', '温馨提示', () => {
            loginViewShow();
            mainView.router.back();
        });
        return;
    }

    const loginName = store.get(cacheUserinfoKey)['loginName'];
    currentPage.find('.release-phone').text(loginName);

    currentPage.find('.toolbar-inner').children('a')[0].onclick = () => {
        const text = currentPage.find('.release-discription').children().val();

        if (!text) {
            f7.alert('请您填写具体需求，越清楚越容易被鱼车司机联系！', '温馨提示');
            return;
        }

        apiCount('btn_fishcar_postDemands');

        function callback(data) {
            const {code, message} = data;
            if (1 == code) {
                nativeEvent.nativeToast('1', '发布成功！');
                mainView.router.back();
                setTimeout(() => {
                    const prevPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
                    prevPage.find('.filter-tab').children().eq(1).trigger('click');
                }, 500)
            } else {
                console.log(message);
            }
        }

        customAjax.ajax({
            apiCategory: 'fishCarDemands',
            data: [text, '', ''],
            type: 'post',
            header: ['token'],
            parameType: 'application/json',
            noCache: true
        }, callback);
    }
}

module.exports = {
    releaseFishCarDemandInit,
}
