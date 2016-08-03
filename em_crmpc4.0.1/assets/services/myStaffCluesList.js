var myStaffCluesListViewService = {
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
    exportFile : function(data, url) {   //导出
        var data = {
                    "entityType" : "puisneClue",
                    "clueType":$('#clueType').val(),
                    "profession": $('#profession').val(),
                    "clueState":$('#clueState').val(),
                    "companyName":$.trim($('#csmName').val()),
                    "region":$('#region').val(),
                    "salesQuery":$.trim($("#people").val()),
                    "dataType": '1'
                };
                ajax({
                   url : "/clue/exportClue",
                    data : data,
                    success : function(data) {
                        var url = urlIp + '/excel/out?path=' +encodeURIComponent(data.msg.message);
                        window.location = url;                  
                    }
                });

    }
};
_.extend(myStaffCluesListViewService, Backbone.Events);
