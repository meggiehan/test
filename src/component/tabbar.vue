<template>
<div class="toolbar-inner fixed-tool-bar">
    <a :class="1 == tabIndex && 'active'" data-reload="true" @click="goToHomeBuy()">
        <span class="iconfont icon-buy"></span> 我要买
    </a>
    <a :class="2 == tabIndex && 'active'" data-reload="true" @click="goToHomeSell()">
        <span class="iconfont icon-sell"></span> 我要卖
    </a>
    <a @click="releaseInfo()">
        <div class="tab-release">
            <span class="tab-release-bg"></span>
            <span class="tab-release-content">
                      <i class="iconfont icon-edit"></i>
                      <p>发布</p>
                   </span>
        </div>
    </a>
    <a onclick="apiCount('btn_home_tutor')" data-reload="true" :class="4 == tabIndex && 'active'" @click="goToClassRoom()">
        <span class="iconfont icon-classroom">
            <i v-if="classRoomNum>0">{{classRoomNum}}</i>
        </span>
        <p>水产课堂</p>
    </a>
    <a :class="5 == tabIndex && 'active'" data-reload="true" @click="goToUser()">
        <span class="iconfont" :class="5 == tabIndex ? 'icon-active-user' : 'icon-user'"></span> 个人中心
    </a>
</div>
</template>

<style>
</style>
<script>
import {
    alertTitleText
} from '../utils/string';
import {
    loginViewShow
} from '../middlewares/loginMiddle';
export default {
    data: function() {
        return {
            pageName: window.mainView.activePage.name
        };
    },
    props: ['tabIndex', 'classRoomNum'],
    methods: {
        releaseInfo() {
            const text = alertTitleText();
            window.apiCount('btn_tabbar_post');
            if (!!text) {
                window.f7.alert(text, '温馨提示', loginViewShow);
            } else {
                window.mainView.router.load({
                    url: 'views/release.html'
                })
            }
        },
        goToHomeBuy(){
            window.apiCount('btn_tabbar_buy');
            if('homeBuy' == this.pageName){
                return;
            }
            window.mainView.router.load({
                url: 'views/homeBuy.html',
                reload: true
            })
        },
        goToHomeSell(){
            window.apiCount('btn_tabbar_sell');
            if('homeSell' == this.pageName){
                return;
            }
            window.mainView.router.load({
                url: 'views/homeSell.html',
                reload: true
            })
        },
        goToClassRoom(){
            window.apiCount('btn_home_tutor');
            if('aquaticClassroom' == this.pageName){
                return;
            }
            window.mainView.router.load({
                url: 'views/aquaticClassroom.html',
                reload: true
            })
        },
        goToUser(){
            window.apiCount('btn_tabbar_profile');
            if('user' == this.pageName){
                return;
            }
            window.mainView.router.load({
                url: 'views/user.html',
                reload: true
            })
        }
    }
};
</script>
