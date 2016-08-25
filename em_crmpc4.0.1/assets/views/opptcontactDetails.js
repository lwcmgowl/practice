//加载并初始化模板对象
var opportContactdetailTemplate = loadTemplate("assets/templates/staff/opptcontactDetails.html");

//列表容器VIEW
var opprotContactdetailView = Backbone.View.extend({
    initialize : function() {
        
    },
    el : '#contactDetail',
    render : function() {
        this.$el.empty();
        this.$el.html($(this.template()));
    },
    model : new marketDetailModel(),
    template : opportContactdetailTemplate,
    load : function(direction) {
        var self = this;
        self.render();
        self.model.fetch({
            success : function(cols, resp, options) {
                var info=resp.msg.item;
                $("#contactTitle").html(info.contactName);
                $("#contactNameDetail").html(info.csmName+'<span id="contactMobi" style="margin-left:10px;margin-right:10px;"></span><span id="division">|</span><span id="contactTele" style="margin-left:10px;"></span>');
                if(info.mobile && info.teleNo){
                   $("#contactMobi").show();
                   $("#contactMobi").html(info.mobile);
                   $("#contactTele").show();
                   $("#contactTele").html(info.teleNo); 
                };
                if(info.teleNo && !info.mobile){
                    $("#contactTele").show();
                    $("#contactTele").html(info.teleNo);
                    $("#division").hide();
                };
                if(!info.teleNo && info.mobile){
                   $("#contactMobi").show();
                   $("#contactMobi").html(info.mobile);
                   $("#division").hide();
                };
              for(var i in info){
                var ele = $('#'+i);
                if(ele[0]){
                    ele.html(info[i]);
                }
            }
            $("#sexType").html(appcan.sex[info.sex]);
            $("#contactType").html(appcan.contactType[info.contactTypeId]);
            if(info.province != '00'){
                $('#area').append(info.province);
                }
                $(".form-group div.u-word").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().hide();
                    }
                });
            },
            error : function(cols, resp, options) {

            },
            id : direction
        });
    }
});


