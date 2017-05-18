import Vue from 'vue';

function chooseDateInit (f7, view, page){
    f7.hideIndicator();

    const currentPage = $$($$('.view-main .page-choose-date')[$$('.view-main .page-choose-date').length - 1]);
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const day = new Date().getDate();

    new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            currentYear: year,
            currentMonth: month,
            timeObj: [
                {text: '上旬', val: 10},
                {text: '中旬', val: 20},
                {text: '下旬', val: 30}
            ]
        },
        methods: {
            isDisable (month, day){
                let res = false;
                const isLeapYear = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
                if(isLeapYear && (2 == month) && (30 == day)){
                    res = (new Date().getTime() > new Date(`${year}/${month}/28`).getTime());
                }else{
                    res = (new Date().getTime() > new Date(`${year}/${month}/${day}`).getTime());
                }
                return res;
            },
            selectTime (month, day, text, isDisable){
                if(isDisable){
                    return;
                }
                const isLeapYear = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
                if(window.releaseVue){
                    if(isLeapYear && (2 == month) && (30 == day)){
                        window.releaseVue.sellTime = parseInt(new Date(`${year}/${month}/28`).getTime() / 1000, 10);
                        window.releaseVue.subInfo.demandInfoSale.marketTime = `${year}年${month}月${text}`;
                    }else{
                        window.releaseVue.sellTime = parseInt(new Date(`${year}/${month}/${day}`).getTime() / 1000, 10);
                        window.releaseVue.subInfo.demandInfoSale.marketTime = `${year}年${month}月${text}`;
                    }
                    view.router.back();
                }
            }
        },
        computed: {
            prevDate (){
                let res = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                if(1 != month){
                    res.splice(0, month - 1);
                }
                return res;
            },
            nextDate (){
                let res = [];
                if(1 != month){
                    for(let i = 1;i < month;i++){
                        res.push(i);
                    }
                }
                return res;
            }
        }
    });
}

export {
  chooseDateInit
};
