/*!
 * @Name: vue common js
 * @Author: Zhengli
 * @Create Date: 2018.7.3 15:33:00
 * @Description: Vue 公共方法
 * @Dependent libraries:
 *      1. jQuery
 *      2. underscore v1.8.2+
 *      3. common.js
 *      4. vue
 *      5. galaxywind-ui
 */

/**
 *  注册常用 filter 方法
 */
Vue.filter('truncatex', function (str, length, truncation) {
    var chinese_pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;

    // 截取指定长度字串，多余以 truncation 取代
    // [\u4E00-\u9FA5]表示汉字，[\uFE30-\uFFA0]表示全角
    str = str || " ";
    length = length || 30;
    truncation = typeof truncation === "string" ? truncation : "...";
    var chineseIn = function (s) {
        return !!chinese_pattern.exec(s);
    };
    var calcSize = function (source) {
        var strTemp = source.replace(chinese_pattern, "aa");
        return strTemp.length;
    };
    var recursion = function (source, length) {
        if (calcSize(source) <= length || (!chineseIn(source))) {
            return source;
        } else {
            return recursion(source.slice(0, source.length - 1), length);
        }
    };
    var sliceLength = length - truncation.length;
    return calcSize(str) > length ? recursion(str.slice(0, sliceLength), sliceLength) + truncation : String(str);
});

/**
 * 注册 常量
 */
