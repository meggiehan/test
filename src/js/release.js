import nativeEvent from '../utils/nativeEvent';
import config from '../config';

function releaseInit(f7, view, page) {
    const $$ = Dom7;
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

    $$('.release-infomation')[0].onclick = () => {
        const btn1 = [{
            text: "我要买",
            color: '#128AF2',
            onClick: () => {
                view.router.load({
                    url: 'views/filter.html?type=1&release=true'
                })
            }
        }, {
            text: "我要卖",
            color: '#128AF2',
            onClick: () => {
                view.router.load({
                    url: 'views/filter.html?type=2&release=true'
                })
            }
        }];
        const btn2 = [{ text: "取消", color: 'red' }];
        f7.actions([btn1, btn2]);
    }
}

module.exports = {
    releaseInit,
}
