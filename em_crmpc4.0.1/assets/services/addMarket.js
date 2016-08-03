var addMarketService = {
    addMarket : function(options) {
        $.ajax({
            url : urlIp + "/marketing/add",
            data : options.attributes,
            success : function(data) {
                    $.success('添加成功')
                    appRouter.navigate("offical", {
                        trigger : true
                    });
            },
            error : function(err) {
                $.warning('数据添加失败')
            }
        });
    }
};
_.extend(addMarketService, Backbone.Events);

