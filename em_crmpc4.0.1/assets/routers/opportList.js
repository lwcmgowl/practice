(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            opportAll: ["assets/services/opportAll.js", "assets/models/opportAll.js", "assets/views/opportAll.js"],
            mystaffOpport: ["assets/services/mystaffOpport.js", "assets/models/mystaffOpport.js", "assets/views/mystaffOpport.js"],
            myresOpport: ["assets/services/myresOpport.js", "assets/models/myresOpport.js", "assets/views/myresOpport.js"],
            detailOpport: ["assets/services/detailOpport.js", "assets/models/detailOpport.js", "assets/views/detailOpport.js"],
            opptcontactDetails: ["assets/services/opptcontactDetails.js", "assets/models/opptcontactDetails.js", "assets/views/opptcontactDetails.js"],
            addContact: ["assets/services/addContact.js", "assets/models/addContact.js", "assets/views/addContact.js"],
            contact: ["assets/services/contact.js", "assets/models/contact.js", "assets/views/contact.js"],
            addOpport: ["assets/services/addOpport.js", "assets/models/addOpport.js", "assets/views/addOpport.js"],
            dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']
        },
        routes : {
            "opportAll":"opportAll",
            "myresOpport":"myresOpport",
            "mystaffOpport":"mystaffOpport",
            "detailOpport/:id":"detailOpport",
            "contact/:info":"contact",
            "opptcontactDetails/:id":"opptcontactDetails",
            "addOpport":"addOpport",
            "edit/:info":"edit",
            "adjust/:info":"adjust",
            "Radiopersonnel/:info":"Radiopersonnel",
            "Cancelgl/:info":"Cancelgl",
            'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic'
        },
        opportAll:function(){
            loadSequence(this.deps.opportAll, function() {
                marketListViewInstance.initinfo();
            })
        },
         detailOpport:function(id){
             loadSequence(this.deps.detailOpport, function() {
                  marketdetailInstance.load(id);
                  })
         },
         opptcontactDetails:function(id){
              loadSequence(this.deps.opptcontactDetails, function() {
                  marketdetailInstance.load(id);
                  })
         },
         contact:function(id){
             // var info = eval(info);
             // var info = JSON.parse(info);
             // var customId=info.customId;
             // var id = info.id;
             // var name = info.opptTtl;
            loadSequence(this.deps.contact, function() {
                marketListViewInstances.baseView = marketListViewInstance;
                marketListViewInstances.initinfo(id);
            })
         },
         myresOpport:function(){
              loadSequence(this.deps.myresOpport, function() {
                marketListViewInstance.initinfo();
            })
         },
         mystaffOpport:function(){
              loadSequence(this.deps.mystaffOpport, function() {
                marketListViewInstance.initinfo();
            })
         },
         addOpport:function(){
              loadSequence(this.deps.addOpport, function() {
                addOpportInstance.load();
            })
         },
         edit:function(id){
            // var info = eval(info);
            // var delinfo = JSON.parse(info);
            // var id = delinfo.id;
            // var customId=delinfo.customId;
            loadSequence(this.deps.addOpport, function() {
                addOpportInstance.baseView = marketListViewInstance;
                addOpportInstance.load(id);
            })
        },
        adjust:function(info){
             // var info = eval(info);
              var info = JSON.parse(info);
             loadSequence(this.deps.myresOpport, function() {
                marketListViewInstance.adjust(info);
            });
            
        },
        Radiopersonnel:function(info){
            var item = JSON.parse(decodeURIComponent(info));
            var name = item.contactName;
            var id=item.id;
              loadSequence(this.deps.contact, function() {
                marketListViewInstance.Radiopersonnel(id,name);
            })
        },
        Cancelgl:function(info){
            loadSequence(this.deps.contact, function() {
                marketListViewInstances.Cancelgl(info);
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
   if (routerType == "opportAll") {
        appRouter.navigate("opportAll", {
            trigger : true
        });
    } else if (routerType == "myresOpport") {
        appRouter.navigate("myresOpport", {
            trigger : true
        });
    } else if (routerType == "mystaffOpport") {
        appRouter.navigate("mystaffOpport", {
            trigger : true
        });
    } 
})($);

