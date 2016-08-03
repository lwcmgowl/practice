(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
               //全部伙伴企业伙伴
               partnerAll:["assets/services/partnerAll.js", "assets/models/partnerAll.js", "assets/views/partnerAll.js"],
               //全部伙伴个人伙伴
               partnerAllPersonal:["assets/services/partnerAllPersonal.js", "assets/models/partnerAllPersonal.js", "assets/views/partnerAllPersonal.js"],
               partnerAllDetail:["assets/services/partnerDetail.js", "assets/models/partnerAll.js", "assets/views/partnerAllDetail.js"],
               partnerAllPersonalDetail:["assets/services/partnerDetail.js", "assets/models/partnerAllPersonal.js", "assets/views/partnerAllPersonalDetail.js"]
        },
        routes : {
             "partnerAll":"partnerAll",
             "partnerAllPersonal":"partnerAllPersonal",
             "partnerAllDetail/:id":"partnerAllDetail",
             "partnerAllPersonalDetail/:id":"partnerAllPersonalDetail"
        },
        //我负责的
        mySubordinate:function(){
             loadSequence(this.deps.mySubordinate, function() {
                $('#myTab a[href="#mySubordinate"]').tab('show');
                enterpriseViewInstance.initinfo();
            })
        },
        mySubordinateDetail:function(id){
             loadSequence(this.deps.mySubordinateDetail, function() {
                 $('#myTab a[href="#partnerInfo"]').tab('show');
                 partnerDetailInstance.initinfo(id);
             })
            
        },
        mySubordinatePersonal:function(){
            loadSequence(this.deps.mySubordinatePersonal, function() {
                // $('#myTab a[href="#mySubordinatePersonal"]').tab('show');
                individualViewInstance.initinfo();
            })
        },
        myStaffPersonalDetail:function(id){
             loadSequence(this.deps.myStaffPersonalDetail, function() {
                $('#myTab a[href="#partnerInfo"]').tab('show');
                 perPartnerDetailInstance.initinfo(id);
             })
        },
        partnerAllDetail:function(id){
            loadSequence(this.deps.partnerAllDetail, function() {
                 $('#myTab a[href="#partnerInfo"]').tab('show');
                 partnerDetailInstance.initinfo(id);
             })
        },
        partnerAll:function() {
            loadSequence(this.deps.partnerAll, function() {
                $('#myTab a[href="#partnerAll"]').tab('show');
                enterpriseViewInstance.initinfo();
            })
        },
         partnerAllPersonal:function(){
            loadSequence(this.deps.partnerAllPersonal, function() {
                $('#myTab a[href="#partnerAllPersonal"]').tab('show');
                individualViewInstance.initinfo();
            })
        },
        partnerAllPersonalDetail:function(id){
             loadSequence(this.deps.partnerAllPersonalDetail, function() {
                $('#myTab a[href="#partnerInfo"]').tab('show');
                 perPartnerDetailInstance.initinfo(id);
             })
        },
        //删除上传图片
         delpic : function(id, type) {
            if (type == '1') {
                 loadSequence(this.deps.enterprise, function() {
                 enterpriseViewInstance.delpic(id);
            })
            }else if(type=='2'){
                 loadSequence(this.deps.individual, function() {
                 individualViewInstance.delpic(id);
               })
            }else if(type=='3'){
                loadSequence(this.deps.partnerDetail, function() {
                 partnerDetailInstance.delpic(id);
               })
            }else if(type=='4'){
                 loadSequence(this.deps.perPartnerDetail, function() {
                 perPartnerDetailInstance.delpic(id);
               })
            }
        },
        //企业伙伴信息详情
         partnerDetail : function(id) {
             loadSequence(this.deps.partnerDetail, function() {
                 $('#myTab a[href="#partnerInfo"]').tab('show');
                 partnerDetailInstance.initinfo(id);
             })
         },
         //企业伙伴信息标签
         partnerInfo:function(){
              loadSequence(this.deps.partnerInfo, function() {
                 $('#myTab a[href="#partnerInfo"]').tab('show');
                 partnerInfoDetailInstance.initinfo();
             })
             
         },
         //个人伙伴信息
         perPartnerDetail:function(id){
             loadSequence(this.deps.perPartnerDetail, function() {
                $('#myTab a[href="#partnerInfo"]').tab('show');
                 perPartnerDetailInstance.initinfo(id);
             })
         },
         //企业客户信息
         customerInfo:function(){
             loadSequence(this.deps.customerInfo, function() {
                 $('#myTab a[href="#customerInfo"]').tab('show');
                 partnerCustomerInfoInstance.initinfo();
             })
         },
         edit:function(id,type){
             if(type==="1"){
                         loadSequence(this.deps.partnerDetail, function() {
                             partnerDetailInstance.edit(id);
                         })
            }else if(type==="2"){
                 loadSequence(this.deps.perPartnerDetail, function() {
                 perPartnerDetailInstance.edit(id);
             })
            }
         },
         del:function(id,type){
             if(type==="1"){
              loadSequence(this.deps.partnerDetail, function() {
                 partnerDetailInstance.delPartner(id);
             });
             }else{
                  loadSequence(this.deps.perPartnerDetail, function() {
                 perPartnerDetailInstance.delPartner(id);
                 });
             }
         },
         convert:function(id,type){
             if(type==="1"){
              loadSequence(this.deps.partnerDetail, function() {
                 partnerDetailInstance.convert(id);
             });
             }else{
                  loadSequence(this.deps.perPartnerDetail, function() {
                 perPartnerDetailInstance.convert(id);
                }); 
             }
         }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
         appRouter.navigate("partnerAll", {
            trigger : true
        });
    

})($);

