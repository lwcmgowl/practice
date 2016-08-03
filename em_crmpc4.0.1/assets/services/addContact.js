var addMarketService = {
    addMarket : function(data,options) {
        ajax({
            url :urlmaps+"/contact/add",
            data : data,
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
    request:function(options){
         var data = {
             salesUserId:appcanUserInfo.userId
         };
         ajax({
            url :"/custom/listcsmname",
            data:data,
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
            url :urlmaps+"/contact/view",
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
            url :urlmaps+"/contact/edit",
            data : data,
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
};
_.extend(addMarketService, Backbone.Events);

