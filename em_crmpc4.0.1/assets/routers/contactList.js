(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            contactAll: ["assets/services/contactAll.js", "assets/models/contactAll.js", "assets/views/contactAll.js"],
            detailContact: ["assets/services/detailContact.js", "assets/models/detailContact.js", "assets/views/detailContact.js"],
            addContact: ["assets/services/addContact.js", "assets/models/addContact.js", "assets/views/addContact.js"],
            dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']
        },
        routes : {
            "contactAll":"contactAll",
            "detailContact/:id":"detailContact",
            "mystaffContact":"mystaffContact",
            "myresContact":"myresContact",
            "addContact":"addContact",
            "edit/:info":"edit",
            'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic'
        },
        contactAll:function(){
            loadSequence(this.deps.contactAll, function() {
                marketListViewInstance.initinfo();
            })
        },
        detailContact:function(id){
            loadSequence(this.deps.detailContact, function() {
                 marketdetailInstance.load(id);
                 })
        },
        mystaffContact:function(){
             loadSequence(this.deps.contactAll, function() {
                marketListViewInstance.initinfo();
            })
            
        },
        myresContact:function(){
            loadSequence(this.deps.contactAll, function() {
                marketListViewInstance.initinfo();
            })
            
        },
        addContact:function(){
            loadSequence(this.deps.addContact, function() {
                      addMarketInstance.load();
               });
        },
        edit:function(id){
            loadSequence(this.deps.addContact, function() {
                      addMarketInstance.baseView = marketListViewInstance;
                      addMarketInstance.load(id);
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
   if (routerType == "contactAll") {
        appRouter.navigate("contactAll", {
            trigger : true
        });
    } else if (routerType == "mystaffContact") {
        appRouter.navigate("mystaffContact", {
            trigger : true
        });
    } else if (routerType == "myresContact") {
        appRouter.navigate("myresContact", {
            trigger : true
        });
    } 

})($);

