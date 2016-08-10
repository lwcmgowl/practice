//加载并初始化模板对象
var marketdetailTemplate = loadTemplate("assets/templates/staff/listviewDetail.html");

//列表容器VIEW
var marketdetailView = Backbone.View.extend({
    initialize : function() {
        
    },
    el : '#detailpartdiv',
    render : function() {
        this.$el.empty();
        var el =  $(this.template());
        this.$el.append(el);
    },
    model : new marketDetailModel(),
    template : marketdetailTemplate,
    load : function(direction) {
        var self = this;
        self.render();
        this.model.fetch({
            success : function(cols, resp, options) {
                var detail=resp.msg.item;
                $("#companyName").html(detail.companyName);
                $("#contactName").html(detail.contactName);
                $("#mobile").html(detail.mobile);
                $("#teleNo").html(detail.teleNo);
                $("#QQ").html(detail.qq);
                $("#weChat").html(detail.weChat);
                $("#email").html(detail.email);
                $("#department").html(detail.department);
                $("#post").html(detail.post);
                
                if(detail.dataSource)
                    $("#dataSource1").html(appcan.clueSources[detail.dataSource]);
                if(appcan.clueSources[detail.dataSource] == "行业会议"){
                    $("#meeting").css("display","block");
                    $("#meetingName").html(detail.conferenceName);
                }
                if(detail.productType)
                    $("#productType").html(appcan.producttype[detail.productType]);
                if(detail.level)
                    $("#Customerlevel").html(appcan.customerlevel[detail.level]);
                if(detail.profession)
                    $("#profession1").html(detail.professionName);
                if(detail.csmNature)
                    $("#csmNature").html(appcan.customerproperty[detail.csmNature]);
                if(detail.csmScale)
                    $("#csmScale").html(appcan.customersize[detail.csmScale]);
                 
                if(detail.region){
                    var region =detail.regionName;
                }
                $("#region1").html(region);
                $("#province1").html(detail.province)
                $("#address").html(detail.address);
                $("#postcode").html(detail.postcode);
                $("#website").html(detail.website);
                $("#fax").html(detail.fax);
               $("#remark").html(detail.remark);
               $("#fzr").html(detail.marketUserName);
               
            },
            error : function(cols, resp, options) {

            },
            id : direction
        });
    }
});

var marketdetailInstance = new marketdetailView();
