var remindService = {
    getmenulist : function(options) {
        var param = {
            "ifno" : "zywx-remind-0004",
            "condition" : {
            },
            "content" : {
                "entityTypeId" : "27"
            }
        };
        ;
        this.ajaxRequest(param, options);
    },
    getremindDetail : function(options) {
        var param = {
            objEntityTypeId : "02",
            ifRead:"0",
            remindUserId:appcanUserInfo.userId,
            pageNo:1,
            pageSize : 10,
        };
        ajax({
            url : '/remind/page',
            data : param,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            },
        });
        
    },
    read : function(options) {
        var param = {
            "ifno" : "zywx-remind-0005",
            "condition" : {},
            "content" : {
                "objectId" : options["id"],
                "entityTypeId" : "27"
            }
        };
        this.ajaxRequest(param, options);
    }
};
_.extend(remindService, Backbone.Events);