(function($window) {
    var Constants = {
        PICKER_OPTIONS: (function () {
            var day_range = function (days) {
                var end = new Date();
                var start = new Date();
                if (days > 0) {
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
                }
                return [start, end];
            };
            return {
                shortcuts: [
                    {
                        text: '最近一天',
                        onClick: function (picker) {
                            picker.$emit('pick', day_range(1));
                        }
                    },
                    {
                        text: '最近一周',
                        onClick: function (picker) {
                            picker.$emit('pick', day_range(7));
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick: function (picker) {
                            picker.$emit('pick', day_range(30));
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick: function (picker) {
                            picker.$emit('pick', day_range(90));
                        }
                    }]
            };
        })()
    };

    var install = function (Vue) {
        Vue.Constants = Constants;
    };

    /** istanbul ignore if */
    if (typeof $window !== 'undefined' && $window.Vue) {
        install($window.Vue);
    }

})(window);

/**
 * 注册 通用方法
 */
(function($window) {

    /**
     * 辅助方法 -->
     * */

    // 统一尾部符号
    var formatEndSymbol = function (content) {
        if (content && content.length > 0) {
            if (/[!.;；。,，、]$/.test(content)) {
                // 其他结束符号：替换为 “！”
                content = content.replace(/[!.;；。,，、]$/g, '');
                content = arguments.callee(content);//结尾可能包含多个符号
            }
            else if (!/[！]$/.test(content)) {
                // 非 “！” 结束符号(无结束符号)：补充 “！”
                content = content + "！";
            }
        }

        return content;
    };

    // 解析 HttpResponse 错误信息
    var parseHttpResponse = function (response) {
        var data = response.data;

        // 解析 DOCTYPE 内容, 仅提取 标题
        var transfer_doctype = function(docText) {
            if (docText.indexOf('DOCTYPE') !== -1) {
                var doc = $(docText);
                var text = doc.find('h3').html();
                return text;
            } else {
                return docText;
            }
        };

        // 解析 responseText 或 data
        if (response.hasOwnProperty("responseText")) {
            try {
                data = $.parseJSON(response.responseText);
            } catch (e) {
                if (response.responseText) {
                    data = {'errorMsg': transfer_doctype(response.responseText)};
                } else {
                    data = {'errorMsg': response.statusText};
                }
            }
        } else if(typeof(data) === 'string') {
            try {
                data = $.parseJSON(data);
            } catch (e) {
                data = {'errorMsg': transfer_doctype(data)};
            }
        }

        if (data.hasOwnProperty("errorMsg")) {
            return data.errorMsg;   // SimpleResponseData or other responseText
        }

        var ret = [];
        Object.keys(data).forEach(function (key) {
            var curData = data[key];
            if (Array.isArray(curData)) {
                // 只取第一个?
                ret.push(curData[0]);
                // curData.forEach(function (curItem) {
                //     ret.push(curItem);
                // })
            }
            else {
                ret.push(data[key]);
            }
        });
        return ret;
    };

    // 检查是否需要处理尾部符号
    var checkIsNeedAppend = function (content) {
        return content.indexOf("</div>") >= 0 || content.indexOf("<br/>") >= 0
    };

    // 弹窗内容处理
    var handleMessageContent = function (content, preContentInfo) {
        if (typeof(content) !== 'string') {
            // 处理前缀信息,默认认为不是 string 才需要给上默认的
            if (preContentInfo !== undefined && preContentInfo.length > 0) {
                preContentInfo = preContentInfo + '失败，失败原因：<br/>';
            }
        }

        // Error 类型， 提取 response, 没有 response 则获取 message
        if (content instanceof Error) {
            if (content.response) {
                content = content.response;
            } else {
                content = content.message;
            }
        }

        // HttpResponse 类型 , 转换为字符串或者数组类型
        if (typeof(content) === 'object' && content.toString() === '[object Object]') {
            content = parseHttpResponse(content);
        }

        if (typeof(content) !== 'string') {
            // 非单纯字符串的处理
            if (Array.isArray(content) && content.length > 0) {
                // 数组类型
                content.forEach(function (item, index) {
                    content[index] = formatEndSymbol(item);
                });

                // 多个的换行处理
                content = content.join("<br/>");
            }
        }

        // 尾部符号处理
        if (!checkIsNeedAppend(content)) {
            content = formatEndSymbol(content);
        }

        // 首部额外内容信息处理
        if (preContentInfo && preContentInfo.length > 0) {
            // 补充前缀信息,一般是操作名称,弥补response方式不知道操作名称
            content = preContentInfo + content;
        }

        return content;
    };

    // 回调处理: 回调方法存在且类型正确才调用
    var transfer_callback = function (callback) {
        // return function
        return function () {
            if (callback && typeof(callback) === 'function')
                callback();
        }
    };

    /**
     * <-- 辅助方法
     * */

    // 通用方法
    var CommonMethods = {
        getPwdStrength: function (pwd) {
            var pwd_strength = {
                valid: false,
                level: 0,
                text: '',
                color: ''
            };

            var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
            var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
            var enoughRegex = new RegExp("(?=.{8,}).*", "g");

            if (pwd.length > 20) {
                pwd_strength.level = 25;
                pwd_strength.color = "#d9534f";
                pwd_strength.text = '太长';
            } else if (!enoughRegex.test(pwd)) {
                pwd_strength.level = 25;
                pwd_strength.text = '太短';
                pwd_strength.color = "#d9534f";
            } else if (strongRegex.test(pwd)) {
                pwd_strength.valid = true;
                pwd_strength.level = 100;
                pwd_strength.color = "#5cb85c";
                pwd_strength.text = '强';
            } else if (mediumRegex.test(pwd)) {
                pwd_strength.valid = true;
                pwd_strength.level = 75;
                pwd_strength.color = "#f0ad4e";
                pwd_strength.text = '中';
            } else {
                pwd_strength.valid = true;
                pwd_strength.level = 50;
                pwd_strength.color = "#d9534f";
                pwd_strength.text = '弱';
            }
            return pwd_strength;
        },
        compactObj: function (obj) {
            var compact_obj = _.clone(obj);

            // 移除未设置的条件
            _.each(_.keys(compact_obj), function (key) {
                var value = compact_obj[key];
                if (_.isFunction(compact_obj[key])) {
                    value = compact_obj[key]();
                }
                if (!value) {
                    delete compact_obj[key];
                }
            });

            return compact_obj;
        }
    };

    // 实例通用方法
    var SelfCommonMethods = {
        /**
         * @member {array} HttpResponse 正确结果
         *  put: HTTP_200_OK
         *  post: HTTP_201_CREATED
         *  delete: HTTP_204_NO_CONTENT
         */
        __$member$successStatus: [200, 201, 204],
        /**
         * @method HttpResponse 解析处理
         * @param {Object, HttpResponse} response HttpResponse 实例
         * @param {Boolean} [show_flag] 是否显示结果提示
         * @param {String} [action_name] 操作名称
         * @param {Function} [success] 成功回调
         * @param {Function} [failure] 失败回调
         */
        $handleSimpleResponse: function (response, show_flag, action_name, success, failure) {
            var $self = this;

            // 处理省略参数
            if (typeof(arguments[1]) === "string"){  //省略 show_flag
                failure = arguments[3];
                success = arguments[2];
                action_name = arguments[1];
                show_flag = undefined;
            } else if (typeof(arguments[2]) === "function"){ //省略 action_name（有 show_flag）
                failure = arguments[3];
                success = arguments[2];
                action_name = undefined;
            } else if (typeof(arguments[1]) === "function") { //省略 action_name（无 show_flag）
                failure = arguments[2];
                success = arguments[1];
                action_name = undefined;
                show_flag = undefined;
            }

            // 处理参数默认值
            if(show_flag === undefined)
                show_flag = true;
            if(!action_name)
                action_name = '操作';

            // 处理回调方法
            var success_callback = transfer_callback(success);
            var failure_callback = transfer_callback(failure);

            // 检查是否显示提示信息
            var show_callback = function (message_func, callback) {
                if (show_flag !== false) {
                    message_func();
                } else {
                    callback();
                }
            };

            // 检查请求结果: 根据 isSuccess 判断,没有时则根据 response.status 判断
            if ((response.data && response.data.isSuccess) ||
                (response.data.isSuccess === undefined &&
                    _.contains($self.__$member$successStatus, response.status))) {
                show_callback(function () {
                    $self.$successMessage(action_name + "成功", success_callback);
                }, success_callback);
                return true;
            } else {
                show_callback(function () {
                    $self.$errorMessage(response, action_name, failure_callback);
                }, failure_callback);
                return false;
            }
        }
    };

    // 通用 消息、提示、弹窗 方法
    var CommonMessageMethods = {
        /**
         * @member {int}
         * @desc 延迟检查失败次数
         */
        __$member$circleCheck: 0,
        /**
         * @member {Object}
         * @desc 当前的 Loading 配置
         */
        __$member$loadingInfo: null,
        /**
         * @method 处理延迟等待
         */
        __$common$isNeedToDelayLayer: function () {
            var $self = this;

            var curCheckResult = $self.__$member$loadingInfo === null;
            if (!curCheckResult) {
                // 失败自增
                $self.__$member$circleCheck += 1;
            }
            else {
                // 重置
                $self.__$member$circleCheck = 0;
            }

            if ($self.__$member$circleCheck > 100) {
                console.error('延迟严查可能存在循环!');
                return false;
            }
            return !curCheckResult;
        },
        /**
         * @method 通用加载
         * @param {String} content 加载提示信息
         * @param {int} [min_time] 延迟时长(单位: 毫秒)
         */
        $commonLoading: function (content, min_time) {
            var $self = this;

            // 处理 默认值
            if (!content) {
                content = "加载中...";
            }
            if (!min_time) {
                min_time = 1000;
            }

            // 焦点控制,避免可以多次点击
            var lastFocus = $(":focus");
            if (lastFocus.length > 0) {
                lastFocus.blur();
            }

            // 默认参数
            var loadingOption = {
                text: content,
                lock: true,
                spinner: 'gu-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            };

            // 调用实例方法 $loading
            var loadingInstance = $self.$loading(loadingOption);
            // 保存延迟参数
            $self.__$member$loadingInfo = {
                'start_time': new Date(),
                'min_time': min_time,
                'content': content
            };
            // 返回 Loading 实例
            return loadingInstance;
        },
        /**
         * @method 操作进行中提示
         * @param {String} action_name 操作名称
         * @param {int} [min_time] 延迟时长(单位: 毫秒)
         */
        $actionLoading: function (action_name, min_time) {
            var $self = this;

            // 处理参数默认值
            if (!action_name)
                action_name = '操作';

            return $self.$commonLoading(action_name + '中...', min_time);
        },
        /**
         * @method 关闭通用加载
         * @param {Object} loadingInstance 加载实例
         * @param {Function} [callback] 回调方法
         */
        $closeLoading: function (loadingInstance, callback) {
            var $self = this;

            // 对象不正确则返回,理论上不会
            if (!loadingInstance) return;

            var curLoadingInfo = $self.__$member$loadingInfo;
            var nDelayTime = 0;

            // 计算延迟时间
            if (curLoadingInfo !== undefined) {
                var now = new Date();
                var min_time = curLoadingInfo['min_time'];
                var start_time = curLoadingInfo['start_time'];
                if (min_time > 0) {
                    var used_time = (now - start_time);
                    if (used_time < min_time) {
                        // 没到时间, 计算延迟时间
                        nDelayTime = min_time - used_time;
                    }
                }
            }

            // 延迟关闭
            setTimeout(function () {
                // 以服务的方式调用的 Loading 需要异步关闭
                $self.$nextTick(function () {
                    $self.__$member$loadingInfo = null;
                    loadingInstance.close();
                    // 调用回调方法
                    if (callback && typeof(callback) === 'function')
                        callback();
                });
            }, nDelayTime);
        },
        /**
         * @method 确定弹窗
         * @param {String} content 提示内容
         * @param {Function} [yes_callback] 回调方法
         * @param {Function} [no_callback] 回调方法
         */
        $commonConfirm: function (content, yes_callback, no_callback) {
            var $self = this;

            // 默认参数
            var confirmOption = {
                type: 'info',
                title: '确认',
                dangerouslyUseHTMLString: true
            };

            // 调用实例方法 $confirm
            $self.$confirm(content, confirmOption)
                .then(transfer_callback(yes_callback))
                .catch(transfer_callback(no_callback));
        },
        /**
         * @method 通用提示弹窗
         * @param {String} type 提示类型, 可以是 success, error, warning, info
         * @param {String} title 提示标题
         * @param {String, Array, Object, HttpResponse} content 提示内容
         * @param {undefined, String} [preContentInfo] 前缀信息, 默认为空字符串
         * @param {Function} [callback] 回调方法
         */
        __$commonAlert: function (type, title, content, preContentInfo, callback) {
            var $self = this;

            // 处理延迟等待
            if ($self.__$common$isNeedToDelayLayer()) {
                setTimeout(function () {
                    $self.__$commonAlert(type, title, content, preContentInfo, callback);
                }, 100);
                return;
            }

            // 处理省略参数
            if(typeof(arguments[3]) === "function"){ //省略 preContentInfo
                callback = arguments[3];
                preContentInfo = undefined;
            }

            // 处理参数默认值
            if (!preContentInfo)
                preContentInfo = '';

            // 弹窗内容处理
            content = handleMessageContent(content, preContentInfo);

            // 默认参数
            var alertOption = {
                type: type,
                title: title || '提示',
                dangerouslyUseHTMLString: true,
                callback: function (action) {
                    if (callback && typeof(callback) === 'function')
                        callback();
                }
            };

            // 调用 Vue 实例方法 $alert
            $self.$alert(content, alertOption);
        },
        /**
         * @method 成功的提示弹窗
         * @param {String, Array} content 提示内容
         * @param {Function} [callback] 回调方法
         */
        $successAlert: function (content, callback) {
            // 调用通用 alert 方法
            this.__$commonAlert('success', '成功', content, undefined, callback);
        },
        /**
         * @method 错误的提示弹窗
         * @param {String, Array, Object, HttpResponse} content 提示内容
         * @param {undefined, String} [preContentInfo] 前缀信息, 默认为空字符串
         * @param {Function} [callback] 回调方法
         */
        $errorAlert: function (content, preContentInfo, callback) {
            // 调用通用 alert 方法
            this.__$commonAlert('error', '失败', content, preContentInfo, callback);
        },
        /**
         * @method 警告的提示弹窗
         * @param {String, Array, Object, HttpResponse} content 提示内容
         * @param {undefined, String} [preContentInfo] 前缀信息, 默认为空字符串
         * @param {Function} [callback] 回调方法
         */
        $warningAlert: function (content, preContentInfo, callback) {
            // 调用通用 alert 方法
            this.__$commonAlert('warning', '警告', content, preContentInfo, callback);
        },
        /**
         * @method 通用消息提示
         * @param {String} type 消息类型, 可以是 success, error, warning, info
         * @param {String, Array, Object, HttpResponse} content 提示内容
         * @param {undefined, String} [preContentInfo] 前缀信息, 默认为空字符串
         * @param {Function} [callback] 回调方法
         * @param {Boolean} [callback_in_end] 是否在关闭时时调用回调方法
         */
        __$commonMessage: function(type, content, preContentInfo, callback, callback_in_end){
            var $self = this;

            // 处理延迟等待
            if ($self.__$common$isNeedToDelayLayer()) {
                setTimeout(function () {
                    $self.__$commonMessage(type, content, preContentInfo, callback, callback_in_end);
                }, 100);
                return;
            }

            // 处理省略参数
            if(typeof(arguments[2]) === "function"){ //省略 preContentInfo
                callback_in_end = arguments[3];
                callback = arguments[2];
                preContentInfo = undefined;
            }

            // 处理参数默认值
            if (!preContentInfo)
                preContentInfo = '';
            if (!callback_in_end)
                callback_in_end = false;

            // 弹窗内容处理
            content = handleMessageContent(content, preContentInfo);

            // 默认参数
            var messageOption = {
                type: type,
                message: content,
                duration: 2000,
                showClose: true,
                dangerouslyUseHTMLString: true
            };

            if (!callback_in_end) {
                // 默认处理,先调用 callback ,然后再提示
                if (callback && typeof(callback) === 'function') {
                    setTimeout(function () {
                        callback();
                    }, 1000); // 1000ms 后再调用.
                }
            }
            else {
                // 在 message 的 onClose 事件中调用 callback
                messageOption.onClose = callback;
            }

            // 调用 Vue 实例方法 $message
            return $self.$message(messageOption);
        },
        /**
         * @method 成功的消息提示
         * @param {String, Array} content 消息内容
         * @param {Function} [callback] 回调方法
         * @param {Boolean} [callback_in_end] 是否在关闭时时调用回调方法
         */
        $successMessage: function (content, callback, callback_in_end) {
            // 调用通用 message 方法
            return this.__$commonMessage('success', content, undefined, callback, callback_in_end);
        },
        /**
         * @method 错误的消息提示
         * @param {String, Array, Object, HttpResponse} content 提示内容
         * @param {undefined, String} [preContentInfo] 前缀信息, 默认为空字符串
         * @param {Function} [callback] 回调方法
         * @param {Boolean} [callback_in_end] 是否在关闭时时调用回调方法
         */
        $errorMessage: function (content, preContentInfo, callback, callback_in_end) {
            // 调用通用 message 方法
            return this.__$commonMessage('error', content, preContentInfo, callback, callback_in_end);
        },
        /**
         * @method 警告的消息提示
         * @param {String, Array, Object, HttpResponse} content 提示内容
         * @param {undefined, String} [preContentInfo] 前缀信息, 默认为空字符串
         * @param {Function} [callback] 回调方法
         * @param {Boolean} [callback_in_end] 是否在关闭时时调用回调方法
         */
        $warningMessage: function (content, preContentInfo, callback, callback_in_end) {
            // 调用通用 message 方法
            return this.__$commonMessage('warning', content, preContentInfo, callback, callback_in_end);
        }
    };

    var install = function (Vue) {
        // 公共通用方法
        Vue.prototype.$common = CommonMethods;

        // 实例通用方法
        _.each(SelfCommonMethods, function (func, func_key) {
            Vue.prototype[func_key] = func;
        });

        // 通用 消息、提示、弹窗 方法
        _.each(CommonMessageMethods, function (func, func_key) {
            Vue.prototype[func_key] = func;
        });
    };

    /** istanbul ignore if */
    if (typeof $window !== 'undefined' && $window.Vue) {
        install($window.Vue);
    }

})(window);

/**
 * 注册 常用检查方法
 */
(function ($window) {
    /**
     * 辅助方法 -->
     * */
    var checkPwd = function(pwd) {
        var patrn = /^(?![0-9a-z]+$)(?![0-9A-Z]+$)(?![0-9\W]+$)(?![a-z\W]+$)(?![a-zA-Z]+$)(?![A-Z\W]+$)[a-zA-Z0-9\W_]+$/;
        if (patrn.exec(pwd) !== null) {
            return true;
        }
        return false;
    };
    var checkSpace = function (attrval, attrname) {
        var reg = /\s+/g;
        if (attrval && reg.test(attrval)) {
            return false;
        }
        return true;
    };
    /**
     * <-- 辅助方法
     * */

    var ValidateMethods = {
        checkSpace: function (rule, value, callback) {
            var label = rule ? rule.label : "";
            if (!checkSpace(value)) {
                callback(new Error(label + "不能包含空格"));
                return false;
            }
            return true;
        },
        checkPwd: function (rule, value, callback) {
            var label = rule.label || "密码";
            if (!checkPwd(value)) {
                callback(new Error(label + "请包括大写字母、小写字母、数字、特殊字符中至少三种进行组合"));
                return false;
            }
            return true;
        },
        ip: function (rule, value, callback) {
            var label = rule.label || "IP";
            if (!$.validate.ipaddress.checkIP(value)) {
                callback(new Error(label + "格式不正确"));
                return;
            }
            callback();
        },
        mask: function (rule, value, callback) {
            var label = rule.label || "掩码";
            if (!$.validate.ipaddress.checkMask(value)) {
                callback(new Error(label + "格式不正确"));
                return;
            }
            callback();
        }
    };

    var install = function (Vue) {
        // 常用检查方法
        Vue.prototype.$validate = ValidateMethods;
    };

    /** istanbul ignore if */
    if (typeof $window !== 'undefined' && $window.Vue) {
        install($window.Vue);
    }
})(window);