/**
 *初始化服务对象
 */
var exportFileService = {
    lock : false,
    exportFile : function(data, type, url) {
       
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        self.lock=true;
        if (url == '' || url == null || url == 'undefined' || url.indexOf('/') < 0) {
            return;
        }
        if (type == '' || type == null || type == 'undefined') {
            return;
        }
        if (type != 'exportFile') {
            return;
        }
        if (data == '' || data == null || data == 'undefined') {
            return;
        }
        var type = type;
        var url = url;
        var data = data;
        ajax({
            url : url,
            data : data,
            success : function(data) {
                self.lock=false;
                if (data.status == '000') {
                    var url = urlIp + '/excel/out?path=' + encodeURIComponent(data.msg.message);
                    window.location = url;
                } else {
                    console.log("数据加载异常:" + data.msg);
                }
            },
            error : function(data) {
                console.log("数据加载异常:" + data.msg);
            }
        });
    }
};
//绑定事件监听
_.extend(exportFileService, Backbone.Events);

