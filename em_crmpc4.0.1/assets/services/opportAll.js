var marketViewService = {
    request : function(options) {
        var self = this;
        ajax({
            url :"/marketing/trade/listTrade",
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
    addMarket:function(options){
        var data={
             "companyName":options.companyName,
            "contactName":options.contactName,
            "mobile":options.mobile,
            "teleNo":options.teleNo,
            "qq":options.QQ,
            "weChat":options.weChat,
            "email":options.email,
            "department":options.department,
            "post":options.post,
            "dataSource":options.dataSource,
            "conferenceName":options.conferenceName,
            "productType":options.productType,
            "level":options.level,
            "profession":options.profession,
            "csmNature":options.csmNature,
            "csmScale":options.csmScale,
            "region":options.region,
            "province":options.sprovince,
            "address":options.address,
            "postcode":options.postcode,
            "website":options.website,
            "fax":options.fax,
            "remark":options.remark,
            "dataType":"0",
            "marketUserId":options.loginId,//
            "submitState":"0"
        };
        ajax({
            url :"/marketing/add",
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
                             "marketUserId": options.assigner,
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
    exportFile : function(data, url) {
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
    delinfo : function(options) {
        var self = this;
        var data = {
            "id" : options.id
        }
        ajax({
            url :"/marketing/del",
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

    }
};
_.extend(marketViewService, Backbone.Events);
