/**
 * name: rest-api.js
 * author: zhengli
 * create date: 2019.3.23 12:00:00
 * description:
 * basic library :
 *      1. api.js
 */


(function($) {
    var commonApiRef = $.API.common;

    // 给 API 增加一个 vdp, vdpApiRef 变量用于下面直接进行引用
    var apiRef = $.API.RestAPI = $.API.RestAPI || {};

    var apiNameSpace = '/api';

    // 基础 url 命名空间
    _.extend(apiRef, {
        namespace: apiNameSpace
    });

    // 生成 rest api
    var models = {
        "TodoTasks": null
    };

    _.extend(apiRef, commonApiRef.generate_rest_api(apiRef.namespace, models));

})(jQuery);