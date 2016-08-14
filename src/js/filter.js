import { trim, html } from '../utils/string';
import { home, filter } from '../utils/template';
import customAjax from '../middlewares/customAjax';
import district from '../utils/district';
import config from '../config';


function filterInit(f7, view, page) {
	const $$ = Dom7;
	const {searchVal, release, type, id} = page.query;
	const searchBtn = $$('.filter-searchbar input');
	const {pageSize} = config;
	let allFishTypeChild;
	/*
	* Three cases into the filter page.
	* 1: home -> filter. query: type
	* 2: search -> filter. query: searchVal or category id.
	* 3: releaseSelectType -> filter. query: release and type
	*/
	trim(searchVal) && searchBtn.val(searchVal);


	/*
	* Ajax callback.
	*/
	const listCallback = (data) => {
		let listHtml = '';
		if(type === 1){
			$$.each(data.data.list, (index, item) => {
                listHtml += home.buy(item);
            })
		}else{
			$$.each(data.data.list, (index, item) => {
                listHtml += home.cat(item);
            })
		}
		html($$('.filter-list'), listHtml, f7);
	}

	const fishTypeRootCallback = (data) => {
		let typeHtml = `<span data-id="0" class="active-ele">全部鱼种</span>`;
		$$.each(data.data.list, (index, item) => {
			typeHtml += filter.fishType(item);
		})
		html($$('.filter-fish-type>.col-35'), typeHtml, f7);

	}
	
	const fishTypeChildCallback = (data) => {
		allFishTypeChild = data.data.list;
		let typeHtml = '';
		$$.each(data.data.list, (index, item) => {
			const classes = index % 3 === 0 && 'on' || '';
			typeHtml += filter.fishType(item, classes);
		})
		html($$('.filter-fish-type>.col-65'), typeHtml, f7);
	}


	/*
	* Ajax.
	*/
	// get root fish type;
	customAjax.ajax({
		apiCategory: 'fishType',
		api: 'getChildrenFishTypeList',
		data: [0, release, type, searchVal],
		val: {
			id: 0
		},
		type: 'get'
	}, fishTypeRootCallback);

	// get root fish type;
	customAjax.ajax({
		apiCategory: 'fishType',
		api: 'getChildrenFishTypeList',
		data: [id, release, type, searchVal],
		type: 'get'
	}, fishTypeChildCallback);


	/*
	* Bind event to dom.
	*/
	// select fish type child.
	$$('.filter-fish-type>.col-35').on('click', (e) => {
		const event = e || window.event;
		const ele = e.target;
		const rootId = ele.getAttribute('data-id');
		let categoryFish = [];
		if(rootId === '0'){
			categoryFish = allFishTypeChild;
		}else{
			$$.each(allFishTypeChild, (index, item) => {
				item.parant_id === rootId && categoryFish.push(item);
			})
		}
		$$('.filter-fish-type span').removeClass('active-ele');
		ele.className = 'active-ele';
		let typeHtml = '';
		$$.each(categoryFish, (index, item) => {
			const classes = index % 3 === 0 && 'on' || '';
			typeHtml += filter.fishType(item, classes);
		})
		html($$('.filter-fish-type>.col-65'),typeHtml ,f7)
	})

	// filter tab event;
	$$('.filter-tab').on('click', (e) => {
		const event = e || window.event;
		let ele = event.target;
		let classes = ele.className;
		const clickTab = () => {
			if (classes.indexOf('active-ele') > -1) {
				ele.className = classes.replace('active-ele', '');
				$$('.winodw-mask').removeClass('on');
				$$('.filter-tabs-content').removeClass('on');
			} else {
				$$('.filter-tab>div').removeClass('active-ele');
				ele.className += ' active-ele';
				$$('.winodw-mask').addClass('on');
				$$('.filter-tabs-content').addClass('on');
				$$('.filter-tabs-content>div').removeClass('active');
				classes.indexOf('tab1') > -1 && $$('.filter-tabs-content>div').eq(0).addClass('active');
				classes.indexOf('tab2') > -1 && $$('.filter-tabs-content>div').eq(1).addClass('active');
				classes.indexOf('tab3') > -1 && $$('.filter-tabs-content>div').eq(2).addClass('active');
			}
		}
		if(ele.parentNode.className.indexOf('filter-tab-title') > -1){
			ele = ele.parentNode;
			classes = ele.className;
			clickTab();
		}else if(classes.indexOf('filter-tab-title') > -1){
			clickTab();
		}
	})

	// filter category and release infomation.
	if(!release){
		/*
	     * initialization home page and send ajax to get list data.
	     */
	    customAjax.ajax({
	        apiCategory: 'demandInfo',
	        api: 'getDemandInfoList',
	        data: ["", "", type || 2, "", pageSize, 1],
	        type: 'get'
	    }, listCallback);
	    //root district render;
	    let rootDistrict = '<span class="active-ele" data-postcode="0">全国</span>';
	    $$.each(district.root.province, (index, item) => {
	    	rootDistrict += filter.districtRender(item);
	    })
	    html($$('.filter-district>.col-35'), rootDistrict, f7);
	    //child district render
	    $$('.filter-district>.col-35').on('click', (e) => {
	    	const event = e || window.event;
	    	const ele = e.target;
	    	const postcode = ele.getAttribute('data-postcode');
	    	$$('.filter-district span').removeClass('active-ele');
			ele.className = 'active-ele';
			let districtHtml = '';
	    	if(postcode !== '0'){
	    		$$.each(district.root.province, (index, item) => {
	    			if(item.postcode === postcode){
	    				$$.each(item.city, (index_, districtItem) => {
	    					districtHtml += filter.districtRender(districtItem);
	    				})
	    			}
	    		})
	    	}
	    	html($$('.filter-district>.col-65'), districtHtml, f7);
	    })
	    // sell or buy active; default type = 1
	    if(!type){
	    	$$('.filter-info-type>p').eq(0).addClass('active-ele');
	    	$$('.filter-list').addClass('buy-list-info');
	    }else{
	    	const _type = type - 1;
	    	$$('.filter-info-type>p').eq(_type).addClass('active-ele');
	    	if(type == 1){
	    		$$('.filter-list').removeClass('cat-list-info').addClass('buy-list-info');
	    	}else{
	    		$$('.filter-list').removeClass('buy-list-info').addClass('cat-list-info');
	    	}
	    }
	    $$('.filter-info-type').on('click', (e) => {
	    	const event = e || window.event;
			let ele = event.target;
			let classes = ele.className;
			if(classes.indexOf('active-ele') <= -1){
				$$('.filter-info-type>p').removeClass('active-ele');
				ele.className += ' active-ele';
				const _type = ele.getAttribute('data-type');
				const tabText = _type == 1 ? '求购' : '出售';
				html($$('.filter-tab>.tab3>span'), tabText, f7)
				customAjax.ajax({
			        apiCategory: 'demandInfo',
			        api: 'getDemandInfoList',
			        data: ["", "", _type, "", pageSize, 1],
			        type: 'get'
			    }, listCallback);
			}
			$$('.winodw-mask').removeClass('on');
			$$('.filter-tabs-content').removeClass('on');
			$$('.filter-tab>div').removeClass('active-ele');
	    })

	    // select city
	    $$('.filter-district>.col-65').on('click', (e) => {
	    	const event = e || window.event;
			const ele = event.target;
			const classes = ele.className;
			const postcode = ele.getAttribute('data-postcode');
			$$('.filter-district>.col-65>span').removeClass('active-ele');
			if(classes.indexOf('active-ele') <= -1 && ele.parentNode.className === 'col-65'){
				const tabText = ele.innerText;
				html($$('.filter-tab>.tab2>span'), tabText, f7)
				ele.className += ' active-ele';
			}
			$$('.winodw-mask').removeClass('on');
			$$('.filter-tabs-content').removeClass('on');
			$$('.filter-tab>div').removeClass('active-ele');
	    })
	}else{
		$$('.filter-navbar').addClass('filter-release-info');
		$$('.page-filter').addClass('filter-release-info');
		$$('.filter-tabs-content').addClass('on active');
		$$('.filter-fish-type').addClass('active');
		$$('.winodw-mask').addClass('on');
		
	}

	// select fish category;
	$$('.filter-fish-type>.col-65').on('click', (e) => {
		const event = e || window.event;
		const ele = event.target;
		const classes = ele.className;
		const childId = ele.getAttribute('data-id');
		$$('.filter-fish-type>.col-65>span').removeClass('active-ele');
		const tabText = ele.innerText;
		ele.className += ' active-ele';
		if(!release){
			html($$('.filter-tab>.tab1>span'), tabText, f7);
			$$('.winodw-mask').removeClass('on');
			$$('.filter-tabs-content').removeClass('on');
			$$('.filter-tab>div').removeClass('active-ele');
		}else{

		}
	})
}

module.exports = {
    filterInit
}