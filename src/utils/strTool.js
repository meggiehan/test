/**
 * [exports 由于string.js中的方法太过于耦合，不利于测试！]
 * 为了方便与单元测试新建的字符串处理
 */
module.exports = {
    getUnit (val){
        if(!val.toString().length){
            return '';
        }
        const arr = [
            {text: '斤', val: 0},
            {text: '尾', val: 1},
            {text: '只', val: 2}
        ];
        let res = '';
        for(let i = 0;i < arr.length;i++){
            val == arr[i].text && (res = arr[i].val);
            val == arr[i].val && (res = arr[i].text);
        }
        return res;
    },

    getBuyTime (time){
        let res = '';
        if(!time){
            res = '长期收购';
        }else{
            const differenceTime = parseInt((time * 1000 - new Date().getTime()) / (60 * 60 * 24 * 1000 * 30), 10);
            if(0 < differenceTime && differenceTime < 1){
                res = '一个月内收购';
            }else if(1 < differenceTime && differenceTime < 2){
                res = '两个月内收购';
            }else if(2 < differenceTime && differenceTime < 3){
                res = '三个月内收购';
            }else{
                res = '长期收购';
            }
        }
        return res;
    }
};
