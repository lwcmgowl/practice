var marketViewService = {
    request : function(options) {
        var self = this;
       ajax({
            url : "/marketing/trade/listDict",
            success : function(data) {
                if (data.status == "000"){
                    options.success(data)
                    }else{
                    options.error(data)
                    };
            },
            error : function(err) {
                options.error(err);
            }
        });

    },
     listDict : function(options) {
        ajax({
            url :"/marketing/trade/listDict",
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
    getMarketPerson:function(options){
        var data={
            "roleType" : 1,
             "regionId" : options.region,
             "tradeId" : options.profession
        };
        ajax({
            url :"/marketing/listStaff",
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
    assign:function(options){
         var data={
                             "id" : options.id,
                             "marketUserId": options.assigner || options.marketUserId,
                             "region":options.region,
                             "profession":options.profession
        };
        ajax({
            url :"/marketing/assign",
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
    exportFile : function(data,url) {
            ajax({
            url : url,
            data : data,
            success : function(data) {
                var url = urlIp + '/excel/out?path=' + encodeURIComponent(data.msg.message);
                window.location = url;
                $.success("导出成功!")
            },
            error : function(err) {
                options.error(err);
            }
        });

    },
     delinfo:function(options){
        alert(options.id)
         var self = this;
         var data={
             "id":options.id
         }
        ajax({
            url :"/marketing/del",
            data:data,
            success : function(data) {
                if (data.status == "000"){
                    options.success(data)
                    }else{
                    options.error(data)
                    };
            },
            error : function(err) {
                options.error(err);
            }
        });

    },
    requestTrade:function(options){
         var self = this;
        ajax({
            url :"/marketing/trade/listTrade",
            success : function(data) {
                if (data.status == "000"){
                    options.success(data)
                    }else{
                    options.error(data)
                    };
            },
            error : function(err) {
                options.error(err);
            }
        });

    }
};
_.extend(marketViewService, Backbone.Events);
