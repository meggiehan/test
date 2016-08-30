import userUtils from '../utils/viewsUtil/userUtils';
import { cancleIndividual, canclCompany } from '../utils/domListenEvent';
import store from '../utils/locaStorage';
import config from '../config';
import customAjax from '../middlewares/customAjax';

function catIdentityStatusInit(f7, view, page) {
    const { cacheUserinfoKey } = config;
    const { token, id } = store.get(cacheUserinfoKey);
    customAjax.ajax({
        apiCategory: 'userInfo',
        api: 'getUserCertificate',
        data: [token],
        type: 'get',
        val: {
            token: id
        }
    }, userUtils.getBussesInfoCallback);
    f7.hideIndicator();
    //cancle authentication.
    $$('.cancel-individual-verify-buuton').off('click', cancleIndividual).on('click', cancleIndividual);

    $$('.cancel-company-verify-buuton').off('click', canclCompany).on('click', canclCompany);
}

module.exports = {
    catIdentityStatusInit,
}
