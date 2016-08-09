/**
 *初始化服务对象
 */
var myResponsCustomerListMainService = {
    lock : false,
    request : function(options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        $.ajax({
            url : urlIp + "/custom/trade/listTrade",
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
    },
     addCustomer : function(data,options) {
        ajax({
            url :"/custom/add",
            data : data,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            },
             error : function(error) {
                options.error(error);
            }
        });
    },
    getcstm:function(options){
         ajax({
            url :"/custom/listcsmname",
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            },
            error : function(err) {
                options.error(err);
            }
        });
    }
};
//绑定事件监听
_.extend(myResponsCustomerListMainService, Backbone.Events);

