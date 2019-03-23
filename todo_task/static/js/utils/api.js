/**
 * name: api.js
 * author: zhengli
 * create date: 2019.3.23 12:00:00
 * description:
 * basic library :
 *      1. underscore v1.8.2+
 *      2. axios
 *      3. cookie
 */


// axios 通用配置及处理
(function() {
    axios.defaults.headers.common['X-CSRFToken'] = $.cookie('XSRF-TOKEN');
})();

/**
 * common api
 */
(function ($) {
    var root = this;

    // API 的全局命名空间
    var _api = $.API = window.API = root.API = ($.API || window.API || root.API || {});

    // 给 API 增加一个 utils, utilsRef 变量用于下面直接进行引用
    var commonApiRef = _api.common = _api.common || {};

    commonApiRef.generate_rest_api = function (namespace, models) {
        var baseRestAPI = {
            _url: '',
            key: '',
            model: '',
            namespace: '',
            methods: ['get', 'post', 'put', 'del'], // 'get', 'post', 'put', 'del', 'action'
            new: function (namespace, key, model, methods) {
                var self = this;

                var instance = _.clone(this);
                instance.key = key;
                instance.model = model || key;
                instance.methods = methods || self.methods;
                instance.namespace = namespace || self.namespace;

                // 删除不需要的 api 方法
                _.each(self.methods, function (method) {
                    if (!_.contains(instance.methods, method)) {
                        delete instance[method];
                    }
                });
                delete instance.new;

                return instance;
            },
            get_url: function () {
                if (!this._url) {
                    this._url = this.namespace + '/' + this.model.replace('_', '-').toLowerCase() + '/';
                }
                return this._url;
            },
            get: function () {
                return axios.get(this.get_url());
            },
            post: function (data) {
                return axios.post(this.get_url(), data);
            },
            put: function (id, data) {
                if (_.isObject(id)) {
                    data = id;
                    id = id.id;
                }
                id = id || 0;
                return axios.put(this.get_url() + id + '/', data);
            },
            del: function (id, data) {
                config = {
                    data: data
                };
                return axios.delete(this.get_url() + id + '/', config);
            },
            action: function (action, id, data, method) {
                if (id && _.isObject(id)) {
                    method = data || 'post';
                    data = id;
                    id = data.id;
                }
                if (data && _.isString(data)) {
                    method = data || 'post';
                    data = null;
                }
                data = $.extend(data, {
                    action: action
                });

                var url_template = _.template("<%= url %><%= id %>/<%= action %>/");
                if (id === undefined || id === null) {
                    url_template = _.template("<%= url %><%= action %>/");
                }
                var action_url = url_template({url: this.get_url(), id: id, action: action});
                if (method === 'get') {
                    data_params = _.reduce(data, function (mem, value, key) {
                        mem.push(key + "=" + encodeURIComponent(value));
                        return mem;
                    }, []);
                    return axios.get(action_url + "?" + data_params.join('&'));
                } else {
                    return axios.post(action_url, data);
                }
            }
        };
        return _.indexBy(_.mapObject(models, function (model, key) {
            if (_.isArray(model)) {
                return baseRestAPI.new(namespace, key, model[0] || key, model[1]);
            }
            return baseRestAPI.new(namespace, key, model);
        }), 'key');
    };
})(jQuery);