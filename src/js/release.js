import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import {releaseType} from '../utils/domListenEvent';

function releaseInit(f7, view, page) {
    f7.hideIndicator();
    const { servicePhoneNumber, debug } = config;
    $$('.release-sound').on('click', () => {
        nativeEvent.apiCount();
        nativeEvent.releaseVoiceInfo();
    })
    if(!window['addressObj']){
        !debug && nativeEvent.getAddress();
    }

    $$('.service-contact-us').on('click', () => {
        nativeEvent.contactUs(servicePhoneNumber);
    })

    $$('.release-infomation').off('click', releaseType).on('click', releaseType);
}

module.exports = {
    releaseInit,
}
