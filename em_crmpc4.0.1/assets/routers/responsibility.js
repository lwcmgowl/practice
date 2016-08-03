(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            responsibility : ["assets/services/responsibility.js", "assets/models/responsibility.js", "assets/views/responsibility.js"],
            addResponsibility : ["assets/services/addResponsibility.js", "assets/models/addResponsibility.js", "assets/views/addResponsibility.js"],
            dynamicEdit : ['assets/services/dynamicEdit.js', 'assets/models/dynamicEdit.js', 'assets/views/dynamicEdit.js'],
            listviewDetail : ["assets/services/listviewDetail.js", "assets/models/listviewDetail.js", "assets/views/listviewDetail.js"]
        },
        routes : {
            "marketDetail/:id" : 'marketDetail',
            "marketpeingDetail/:id" : 'marketpeingDetail',
            "del/:info" : 'delinfo',
            "assign/:info" : "assign",
            "addMarket/:status" : "addMarket",
            "listview" : "listview",
            "listviewDetail/:id" : "listviewDetail",
            "mystaff" : "mystaff",
            "responsibility" : "responsibility",
            "addResponsibility" : "addResponsibility",
            "report/:info" : "report",
            "transfer/:info" : "transfer",
            "edit/:info" : "edit",
            'dynamicOffical/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'getUnallotDynamic',
            'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'getUnallotDynamics',
            'dynamicEditUnclear/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'dynamicEditUnclear'
        },
        //正式数据
        //我负责的
        responsibility : function() {
            loadSequence(this.deps.responsibility, function() {
                marketViewInstance.initinfo();
            })
        },
        addResponsibility : function() {
            loadSequence(this.deps.addResponsibility, function() {
                addMarketInstance.load();
            })
        },
        edit : function(id) {
            loadSequence(this.deps.addResponsibility, function() {
                addMarketInstance.load(id);
            })
        },
        delinfo : function(id) {
            loadSequence(this.deps.responsibility, function() {
                marketViewInstance.delinfo(id);
            })
        },
        report : function(id) {
            loadSequence(this.deps.responsibility, function() {
                marketViewInstance.report(id);
            });
        },
        transfer : function(id) {
            loadSequence(this.deps.responsibility, function() {
                marketViewInstance.transfer(id);
            });
        },
        assign : function(info) {
            var info = eval(info);
            var assignInfo = JSON.parse(info);
            loadSequence(this.deps.offical, function() {
                marketViewInstance.assign(assignInfo);
            });
            loadSequence(this.deps.pending, function() {
                unclearViewInstance.assign(assignInfo);
            });
        },
        marketDetail : function(id) {
            loadSequence(this.deps.marketDetail, function() {
                marketdetailInstance.load(id);
            })
        },
        listviewDetail : function(id) {
            loadSequence(this.deps.listviewDetail, function() {
                marketdetailInstance.load(id);
            })
        },
        addMarket : function(status) {
            if (status == 1) {
                loadSequence(this.deps.addMarket, function() {
                    addMarketInstance.load();
                });
            } else {
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
        getUnallotDynamic : function(objEntityId, objEntityTypeId, editType, companyName) {
            loadSequence(this.deps.dynamicOffical, function() {
                dynamicViewObj.getDynamicData(objEntityId, objEntityTypeId, editType, companyName);
            });
        },
        dynamicEditUnclear : function(objEntityId, objEntityTypeId, editType, companyName) {
            loadSequence(this.deps.dynamicUnclear, function() {
                dynamicViewObjs.getDynamicData(objEntityId, objEntityTypeId, editType, companyName);
            });
        },
        getUnallotDynamics : function(objEntityId, objEntityTypeId, editType, companyName) {
            loadSequence(this.deps.dynamicEdit, function() {
                dynamicViewObj.getDynamicData(objEntityId, objEntityTypeId, editType, companyName);
            });
        }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
        appRouter.navigate("responsibility", {
            trigger : true
        });
    

})($);

