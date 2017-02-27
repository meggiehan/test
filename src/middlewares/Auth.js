/**
 * 用户认证相关
 * Created by domicc on 24/02/2017.
 */

import localStorage from '../utils/locaStorage'

export default class Auth {

    static getToken() {
        return localStorage.get("accessToken");
    };

    static setToken(accessToken){
        localStorage.set("accessToken", accessToken);
    }

}