//加载并初始化模板对象
var connectionCustomerDetailTemplate = loadTemplate("assets/templates/customer/connectionCustomerDetail.html");
//列表容器VIEW
var connectionCustomerDetailView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    model : new connectionCustomerDetailModel(),
    template : connectionCustomerDetailTemplate,
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    events : {
        'class #btn btn-default' : 'backHref'
    },
    backHref : function() {

    },
    getDetailData : function(detailId, name) {
        var self = this;
        self.render();
        this.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                for (var i in info) {
                    var ele = $('#' + i);
                    if (ele[0]) {
                        ele.html(info[i]);
                    }
                }
                $("#sexType").html(appcan.sex[info.sex]);
                $("#contactType").html(appcan.contactType[info.contactTypeId]);
                if (info.province != '00') {
                    $('#area').append(info.province);
                }
            },
            error : function(cols, resp, options) {
                //alert(resp);
            },
            id : detailId,
            name : name
        });
    }
});
var connectionCustomerDetailViewInstance = new connectionCustomerDetailView();
