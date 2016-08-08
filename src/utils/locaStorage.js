module.exports = {
	get: (key) => {
		if(!window.localStorage.getItem(key)){
			return;
		}
		let value = window.localStorage.getItem(key);
		
		return JSON.parse(value);
	},
	set: (key, val) => {
		let value;
		if(typeof val === 'object'){
			value = JSON.stringify(val);
		}else{
			value = val;
		}
        window.localStorage.setItem(key, val)
	},
	remove: (key) => {
		window.localStorage.removeItem(key)
	}
}