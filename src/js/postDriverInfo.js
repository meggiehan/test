import store from '../utils/locaStorage';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {html, trim, getFishTankId, getOxygenTankId, getProvinceId, getFishTankName, getOxygenTankName} from '../utils/string';
import {fishCar} from '../utils/template';
import customAjax from '../middlewares/customAjax';

function postDriverInfoInit(f7, view, page) {
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const {id} = page.query;
    const {identity} = config;
    let selectedAddress = '';
    let selectedFishTankSize = '';
    let selectFishTankNumber = '';
    let selectedFishTankMaterial = '';
    let selectOxygenTankMaterial = '';

    /**
     * 路线范围选择
     * */
    f7.picker({
        input: currentPage.find('.post-driver-select-address'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        // value: [selectedAddress || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['全国', '多条路线']
            }
        ],
        onChange: (a,b) => {
            if('全国' != b[0]){
                currentPage.find('.add-address-click-box').show();
            }else{
                currentPage.find('.add-address-click-box').hide();
            }
        }
    });

    /**
     * 添加路线
     * 编辑路线，存入点击的index
     * */
    currentPage.find('.post-driver-select')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        //添加路线，弹出model
        if($$(ele).hasClass('add-item-btn')){
            $$('.edit-driver-address-model').addClass('add');
            return;
        }

        if((!(ele.tagName == 'INPUT' && !$$(ele).hasClass('post-driver-select-address')))){
            return;
        }
        window.addressIndex = Number($$(ele).parent().prev().attr('data-index'));
        $$('.edit-driver-address-model').addClass('edit');
    }

    /**
     * 鱼罐方数选择
     * */
    f7.picker({
        input: currentPage.find('.post-driver-fish-box-size'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        // value: [selectedFishTankSize || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['1方', '2方', '3方', '4方', '5方', '6方',
                    '7方', '8方', '9方', '10方', '11方', '12方',
                    '13方', '14方', '15方', '16方', '17方', '18方', '19方', '20方']
            }
        ]
    });

    /**
     * 分箱数选择
     * */
    f7.picker({
        input: currentPage.find('.post-driver-fish-box-number'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        // value: [selectFishTankNumber || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['1个', '2个', '3个', '4个', '5个', '6个',
                    '7个', '8个', '9个', '10个']
            }
        ]
    });

    /**
     * 点击上传从业资格证
     * */
    currentPage.find('.post-box').children('.left')[0].onclick = () => {
        nativeEvent.postPic(5, '', 'roadTransportQualificationCertificate', 'postDriverRoadTransportFileCallback');
    };

    /**
     * 点击上传运输证
     * */
    currentPage.find('.post-box').children('.right')[0].onclick = () => {
        nativeEvent.postPic(5, '', 'transportCertificate', 'postDriverTransportCertificateFileCallback');
    };

    /**
     * 鱼罐材质选择
     * */
    f7.picker({
        input: currentPage.find('.post-driver-fish-box'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        // value: [selectedFishTankMaterial || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['玻璃钢', '塑胶', '不锈钢', '白铁', '铁', '铝']
            }
        ]
    });

    /**
     * 氧气罐材质选择
     * */
    f7.picker({
        input: currentPage.find('.post-driver-fish-oxygen-tank'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        // value: [selectOxygenTankMaterial || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['液氧罐', '普通氧气罐']
            }
        ]
    });

    /**
     * render 辅助设备列表
     * 选择辅助设备
     * */
    currentPage.find('.post-driver-device-list').html(fishCar.tagList());
    currentPage.find('.post-driver-device-list')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if(ele.tagName != 'SPAN'){
            return;
        }
        $$(ele).toggleClass('on');
    }

    /**
     * 获取鱼车配送路线
     * */
    function getFishCarAddress(){
        let res = [];
        $$.each(currentPage.find('.post-select-address'), (index, item) => {
            const valArr = $$(item).find('input').val().split('-');
            const onlyStart = 1 == valArr.length ? valArr[0].substring(0,valArr[0].length-1) : '';
            const startId = onlyStart ? getProvinceId(onlyStart)['provinceId'] : '';
            res.push({
                departureProvinceId: startId || getProvinceId(valArr[0])['provinceId'],
                departureProvinceName: onlyStart || valArr[0],
                destinationProvinceId: startId || getProvinceId(valArr[1])['provinceId'],
                destinationProvinceName: onlyStart || valArr[1],
            })
        })
        return res;
    }

    /**
     * 获取标签列表
     * */
    function getTagList(){
        let res = [];
        $$.each(currentPage.find('.post-driver-device-list').children('span'), (index, item) => {
            if($$(item).hasClass('on')){
                res.push({
                    id: $$(item).attr('data-id'),
                    tagName: $$(item).text()
                })
            }
        })
        return res;
    }

    /**
     * 点击提交申请
     * */
    function callback(data){
        const {code, message} = data;
        if(1 == code){
            if(id){
                nativeEvent.nativeToast('1', '修改成功！');
                view.router.load({
                    url: 'views/user.html'
                })
                return;
            }
            view.router.load({
                url: 'views/recruitDriverSuccess.html'
            })
        }else if(8 == code || 4 == code){
            f7.alert(message);
        }else{
            console.log(message);
        }
        f7.hideIndicator();
    }

    /**
     * 提交司机申请
     * 提交信息验证
     * */
    currentPage.find('.submit-btn')[0].onclick = () => {
        const selectAddress = trim(currentPage.find('.post-driver-select-address').val());
        const fishTank = trim(currentPage.find('.post-driver-fish-box').val());
        const fishTankSize = trim(currentPage.find('.post-driver-fish-box-size').val());
        const fishBoxNumber = trim(currentPage.find('.post-driver-fish-box-number').val());
        const fishOxygenTank = trim(currentPage.find('.post-driver-fish-oxygen-tank').val());
        let errors = '';

        if(!fishOxygenTank){
            errors = '请选择氧气罐材质！';
        }

        if(!fishBoxNumber){
            errors = '请填写分箱数！';
        }

        if(!fishTankSize){
            errors = '请填写鱼罐方数！';
        }

        if(!fishTank){
            errors = '请选择鱼罐材质！';
        }

        if('多条路线' == selectAddress && !currentPage.find('.post-select-address').length){
            errors = '请您添加路线！';
        }

        if(!selectAddress){
            errors = '请选择路线范围！';
        }

        if(errors){
            f7.alert(errors);
            return;
        }
        f7.showIndicator();
        const roadTransportQualificationCertificate = currentPage.find('.post-box').children('.left').find('img').length ?
            currentPage.find('.post-box').children('.left').find('img').eq(0).attr('src').split('@')[0] : '';
        const roadTransportCertificate = currentPage.find('.post-box').children('.right').find('img').length ?
            currentPage.find('.post-box').children('.right').find('img').eq(0).attr('src').split('@')[0] : '';

        let data = {
            contactName: window.authObj.name,
            contactPhone: window.authObj.phone,
            workingAge: Number(window.authObj.age.replace('年', '')),
            hasTeam: '是' == window.authObj.team,
            positiveIdUrl: window.authObj.authUrl,
            drivingLicence: window.authObj.driverUrl,
            roadTransportQualificationCertificate,
            roadTransportCertificate,
            fishTankMaterial: getFishTankId(fishTank),
            fishTankSize: Number(fishTankSize.replace('方', '')),
            fishTankBoxCount: Number(fishBoxNumber.replace('个', '')),
            oxygenTankMaterial: getOxygenTankId(fishOxygenTank),
            routeList: getFishCarAddress(),
            auxiliaryList: getTagList()
        }
        if(id){
            customAjax.ajax({
                apiCategory: 'fishCarDrivers',
                parameType: 'application/json',
                data: data,
                header: ['token'],
                type: 'put',
                val:{
                    id
                },
                isMandatory: true,
                noCache: true
            }, callback);
        }else{
            customAjax.ajax({
                apiCategory: 'postFishCars',
                parameType: 'application/json',
                data: data,
                type: 'post',
                isMandatory: true,
                noCache: true
            }, callback);
        }
    }

    /**
     * 如果存在id，则是修改，反则是新增申请
     * 填满返回的信息
     * */
    if(!id){
        f7.hideIndicator();
    }else{
        currentPage.find('.submit-btn').children().text('提交修改');
        const {
            routeList,
            roadTransportQualificationCertificate,
            roadTransportCertificate,
            fishTankMaterial,
            fishTankBoxCount,
            oxygenTankMaterial,
            fishTankSize,
            auxiliaryList
        } = window.driverData;
        //render路线
        if(routeList && routeList.length){
            selectedAddress = '多条路线';
            currentPage.find('.post-driver-select-address').val('多条路线');
            currentPage.find('.add-address-click-box').remove();

            $$.each(routeList, (index, item) => {
                const {departureProvinceName, destinationProvinceName} = item;
                const address = departureProvinceName == destinationProvinceName ?
                    `${destinationProvinceName}内` : `${departureProvinceName}-${destinationProvinceName}`;
                currentPage.find('.post-driver-select').append(fishCar.selectAddress(index, address));
            })

            if(currentPage.find('.post-select-address').length < 5){
                currentPage.find('.post-driver-select').append(fishCar.addBtn());
            }
        }else{
            selectedAddress = '全国';
            currentPage.find('.post-driver-select-address').val('全国');
        }

        //填写鱼罐材质
        currentPage.find('.post-driver-fish-box').val(getFishTankName(fishTankMaterial));
        selectedFishTankMaterial = getFishTankName(fishTankMaterial);

        //填写鱼罐方数
        currentPage.find('.post-driver-fish-box-size').val(`${fishTankSize}方`);
        selectedFishTankSize = `${fishTankSize}方`;

        //填写分箱数
        currentPage.find('.post-driver-fish-box-number').val(`${fishTankBoxCount}个`);
        selectFishTankNumber = `${fishTankBoxCount}个`;

        //填写氧气罐材质
        currentPage.find('.post-driver-fish-oxygen-tank').val(getOxygenTankName(oxygenTankMaterial));
        selectOxygenTankMaterial = getOxygenTankName(oxygenTankMaterial);

        //填选辅助设备
        if(auxiliaryList && auxiliaryList.length){
            $$.each(auxiliaryList, (index, item) => {
                currentPage.find('.post-driver-device-list').children(`span[data-id="${item.id}"]`).addClass('on');
            })
        }

        //填写证件
        roadTransportQualificationCertificate && currentPage.find('.post-box').children('.left').children('div').
        html(`<img src="${roadTransportQualificationCertificate}${identity['individual']}" />`);
        roadTransportCertificate && currentPage.find('.post-box').children('.right').children('div').
        html(`<img src="${roadTransportCertificate}${identity['individual']}" />`);
    }
}

module.exports = {
    postDriverInfoInit
}
