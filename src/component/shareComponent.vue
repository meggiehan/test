<template>
    <div class="invite-share-tab">
        <div @click="shareToWeixinFriedns" class="invite-share-items weixin-friends">
            <img src="../build/img/icon_weixin.png" alt="微信好友">
            <p>微信好友</p>
        </div>
        <div class="invite-share-items weixin-friends-circle">
            <img src="../build/img/circleFriends.png" alt="微信朋友圈">
            <p>微信好友</p>
        </div>
        <div class="invite-share-items qq-friends">
            <span class="iconfont icon-qq"></span>
            <p>QQ</p>
        </div>
        <div class="invite-share-items qq-zone">
            <span class="iconfont icon-msg"></span>
            <p>短信</p>
        </div>
    </div>
</template>
<style>
    .invite-share-tab{
        overflow: hidden;
    }
    .invite-share-items{
        width: 25%;
        float: left;
    }
    .invite-share-items img{
        display: block;
        width: 4.5rem;
        margin: 0 auto;
    }
    .weixin-friends-circle img, .weixin-friends img{
        padding-top: 1rem;
    }
    .weixin-friends-circle img{
        width: 4rem;
        padding-bottom: 0.5rem;
    }
    .invite-share-items span.icon-qq{
        font-size: 4.6rem;
        color: #02A6E3;
    }
    .invite-share-items span.icon-msg{
        font-size: 4.6rem;
        color: #22DE7E;
    }
    .qq-zone p, .qq-friends p{
        margin-top: 0.7rem;
    }
</style>

<script>
    import {
        get,
        set
    } from '../utils/localStorage';
    import nativeEvent from '../utils/nativeEvent';
    import config from '../config';
    const {cacheUserInfoKey} = config;
    const userInfo = get(cacheUserInfoKey);

    const {
        invitationCode,
        inviterNickname,
        inviterPhone,
        invitationLink,
        scanLink,
        imgUrl,
        registerCount,
        nickname
    } = userInfo || {};

    nativeEvent.apiCount('btn_inviteFriends_share');
    const title = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！`;
    const str = `养得好不如卖的好，鱼大大实名认证水产交易平台`;
    const messageTile = `好友${nickname ? '"' + nickname + '"' : ''}给您的神奇卖鱼工具！赶紧看看吧:${invitationLink}`;

    nativeEvent.shareInfo(title, str, invitationLink, messageTile, imgUrl || 'http://m.yudada.com/img/app_icon_108.png');

    export default{
        data: function () {
            return {name: '雨歇微凉', age: 2000};
        },
        methods: {
            shareToWeixinFriedns: () => {

                console.log(userInfo)
            }
        }
    };
</script>
