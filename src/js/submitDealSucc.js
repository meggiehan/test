import Vue from 'vue';

function submitDealSuccInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {infoId, type} = page.query;

    window.strengthShowModel = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {

        },
        computed: {
            hrefUrl (){
                return `views/${1 == type ? 'buydetail.html' : 'selldetail.html'}?id=${infoId}`;
            }
        }
    });
}

export{
  submitDealSuccInit
};
