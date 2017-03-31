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
                               authText,
                               callback) {
    const businessCardStrCacheSaveKey = 'businessCardStrCache'; //作为名片信息更新对比的key
    const businessCardUrlCacheSaveKey = 'businessCardUrlCache'; //上传之后返回的名片url
    const BG_WIDTH = 600;
    const BG_HEIGHT = 917;

    const businessCardStr = getBusinessCardStr(userInfo); //获取当前名片对比的key
    const businessCardStrCache = store.get(businessCardStrCacheSaveKey); //获取上次上传图片返回的url

    const {
        buyNumber,
        sellNumber,
        nickname,
        publishedDemandsCount
    } = userInfo;

    /**
     * 分享个人卡片
     * 画布的操作
     * */
    const drawImageBase64 = (ctx, canvasBox) => {
        try {
            ctx.drawImage(qrCodeBg[0], 2, 2, BG_WIDTH, BG_HEIGHT);
            ctx.drawImage(levelPic[0], 122, 152, 50, 50);
            ctx.drawImage(qrCode[0], 236, 464, 132, 132);

            ctx.beginPath();
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.arc(292, 202, 64, 0, 2 * Math.PI);
            ctx.fill();
            ctx.drawImage(headImg[0], 232, 142, 120, 120);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText((publishedDemandsCount), 420, 192);

            if (authText) {
                ctx.beginPath();
                ctx.fillStyle = "#FFBE44";
                ctx.fillRect(222, 247, 140, 30);
                ctx.font = "16px Arial";
                ctx.fillStyle = "#fff";
                ctx.fillText(`已完成${authText}`, 234, 267);
            }

            ctx.font = "22px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText((nickname || '匿名用户'), 262, 330);
            ctx.save();
            return canvasBox.toDataURL("image/png");
        } catch (err) {
            return 'error'
        }
    };
    const getBase64Code = () => {
        const canvas = document.createElement('canvas');
        canvas.crossOrigin = "Anonymous";
        canvas.id = 'canvasBox';
        currentPage.append(canvas);

        const canvasBox = currentPage.find('#canvasBox')[0];
        const ctx = canvasBox.getContext("2d");
        canvasBox.width = BG_WIDTH + 4;
        canvasBox.height = BG_HEIGHT + 4;

        return drawImageBase64(ctx, canvasBox);
    };

    //如果当前用户信息没有变化且还有之前服务器返回的名片url，则不生成图片上传。
    if (businessCardStr == businessCardStrCache && store.get(businessCardUrlCacheSaveKey)) {
        callback({
            code: 1,
            data: store.get(businessCardUrlCacheSaveKey)
        });
    } else {
        if (currentPage.find('#canvasBox').length) {
            currentPage.find('#canvasBox').remove();
        }
        const sharePicBaseCode = getBase64Code();
        if('error' == getBase64Code()){
            callback('error');
            return;
        }
        ShareBusinessCardModel.post({data: sharePicBaseCode}, (res) => {
            const {
                code,
                data
            } = res;
            if (1 == code) {
                store.set(businessCardStrCacheSaveKey, businessCardStr);
                store.set(businessCardUrlCacheSaveKey, data);
            }
            callback(res);
        })
    }
}

export {
    shareBusinessCardCtrl
}