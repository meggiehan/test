import { timeDifference, getDate } from './time';
import {getCertInfo, imgIsUpload} from './string';
import config from '../config/';
import store from './locaStorage';


const  { cacheUserinfoKey, imgPath, backgroundImgUrl, identity } = config;
const hashStr = location.hash;

module.exports = {
    home: {
        cat: (data) => {
            const { id, certificate_type_list, imge_path, state, check_time, price, fish_type_name, specifications, create_time, contact_name, province_name, city_name, personal_authentication_state, enterprise_authentication_state } = data;
            let img = document.createElement('img');
            let text = '';
            // $$.each(certificate_type_list, (index, item) => {
            //     text += item && `<span class="list-cert button ${getCertInfo(item)['classes']}">${getCertInfo(item)['text']}</span>` || '';
            // })
            text += certificate_type_list && certificate_type_list[0] ? `<span class="list-cert button ${getCertInfo(certificate_type_list[0])['classes']}">${getCertInfo(certificate_type_list[0])['text']}</span>` : '';
            // const {text, classes} = getCertInfo(certificate_type);
            const apiStr = (hashStr.indexOf('home.html') > -1 && 'cell_selllist') || (hashStr.indexOf('filter.html') > -1 && 'cell_list') || null;
            const clickEvent = apiStr ? `onclick="apiCount('${apiStr}');"` : '';
            let showTime = timeDifference(check_time);
            const userInfo = store.get(cacheUserinfoKey);
            if (userInfo) {
                id == userInfo['id'] && (showTime = timeDifference(create_time));
            }
            let imgStr;
            img.src = imge_path && `${imge_path}${imgPath(11)}`;
            imgStr = img.complete ? '<img src="' + `${imge_path}${imgPath(11)}` + '"/></div>' :
                '<img data-src="' + `${imge_path && (imge_path + imgPath(11)) || backgroundImgUrl}` + '" src="' + backgroundImgUrl + '" class="lazy"></div>';
            let res = '';
            let span = '';
            0 == state && (span = '<span>待审核</span>');
            2 == state && (span = '<span class="iconfont icon-info">审核未通过</span>')
            res += '<a class="row cat-list-info" href="./views/selldetail.html?id=' + id + '" '+clickEvent+'>' +
                '<div class="col-30">' + span + imgStr +
                '<div class="col-70">' +
                '<div class="cat-list-title row">' +
                '<div class="col-60 goods-name">' + fish_type_name + '</div>' +
                '<div class="col-40 goods-price">' + `${price || '面议'}` + '</div>' +
                '</div>' +
                '<div class="row cat-list-text">' +
                '<div class="col-70 goods-weight">' + `${specifications || ''}` + '</div>' +
                '<div class="col-30 goods-create-time">' + showTime + '</div>' +
                '</div>' +
                '<div class="cat-list-address">' +
                '<span>' + `${contact_name || ''}` + '</span> ' + `${province_name || ''}${city_name || ''}` +
                '</div>' +
                '<div class="cat-list-tags">'
            if (personal_authentication_state === 1 || enterprise_authentication_state === 1) {
                res += '<span class="iconfont icon-v button">实名认证</span>';
                res += text || '';
            }
            res += '</div></div>';
            return res;
        },
        buy: (data) => {
            const { id, fish_type_name, stock, check_time, state, specifications, create_time, contact_name, province_name, city_name, personal_authentication_state, enterprise_authentication_state } = data;
            const isV = personal_authentication_state === 1 || enterprise_authentication_state === 1;
            const apiStr = (hashStr.indexOf('home.html') > -1 && 'cell_purchaselist') || (hashStr.indexOf('filter.html') > -1 && 'cell_list') || null;
            const clickEvent = apiStr ? `onclick="apiCount('${apiStr}');"` : '';
            let img = document.createElement('img');
            let showTime = timeDifference(check_time);
            const userInfo = store.get(cacheUserinfoKey);
            if (userInfo) {
                id == userInfo['id'] && (showTime = timeDifference(create_time));
            }
            let res = '';
            let span = '';
            0 == state && (span = '<span>待审核</span>');
            2 == state && (span = '<span class="iconfont icon-info">审核未通过</span>')
            res += '<a href="./views/buydetail.html?id=' + id + '" class="buy-list-info" '+clickEvent+' >' +
                '<div class="row">' +
                '<div class="col-65 buy-name">' + span + fish_type_name + '</div>' +
                '<div class="col-35 buy-price">' + `${stock || ''}` + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-65 buy-spec">规格：' + `${specifications || ''}` + '</div>' +
                '<div class="col-35 buy-time">' + showTime + '</div>' +
                '</div>' +
                '<div class="home-buy-address">' +
                '<span class="' + `${isV && "iconfont icon-v"}` + '">' + `${contact_name || '匿名用户'}` + '</span>' + `指定产地：${province_name || ''}${city_name || ''}` +
                '</div>'
            return res;
        }
    },
    search: {
        link: (data, release, type) => {
            const { name, id, parant_id, parant_name } = data;
            let li = '';
            li += release ? `<a href="views/releaseInfo.html?type=${type}&fishId=${id}&fishName=${name}&parentFishId=${parant_id}&parentFishName=${parant_name}">${name}</a>`:
                            `<a href="views/filter.html?id=${id}&search=true" data-reload="true">${name}</a>`;
            return li;
        },
        historyLink: (data) => {
            if (!data) {
                return;
            }
            const val = decodeURI(data);
            return `<a href="views/filter.html?keyvalue=${val}&type=2&search=true" data-reload="true">${val}</a>`;
        }
    },
    selldetail: {
        cert: (data) => {
            const { type, fish_type_name, path, state } = data;
            let link = '';
            const {label, text, classes, certName} = getCertInfo(type);
            link += '<a class="iconfont icon-right open-cert-button" data-url="' + path + '">' +
                '<span class="cert-label ' + classes + '">' + label + '</span>' + `具备“${certName}”-${fish_type_name}` + 
                '</a>'
            return link;
        }
    },
    filter: {
        fishType: (data, classes) => {
            const {
                name,
                id,
                parant_id,
                parant_name
            } = data;
            return `<span class="${classes || ''}" data-id="${id}" data-parent-id="${parant_id}" data-parent-name="${parant_name}">${name}</span>`;
        },
        searchResultNull: () => {

        },
        districtRender: (data, classes) => {
            const {
                name,
                postcode
            } = data;
            return `<span class="${classes || ''}" data-postcode="${postcode}">${name}</span>`;
        },
    },
    fishCert: {
        certList: (data, index) => {
            const { state, path, id, closing_date, type, reasons_for_refusal } = data;

            let img = document.createElement('img');
            let imgStr;
            img.src = path && `${path + identity['catCompany']}`;
            imgStr = '<img src="' + `${path + identity['catCompany']}` + '"/>';
            let reviewText = 0 == state && '审核中' || 2 == state && '审核未通过';
            let itemBottom = '';
            if (1 !== state) {
                itemBottom += '<p class="fish-cert-button">';
                itemBottom += 2 == state ? '<span class="fish-cert-reupload" data-id="' + id + '" style="margin-right: 0.5rem">重新上传</span>' : '';
                itemBottom += '<span class="fish-cert-delete" data-id="' + id + '" data-index="' + index + '">删除</span></p>'
            }
            const spans = 2 == state ? `<span class="cat-cert-faild-info ps-a" data-info="${reasons_for_refusal}">查看原因</span>` : '';
            let str = '';
            
            str += `<div class="col-50" data-parent-id="${id}">`;
            str += `<div class="ps-r">${spans}${imgStr}</div>`;
            str += 1 == state ? `<p class="cert-name">${getCertInfo(type).certName}</p>` : '';
            str += 1 !== state ? `<p class="cert-name">${reviewText}</p>` : '';
            str += 1 == state ? `<p class="cert-create-time">有效期至${getDate(closing_date)}</p>` : '';
            str += itemBottom;
            str += '</div>';
            return str;
        }
    }
}
