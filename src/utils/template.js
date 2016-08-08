import { timeDifference } from './time';
import config from '../config/';
const { backgroundImgUrl } = config;

module.exports = {
    home: {
        cat: (data) => {
            const { id, imge_path, price, fish_type_name, specifications, create_time, contact_name, province_name, city_name, personal_authentication_state, enterprise_authentication_state } = data;
            let res = '';
            res += '<a class="row cat-list-info" href="./views/selldetail.html?id=' + id + '">' +
                '<div class="col-30"><img data-src="' + `${imge_path || backgroundImgUrl}` + '" src="' + backgroundImgUrl + '" class="lazy-fadeIn lazy lazy-loaded"></div>' +
                '<div class="col-70">' +
                '<div class="cat-list-title row">' +
                '<div class="col-60 goods-name">' + fish_type_name + '</div>' +
                '<div class="col-40 goods-price">' + `${price || '面议'}` + '</div>' +
                '</div>' +
                '<div class="row cat-list-text">' +
                '<div class="col-70 goods-weight">' + specifications + '</div>' +
                '<div class="col-30 goods-create-time">' + timeDifference(create_time) + '</div>' +
                '</div>' +
                '<div class="cat-list-address">' +
                '<span>' + contact_name + '</span> ' + `${province_name}${city_name}` +
                '</div>' +
                '<div class="cat-list-tags">'
            if (personal_authentication_state === 1 || enterprise_authentication_state === 1) {
                res += '<span class="iconfont icon-v button">实名认证</span>'
                    //'<span class="button">水产养殖</span>'
            }
            res += '</div></div>';
            return res;
        },
        buy: (data) => {
            const { id, fish_type_name, stock, specifications, create_time, contact_name, province_name, city_name, personal_authentication_state, enterprise_authentication_state } = data;
            const isV = personal_authentication_state === 1 || enterprise_authentication_state === 1;
            let res = '';
            res += '<a href="./views/buydetail.html?id=' + id + '" class="buy-list-info">' +
                '<div class="row">' +
                '<div class="col-65 buy-name">' + fish_type_name + '</div>' +
                '<div class="col-35 buy-price">' + stock + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-65 buy-spec">规格：' + specifications + '</div>' +
                '<div class="col-35 buy-time">' + timeDifference(create_time) + '</div>' +
                '</div>' +
                '<div class="home-buy-address">' +
                '<span class="' + `${isV && "iconfont icon-v"}` + '">' + `${contact_name || '匿名用户'}` + '</span>' + `指定产地：${province_name}${city_name}` +
                '</div>'
            return res
        }
    },
    search: {
        link: (data) => {
            const { name, id } = data;
            let li = '';
            li += '<a href="' + `./views/filter.html?keyvalue＝${name}` + '">' + name + '</a>';
            return li;
        }
    }
}
