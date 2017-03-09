import config from '../config';
import {releaseFishViewHide} from './releaseView/releaseFishViews';

function releaseFishCarDemandSuccessInit(f7, view, page) {
    f7.hideIndicator();
    const {isDriver} = page.query;
    const $currentPage = $$($$('.view-release-fish .pages>.page')[$$('.view-release-fish .pages>.page').length - 1]);
    const pageName = mainView.activePage.name;
    if(isDriver){
        $currentPage.find('.circular-content').text('请等待货主联系');
        $currentPage.find('p').text('正在通知有需求的货主，请耐心等待');
        pageName == 'fishCarTripList' ? $currentPage.find('.jump-btn').text('查看我的行程')
        : $currentPage.find('.jump-btn').text('去找货主');
    }else{
        pageName == 'myFishCarDemandList' ? $currentPage.find('.jump-btn').text('查看我的需求')
            : $currentPage.find('.jump-btn').text('去找司机');
    }

    $currentPage.find('.jump-btn').click(() => {
        // mainView.router.reloadPage(`views/fishCar.html?isFishCar=${!isDriver}`);
        mainView.router.refreshPage();
        releaseFishViewHide();
    })
}

export {
    releaseFishCarDemandSuccessInit
}
