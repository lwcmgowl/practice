(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {           
           offical : ["assets/services/cluesList.js", "assets/models/cluesList.js", "assets/views/cluesList.js"],           
           clueListDetail : ["assets/services/cluesListDetail.js", "assets/models/cluesListDetail.js", "assets/views/cluesListDetail.js"],
            dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']
        },
        routes : {
             "offical" : 'offical',
             "clueListDetail/:id":'clueListDetail',
              'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic'
        },
       offical : function(page) {
            loadSequence(this.deps.offical, function() {             
                cluesListViewInstance.initinfo();
            })
        },
        clueListDetail : function(id) {
            loadSequence(this.deps.clueListDetail, function() {             
                clueListdetailInstance.load(id);
            })
        },
        getUnallotDynamic:function(objEntityId,objEntityTypeId,editType,companyName){
            loadSequence(this.deps.dynamicEdit,function(){
                dynamicViewObj.getDynamicData(objEntityId,objEntityTypeId,editType,companyName);
            });
        }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
    appRouter.navigate("offical", {
            trigger : true
        });
})($);

