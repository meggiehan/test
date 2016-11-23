import { timeDifference, getDate, getDealTime } from './time';
import { getCertInfo, imgIsUpload, getName } from './string';
import config from '../config/';
import store from './locaStorage';


const { cacheUserinfoKey, imgPath, backgroundImgUrl, identity } = config;
const hashStr = location.hash;

module.exports = {
    home: {
        cat: (data, userLevel, nameAuthentication) => {
            const {
                id,
                level,
                state,
                price,
                specifications,
                imgs,
                title
            } = data;
            const certificate_type_list = data['certificate_type_list'] || data['certificateTypeList'];
            const imge_path = data['imge_path'] || data['imgePath'];
            const fish_type_name = data['fish_type_name'] || data['fishTypeName'];
            const check_time = data['check_time'] || data['checkTime'];
            const create_time = data['create_time'] || data['createTime'];
            const contact_name = data['contact_name'] || data['contactName'];
            const province_name = data['province_name'] || data['provinceName'];
            const city_name = data['city_name'] || data['cityName'];
            const personal_authentication_state = data['personal_authentication_state'] || data['personalAuthenticationState'];
            const enterprise_authentication_state = data['enterprise_authentication_state'] || data['enterpriseAuthenticationState'];
            let img = document.createElement('img');
            let infoImgs;
            imgs && JSON.parse(imgs).length ? (infoImgs = JSON.parse(imgs)) : (infoImgs = [imge_path]);
            const currentLevel = level && level || userLevel;

            const apiStr = (hashStr.indexOf('home.html') > -1 && 'cell_selllist') || (hashStr.indexOf('filter.html') > -1 && 'cell_list') || null;
            const clickEvent = apiStr ? `onclick="apiCount('${apiStr}');"` : '';
            let showTime = timeDifference(check_time);
            const userInfo = store.get(cacheUserinfoKey);
            if (userInfo) {
                id == userInfo['id'] && (showTime = timeDifference(create_time));
            }
            let imgStr;
            img.src = `${infoImgs[0]}${imgPath(11)}`;
            imgStr = img.complete ? '<img src="' + `${infoImgs[0] + imgPath(11)}` + '"/></div>' :
                '<img data-src="' + `${infoImgs.length && (infoImgs[0] + imgPath(11)) || backgroundImgUrl}` + '" src="' + backgroundImgUrl + '" class="lazy"></div>';
            let res = '';
            let span = '';
            const authText = (personal_authentication_state === 1 || enterprise_authentication_state === 1 || 1 === nameAuthentication) && '实名' || null;
            0 == state && (span = '<span>待审核</span>');
            2 == state && (span = '<span class="iconfont icon-info">审核未通过</span>')
            1 == state && infoImgs.length > 1 && (span = '<span class="sell-list-imgs">多图</span>');
            res += '<a class="row cat-list-info" href="./views/selldetail.html?id=' + id + '" ' + clickEvent + '>' +
                '<div class="col-30 ps-r">' + span + imgStr +
                '<div class="col-70">' +
                '<div class="cat-list-title row">' +
                '<div class="col-60 goods-name">' + fish_type_name + '</div>' +
                '<div class="col-40 goods-price">' + `${price || '面议'}` + '</div>' +
                '</div>' +
                '<div class="row cat-list-text">' + `${province_name + city_name}${specifications && '    |    ' + specifications || ''}` + '</div>' +
                '<div class="cat-list-title-auth">' +
                `${title && '<span><b>特</b><i>'+ title +'</i></span>'|| '' }` +
                `${authText && '<b>'+authText+'</b>' || ''}` +
                '</div>' +
                '<div class="cat-list-user-name">' +
                `<span class="user-name">${contact_name || '匿名用户'}<b class="${currentLevel ? 'iconfont icon-v' + currentLevel : ''}"></b></span>` +
                `<span class="user-release-time">${showTime}</span>` +
                '</div>' +
                '<div class="cat-list-tags">';
            if (certificate_type_list && certificate_type_list.length) {
                $$.each(certificate_type_list, (index, item) => {
                    const {classes, label, certName} = getCertInfo(item);
                    res += '<p>' +
                        '<span class="cert-label ' + classes + '">' + label + '</span>' + `具备“${certName}”` +
                        '</p>'
                })
            }
            res += '</div></div></a>';
            return res;
        },
        buy: (data, userLevel) => {
            const {
                id,
                level,
                stock,
                state,
                specifications,
            } = data;
            const certificate_type_list = data['certificate_type_list'] || data['certificateTypeList'];
            const imge_path = data['imge_path'] || data['imgePath'];
            const fish_type_name = data['fish_type_name'] || data['fishTypeName'];
            const check_time = data['check_time'] || data['checkTime'];
            const create_time = data['create_time'] || data['createTime'];
            const contact_name = data['contact_name'] || data['contactName'];
            const province_name = data['province_name'] || data['provinceName'];
            const city_name = data['city_name'] || data['cityName'];
            const personal_authentication_state = data['personal_authentication_state'] || data['personalAuthenticationState'];
            const enterprise_authentication_state = data['enterprise_authentication_state'] || data['enterpriseAuthenticationState'];
            // const isV = personal_authentication_state === 1 || enterprise_authentication_state === 1;
            const apiStr = (hashStr.indexOf('home.html') > -1 && 'cell_purchaselist') || (hashStr.indexOf('filter.html') > -1 && 'cell_list') || null;
            let img = document.createElement('img');
            let showTime = timeDifference(check_time);
            const userInfo = store.get(cacheUserinfoKey);
            const isAuth = (1 == personal_authentication_state) || (1 == enterprise_authentication_state) || false;
            if (userInfo) {
                id == userInfo['id'] && (showTime = timeDifference(create_time));
            }
            const currentLevel = level && level || userLevel;
            let res = '';
            let span = '';
            0 == state && (span = '<span>待审核</span>');
            2 == state && (span = '<span class="iconfont icon-info">审核未通过</span>')
            res += '<a href="./views/buydetail.html?id=' + id + '" class="buy-list-info">' +
                '<div class="row">' +
                '<div class="col-65 buy-name">' + span + fish_type_name + '</div>' +
                '<div class="col-35 buy-price">' + `${stock || ''}` + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-65 buy-address">' + `所在地区：${province_name || ''}${city_name || ''}` + '</div>' +
                '<div class="col-35 buy-time">' + showTime + '</div>' +
                '</div>' +
                `<div class="row ${!specifications && 'hide'}">` + 
                    '<div class="col-65 buy-spec">规格：' + `${specifications || ''}` + '</div>' +
                '</div>'+
                '<div class="home-buy-address">' +
                `${isAuth ? '<span class="buy-list-auth">实名</span>' :''} <span>${contact_name || '匿名用户'}</span>${currentLevel ? '<span class="iconfont icon-v' + currentLevel +'" style="margin:0;font-size: 2rem;"></span>' : ''}` +
                '</div>'
            return res;
        },
        dealInfo: (data) => {
            const {
                provinceName,
                fishTypeName,
                userName,
                quantity,
                tradeDate
            } = data;
            return `<div class="home-deal-info">[${provinceName}]<span class="deal-list-name">${getName(userName)}</span><span class="deal-list-category">${fishTypeName} ${quantity}斤</span>, ${getDealTime(tradeDate)}</div>`
        }
    },
    search: {
        link: (data, release, type) => {
            const {
                name,
                id,
                parant_id,
                parant_name
            } = data;
            let li = '';
            li += release ? `<a href="views/releaseInfo.html?type=${type}&fishId=${id}&fishName=${name}&parentFishId=${parant_id}&parentFishName=${parant_name}">${name}</a>` :
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
            const {
                type,
                fish_type_name,
                path,
                state
            } = data;
            let link = '';
            const { label, text, classes, certName } = getCertInfo(type);
            link += '<a class="iconfont icon-right open-cert-button" data-url="' + `${path}@1o` + '">' +
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
            const {
                state,
                path,
                id,
                closing_date,
                type,
                reasons_for_refusal
            } = data;

            let imgStr = '<img src="' + `${path + identity['catCompany']}` + '"/>';
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
    },
    invite: {
        inviteList: (data, isLast) => {
            const {
                nickname,
                phone,
                createTime
            } = data;
            let html = '';
            html += `<div class="row ${isLast ? 'last' : ''}">` +
                `<span class="col-33 left">${phone || ''}</span>` +
                `<span class="col-33">${nickname || ''}</span>` +
                `<span class="col-33 invite-time right">${getDate(createTime*0.001, true)}</span>` +
                '</div>';
            return html;
        }
    },
    deal: {
        list: (data) => {
            const {
                provinceName,
                cityName,
                fishTypeName,
                userName,
                quantity,
                tradeDate,
                personAuth,
                enterpriseAuth,
                level,
                imgUrl
            } = data;
            let res = '';
            res += '<a>' +
                `<p class="deal-list-title">${fishTypeName} ${quantity}斤 <span>${provinceName}${cityName||''}</span></p>` +
                '<p class="deal-list-user-info">' +
                `<img src="${imgUrl && imgUrl + imgPath(4) || 'img/defimg.png'}">` +
                `<span class="deal-list-user-name">${getName(userName)}</span>` +
                `<span class="deal-list-time">${getDealTime(tradeDate)}达成交易</span>` +
                '</p>' +
                '<p>' +
                `${1 == personAuth && '<span class="list-cert-style">个人认证用户</span>' || ''}` +
                `${1 == enterpriseAuth && '<span class="list-cert-style">企业认证用户</span>' || ''}` +
                `${level && '<span class="list-cert-style">' + level + '级用户</span>' || ''}` +
                '</p>' +
                '</a>';
            return res;
        }
    },
    releaseInfo: {
        picList: (imgurl, currentPage) => {
            const isFist = currentPage.find('.release-info-pic-list').children('span').length == 0;
            let res = '';
            res += '<span class="col-20">' +
                `<img class="release-info-img" src="${imgurl}${imgPath(9)}" alt="">` +
                '<b class="iconfont icon-clear remove-release-img-btn"></b>' +
                `${isFist && '<span>封面</span>' || ''}` +
                '</span>'
            return res;
        },
        addPicBtn: () => {
            let span = '';
            const height = (($$(window).width() - 7) * 18.1 * 0.01).toFixed(2);
            span += '<span class="col-20 release-info-pic-add add" style="height:' + height + 'px;overflow:hidden;">' +
                `<i class="iconfont icon-add add" style="line-height:${height*0.5}px"></i>` +
                `<p class="add" style="line-height:${height*0.4}px">添加图片</p>` +
                '</span>'
            return span;
        },
        tag: (data) => {
            const { id, name } = data;
            return `<span data-id="${id}">${name}</span>`;
        }
    }




}
