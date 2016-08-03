//加载并初始化模板对象
var marketdetailTemplate = loadTemplate("assets/templates/staff/detailOpport.html");

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
            if(info.startDate)
                $("#startDate").html(info.startDate.substring(0,4)+'-'+info.startDate.substring(4,6)+'-'+info.startDate.substring(6,8))
            if(info.sttlDate)
                $("#sttlDate").html(info.sttlDate.substring(0,4)+'-'+info.sttlDate.substring(4,6)+'-'+info.sttlDate.substring(6,8))
            $("#opptStat").html(appcan.opptStat[parseInt(info.opptStatId)]);
            $("#ProductType").html(appcan.producttype[parseInt(info.productType)]);
            $("#Source").html(appcan.clueSources[parseInt(info.dataSource)]);
            $("#vndtAmt").html(self.milliFormat(info.vndtAmt));
            if($("#Source").html()==='行业会议'){
                $("#meeting").removeClass('hide');
               }
            },
            error : function(cols, resp, options) {

            },
            id : direction
        });
         //self.render();
    },
     milliFormat:function(s){//添加千位符  
        if(/[^0-9\.]/.test(s)) return "invalid value";  
        s=s.replace(/^(\d*)$/,"$1.");  
        s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");  
        s=s.replace(".",",");  
        var re=/(\d)(\d{3},)/;  
        while(re.test(s)){  
            s=s.replace(re,"$1,$2");  
        }  
        s=s.replace(/,(\d\d)$/,".$1");  
        return s.replace(/^\./,"0.")  
    }  
});

var marketdetailInstance = new marketdetailView();
