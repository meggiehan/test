import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import { releaseType, soundRelease, contactUs } from '../utils/domListenEvent';

function releaseInit(f7, view, page) {
    // views/filter.html?type=1&release=true
    // views/filter.html?type=2&release=true
    f7.hideIndicator();
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { servicePhoneNumber, debug } = config;
    currentPage.find('.release-sound')[0].onclick = soundRelease;
    if (!window['addressObj'] || (window['addressObj'] && !window['addressObj']['initCityName'])) {
        !debug && nativeEvent.getAddress();
    }

    $$('.service-contact-us').off('click', contactUs).on('click', contactUs);

    currentPage.find('.release-infomation').click(() => {
        $$('.release-select-model').addClass('on');
    })

    $$('.release-select-model')[0].onclick = (e) => {
        $$('.release-select-model').removeClass('on');
    }
}

module.exports = {
    releaseInit,
}
