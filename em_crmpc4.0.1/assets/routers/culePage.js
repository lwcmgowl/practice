(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            notAssign : ["assets/services/culePage.js", "assets/models/culePage.js", "assets/views/culePage.js"],
            assign : ["assets/services/culePage1.js", "assets/models/culePage1.js", "assets/views/culePage1.js"],
            notAssignclueDetail : ["assets/services/culeDetail.js", "assets/models/culeDetail.js", "assets/views/culeDetail.js"],
            getDynamic : ['assets/services/allotClueService.js', 'assets/models/allotClue.js', 'assets/views/unAllotDynamic1.js'],
            add : ["assets/services/culePage.js", "assets/models/culePage.js", "assets/views/culeAdd.js"],
            getAllotedDynamic : ['assets/services/allotClueService.js', 'assets/models/allotClue.js', 'assets/views/allotedDynamic1.js'],
            assignClueDetail : ["assets/services/assignculePage.js", "assets/models/assignculePage.js", "assets/views/assignculeDetail.js"],
        },
        routes : {
            "notAssign" : 'notAssign',
            "assign" : 'assign',
            "notAssignclueDetail/:id" : 'notAssignclueDetail',
            "assignClueDetail/:id" : "assignClueDetail",
            'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'getUnallotDynamic',
            'getAllotedDynamic/:objEntityId/:objEntityTypeId/:editType/:companyName' : 'getAllotedDynamic',
            "resubmit/:info" : "resubmit",
            "add" : "add",
            "edit/:info" : "edit"
            // "*actions" : "notAssign"
        },
        notAssign : function() {
            loadSequence(this.deps.notAssign, function() {
                $('#myTab a[href="#notAssign"]').tab('show');
                culePageViewInstance.notAssign();
            })
        },
        assign : function() {
            loadSequence(this.deps.assign, function() {
                $('#myTab a[href="#assign"]').tab('show');
                culePage1ViewInstance.initInfo();
            })
        },
        notAssignclueDetail : function(id) {
            loadSequence(this.deps.notAssignclueDetail, function() {
                culeDetailViewInstances.load(id);
            })
        },
        assignClueDetail : function(id) {
            loadSequence(this.deps.assignClueDetail, function() {
                culeDetailViewInstance.load(id);
            })
        },
        getUnallotDynamic : function(objEntityId, objEntityTypeId, editType, companyName) {
            loadSequence(this.deps.getDynamic, function() {
                dynamicViewObj.init(objEntityId, objEntityTypeId, editType, companyName);
            });
        },
        getAllotedDynamic : function(objEntityId, objEntityTypeId, editType, companyName) {
            loadSequence(this.deps.getAllotedDynamic, function() {
                allotedDynamicViewObj.init(objEntityId, objEntityTypeId, editType, companyName);
            });
        },
        resubmit : function(id) {
            loadSequence(this.deps.notAssign, function() {
                culePageViewInstance.resubmit(id);
            });
        },
        add : function() {
            loadSequence(this.deps.add, function() {
                culeAddlViewInstance.load();
            })
        },
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
    var btn = btnHandler.btns;
    var isAssignNum = btn.indexOf("pageIsAssign");
    var notAssignNum = btn.indexOf("pageNotAssign");
    if (isAssignNum >= 0 && notAssignNum >= 0) {
        appRouter.navigate("notAssign", {
            trigger : true
        });
    } else {
        if (isAssignNum >= 0) {
            appRouter.navigate("assign", {
                trigger : true
            });
            $("#notAssign").hide();
            $('#myTab a[href="#notAssign"]').parent().hide();
        }else{
            $("#assign").hide();
            $('#myTab a[href="#assign"]').parent().hide();
        }
        if (notAssignNum >= 0) {
            appRouter.navigate("notAssign", {
                trigger : true
            });
            $("#assign").hide();
            $('#myTab a[href="#assign"]').parent().hide();
        }else{
            $("#notAssign").hide();
            $('#myTab a[href="#notAssign"]').parent().hide();
        }
    }
    
   

})($);

