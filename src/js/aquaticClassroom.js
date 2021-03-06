import GetInfoListModel from './model/GetInfoListModel';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import config from '../config';
import tabbar from '../component/tabbar';
import store from '../utils/localStorage';
/**
 * [aquaticClassroomInit 咨询模块ctrl]
 * @param  {[object]} f7   [description]
 * @param  {[object]} view [description]
 * @param  {[object]} page [description]
 */
function aquaticClassroomInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-aquatic-classroom')[$$('.view-main .pages>.page-aquatic-classroom').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    const {
        pageSize,
        infoNumberKey
    } = config;
    let pageNo = 1;
    let loading = false;
    store.set(infoNumberKey, 0);

    Vue.component('tab-bar-component', tabbar);
    // 底部tabbar组件
    new Vue({
        el: currentPage.find('.toolbar')[0]
    });

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            infoList: [],
            newList: []
        },
        methods: {
            openNewWindow (url, id){
                nativeEvent.goNewWindow(url);
                window.apiCount('cell_tutor_list');
                GetInfoListModel.putInfoViews(
                  id,
                  (res) => {
                      const {code, message} = res;
                      if(1 !== code){
                          console.log(message);
                      }
                  }
              );
            }
        },
        computed: {
            isLoading (){
                if(this.infoList.length && !this.newList.length){
                    return false;
                }else{
                    return true;
                }
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
            if(data.length >= pageSize){
                loading = false;
            }
        }else{
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
    };

    /*
     * [getList 获取咨询列表数据]
     */
    const getList = () => {
        GetInfoListModel.getInfoList(
            !!nativeEvent.getNetworkStatus(),
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
        getList();
    });

    // 上拉加载
    $infinite.on('infinite', function (){
        if(!vueData.isLoading || loading){
            return;
        }
        loading = true;
        pageNo++;
        getList();
    });
}

export {
    aquaticClassroomInit
};
