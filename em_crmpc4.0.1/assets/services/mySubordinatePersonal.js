var partnerViewService = {
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

    }
};
_.extend(partnerViewService, Backbone.Events);
