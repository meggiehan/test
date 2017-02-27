/**
 * Rest Api Request Template
 * Created by domicc on 24/02/2017.
 */

export default class RestTemplate {

    static get(url, headers, params, callback){
        $$.ajax({
                    method: 'get',
                    url,
                    headers,
                    contentType: 'application/json',
                    data: params,
                    cache: false,
                    processData: true,
                    crossDomain: true,
                    success: function (result) {
                        console.log(result);
                        callback(result);
                    }
                });
    };

    static post(url, headers, params, body, callback){

    };

    static put(url, headers, params, body, callback){

    };

    static del(url, headers, params, callback){

    };

}