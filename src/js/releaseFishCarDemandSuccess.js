import config from '../config';
import {releaseFishViewHide} from './releaseView/releaseFishViews';

function releaseFishCarDemandSuccessInit(f7, view, page) {
    f7.hideIndicator();
    const {isDriver} = page.query;
    const $currentPage = $$($$('.view-release-fish .pages>.page')[$$('.view-release-fish .pages>.page').length - 1]);
    if(isDriver){
        $currentPage.find('.circular-content').text('请等待货主联系');
        $currentPage.find('p').text('正在通知有需求的货主，请耐心等待');
        $currentPage.find('.jump-btn').text('去找货主');
    }

    $currentPage.find('.jump-btn').click(() => {
        releaseView.router.reloadPage(`views/fishCar.html?isFishCar=${!!isDriver}`);
        releaseFishViewHide();
    })
}

export {
    releaseFishCarDemandSuccessInit
}
