<template>
        <div class="toolbar-inner fixed-tool-bar">
            <a href="views/homeBuy.html" :class="1 == tabIndex && 'active'" data-reload="true">
              <span class="iconfont icon-buy"></span>
              我要买
            </a>
            <a href="views/homeSell.html" :class="2 == tabIndex && 'active'" data-reload="true">
              <span class="iconfont icon-sell"></span>
              我要卖
            </a>
            <a @click="releaseInfo()" class="tab-release">
               <span class="tab-release-bg"></span>
               <span class="tab-release-content">
                  <i class="iconfont icon-edit"></i>
                  <p>发布</p>
               </span>
            </a>
            <a href="views/aquaticClassroom.html"
            onclick="apiCount('btn_home_tutor')">
              <span class="iconfont icon-classroom"></span>
              <p>水产课堂</p>
            </a>
            <a href="views/user.html"
            :class="5 == tabIndex && 'active'"
            onclick="apiCount('btn_tabbar_profile');" data-reload="true">
              <span class="iconfont" :class="5 == tabIndex ? 'icon-active-user' : 'icon-user'"></span>
              个人中心
            </a>
        </div>
</template>

<style>
</style>
<script>
    import {alertTitleText} from '../utils/string';
    import {loginViewShow} from '../middlewares/loginMiddle';
    export default{
        data: function () {
            return {};
        },
        props: ['tabIndex'],
        methods: {
            releaseInfo (){
                const text = alertTitleText();
                window.apiCount('btn_tabbar_post');
                if(!!text){
                    window.f7.alert(text, '温馨提示', loginViewShow);
                }else{
                    window.mainView.router.load({
                        url: 'views/release.html'
                    })
                }
            }
        }
    };
</script>
