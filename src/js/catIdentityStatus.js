import userUtils from '../utils/viewsUtil/userUtils';
import { cancleIndividual, canclCompany } from '../utils/domListenEvent';
import store from '../utils/locaStorage';
import config from '../config';
import customAjax from '../middlewares/customAjax';

function catIdentityStatusInit(f7, view, page) {
    const { cacheUserinfoKey } = config;
    const userInfo = store.get(cacheUserinfoKey);
    f7.hideIndicator();
    userUtils.getBussesInfoCallback(userInfo)
    //cancle authentication.
    $$('.cancel-individual-verify-buuton').off('click', cancleIndividual).on('click', cancleIndividual);

    $$('.cancel-company-verify-buuton').off('click', canclCompany).on('click', canclCompany);
}

module.exports = {
    catIdentityStatusInit,
}
