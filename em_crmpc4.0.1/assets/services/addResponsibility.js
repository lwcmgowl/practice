var addMarketService = {
    addMarket : function(data,options) {
        ajax({
            url :"/marketing/add",
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
    edittglrequest:function(id,data,options){
         var data = $.extend({"id":id}, data);
        ajax({
            url :"/marketing/edit",
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
    gettail:function(id,options){
        var data = {
            "id":id
        };
        ajax({
            url :"/marketing/view",
            data : data,
            success : function(data) {
                options.success(data)
            },
            error : function(err) {
                options.error(data)
            }
        });
        
    }
};
_.extend(addMarketService, Backbone.Events);

