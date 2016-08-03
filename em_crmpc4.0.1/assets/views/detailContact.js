//加载并初始化模板对象
var marketdetailTemplate = loadTemplate("assets/templates/staff/detailContact.html");

//列表容器VIEW
var marketdetailView = Backbone.View.extend({
    initialize : function() {
        
    },
    el : '#contentdiv',
    render : function() {
        this.$el.empty();
        var el =  $(this.template());
        this.$el.append(el);
    },
    model : new marketDetailModel(),
    template : marketdetailTemplate,
    load : function(direction) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                self.render();
                var info=resp.msg.item;
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
         //self.render();
    },
    pagecountchange : function(e) {
        console.log("select ",e);
    }
});

var marketdetailInstance = new marketdetailView();
