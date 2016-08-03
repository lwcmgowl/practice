//加载并初始化模板对象
var detailEditMainTemplate = loadTemplate("assets/templates/customer/detailEdit.html");
//列表容器VIEW
var detailEditModelMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    model : new detailEditModel(),
    template : detailEditMainTemplate,
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    events : {
        'class #btn btn-default' : 'backHref'
    },
    backHref : function() {
        //window.history.back();
    },
    getDetailData : function(detailId) {
        var self = this;
        self.render();
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#csmName").html(resp.msg.item.csmName);
                $("#salesUserId").html(resp.msg.item.salesUserName);
                $("#csmStatId").html(appcan.csmStat[resp.msg.item.csmStatId]);
                $("#level").html(appcan.customerlevel[resp.msg.item.level]);
                $("#profession").html(resp.msg.item.professionName);
                $("#csmNature").html(appcan.customerproperty[resp.msg.item.csmNature]);
                $("#csmScale").html(appcan.customersize[resp.msg.item.csmScale]);
                $("#upperCompanyName").html(resp.msg.item.upperCompanyName);
                $("#region").html(resp.msg.item.regionName);
                $("#province").html(resp.msg.item.province);
                $("#address").html(resp.msg.item.address);
                $("#postcode").html(resp.msg.item.postcode);
                $("#website").html(resp.msg.item.website);
                $("#fax").html(resp.msg.item.fax);
                $("#remark").html(resp.msg.item.remark);
                $("#csmNum").html(resp.msg.item.csmNum);
            },
            error : function(cols, resp, options) {
                //alert(resp);
            },
            id : detailId
        });
    }
});
var detailEditModelMainViewInstance = new detailEditModelMainView();
