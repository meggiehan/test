
function notFoundInit(f7, view, page) {
    const currentPage = $$($$('.pages>.page')[$$('.pages>.page').length - 1]);
    const { errInfo } = page.query;
    errInfo && currentPage.find('.not-found-error-info').text(errInfo || '');
    f7.hideIndicator();
    currentPage.find('.show-other-info')[0].onclick = () => {
        f7.showIndicator();
        mainView.router.back();
        setTimeout(() => {
            mainView.router.refreshPage();
            f7.hideIndicator();
        }, 800)
    }
}

module.exports = {
    notFoundInit
}
