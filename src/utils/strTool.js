/**
 * [exports 由于string.js中的方法太过于耦合，不利于测试！]
 * 为了方便与单元测试新建的字符串处理
 */
module.exports = {
    getUnit (val){
        if(!val){
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
    }
};
