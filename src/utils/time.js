module.exports = {
    timeDifference: (unix) => {
        if (unix == "" || unix == null) {
            return;
        }
        var today = new Date();
        var unixs = new Date((unix * 1000));

        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hour = today.getHours();
        var min = today.getMinutes();
        var second = today.getSeconds();

        var unixMonth = parseInt(unixs.getMonth() + 1);
        var unixday = unixs.getDate();
        //console.log(unixs + "" +unixMonth + "**" + unixday);


        var todayZero = year + "/" + month + "/" + day;
        //console.log(todayZero);

        var currentUnix = Date.parse(new Date(today)) / 1000; //当前时间戳
        var todayZeroUnix = Date.parse(new Date(todayZero)) / 1000; //当天凌晨时间戳
        var yestedayZeroUnix = parseInt(todayZeroUnix - 24 * 60 * 60); //昨天凌晨时间戳
        var qiantianZeroUnix = parseInt(yestedayZeroUnix - 24 * 60 * 60); //前天凌晨
        var unixDefi = parseInt(currentUnix - unix); //时间戳差
        var todayZero = "";
        var temp = "";
        var mint = "";
        var hourt = "";
        //刚刚
        if (unixDefi <= 60) {
            temp = "刚刚";
        } else if (unixDefi > 60 && unixDefi <= 60 * 60) { //几分钟之前
            min = parseInt(unixDefi / 60);
            temp = min + "分钟前";
        } else if (unix < currentUnix && unix > todayZeroUnix) { //几小时之前
            hourt = parseInt((currentUnix - unix) / (60 * 60));
            temp = hourt + "小时前";
        } else if (unix > yestedayZeroUnix && unix <= todayZeroUnix) { //昨天
            temp = "昨天";
        } else if (unix < yestedayZeroUnix && unix >= qiantianZeroUnix) { //前天
            temp = "前天";
        } else {
            temp = unixMonth + "月" + unixday + "日";
        }
        return temp;
    },
    centerShowTime: (unix) => {
        if (!unix) {
            return '';
        }
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hour = today.getHours();
        var min = today.getMinutes();
        var second = today.getSeconds();

        var todayZero = year + "/" + month + "/" + day;

        var currentUnix = Date.parse(new Date(today)) / 1000; //当前时间戳
        var unixDefi = parseInt(currentUnix - unix); //时间戳差
        var temp = "";

        if (unixDefi < 60 * 60) { //1小时内
            min = parseInt(unixDefi / 60);
            temp = "刚刚来过";
        } else if (unixDefi >= 60*60 && unixDefi < 60*60*24) { //几小时之前
            temp = parseInt(unixDefi / (60 * 60)) + "小时前来过";
        } else if (unixDefi >= 60*60*24 && unixDefi < 60*60*24*7) {
            temp = parseInt(unixDefi / (60 * 60 * 24)) + "天前来过";
        } else {
            temp = "一周前来过";
        }
        return temp;
    },
    getDate: (time, type) => {
        if(!time){
            return '';
        }
        var test = new Date(parseInt(time) * 1000);
        var $_year = test.getFullYear();
        var $_month = parseInt(test.getMonth()) + 1;
        var $_day = test.getDate();
        var $_f_date = $_year + "年" + $_month + "月" + $_day + "日";
        if(!type){
            return $_f_date;
        }
        var $_hours = test.getHours();
        var $_minute = test.getMinutes() > 9 ? test.getMinutes() : `0${test.getMinutes()}`;
        return `${$_month}月${$_day}日${$_hours}:${$_minute}`;
    },
    getDealTime: (data) => {
        if(!data){
            return '';
        }
        var test = new Date(parseInt(data));
        var m = parseInt(test.getMonth()) + 1;
        var d = test.getDate();
        var nowTime = new Date().getTime();
        let res;
        if(nowTime - test <= 60*60*24*1000){
            res = '今天';
        }else if(nowTime - test > 60*60*24*1000 && nowTime - test <= 60*60*24*1000*2){
            res = '昨天';
        }else{
            res = `${m}月${d}日`;
        }
        return res;
    },
    fishCarActiveTime: (date) => {
        if(!date){
            return '';
        }
        const currentTime = new Date().getTime();
        const itemTime = date * 1000;
        let res = '';
        if(currentTime - itemTime <= 60*60*1000){
            res = '刚刚活跃';
        }else if(60*60*1000 < (currentTime - itemTime) && (currentTime - itemTime) <= 60*60*1000*24){
            res = '今天活跃';
        }else if(60*60*1000*24*2 >= (currentTime - itemTime) && (currentTime - itemTime) > 60*60*1000*24){
            res = '昨天活跃';
        }else if(60*60*1000*24*7 >= (currentTime - itemTime) && (currentTime - itemTime) > 60*60*1000*24*2){
            res = `${parseInt((currentTime - itemTime)/(60*60*1000*24))}天前活跃`;
        }else if((currentTime - itemTime) > 60*60*1000*24*7){
            res ='7天前活跃';
        }
        return res;
    },
    getBeforedawnTime: () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return `${year}/${month}/${day}`;
    }

}





