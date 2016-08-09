/**
 *初始化服务对象
 */
var customerConnectionChanceService = {
    lock : false,
    request : function(options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
    },
    getDetail:function(options){
         var paramData = {
            "id" : options.id
        };
        //加载数据
       ajax({
            url :"/custom/opport/view",
            data : paramData,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data);
                } else {
                    options.error(data);
                }
            },
            error : function(error) {
                options.error(error);
            }
        });
        
    }
};
//绑定事件监听
_.extend(customerConnectionChanceService, Backbone.Events);

