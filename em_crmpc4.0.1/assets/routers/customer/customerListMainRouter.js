(function() {
    /**
     * 模块相关配置列表相关操作路由
     */
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("路由初始化....");
        },
        //配置页面相关操作
        deps : {

            //全部客户模块 **********************************开始
            loadCustomerList : ["assets/services/customer/customerListMainService.js", "assets/models/customer/customerListMainModel.js", "assets/views/customer/customerListMainView.js"],
            //动态 dynamic:[]
            dynamic : ["assets/services/customer/dynamicEditService.js", "assets/models/customer/dynamicEditModel.js", "assets/views/customer/dynamicEditView.js"],
            //联系人 customer:[]
            customer : ["assets/services/customer/connectionListMainService.js", "assets/models/customer/connectionListMainModel.js", "assets/views/customer/connectionListMainView.js"],
            //机会 chance:[]
            chance : ["assets/services/customer/customerConnectionChanceService.js", "assets/models/customer/customerConnectionChanceModel.js", "assets/views/customer/customerConnectionChanceView.js"],
            mystaffchance : ["assets/services/customer/customerConnectionChanceService.js", "assets/models/customer/customerConnectionChanceModel.js", "assets/views/customer/customerConnectionChanceView1.js"],
            //动态 detail:[]
            detail : ["assets/services/customer/detailEditService.js", "assets/models/customer/detailEditModel.js", "assets/views/customer/detailEditView.js"],
            //联系人详情
            connectionCustomerDetail : ["assets/services/customer/connectionCustomerDetailService.js", "assets/models/customer/connectionCustomerDetailModel.js", "assets/views/customer/connectionCustomerDetailView.js"],
            //机会查看
            opportDetails : ["assets/services/customer/opportDetailsService.js", "assets/models/customer/opportDetailsModel.js", "assets/views/customer/opportDetailsView.js"],
            //全部客户模块 ***********************************结束

            //我下属的客户模块 **********************************开始
            loadMyCustomerList : ["assets/services/customer/myCustomerListMainService.js", "assets/models/customer/myCustomerListMainModel.js", "assets/views/customer/myCustomerListMainView.js"],
            //我下属的客户模块 **********************************结束

            //我负责的客户模块 **********************************开始
            loadMyResponsCustomerList : ["assets/services/customer/myResponsCustomerListMainService.js", "assets/models/customer/myResponsCustomerListModel.js", "assets/views/customer/myResponsCustomerListMainView.js"],
            //我负责的客户模块 **********************************结束

            //全部机会模块 **********************************开始
            loadAllChanceMainList : ["assets/services/chance/chanceListMainService.js", "assets/models/chance/chanceListMainModel.js", "assets/views/chance/chanceListMainView.js", "assets/views/common/historyBack.js", "assets/services/common/exportFileService.js"],
            
            //全部机会模块 **********************************开始
            addCustomer:["assets/services/addCustomer.js", "assets/models/addCustomer.js", "assets/views/addCustomer1.js"],
            addContact: ["assets/services/addContact.js", "assets/models/addContact.js", "assets/views/addContact1.js"],
            addOpport: ["assets/services/addOpport.js", "assets/models/addOpport.js", "assets/views/addOpport1.js"]
        
        },
        //注入操作事件
        routes : {
            //全部客户模块 **********************************开始
            "loadCustomerList" : 'loadCustomerList',
            "dynamic/:objEntityId/:companyName/:objEntityTypeId/:editType/:cusotm" : 'dynamic',
            "detail/:id" : 'detail',
            "customer/:id/:name/:type/:customId" : 'customer',
            "connectionCustomerDetail/:id/:name" : 'connectionCustomerDetail',
            "chance/:id/:name/:type" : 'chance',
            "mystaffchance/:id/:name/:type":"mystaffchance",
            "opportDetails/:id/:options" : 'opportDetails',
            //全部客户模块 ***********************************结束

            //我下属的客户模块 **********************************开始
            "loadMyCustomerList" : 'loadMyCustomerList',
            //我下属的客户模块 **********************************结束

            //我负责的客户模块 **********************************开始
            "loadMyResponsCustomerList" : 'loadMyResponsCustomerList',
            //我负责的客户模块 **********************************结束

            //全部机会模块 **********************************开始
            "loadAllChanceMainList" : 'loadAllChanceMainList',
            //全部机会模块 ***********************************结束
            "addCustomer":"addCustomer",
            "edit/:info":"edit",
            "deliver/:info":"deliver",
            "change/:info":"change",
            "editCont/:id/:customId/:type":"editCont",
            "addcustomer/:id/:customId/:type":"addcustomer",
            "editChane/:id/:customId/:custom":"editChane",
            "addChances/:id/:customId/:type":"addChances"
            
        },
        //全部客户模块 **********************************开始
        loadCustomerList : function() {
            loadSequence(this.deps.loadCustomerList, function() {
                customerListMainViewInstance.initProfession();
            })
        },
        dynamic : function(objEntityId, companyName, objEntityTypeId, editType, cusotm) {
            loadSequence(this.deps.dynamic, function() {
                dynamicEditModelMainViewInstance.getDynamicData(objEntityId, companyName, objEntityTypeId, editType, cusotm);
            })
        },
        detail : function(id) {
            loadSequence(this.deps.detail, function() {
                detailEditModelMainViewInstance.getDetailData(id);
            })
        },
        customer : function(id, name, type,customId) {
            loadSequence(this.deps.customer, function() {
                connectionListMainViewInstance.initinfo(id, name, type,customId);
            })
        },
        connectionCustomerDetail : function(id, name) {
            loadSequence(this.deps.connectionCustomerDetail, function() {
                connectionCustomerDetailViewInstance.getDetailData(id, name);
            })
        },
        chance : function(id, name, type) {
            loadSequence(this.deps.chance, function() {
                customerConnectionChanceMainViewInstance.initinfo(id, name, type);
            })
        },
        mystaffchance:function(id, name, type) {
            loadSequence(this.deps.mystaffchance, function() {
                customerConnectionChanceViewInstance.initinfo(id, name, type);
            })
        },
        opportDetails : function(id, chanceURL) {
            loadSequence(this.deps.opportDetails, function() {
                opportDetailsMainViewInstance.getDetailData(id, chanceURL);
            })
        },
        //全部客户模块 ***********************************结束

        //我下属的客户模块 **********************************开始
        loadMyCustomerList : function() {
            loadSequence(this.deps.loadMyCustomerList, function() {
                myCustomerListMainViewInstance.initProfession();
            })
        },
        //我下属的客户模块 **********************************结束

        //我负责的客户模块 **********************************开始
        loadMyResponsCustomerList : function() {
            loadSequence(this.deps.loadMyResponsCustomerList, function() {
                myResponsCustomerListMainViewInstance.initProfession();
            })
        },
        deliver:function(id){
            // var info = eval(info);
            // var delinfo = JSON.parse(info);
            // var csmName = delinfo.csmName;
            // var regionName =delinfo.regionName;
            // var professionName=delinfo.professionName;
            // var region=delinfo.region;
            // var profession=delinfo.profession;
            // var id=delinfo.id;
            // var curName = delinfo.salesUserId;
             loadSequence(this.deps.loadMyResponsCustomerList, function() {
                myResponsCustomerListMainViewInstance.deliver(id);
            })
        },
        change:function(id){
             // var info = eval(info);
            // var delinfo = JSON.parse(info);
            // var csmName=delinfo.csmName;
            // // var opptTtl=delinfo.opptTtl;
            // var csmStatId=delinfo.csmStatId;
            // var id=delinfo.id;
            loadSequence(this.deps.loadMyResponsCustomerList, function() {
                myResponsCustomerListMainViewInstance.change(id);
            }) 
        },
        //我负责的客户模块 **********************************结束

        //全部机会模块 **********************************开始
        loadAllChanceMainList : function() {
            loadSequence(this.deps.loadAllChanceMainList, function() {
                chanceListMainViewInstance.load();
            })
        },
        //全部机会模块 ***********************************结束
        addCustomer:function(){
             loadSequence(this.deps.addCustomer, function() {
                addMarketInstance.load();
            })
        },
         edit:function(id){
            loadSequence(this.deps.addCustomer, function() {
                      addMarketInstance.load(id);
               });
        },
          editCont:function(id,customId,type){
            loadSequence(this.deps.addContact, function() {
                      addMarketInstance.load(id,customId,type);
               });
            
        },
        addcustomer:function(id,customId,type){
            loadSequence(this.deps.addContact, function() {
                      addMarketInstance.load(id,customId,type);
               });
        },
         editChane:function(id,customId,custom){
            loadSequence(this.deps.addOpport, function() {
                addOpportInstance.load(id,customId,custom);
            })
        },
        addChances:function(id,customId,type){
            loadSequence(this.deps.addOpport, function() {
                      addOpportInstance.load(id,customId,type);
               });
        }
        
    });

    window.appRouter = new AppRouter();
    Backbone.history.start();
    //默认指定运行
    if (routerType == "loadMyCustomerList") {
        appRouter.navigate("loadMyCustomerList", {
            trigger : true
        });
    } else if (routerType == "loadCustomerList") {
        appRouter.navigate("loadCustomerList", {
            trigger : true
        });
    } else if (routerType == "loadMyResponsCustomerList") {
        appRouter.navigate("loadMyResponsCustomerList", {
            trigger : true
        });
    } else if (routerType == "loadAllChanceMainList") {
        appRouter.navigate("loadAllChanceMainList", {
            trigger : true
        });
    }
})($);

