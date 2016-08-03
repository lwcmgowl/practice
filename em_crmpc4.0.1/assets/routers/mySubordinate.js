(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
               //企业伙伴
               // enterprise : ["assets/services/enterprise.js", "assets/models/enterprise.js", "assets/views/enterprise.js"],
               //个人伙伴
               // individual:["assets/services/individual.js", "assets/models/individual.js", "assets/views/individual.js"],
               //我下属的企业伙伴
               mySubordinate:["assets/services/mySubordinate.js", "assets/models/mySubordinate.js", "assets/views/mySubordinate.js"],
               //我下属的个人伙伴
               mySubordinatePersonal:["assets/services/mySubordinatePersonal.js", "assets/models/mySubordinatePersonal.js", "assets/views/mySubordinatePersonal.js"],
               
               //全部伙伴企业伙伴
               // partnerAll:["assets/services/partnerAll.js", "assets/models/partnerAll.js", "assets/views/partnerAll.js"],
               //全部伙伴个人伙伴
               // partnerAllPersonal:["assets/services/partnerAllPersonal.js", "assets/models/partnerAllPersonal.js", "assets/views/partnerAllPersonal.js"],
               //伙伴详情
               // partnerDetail:["assets/services/partnerDetail.js", "assets/models/partnerDetail.js", "assets/views/partnerDetail.js"],
               mySubordinateDetail:["assets/services/mySubordinate.js", "assets/models/mySubordinate.js", "assets/views/mySubordinateDetail.js"],
               // partnerInfo:["assets/services/partnerDetail.js", "assets/models/partnerDetail.js", "assets/views/partnerInfo.js"],
               // customerInfo:["assets/services/partnerDetail.js", "assets/models/partnerDetail.js", "assets/views/customerInfo.js"],
               // perPartnerDetail:["assets/services/partnerDetail.js", "assets/models/partnerDetail.js", "assets/views/perPartnerDetail.js"],
               myStaffPersonalDetail:["assets/services/mySubordinatePersonal.js", "assets/models/mySubordinatePersonal.js", "assets/views/myStaffPersonalDetail.js"],
               // partnerAllDetail:["assets/services/partnerDetail.js", "assets/models/partnerDetail.js", "assets/views/partnerAllDetail.js"],
               // partnerAllPersonalDetail:["assets/services/partnerDetail.js", "assets/models/partnerDetail.js", "assets/views/partnerAllPersonalDetail.js"]
            // addResponsibility : ["assets/services/addResponsibility.js", "assets/models/addResponsibility.js", "assets/views/addResponsibility.js"],
            // dynamicEdit : ['assets/services/dynamicEdit.js', 'assets/models/dynamicEdit.js', 'assets/views/dynamicEdit.js'],
            // listviewDetail : ["assets/services/listviewDetail.js", "assets/models/listviewDetail.js", "assets/views/listviewDetail.js"]
        },
        routes : {
             "mySubordinate":"mySubordinate",
             "mySubordinatePersonal":"mySubordinatePersonal",
             //删除上传图片
             "delpic/:id/:type" : "delpic",
             "partnerDetail/:id":"partnerDetail",
             "partnerInfo":"partnerInfo",
             "edit/:id/:type":"edit",
             "del/:id/:type":"del",
             "convert/:id/:type":"convert",
             "perPartnerDetail/:id":"perPartnerDetail",
             "customerInfo":"customerInfo",
             "addIndividual":"addIndividual",
             "mySubordinateDetail/:id":"mySubordinateDetail",
             "myStaffPersonalDetail/:id":"myStaffPersonalDetail",
            // "marketDetail/:id" : 'marketDetail',
            // "marketpeingDetail/:id" : 'marketpeingDetail',
            // "del/:info" : 'delinfo',
            // "assign/:info" : "assign",
            // "addMarket/:status" : "addMarket",
            // "listview" : "listview",
            // "listviewDetail/:id" : "listviewDetail",
            // "mystaff" : "mystaff",
            // "addResponsibility" : "addResponsibility",
            // "report/:info" : "report",
            // "transfer/:info" : "transfer",
            // "edit/:info" : "edit",
            // 'dynamicOffical/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'getUnallotDynamic',
            // 'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'getUnallotDynamics',
            // 'dynamicEditUnclear/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'dynamicEditUnclear'
        },
        //我负责的
        enterprise : function() {
            loadSequence(this.deps.enterprise, function() {
                $('#myTab a[href="#enterprise"]').tab('show');
                enterpriseViewInstance.initinfo();
            })
        },
        individual:function(){
            loadSequence(this.deps.individual, function() {
                $('#myTab a[href="#individual"]').tab('show');
                individualViewInstance.initinfo();
            })
        },
        //添加个人伙伴
        addIndividual:function(){
             loadSequence(this.deps.individual, function() {
                individualViewInstance.add();
            })
        },
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
        // addResponsibility : function() {
            // loadSequence(this.deps.addResponsibility, function() {
                // addMarketInstance.load();
            // })
        // },
        // edit : function(id) {
            // loadSequence(this.deps.addResponsibility, function() {
                // addMarketInstance.load(id);
            // })
        // },
        // delinfo : function(id) {
            // loadSequence(this.deps.responsibility, function() {
                // marketViewInstance.delinfo(id);
            // })
        // },
        // report : function(id) {
            // loadSequence(this.deps.responsibility, function() {
                // marketViewInstance.report(id);
            // });
        // },
        // transfer : function(id) {
            // loadSequence(this.deps.responsibility, function() {
                // marketViewInstance.transfer(id);
            // });
        // },
        // assign : function(info) {
            // var info = eval(info);
            // var assignInfo = JSON.parse(info);
            // loadSequence(this.deps.offical, function() {
                // marketViewInstance.assign(assignInfo);
            // });
            // loadSequence(this.deps.pending, function() {
                // unclearViewInstance.assign(assignInfo);
            // });
        // },
        // marketDetail : function(id) {
            // loadSequence(this.deps.marketDetail, function() {
                // marketdetailInstance.load(id);
            // })
        // },
        // listviewDetail : function(id) {
            // loadSequence(this.deps.listviewDetail, function() {
                // marketdetailInstance.load(id);
            // })
        // },
        // addMarket : function(status) {
            // if (status == 1) {
                // loadSequence(this.deps.addMarket, function() {
                    // addMarketInstance.load();
                // });
            // } else {
                // loadSequence(this.deps.addMarketPending, function() {
                    // addMarketPendingInstance.load();
                // });
            // };
        // },
        // marketpeingDetail : function(id) {
            // loadSequence(this.deps.marketpeingDetail, function() {
                // marketpeingDetailInstance.load(id);
            // })
        // },
        // getUnallotDynamic : function(objEntityId, objEntityTypeId, editType, companyName) {
            // loadSequence(this.deps.dynamicOffical, function() {
                // dynamicViewObj.getDynamicData(objEntityId, objEntityTypeId, editType, companyName);
            // });
        // },
        // dynamicEditUnclear : function(objEntityId, objEntityTypeId, editType, companyName) {
            // loadSequence(this.deps.dynamicUnclear, function() {
                // dynamicViewObjs.getDynamicData(objEntityId, objEntityTypeId, editType, companyName);
            // });
        // },
        // getUnallotDynamics : function(objEntityId, objEntityTypeId, editType, companyName) {
            // loadSequence(this.deps.dynamicEdit, function() {
                // dynamicViewObj.getDynamicData(objEntityId, objEntityTypeId, editType, companyName);
            // });
        // }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
         appRouter.navigate("mySubordinate", {
            trigger : true
        });
    

})($);

