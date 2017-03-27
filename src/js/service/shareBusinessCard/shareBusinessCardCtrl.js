import ShareBusinessCardModel from './ShareBusinessCardModel';
import {
    getBusinessCardStr
} from '../../../utils/string';
import store from '../../../utils/localStorage';

function shareBusinessCardCtrl(userInfo, qrCode, qrCodeBg, levelPic, headImg, currentPage) {
    const businessCardStrCacheSaveKey = 'businessCardStrCache';
    const businessCardUrlCacheSaveKey = 'businessCardUrlCache';
    const BG_WIDTH = 500;
    const BG_HEIGHT = 764;

    const businessCardStr = getBusinessCardStr(userInfo);
    const businessCardStrCache = store.get(businessCardStrCacheSaveKey);

    const {
        buyNumber,
        sellNumber,
        enterpriseAuthenticationState,
        personalAuthenticationState,
        nickname
    } = userInfo;

    /**
     * 分享个人卡片
     * */
    if ((businessCardStr !== businessCardStrCache) || !store.get(businessCardUrlCacheSaveKey)) {
        const canvas = document.createElement('canvas');
        canvas.crossOrigin = "Anonymous";
        let bgLoad = false;
        let imgHeadLoad = false;
        canvas.id = 'canvasBox';
        currentPage.append(canvas);

        const canvasBox = currentPage.find('#canvasBox')[0];
        const ctx = canvasBox.getContext("2d");
        canvasBox.width = BG_WIDTH;
        canvasBox.height = BG_HEIGHT;
        const drawImageBase64 = () => {
            ctx.drawImage(qrCodeBg[0], 0, 0, BG_WIDTH, BG_HEIGHT);
            ctx.drawImage(levelPic[0], 100, 120, 50, 50);
            ctx.drawImage(qrCode[0], 195, 385, 110, 110);

            ctx.beginPath();
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.arc(250, 165, 53, 0, 2 * Math.PI);
            ctx.fill();
            ctx.drawImage(headImg[0], 200, 115, 100, 100);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText((buyNumber + sellNumber), 348, 160);

            ctx.font = "22px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText((nickname || '匿名用户'), 215, 275);


            ctx.save();
            console.log(bgLoad, imgHeadLoad);
            let image = new Image();
            image.crossOrigin = "anonymous";
            image.src = canvasBox.toDataURL("image/png");
            window.open(canvasBox.toDataURL("image/png"), true);
        };

        qrCodeBg[0].onload = () => {
            bgLoad = true;
            if (!imgHeadLoad) {
                return;
            }
            drawImageBase64();
        };

        headImg[0].onload = () => {
            imgHeadLoad = true;
            if (!bgLoad) {
                return;
            }
            drawImageBase64();
        }
    }


}

export {
    shareBusinessCardCtrl
}