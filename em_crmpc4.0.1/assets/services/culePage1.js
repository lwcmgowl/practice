var culePageViewService = {
    request : function(options) {
         var self = this;
        $.ajax({
            url : urlIp+options.url,
            data : options.param,
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
_.extend(culePageViewService, Backbone.Events);
