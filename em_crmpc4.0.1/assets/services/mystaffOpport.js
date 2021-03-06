var marketViewService = {
    requestDetail:function(options){
         var self = this;
        data = {
            "id" : options["id"]
        }, 
        ajax({
            url :"/opport/view",
            data : data,
            success : function(data) {
                if (data.status == "000")
                    options.success(data);
                else
                    options.error(data);
                self.lock = false;
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

    }
    
};
_.extend(marketViewService, Backbone.Events);
