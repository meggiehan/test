class CustomClass {
    clone(obj) {
        let o;
        switch (typeof obj) {
            case 'undefined':
                break;
            case 'string':
                o = obj + '';
                break;
            case 'number':
                o = obj - 0;
                break;
            case 'boolean':
                o = obj;
                break;
            case 'object':
                if (obj === null) {
                    o = null;
                } else {
                    if (obj instanceof Array) {
                        o = [];
                        for (let i = 0, len = obj.length; i < len; i++) {
                            o.push(this.clone(obj[i]));
                        }
                    } else {
                        o = {};
                        for (let k in obj) {
                            o[k] = this.clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    }
}

const objectUtil = new CustomClass();
export default objectUtil;
