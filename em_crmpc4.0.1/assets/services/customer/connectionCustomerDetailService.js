/**
 *初始化服务对象
 */
var connectionCustomerDetailService = {
    lock : false,
    getDetailData : function(id,name, options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        var paramData = {
            "id" : id
        };
        var custom = '';
        if(name){
            custom = "/custom";
        }
        //加载数据
        $.ajax({
            url : urlIp + custom + "/contact/view",
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
_.extend(connectionCustomerDetailService, Backbone.Events);

