var addMarketService = {
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
            }
            // error : function(err) {
                // options.error(err);
            // }
        });
    },
    request:function(options){
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
        
    },
    gettail:function(options){
        var data = {
            "id" : options.id
        };
        ajax({
            url :"/custom/view",
            data : data,
            success : function(data) {
                if (data.status == "000"){
                    options.success(data);
                }else{
                    options.error(data);
                }
            },
            error : function(err) {
                options.error(err);
            }
        });
    },
    edittglrequest:function(id,data,options){
         var data = $.extend({"id":id}, data);
        ajax({
            url :"/custom/edit",
            data : data,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            }
            // error : function(err) {
                // options.error(err);
            // }
        });
        
    },
};
_.extend(addMarketService, Backbone.Events);

