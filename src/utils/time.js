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
    }
}
