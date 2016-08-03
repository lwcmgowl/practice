/**
 *初始化服务对象
 */
var chanceAllListMainService = {
    lock : false,
    request : function(options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        // $.ajax({
        // url : urlIp + "/custom/trade/listTrade",
        // success : function(data) {
        // if (data.status == "000") {
        // options.success(data);
        // } else {
        // options.error(data);
        // }
        // self.lock = false;
        //
        // },
        // error : function(error) {
        // options.error(error);
        // self.lock = false;
        //
        // }
        // });
    }
};
//绑定事件监听
_.extend(chanceAllListMainService, Backbone.Events);

