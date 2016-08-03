(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {           
           myStaff : ["assets/services/myStaffCluesList.js", "assets/models/myStaffCluesList.js", "assets/views/myStaffCluesList.js"],           
           myStaffCluesListDetail : ["assets/services/myStaffCluesListDetail.js", "assets/models/myStaffCluesListDetail.js", "assets/views/myStaffCluesListDetail.js"],
           dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']
        },
        routes : {
             "myStaff" :'myStaff',
             "myStaffCluesListDetail/:id":'myStaffCluesListDetail',
             'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic'
        },
       myStaff : function(page) {
            loadSequence(this.deps.myStaff, function() {             
               myStaffCluesListViewInstance.initinfo();
            })
        },
        myStaffCluesListDetail : function(id) {
            loadSequence(this.deps.myStaffCluesListDetail, function() {             
                myStaffCluesListDetailInstance.load(id);
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
    appRouter.navigate("myStaff", {
            trigger : true
        });
})($);

