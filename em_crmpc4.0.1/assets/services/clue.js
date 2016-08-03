var clueViewService = {
    request : function(options) {
        var self = this;
        ajax({
            url :"/clue/trade/listDict",
            success : function(data) {
                if (data.status == "000") {
                    //alert(JSON.stringify(data))
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
            url : "/clue/trade/listDict",
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
    getMarketPerson : function(options) {
        var data = {
            "roleType" : 3,
            "regionId" : options.region,
            "tradeId" : options.profession
        };
        ajax({
            url : "/clue/listStaff",
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
    transfer : function(options) {
       { var data = {
            "id" : options.id,
            "salesUserId" : options.salesUserId,
            "region" : options.region,
            "profession" : options.profession
        };
        ajax({
            url : "/clue/transfer",
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
        });}

    },
    assign : function(options) {
        var data = {
                        "id" : options.id,
                        "assigner" : options.assigner,
                        "region":options.region,
                        "clueType":1,
                        "profession":options.profession

        };
        ajax({
            url : "/clue/assign",
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
    exportFile : function(data, url) {//导出
        var data = {
            "entityType" : "exportClueManage",
            "profession" : $('#industrycategory').val(),
            "region" : $('#bigRegions').val(),
            "companyName" : $.trim($('#csmName').val()),
            "clueState" : $('#clueState').val(),
            "salesQuery" : $.trim($('#responsibilityPeople').val()),
            "marketQuery" : $.trim($('#reportPeople').val()),
            "dataType" : '1'
        };
        ajax({
            url : "/clue/exportClue",
            data : data,
            success : function(data) {
                var url = urlIp + '/excel/out?path=' + encodeURIComponent(data.msg.message);
                window.location = url;
            }
        });

    },
    delinfo:function(options){
         var data = {
            "id" : options.id,
            "assigner":"",
            "dataType":"0"
        };
        ajax({
            url : "/clue/cancel",
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
_.extend(clueViewService, Backbone.Events);
