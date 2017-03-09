import nativeEvent from '../../utils/nativeEvent';

function weixinModalEvent(){
    /*
     * 关闭微信分享model
     * */
    $$('.modal-close').click((e) => {
        const ele = e.target || window.event.target;
        const classes = ele.className;
        if (classes.indexOf('footer') > -1 || classes.indexOf('modal-close') > -1) {
            $$('.modal-close').removeClass('on');
        }
    });

    /*
     * 微信分享给朋友
     * */
    $$('.share-to-friends')[0].onclick = () => {
        const {webUrl, imgUrl, description, title} = window.shareInfo;
        let url = imgUrl ? (imgUrl.split('@')[0].split('?')[0] + '?x-oss-process=image/resize,m_fill,h_100,w_100') : '';
        url = url ? encodeURI(url) : 'http://m.yudada.com/img/app_icon_108.png';
        nativeEvent.shareInfoToWeixin(2, webUrl, url, description, title);
    };

    /*
     * 微信分享到朋友圈
     * */
    $$('.share-to-friends-circle')[0].onclick = () => {
        const {webUrl, imgUrl, description, title} = window.shareInfo;
        let url = imgUrl ? (imgUrl.split('@')[0].split('?')[0] + '?x-oss-process=image/resize,m_fill,h_100,w_100') : '';
        url = url ? encodeURI(url) : 'http://m.yudada.com/img/app_icon_108.png';
        nativeEvent.shareInfoToWeixin(3, webUrl, url, description, title);
    };
}


export {weixinModalEvent}