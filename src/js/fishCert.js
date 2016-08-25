import customAjax from '../middlewares/customAjax';
import config from '../config';
import store from '../utils/locaStorage';
import nativeEvent from '../utils/nativeEvent';
import { trim, html } from '../utils/string';
import { logOut } from '../middlewares/loginMiddle';
import { fishCert } from '../utils/template';


function fishCertInit(f7, view, page) {
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    let dataIndex;
    if (!userInfo) {
        logOut();
    }
    $$('.fish-cert-head .button').on('click', () => {
        nativeEvent.postPic(-1, '');
    })

    //get user fish cset list.
    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1) {
            f7.alert(message, '提示');
        }
        let listStr = '';
        $$.each(data.data.list, (index, item) => {
            listStr += fishCert.certList(item, index);
        })
        html($$('.fish-cert-list'), listStr, f7);
        listStr && $$('.fish-cert-content').addClass('show');
    }
    customAjax.ajax({
        apiCategory: 'userInfo',
        api: 'getUserFishCertificateList',
        data: [userInfo['token']],
        type: 'get'
    }, callback);

    //cat verify cert faild info.
    const deleteCallback = (data) => {
        const { code, message } = data;
        if (1 == code) {
            $$('.fish-cert-list>.col-50')[dataIndex].remove();
            dataIndex--;
        }
        !$$('.fish-cert-list>.col-50').length && $$('.fish-cert-content').removeClass('show');
    }
    $$('.fish-cert-list')[0].onclick = (e) => {
        const event = e || window.event;
        const ele = e.target;
        let classes = ele.className;
        const id = $$(ele).attr('data-id');
        if (classes.indexOf('cat-cert-faild-info') > -1) {
            const info = $$(ele).attr('data-info');
            f7.alert(info, '未通过原因');
        } else if (classes.indexOf('fish-cert-delete') > -1) {
            dataIndex = $$(ele).attr('data-index');
            const sureCallback = () => {
                customAjax.ajax({
                    apiCategory: 'userInfo',
                    api: 'deleteUserFishCertificate',
                    data: [userInfo['token'], id],
                    val: { id },
                    type: 'post'
                }, deleteCallback);
            }

            f7.confirm('确定删除？','删除证书', sureCallback)
        }else if(classes.indexOf('fish-cert-reupload') > -1){
        	nativeEvent.postPic(-1, id);
        }
    }

}

module.exports = {
    fishCertInit,
}
