var partnerViewService = {
    request : function(options) {
        var self = this;
        var data={
            id:options.id
        }
        ajax({
            url :"/partner/view",
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
    addEnterprise : function(data,options) {
        ajax({
            url : "/partner/add",
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
    editPartner:function(id,data,options) {
        var data = $.extend({"id":id}, data);
        ajax({
            url : "/partner/edit",
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
    getMarketPerson : function(options) {
        var data = {
            "regionId" : options.region,
            "roleType" : options.roleType
        };
        ajax({
            url : "/partner/listStaff",
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
    assign : function(options) {
                var data = {
                            "id" :options.id,
                            "partnerUserId" : options.partnerUserId,
                            "region" : options.region
                        };
        ajax({
            url : "/partner/convert",
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
    reportrole : function(options) {
        var data = {
            "id" : options.id,
            "dataType" : "1",
            "clueType" : "0",
            "salesUserId" : options.userId,
            "submitState" : "",
            "clueState" : "0"
        };
        ajax({
            url : "/marketing/report",
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
     addCustomer : function(data,options) {
        ajax({
            url : "/partner/partnerCustom/add",
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
_.extend(partnerViewService, Backbone.Events);
