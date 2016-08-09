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
                $("#contactNameDetail").html(info.csmName+'<span id="contactMobi"></span><b>|<b><span id="contactTele"></span>');
                if(info.mobile){
                   $("#contactMobi").show();
                   $("#contactMobi").html(info.mobile); 
                }else{
                    $("#contactMobi").hide();
                    $("#contactNameDetail b").hide();
                }
                if(info.teleNo){
                    $("#contactTele").show();
                    $("#contactNameDetail b").show();
                    $("#contactTele").html(info.teleNo);
                }else{
                    $("#contactTele").hide();
                    $("#contactNameDetail b").hide();
                }
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
            },
            error : function(cols, resp, options) {

            },
            id : direction
        });
    }
});


