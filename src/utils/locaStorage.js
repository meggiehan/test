module.exports = {
    get: (key) => {
        if (!window.localStorage.getItem(key)) {
            return;
        }
        let value = window.localStorage.getItem(key);

        return JSON.parse(value);
    },
    set: (key, val) => {
        if(!key){
            return;
        }
        let value;
        if (typeof val == 'object') {
            value = JSON.stringify(val);
        } else {
            value = val;
        }
        window.localStorage.setItem(key, value)
    },
    remove: (key) => {
        window.localStorage.removeItem(key)
    },
    clear: () => {
        window.localStorage.clear();
    },
    getAll: () => {
        return window.localStorage;
    }
}
