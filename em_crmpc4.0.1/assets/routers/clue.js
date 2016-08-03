(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
           offical : ["assets/services/clue.js", "assets/models/clue.js", "assets/views/clue.js"],
           clueDetail : ["assets/services/clueDetail.js", "assets/models/clueDetail.js", "assets/views/clueDetail.js"],  
           dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']             
        },
        routes : {
            "offical" : 'offical', 
            "clueDetail/:id":'clueDetail', 
            "cancel/:info":"delinfo",
            "assign/:info" : "assign", 
            "transfer/:info":"transfer",
            'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic'
        },
        offical : function(page) {
            loadSequence(this.deps.offical, function() {                          
                clueViewInstance.initinfo();
            })
        },
        clueDetail : function(id) {
            loadSequence(this.deps.clueDetail, function() {         
                clueDetailViewObj.getDetail(id);
            })
        },
        assign : function(id) {           
            loadSequence(this.deps.offical, function() {
                clueViewInstance.assign(id);
            });          
        },
        delinfo : function(id) {           
            loadSequence(this.deps.offical, function() {
                clueViewInstance.delinfo(id);
            }); 
        },
         transfer: function(id) {          
            loadSequence(this.deps.offical, function() {
                clueViewInstance.transfer(id);
            }); 
        },
         getUnallotDynamic:function(objEntityId,objEntityTypeId,editType,companyName){
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
    } 

})($);

