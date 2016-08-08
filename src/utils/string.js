module.exports = {
    trim: (str) => {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    /*
	* Prevent script injection attacks.
    */
    html: (dom, str, f7) => {
        if (str.indexOf('<script') > -1) {
            f7.alert('请求错误,请重新发送请求!')
            return;
        }
        dom.html(str);
    }

}
