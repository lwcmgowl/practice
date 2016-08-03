var cluesListViewService = {
    request : function(options) {
        var self = this;
        ajax({
            url :"/clue/trade/listTrade",
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
    listDict : function(options) {   //获取数据
        ajax({
            url :"/clue/trade/listTrade",
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
    exportFile : function(data, url) {   //导出
        var data = {
                    "entityType" : "exportClue",
                    "dataType" : "1",
                    "profession":$("#profession").val(),
                    "region" : $("#region").val(),
                    "clueState" : $("#clueState").val(),
                    "companyName" : $.trim($("#csmName").val()),
                    "salesQuery":$.trim($('#people').val()),
                    "submitState":1
                };      
        ajax({
            url : "/clue/exportClue",   //url,
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
_.extend(cluesListViewService, Backbone.Events);
