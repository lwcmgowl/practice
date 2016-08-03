var contactViewService = {
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
            "relationId": options.id
        }
        ajax({
            url :"/opport/contact/delRelationId",
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
_.extend(contactViewService, Backbone.Events);
