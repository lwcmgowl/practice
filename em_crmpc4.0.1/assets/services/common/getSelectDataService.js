/**
 *初始化服务对象
 */
var getSelectDataService = {
    lock : false,
    getSelectData : function(data, type, url) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        if (url == '' || url == null || url == 'undefined' || url.indexOf('/') < 0) {
            return;
        }
        if (type == '' || type == null || type == 'undefined') {
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
            },
            error : function(data) {
                console.log("数据加载异常:" + data.msg);
            }
        });
    }
};
//绑定事件监听
_.extend(exportFileService, Backbone.Events);

