var myReportViewService = {
    myReportDetail : function(options) {
        var self = this;
        var data={
            id:options.id
        }
        ajax({
            url :"/opport/viewTemp",
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
    clueDetail : function(options) {
       var self = this;
        var data={
            id:options.id
        }
        ajax({
            url :"/opport/viewClue",
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
    assign : function(options) {
                var data = {
                    "id" :options.id,
                    "salesUserId" : options.salesUserId
                        };
        ajax({
            url : "/opport/clue/transfer",
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
    getListExamine:function(options){
         var data = {
                    objEntityId:options.objEntityId
             };
        ajax({
            url : "/opport/examine/list",
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
    delPartner : function(options) {
        var self = this;
        var data = {
            "id" : options.id
        }
        ajax({
            url : "/partner/deletePartner",
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
    //添加商机
    addMyReport : function(data,options) {
        ajax({
            url : "/opport/addTemp",
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
    //导出商机
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
    //客户列表
    customerList:function(options){
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
    contactList:function(options){
        var data={
             "customId":options.customId
        };
         ajax({
            url :"/opport/contact/listContactName",
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
    }
};
_.extend(myReportViewService, Backbone.Events);
