import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import { releaseType, soundRelease, contactUs } from '../utils/domListenEvent';

function releaseInit(f7, view, page) {
    f7.hideIndicator();
    const { servicePhoneNumber, debug } = config;
    $$('.release-sound').off('click', soundRelease).on('click', soundRelease);
    if (!window['addressObj'] || (window['addressObj'] && !window['addressObj']['initCityName'])) {
        !debug && nativeEvent.getAddress();
    }

    $$('.service-contact-us').off('click', contactUs).on('click', contactUs);

    $$('.release-infomation').off('click', releaseType).on('click', releaseType);
}

module.exports = {
    releaseInit,
}
