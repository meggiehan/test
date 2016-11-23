import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import { releaseType, soundRelease, contactUs } from '../utils/domListenEvent';

function releaseInit(f7, view, page) {
	// views/filter.html?type=1&release=true
	// views/filter.html?type=2&release=true
    f7.hideIndicator();
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { servicePhoneNumber, debug } = config;
    currentPage.find('.release-sound')[0].onclick =  soundRelease;
    if (!window['addressObj'] || (window['addressObj'] && !window['addressObj']['initCityName'])) {
        !debug && nativeEvent.getAddress();
    }

    $$('.service-contact-us').off('click', contactUs).on('click', contactUs);

    currentPage.find('.release-infomation').click(() => {
    	currentPage.find('.release-select-model').addClass('on');
    })

    currentPage.find('.release-select-model')[0].onclick = (e) => {
        const ele = e.target || window.event;
        if($$(ele).hasClass('footer') || $$(ele).hasClass('release-select-model')){
            currentPage.find('.release-select-model').removeClass('on');
        }
    }
}

module.exports = {
    releaseInit,
}
