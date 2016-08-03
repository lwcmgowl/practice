var myResponsibleCluesListViewService = {
    request : function(options) {
        var self = this;
        ajax({
            url : "/clue/trade/listTrade",
            success : function(data) {
                if (data.status == "000") {
                    //alert(JSON.stringify(data))
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
    toopp : function(options) {// 改变线索状态
        var data = {
            clueId : options.clueId,
            opptTtl : options.opptTtl,
            opptStatId : options.opptStatId,
            vndtAmt : options.vndtAmt,
            startDate : options.startDate,
            sttlDate : options.sttlDate,
            remark : options.remark,
            dataSource : options.dataSource,
            productType : options.productType,
            conferenceName:options.conferenceName
        }
        ajax({
            url : '/clue/toopp',
            data : data,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            },
        });
    },
    change : function(options) {// 改变线索状态
        var data = {
            clueState : options.clueState,
            closeReason : options.closeReason,
            id : options.id,
            contactName : options.contactName,
            companyName : options.companyName
        }
        ajax({
            url : '/clue/edit',
            data : data,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            },
        });
    },
    transfer : function(options) {// 改变线索状态
        var data = {
            "id" : options.id,
            "salesUserId" : options.salesUserId
        }
        ajax({
            url : '/clue/transfer',
            data : data,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data)
                } else {
                    options.error(data)
                };
            },
        });
    },
     addmyRespon : function(data,options) {   //添加
        ajax({
            url :"/clue/add",   
            data : data,
            success : function(data) {
               if (data.status == "000"){
                    options.success(data);
                }else{
                    options.error(data);
                }
            },
            error : function(err) {
                $.warning('数据添加失败')
            }
        });
    }
};
_.extend(myResponsibleCluesListViewService, Backbone.Events);
