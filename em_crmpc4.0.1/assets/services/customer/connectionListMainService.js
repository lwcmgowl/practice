/**
 *初始化服务对象
 */
var connectionListMainService = {
    lock : false,
    request : function(options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
    }
};
//绑定事件监听
_.extend(connectionListMainService, Backbone.Events);

