var addmyResponService = {
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
    },
    edit:function(id,info,options){
         var data = $.extend({"id":id}, info);
        ajax({
            url :"/clue/edit",
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
    },
    getDetail:function(id,options){  //详情
        var data={
            "id":id
         }
        ajax({
            url :"/clue/view",   
            data : data,
            success : function(data) {
                if (data.status == "000"){
                    options.success(data);
                }else{
                    options.error(data);
                }
            },
            error : function(err) {
                options.error(err);
            }
        });
    }
};
_.extend(addmyResponService, Backbone.Events);

