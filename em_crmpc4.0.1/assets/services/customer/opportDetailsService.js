/**
 *初始化服务对象
 */
var opportDetailsService = {
    lock : false,
    getDetailData : function(id, options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        if(!id){
            return;
        }
        var paramData = {
            "id" : id
        };
        //加载数据
        $.ajax({
            url : urlIp + "/custom/opport/view",
            data : paramData,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data);
                } else {
                    options.error(data);
                }
                self.lock = false;
            },
            error : function(error) {
                options.error(error);
                self.lock = false;
            }
        });
    }
};
//绑定事件监听
_.extend(opportDetailsService, Backbone.Events);

