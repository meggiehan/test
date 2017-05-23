import Mvp from './model/Mvp';
import Vue from 'vue';
import config from '../config';
/**
 * [aquaticClassroomInit 全明星列表ctrl]
 * @param  {[object]} f7   [description]
 * @param  {[object]} view [description]
 * @param  {[object]} page [description]
 */
function mvpListInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-mvp-list')[$$('.view-main .pages>.page-mvp-list').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    const {
        pageSize,
        backgroundImgUrl,
        mWebUrl
    } = config;
    let pageNo = 1;
    let loading = false;

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            infoList: [],
            newList: [],
            backgroundImgUrl,
            isLoading: true
        },
        methods: {
            openNewWindow (item){
                view.router.load({
                    url: `${mWebUrl}banner/mvp?id=${item.id}`
                });
            }
        }
    });

    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            $$.each(data, (index, item) => {
                vueData.infoList.push(item);
            });
            vueData.newList = data;
            if(data.length){
                loading = false;
                vueData.isLoading = true;
            }else{
                loading = true;
                vueData.isLoading = false;
            }
        }else{
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        setTimeout(() => {
            currentPage.find('.lazy').trigger('lazy');
        }, 400);
    };

    /*
     * [getList 获取咨询列表数据]
     */
    const getList = () => {
        Mvp.getMvpList(
            {
                pageSize,
                pageNo
            },
            callback
        );
    };
    getList();

    // 下拉刷新
    $ptrContent.on('refresh', () => {
        vueData.infoList = [];
        vueData.newList = [];
        pageNo = 1;
        loading = false;
        vueData.isLoading = true;
        getList();
    });

    // 上拉加载
    $infinite.on('infinite', function (){
        if(loading){
            return;
        }
        loading = true;
        pageNo++;
        getList();
    });
}

export {
    mvpListInit
};
