import ShareBusinessCardModel from './ShareBusinessCardModel';
import {
    getBusinessCardStr
} from '../../../utils/string';
import store from '../../../utils/localStorage';

function shareBusinessCardCtrl(userInfo,
                               qrCode,
                               qrCodeBg,
                               levelPic,
                               headImg,
                               currentPage,
                               authText) {
    const businessCardStrCacheSaveKey = 'businessCardStrCache';
    const businessCardUrlCacheSaveKey = 'businessCardUrlCache';
    const BG_WIDTH = 500;
    const BG_HEIGHT = 764;

    const businessCardStr = getBusinessCardStr(userInfo);
    const businessCardStrCache = store.get(businessCardStrCacheSaveKey);
    let bgLoad = false;
    let imgHeadLoad = false;

    const {
        buyNumber,
        sellNumber,
        nickname
    } = userInfo;

    /**
     * 分享个人卡片
     * */

    const drawImageBase64 = (ctx, canvasBox) => {
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

        if (authText) {
            ctx.beginPath();
            ctx.fillStyle = "#FFBE44";
            ctx.fillRect(188, 200, 124, 27);
            ctx.font = "16px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText(`已完成${authText}`, 194, 220);
        }

        ctx.font = "22px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText((nickname || '匿名用户'), 215, 275);


        ctx.save();
        console.log(bgLoad, imgHeadLoad);
        const img = new Image();
        img.src = canvasBox.toDataURL("image/png");

        return canvasBox.toDataURL("image/png");
    };
    const getBase64Code = () => {
        const canvas = document.createElement('canvas');
        canvas.crossOrigin = "Anonymous";
        canvas.id = 'canvasBox';
        currentPage.append(canvas);

        const canvasBox = currentPage.find('#canvasBox')[0];
        const ctx = canvasBox.getContext("2d");
        canvasBox.width = BG_WIDTH;
        canvasBox.height = BG_HEIGHT;

        if(imgHeadLoad && bgLoad){
            drawImageBase64(ctx, canvasBox);
        }else{
            qrCodeBg[0].onload = () => {
                bgLoad = true;
                if (!imgHeadLoad) {
                    return;
                }
                drawImageBase64(ctx, canvasBox);
            };
            headImg[0].onload = () => {
                imgHeadLoad = true;
                if (!bgLoad) {
                    return;
                }
                drawImageBase64(ctx, canvasBox);
            }
        }
    };

    if (businessCardStr !== businessCardStrCache) {
        const sharePicBaseCode = getBase64Code();

    }else{
        console.log(123)
    }


}

export {
    shareBusinessCardCtrl
}