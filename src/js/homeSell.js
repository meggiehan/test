
function homeSellInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);

    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });
}

export {
    homeSellInit
};
