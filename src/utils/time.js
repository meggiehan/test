module.exports = {
    timeDifference: (unix) => {
        if (unix == '' || unix == null){
            return;
        }
        var today = new Date();
        var unixs = new Date((unix * 1000));

        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var min = today.getMinutes();

        var unixMonth = parseInt(unixs.getMonth() + 1, 10);
        var unixday = unixs.getDate();
        // console.log(unixs + "" +unixMonth + "**" + unixday);

        var todayZero = year + '/' + month + '/' + day;
        // console.log(todayZero);

        var currentUnix = Date.parse(new Date(today)) / 1000; // 当前时间戳
        var todayZeroUnix = Date.parse(new Date(todayZero)) / 1000; // 当天凌晨时间戳
        var yestedayZeroUnix = parseInt(todayZeroUnix - 24 * 60 * 60, 10); // 昨天凌晨时间戳
        var qiantianZeroUnix = parseInt(yestedayZeroUnix - 24 * 60 * 60, 10); // 前天凌晨
        var unixDefi = parseInt(currentUnix - unix, 10); // 时间戳差
        var temp = '';
        var hourt = '';
        // 刚刚
        if (unixDefi <= 60){
            temp = '刚刚';
        } else if (unixDefi > 60 && unixDefi <= 60 * 60){ // 几分钟之前
            min = parseInt(unixDefi / 60, 10);
            temp = min + '分钟前';
        } else if (unix < currentUnix && unix > todayZeroUnix){ // 几小时之前
            hourt = parseInt((currentUnix - unix) / (60 * 60), 10);
            temp = hourt + '小时前';
        } else if (unix > yestedayZeroUnix && unix <= todayZeroUnix){ // 昨天
            temp = '昨天';
        } else if (unix < yestedayZeroUnix && unix >= qiantianZeroUnix){ // 前天
            temp = '前天';
        } else {
            temp = unixMonth + '月' + unixday + '日';
        }
        return temp;
    },
    centerShowTime: (unix) => {
        if (!unix){
            return '';
        }
        var today = new Date();

        var currentUnix = Date.parse(new Date(today)) / 1000; // 当前时间戳
        var unixDefi = parseInt(currentUnix - unix, 10); // 时间戳差
        var temp = '';

        if (unixDefi < 60 * 60){ // 1小时内
            temp = '刚刚来过';
        } else if (unixDefi >= 60 * 60 && unixDefi < 60 * 60 * 24){ // 几小时之前
            temp = parseInt(unixDefi / (60 * 60), 10) + '小时前来过';
        } else if (unixDefi >= 60 * 60 * 24 && unixDefi < 60 * 60 * 24 * 7){
            temp = parseInt(unixDefi / (60 * 60 * 24), 10) + '天前来过';
        } else {
            temp = '一周前来过';
        }
        return temp;
    },
    getDate: (time, type) => {
        if(!time){
            return '';
        }
        var test = new Date(parseInt(time, 10) * 1000);
        var $year = test.getFullYear();
        var $month = parseInt(test.getMonth(), 10) + 1;
        var $day = test.getDate();
        var $fdate = $year + '年' + $month + '月' + $day + '日';
        if(!type){
            return $fdate;
        }
        var $hours = test.getHours();
        var $minute = test.getMinutes() > 9 ? test.getMinutes() : `0${test.getMinutes()}`;
        return `${$month}月${$day}日${$hours}:${$minute}`;
    },
    getDealTime: (data) => {
        if(!data){
            return '';
        }
        var test = new Date(parseInt(data, 10));
        var m = parseInt(test.getMonth(), 10) + 1;
        var d = test.getDate();
        var nowTime = new Date().getTime();
        let res;
        if(nowTime - test <= 60 * 60 * 24 * 1000){
            res = '今天';
        }else if(nowTime - test > 60 * 60 * 24 * 1000 && nowTime - test <= 60 * 60 * 24 * 1000 * 2){
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
        if(currentTime - itemTime <= 60 * 60 * 1000){
            res = '刚刚活跃';
        }else if(60 * 60 * 1000 < (currentTime - itemTime) && (currentTime - itemTime) <= 60 * 60 * 1000 * 24){
            res = '今天活跃';
        }else if(60 * 60 * 1000 * 24 * 2 >= (currentTime - itemTime) && (currentTime - itemTime) > 60 * 60 * 1000 * 24){
            res = '昨天活跃';
        }else if(60 * 60 * 1000 * 24 * 7 >= (currentTime - itemTime) && (currentTime - itemTime) > 60 * 60 * 1000 * 24 * 2){
            res = `${parseInt((currentTime - itemTime) / (60 * 60 * 1000 * 24), 10)}天前活跃`;
        }else if((currentTime - itemTime) > 60 * 60 * 1000 * 24 * 7){
            res = '7天前活跃';
        }
        return res;
    },
    getBeforedawnTime: () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return `${year}/${month}/${day}`;
    },
    getMarketTimeStr (time){
        if(!time){
            return '';
        }
        const year = new Date(time * 1000).getFullYear();
        const month = new Date(time * 1000).getMonth() + 1;
        const day = new Date(time * 1000).getDate();
        let timeStr = '';
        if(day <= 10){
            timeStr = '上旬';
        }

        if(day <= 20 && day > 10){
            timeStr = '中旬';
        }

        if(day > 20){
            timeStr = '下旬';
        }
        return `预售产品，${year}年${month}月${timeStr}开卖`;
    }
};
