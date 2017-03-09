import {timeDifference, getDate, getDealTime} from './time';
import {getCertInfo,
    imgIsUpload,
    getName,
    getInfoStatus,
    getCreateDriverListLabel,
    getFishTankName,
    getFishCarDateStyle
} from './string';
import config from '../config/';
import store from './localStorage';


const {cacheUserinfoKey, imgPath, backgroundImgUrl, identity} = config;
module.exports = {
    home: {
        cat: (data, userLevel, nameAuthentication, isMyList) => {
            const {
                id,
                level,
                state,
                price,
                specifications,
                imgList,
                title,
                refreshed,
                type,
                sort,
                contactName,
                fishCertificateList,
                fishTypeName,
                nameAuthenticated,
                provinceName,
                cityName,
                quantityTagList
            } = data;
            let img = document.createElement('img');
            const currentLevel = level || userLevel;
            let imgStr;
            let res = '';
            let span = '';

            if(imgList){
                img.src = `${imgList[0]}${imgPath(11)}`;
                imgStr = img.complete ? '<img src="' + `${imgList[0] + imgPath(11)}` + '"/></div>' :
                '<img data-src="' + `${(imgList[0] + imgPath(11)) || backgroundImgUrl}` + '" src="' + backgroundImgUrl + '" class="lazy"/></div>';
            }else{
                imgStr = '<img data-src="backgroundImgUrl" /></div>';
            }

            const authText = nameAuthenticated ? '实名' : false;
            imgList && imgList.length > 1 && (span += '<span class="sell-list-imgs">多图</span>');
            res += '<a class="cat-list-info item-content" href="./views/selldetail.html?id=' + id + '" style="padding:2%;">' +
                '<div class="col-30 ps-r item-media">' + span + imgStr +
                '<div class="col-70 item-inner">' +
                '<div class="cat-list-title row">' +
                '<div class="col-60 goods-name">' + fishTypeName + '</div>' +
                '<div class="col-40 goods-price">' + `${price || '面议'}` + '</div>' +
                '</div>' +
                '<div class="row cat-list-text">' + `${(provinceName || '') + (cityName || '')}${(specifications && '    |    ' + specifications || '') || ((quantityTagList && quantityTagList.length ? ( '    |    ' + quantityTagList[0].tagName) : ''))}` + '</div>' +
                '<div class="cat-list-title-auth">' +
                `${title && '<span><b>特</b><i>' + title + '</i></span>' || '' }` +
                `${authText ? '<b>' + authText + '</b>' : ''}` +
                '</div>' +
                '<div class="cat-list-user-name">' +
                `<span class="user-name">${contactName || '匿名用户'}<b class="${currentLevel ? 'iconfont icon-v' + currentLevel : ''}"></b></span>` +
                `<span class="user-release-time">${timeDifference(sort)}</span>` +
                '</div>';

            let certList = '';

            if (!isMyList) {
                certList += '<div class="cat-list-tags">';
                if (fishCertificateList && fishCertificateList.length) {
                    $$.each(fishCertificateList, (index, item) => {
                        const {classes, label, certName} = getCertInfo(item.type);
                        certList += '<p>' +
                            '<span class="cert-label ' + classes + '">' + label + '</span>' + `具备“${certName}”` +
                            '</p>'
                    })
                }
            }
            res += certList;
            res += '</div></div></a>';
            if (isMyList) {
                const {text, className} = getInfoStatus(state);
                const refreshBtn = refreshed ? '<span class="refresh-btn disabled">今天已刷新</span>' : `<span class="refresh-btn" data-id="${id}">刷新信息</span>`;
                res += '<div class="list-check-status">' +
                    `<div><span class="${className} f-l">${text}</span>` +
                    (1 == state ? (refreshBtn + `<span class="sell-list-share" data-type="${type}" data-id="${id}">分享给朋友</span>`) : '') + '</div>' +
                    '<p></p>' +
                    '</div>';
            }
            return res;
        },
        buy: (data, userLevel, nameAuthentication, isMyList) => {
            const {
                id,
                level,
                stock,
                state,
                specifications,
                describe,
                refreshed,
                type,
                sort, //refreshTime
                cityName,
                contactName,
                fishTypeName,
                nameAuthenticated,
                provinceName,
                quantityTagList,
                description
            } = data;
            const isAuth = nameAuthenticated || false;
            const currentLevel = level || userLevel;
            let res = '';

            res += '<a href="./views/buydetail.html?id=' + id + '" class="buy-list-info">' +
                '<div class="row">' +
                '<div class="col-65 buy-name">' + fishTypeName + '</div>' +
                '<div class="col-35 buy-price">' + `${stock || '大量'}` + '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-65 buy-address">' + `所在地区：${provinceName || ''}${cityName || ''}` + '</div>' +
                '<div class="col-35 buy-time">' + timeDifference(sort) + '</div>' +
                '</div>' +
                `<div class="row ${!specifications && (!quantityTagList || !quantityTagList.length) && 'hide'}">` +
                '<div class="col-65 buy-spec">规格：' + `${specifications || (quantityTagList && quantityTagList.length && quantityTagList[0].tagName) || ''}` + '</div>' +
                '</div>' +
                '<div class="home-buy-address">' +
                `${isAuth ? '<span class="buy-list-auth">实名</span>' : ''} <span>${contactName || '匿名用户'}</span>${currentLevel ? '<span class="iconfont icon-v' + currentLevel + '" style="margin:0;font-size: 2rem;"></span>' : ''}` +
                '</div>' +
                (description ? ('<div class="buy-list-describe"><span>具体要求</span>' + description + '</div>') : '') +
                '</a>';

            if (isMyList) {
                const {text, className} = getInfoStatus(state);
                const refreshBtn = refreshed ? '<span class="refresh-btn disabled">今天已刷新</span>' : `<span class="refresh-btn" data-id="${id}">刷新信息</span>`;
                res += '<div class="list-check-status">' +
                    `<div><span class="${className} f-l">${text}</span>` +
                    (1 == state ? (refreshBtn + `<span class="sell-list-share" data-type="${type}" data-id="${id}">分享给朋友</span>`) : '') + '</div>' +
                    '<p></p>' +
                    '</div>';
            }
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
            return `<div class="home-deal-info">[${provinceName}]<span class="deal-list-name">${getName(userName)}</span>成交  <span class="deal-list-category">${fishTypeName} ${quantity || ''}</span>, ${getDealTime(tradeDate)}</div>`
        },
        banner: (data) => {
            const {imgUrl, link, loginRequired} = data;
            return `<div class="swiper-slide" data-login="${loginRequired ? 1 : 0}" data-href="${link}"><img src="${imgUrl}" alt=""></div>`;
        },
        renderFishList: (data, index) => {
            const {id, name} = data;
            const isBorder = (index + 2)%3 == 0;
            const str = `${isBorder ? '|' : ''}<a href="views/filter.html?fishId=${id}">${name}</a>${isBorder ? '|' : ''}`
            return str;
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
                `<a href="views/filter.html?id=${id}&search=true" data-reload="true" data-name="${name}" data-parent-name="${parant_name}" data-id="${id}" data-parent-id="${parant_id}">${name}</a>`;
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
                fishTypeName,
                url
            } = data;
            let link = '';
            const {label, text, classes, certName} = getCertInfo(type);
            link += '<a class="iconfont icon-right open-cert-button" data-url="' + `${path || url}@1o` + '">' +
                '<span class="cert-label ' + classes + '">' + label + '</span>' + `具备“${certName}”-${fish_type_name || fishTypeName}` +
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
                `<span class="col-33 invite-time right">${getDate(createTime * 0.001, true)}</span>` +
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
                imgUrl,
                userId
            } = data;
            let res = '';
            res += '<a href="views/otherIndex.html?currentUserId=' + userId + '">' +
                `<p class="deal-list-title">${fishTypeName} ${quantity || '若干'} <span>${provinceName}${cityName || ''}</span></p>` +
                '<p class="deal-list-user-info">' +
                `<img src="${imgUrl && imgUrl + imgPath(4) || 'img/defimg.png'}">` +
                `<span class="deal-list-user-name">${getName(userName)}</span>|` +
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
                `<span style="display:${isFist ? 'block' : 'none'}">封面</span>` +
                '</span>'
            return res;
        },
        addPicBtn: () => {
            let span = '';
            const height = (($$(window).width() - 7) * 18.1 * 0.01).toFixed(2);
            span += '<span class="col-20 release-info-pic-add add" style="height:' + height + 'px;overflow:hidden;">' +
                `<i class="iconfont icon-add add" style="line-height:${height * 0.5}px"></i>` +
                `<p class="add" style="line-height:${height * 0.4}px">添加图片</p>` +
                '</span>'
            return span;
        },
        tag: (data) => {
            const {id, name} = data;
            return `<span data-id="${id}">${name}</span>`;
        }
    },

    fishCar: {
        list: (data, isMine, expired) => {
            const {
                contactName,
                appointedDate,
                fishType,
                quality,
                description,
                contactPhone,
                departureProvinceName,
                destinationProvinceName,
                id,
                headImgUrl,
                driverId
            } = data;
            let str = '';
            const src = headImgUrl ? (headImgUrl + imgPath(8)) : './img/ic_avatar_default.png';

            const btnStr = !isMine ?
                `<div data-phone="${contactPhone}" class="phone fish-call"><i class="iconfont icon-call fish-call"></i><div fish-call class="text">电话联系</div></div>` :
                `<div class="phone delete-trip" data-id="${id}">删除</div>`;

            str += `<div class="driver-info">` +
                        `<a class="driver" onclick="apiCount('btn_fishcar_routes_goFishcarDetail')" href="views/driverDemandInfo.html?id=${driverId}">` +
                            `<div class=""><img class="avatar" src="${src}"/></div>` +
                            `<div class="username">${contactName}</div>` +
                            `<div class="description"><div>查看鱼车信息</div><i class="iconfont icon-right"></i></div>` +
                        `</a>`+
                        `<div class="driver-demand">` +
                            `<div class="icon time">${getFishCarDateStyle(appointedDate)}</div>` +
                            `<div class="icon route">${departureProvinceName}-${destinationProvinceName}</div>` +
                            `${description ? '<div class="icon description">'+description+'</div>' : ''}` +
                        `</div>` +
                        `<div class="driver-contact">` +
                            `<div>${expired ? '已结束' : '正在寻找货物'}</div>` +
                            btnStr +
                        `</div>` +
                    '</div>';
            return str;
        },
        demandList: (data, isMine, expired) => {
            const {
                contactName,
                appointedDate,
                fishType,
                quality,
                description,
                contactPhone,
                departureProvinceName,
                departureCityName,
                destinationProvinceName,
                destinationCityName,
                id,
                userInfoView,
                userId
            } = data;
            let str = '';
            const src = userInfoView.imgUrl ? (userInfoView.imgUrl + imgPath(8)) : './img/ic_avatar_default.png';
            const btnStr = !isMine ?
                `<div data-phone="${contactPhone}" class="phone fish-call"><i class="iconfont icon-call fish-call"></i><div fish-call class="text">电话联系</div></div>` :
                `<div class="phone delete-trip" data-id="${id}">删除</div>`;

            const level = !!userInfoView.level ? `<i class="iconfont icon-v${userInfoView.level}"></i>` : '';
            str += `<div class="driver-info">` +
                `<a class="driver" onclick="apiCount('btn_fishcar_demands_goProfile')" href="views/otherIndex.html?id=${userId}&currentUserId=${userId}">` +
                `<div class=""><img class="avatar" src="${src}"/></div>` +
                `<div class="username"><span>${contactName}</span>${level}</div>` +
                `<div class="description"><div>查看个人主页</div><i class="iconfont icon-right"></i></div>` +
                `</a>`+
                `<div class="driver-demand">` +
                `<div class="icon time">${getFishCarDateStyle(appointedDate)}</div>` +
                `<div class="icon route">${departureProvinceName + (departureCityName || '')}-${destinationProvinceName + (destinationCityName || '')}</div>` +
                `${(fishType || quality) ? '<div class="icon fish-name">'+ (fishType||'') + ' ' + (quality||'') +'</div>' : ''}` +
                `${description ? '<div class="icon description">'+description+'</div>' : ''}` +
                `</div>` +
                `<div class="driver-contact">` +
                `<div class="${expired ? 'expired-text' : ''}">${expired ? '已结束' : '正在寻找鱼车'}</div>` +
                btnStr +
                `</div>` +
                '</div>';
            return str;
        },
        selectAddress: (number, address) => {
            let res = '';
            res += '<div class="item-content post-select-address">' +
                '<div class="item-inner">' +
                `<div class="item-title" data-index="${number}">路线${getCreateDriverListLabel(number)}</div>` +
                '<div class="item-input">' +
                `<input type="text" class="post-driver-name" value="${address}" readonly placeholder="${address}">` +
                '<span class="iconfont icon-right"></span>' +
                '</div>' +
                '</div>' +
                '</div>';
            return res;
        },
        addBtn: () => {
            let res = '';
            res += '<div class="item-content add-address-click-box add-item-btn" style="display: block">' +
                '<input type="text">' +
                '<div class="item-inner add-item-btn">' +
                '<span class="iconfont icon-add add-item-btn"></span>' +
                '<span class="add-item-btn">点击添加地区</span>' +
                '</div>' +
                '</div>';
            return res;
        },
        tagList: () => {
            const data = [
                {id: 39, text: '电动上下鱼装置'},
                {id: 40, text: '换水桶'},
                {id: 41, text: '鱼篓'},
                {id: 42, text: '捞兜'},
                {id: 43, text: '电子秤'},
                {id: 44, text: '行车记录仪'},
            ];
            let str = '';
            $$.each(data, (index, item) => {
                str += `<span data-id="${item.id}">${item.text}</span>`;
            })
            return str;
        }

    },
    driverDemeandInfo: {
        device: (data) => {
            let str = '';
            $$.each(data, (index, item) => {
                str += `<span class="col-50 ${index%2 == 0 ? 'on' : ''}"><i class="iconfont icon-tick"></i>${item.tagName}</span>`
            })
            return str;
        }
    }
}
