import { timeDifference } from './time';
import config from '../config/';
const { backgroundImgUrl, imgPath } = config;

module.exports = {
    home: {
        cat: (data) => {
            const { id, imge_path, price, fish_type_name, specifications, create_time, contact_name, province_name, city_name, personal_authentication_state, enterprise_authentication_state } = data;
            let res = '';
            res += '<a class="row cat-list-info" href="./views/selldetail.html?id=' + id + '">' +
                '<div class="col-30"><img data-src="' + `${imge_path && (imge_path + imgPath(11)) || backgroundImgUrl}` + '" src="' + backgroundImgUrl + '" class="lazy-fadeIn lazy lazy-loaded"></div>' +
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
            li += '<a href="' + `views/filter.html?id=${id}` + '">' + name + '</a>';
            return li;
        }
    },
    selldetail: {
        cert: (data) => {
            const { type, fish_type_name, path, state } = data;
            let link = '';
            let className;
            let text;
            let label;
            if(type === 1){
                className = 'seedling';
                text = `具备“苗种生产许可证” - ${fish_type_name}`;
                label = '苗';
            }else if(2 === type){
                className = 'water';
                text = `具备“水产养殖许可证” - ${fish_type_name}`;
                label = '水';
            }else if(3 === type){
                className = 'cert';
                text = `具备“检验检疫合格证” - ${fish_type_name}`;
                label = '检';
            }else if(4 === type){
                className = 'water';
                text = `具备“无公害农产品产地认证证书” - ${fish_type_name}`;
                label = '检';
            }else if(5 === type){
                className = 'water';
                text = `具备“绿色食品证书” - ${fish_type_name}`;
                label = '绿';
            }else if(6 === type){
                className = 'water';
                text = `具备“有机产品认证证书” - ${fish_type_name}`;
                label = '有';
            }
            link += '<a class="iconfont icon-right open-cert-button" data-url="'+ path +'">' +
                        '<span class="cert-label '+ className +'">'+ label +'</span>' + text +
                    '</a>'
            return link;
        }
    },
    filter: {
        fishType: (data, classes) => {
            const {
                name, id, parant_id, parant_name
            } = data;
            return `<span class="${classes || ''}" data-id="${id}" data-parent-id="${parant_id}" data-parent-name="${parant_name}">${name}</span>`;
        },
        searchResultNull: () => {

        },
        districtRender: (data, classes) => {
            const {
                name, postcode
            } = data;
            return `<span class="${classes || ''}" data-postcode="${postcode}">${name}</span>`;
        },
    }
}
