module.exports = {
    filterTabClick: (e) => {
        const event = e || window.event;
        let ele = event.target;
        let classes = ele.className;
        const clickTab = () => {
            if (classes.indexOf('active-ele') > -1) {
                ele.className = classes.replace('active-ele', '');
                $$('.winodw-mask').removeClass('on');
                $$('.filter-tabs-content').removeClass('on');
            } else {
                $$('.filter-tab>div').removeClass('active-ele');
                ele.className += ' active-ele';
                $$('.winodw-mask').addClass('on');
                $$('.filter-tabs-content').addClass('on');
                $$('.filter-tabs-content>div').removeClass('active');
                classes.indexOf('tab1') > -1 && $$('.filter-tabs-content>div').eq(0).addClass('active');
                classes.indexOf('tab2') > -1 && $$('.filter-tabs-content>div').eq(1).addClass('active');
                classes.indexOf('tab3') > -1 && $$('.filter-tabs-content>div').eq(2).addClass('active');
            }
        }
        if (ele.parentNode.className.indexOf('filter-tab-title') > -1) {
            ele = ele.parentNode;
            classes = ele.className;
            clickTab();
        } else if (classes.indexOf('filter-tab-title') > -1) {
            clickTab();
        }
    }
}
