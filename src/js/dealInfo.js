
function dealInfoInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);

    let dealunit = f7.picker({
        input: currentPage.find('#deal-unit'),
        toolbarCloseText: '确定',
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['斤', '尾', '只']
            }
        ]
    });
}

export{
  dealInfoInit
};
