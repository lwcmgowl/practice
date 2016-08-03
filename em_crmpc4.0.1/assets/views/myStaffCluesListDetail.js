//加载并初始化模板对象
var  myStaffCluesListDetailTemplate = loadTemplate("assets/templates/staff/myStaffCluesListDetail.html");
//列表容器VIEW
var  myStaffCluesListDetailView = Backbone.View.extend({  
    initialize : function() {
        
    },
    el :'#contentdiv',
    render : function() {
        this.$el.empty();
        var el =  $(this.template());
        this.$el.append(el);
    },
    model : new myStaffCluesListDetailModel(),
    template : myStaffCluesListDetailTemplate,
    load : function(direction) {
        var self = this;
           self.render();
        this.model.fetch({
            success : function(cols, resp, options) {
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
            if(detail.dataSource){
               $("#dataSource").html(appcan.clueSources[detail.dataSource]); 
            }
            if(detail.productType){
               $("#productType").html(appcan.producttype[detail.productType]); 
            }
            if(detail.level){
                $("#level").html(appcan.customerlevel[detail.level]);
            }
           if(detail.profession){
                    $("#profession1").html(detail.professionName);
                }
            if(detail.csmNature){
                $("#csmNature").html(appcan.customerproperty[detail.csmNature]);
            }
            if(detail.csmScale){
                $("#csmScale").html(appcan.customersize[detail.csmScale]);  
            }
            if(detail.region){
                    var region =detail.regionName;
                }
            $("#region1").html(region);
            $("#province").html(detail.province)
            $("#address").html(detail.address);
            $("#postcode").html(detail.postcode);
            $("#website").html(detail.website);
            $("#fax").html(detail.fax);
            $("#remark").html(detail.remark);
            $("#marketUserName").html(detail.marketUserName);
            $("#assignerName").html(detail.assignerName);
            $("#remark").html(detail.remark);
            if(detail.distributionTime){
                 $("#distributionTime").html(toDateString(detail.distributionTime));
            }
            $("#salesUserName").html(detail.salesUserName);
            if(detail.submitTime){
            $("#reportTime").html(toDateString(detail.submitTime));
            }
            if(detail.clueState){
               $("#clueState1").html( appcan.clueState[detail.clueState]); 
            }
            // if(detail.clueType==0){
                // $("#assignerName1").css("display","none");
                // $("#distributionTime1").css("display","none");
                // $("#closeReason1").hide();
            // }
            if(detail.clueState == 3){
                $("#closeReason1").show();
                $("#closeReason").html(appcan.closeReason[detail.closeReason]);//不合格原因
            }else{
                $("#closeReason1").hide();
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

var myStaffCluesListDetailInstance = new  myStaffCluesListDetailView();
