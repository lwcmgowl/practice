//加载并初始化模板对象
var culeDetailTemplate = loadTemplate("assets/templates/staff/assignculeView.html");

//列表容器VIEW
var culeDetailView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#assign',
    render : function() {
        this.$el.empty();
        // var el = $(this.template());
        // this.$el.append(el);
        this.$el.append($(this.template()));
    },
    model : new culePageModel(),
    template : culeDetailTemplate,
    load : function(direction) {
        var self = this;
        this.model.fetch({
            type : 3,
            id : direction,
            success : function(cols, resp, options) {
                self.render();
                var detail = resp.msg.item;
                $("#companyName").html(detail.companyName);
                $("#contactName").html(detail.contactName);
                $("#mobile").html(detail.mobile);
                $("#teleNo").html(detail.teleNo);
                $("#QQ").html(detail.qq);
                $("#weChat").html(detail.weChat);
                $("#email").html(detail.email);
                $("#department").html(detail.department);
                $("#post").html(detail.post);
                if (detail.dataSource) {
                    $("#dataSource").html(appcan.clueSources[detail.dataSource]);
                }
                if (detail.productType) {
                    $("#productType").html(appcan.producttype[detail.productType]);
                }
                if (detail.level) {
                    $("#level").html(appcan.customerlevel[detail.level]);
                }
                if (detail.profession) {
                    $("#profession").html(detail.professionName);
                }
                if (detail.csmNature) {
                    $("#csmNature").html(appcan.customerproperty[detail.csmNature]);
                }
                if (detail.csmScale) {
                    $("#csmScale").html(appcan.customersize[detail.csmScale]);
                }
                if (detail.region) {
                    var region = detail.regionName;
                }
                $("#region").html(region);
                $("#province").html(detail.province);
                $("#address").html(detail.address);
                $("#postcode").html(detail.postcode);
                $("#website").html(detail.website);
                $("#fax").html(detail.fax);
                $("#remark").html(detail.remark);
                //  $("#marketUserName").html(detail.marketUserName);
                $("#assignerName").html(detail.assignerName);
                if (detail.distributionTime) {
                    $("#distributionTime").html(toDateString(detail.distributionTime));
                }
                if (detail.submitTime) {
                    $("#reportTime").html(toDateString(detail.submitTime));
                }
                $("#salesUserName").html(detail.salesUserName);
                // if(detail.clueState){
                // $("#clueState").html( appcan.clueState[detail.clueState]);
                // }
                if (detail.clueState == 3) {
                    $("#closeReason1").show();
                    $("#closeReason").html(appcan.closeReason[detail.closeReason]);
                    //不合格原因
                } else {
                    $("#clueState").html(appcan.clueState[detail.clueState]);
                    $("#closeReason1").hide();
                }

            },
            error : function(cols, resp, options) {

            }
        });
        //self.render();
    }
});

var culeDetailViewInstance = new culeDetailView();
