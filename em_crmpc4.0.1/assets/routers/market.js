(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            offical : ["assets/services/market.js", "assets/models/market.js", "assets/views/market.js"],
            listview : ["assets/services/listview.js", "assets/models/listview.js", "assets/views/listview.js"],
            pending : ["assets/services/unclear.js", "assets/models/unclear.js", "assets/views/unclear.js"],
            marketDetail : ["assets/services/marketDetail.js", "assets/models/marketDetail.js", "assets/views/marketDetail.js"],
            marketpeingDetail : ["assets/services/marketDetail.js", "assets/models/marketDetail.js", "assets/views/marketpeingDetail.js"],
            addMarket : ["assets/services/addMarket.js", "assets/models/addMarket.js", "assets/views/addMarket.js"],
            addMarketPending : ["assets/services/addMarketPending.js", "assets/models/addMarketPending.js", "assets/views/addMarketPending.js"],
            listviewDetail : ["assets/services/listviewDetail.js", "assets/models/listviewDetail.js", "assets/views/listviewDetail.js"],
            mystaff: ["assets/services/mystaff.js", "assets/models/mystaff.js", "assets/views/mystaff.js"],
            responsibility:["assets/services/responsibility.js", "assets/models/responsibility.js", "assets/views/responsibility.js"],
            addResponsibility:["assets/services/addResponsibility.js", "assets/models/addResponsibility.js", "assets/views/addResponsibility.js"],
            dynamicOffical:['assets/services/dynamicOffical.js','assets/models/dynamicOffical.js','assets/views/dynamicOffical.js'],
            dynamicUnclear:['assets/services/dynamicOffical.js','assets/models/dynamicOffical.js','assets/views/dynamicOffical1.js'],
            dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']
        },
        routes : {
            "offical" : 'offical',
            "pending" : 'pending',
            "marketDetail/:id" : 'marketDetail',
            "marketpeingDetail/:id" : 'marketpeingDetail',
            "del/:info-:type" : 'delinfo',
            "assign/:info-:type" : "assign",
            "addMarket/:status":"addMarket",
            "listview":"listview",
            "listviewDetail/:id":"listviewDetail",
            "mystaff":"mystaff",
            "responsibility":"responsibility",
            "addResponsibility":"addResponsibility",
            "report/:info":"report",
            "transfer/:info":"transfer",
            "edit/:info":"edit",
            'dynamicOffical/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic',
            'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamics',
            'dynamicEditUnclear/:objEntityId/:objEntityTypeId/:editType/:companyName':'dynamicEditUnclear'
        },
        //正式数据
        offical : function() {
            loadSequence(this.deps.offical, function() {
                marketManageViewInstance.initinfo();
            })
        },
         //待确认数据
         pending : function() {
            loadSequence(this.deps.pending, function() {
                $('#myTab a[href="#pending"]').tab('show');
                unclearViewInstance.initinfo();
            })
        },
        //营销数据查看
        listview:function(){
             loadSequence(this.deps.listview, function() {
                marketListViewInstance.initinfo();
            })
        },
        //我下属的
        mystaff:function(){
            loadSequence(this.deps.mystaff, function() {
                marketListViewInstance.initinfo();
            })
        },
        //我负责的
        responsibility:function(){
            loadSequence(this.deps.responsibility, function() {
                marketViewInstance.initinfo();
            })
        },
        addResponsibility:function(){
            loadSequence(this.deps.addResponsibility, function() {
                addMarketInstance.load();
            })
        },
        edit:function(id){
            loadSequence(this.deps.addResponsibility, function() {
                addMarketInstance.load(id);
            })
        },
        delinfo : function(id,type) {
            if(type=="1"){
                loadSequence(this.deps.offical, function() {
                        marketViewInstance.delinfo(id);
                    });
            }else{
                    loadSequence(this.deps.pending, function() {
                unclearViewInstance.delinfo(id);
                })
            }
        },
        report:function(id){
             loadSequence(this.deps.responsibility, function() {
                marketViewInstance.report(id);
            });
        },
         transfer:function(id){
             loadSequence(this.deps.responsibility, function() {
                marketViewInstance.transfer(id);
            });
        },
        assign : function(id,type) {
            if(type=="1"){
                    loadSequence(this.deps.offical, function() {
                        marketViewInstance.assign(id);
                    });
            }else{
            loadSequence(this.deps.pending, function() {
                unclearViewInstance.assign(id);
            });
            }
        },
        marketDetail : function(id) {
            loadSequence(this.deps.marketDetail, function() {
                marketdetailInstance.load(id);
            })
        },
        listviewDetail:function(id){
            loadSequence(this.deps.listviewDetail, function() {
                marketdetailInstance.load(id);
            })
        },
        addMarket:function(status){
            if(status==1){
                loadSequence(this.deps.addMarket, function() {
                     addMarketInstance.load();
              });
            }else{
                loadSequence(this.deps.addMarketPending, function() {
                     addMarketPendingInstance.load();
            });
            };
        },
        marketpeingDetail : function(id) {
            loadSequence(this.deps.marketpeingDetail, function() {
                marketpeingDetailInstance.load(id);
            })
        },
        getUnallotDynamic:function(objEntityId,objEntityTypeId,editType,companyName){
            loadSequence(this.deps.dynamicOffical,function(){
                dynamicViewObj.getDynamicData(objEntityId,objEntityTypeId,editType,companyName);
            });
        },
        dynamicEditUnclear:function(objEntityId,objEntityTypeId,editType,companyName){
            loadSequence(this.deps.dynamicUnclear,function(){
                dynamicViewObjs.getDynamicData(objEntityId,objEntityTypeId,editType,companyName);
            });
        },
         getUnallotDynamics:function(objEntityId,objEntityTypeId,editType,companyName){
            loadSequence(this.deps.dynamicEdit,function(){
                dynamicViewObj.getDynamicData(objEntityId,objEntityTypeId,editType,companyName);
            });
        }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
    if (routerType == "offical") {
        appRouter.navigate("offical", {
            trigger : true
        });
    } else if (routerType == "listview") {
        appRouter.navigate("listview", {
            trigger : true
        });
    }else if (routerType == "mystaff") {
        appRouter.navigate("mystaff", {
            trigger : true
        });
    }else if (routerType == "responsibility") {
        appRouter.navigate("responsibility", {
            trigger : true
        });
    }

})($);

