import customAjax from '../middlewares/customAjax';
/**
 * Rest Api Request Template
 * Created by domicc on 24/02/2017.
 */

export default class RestTemplate {

    static get(url, headers, params, callback, noCache) {
        customAjax.ajax({
            apiCategory: url,
            header: ['token'],
            type: 'get',
            data: params,
            noCache
        }, callback);
        // $$.ajax({
        //     method: 'get',
        //     url,
        //     headers,
        //     contentType: 'application/json',
        //     data: params,
        //     cache: false,
        //     processData: true,
        //     crossDomain: true,
        //     success: function (result) {
        //         console.log(result);
        //         callback(JSON.parse(result));
        //     }
        // });
    };

    static post(url, headers, params, body, callback) {
        customAjax.ajax({
            apiCategory: url,
            header: ['token'],
            val: params,
            type: 'post',
            data: body,
            paramsType: 'application/json',
            noCache: true,
            isMandatory: true
        }, callback);
    };

    static put(url, headers, params, body, callback) {

    };

    static del(url, headers, params, callback) {

    };

}