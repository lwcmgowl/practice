(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {           
           offical : ["assets/services/myResponsibleCluesList.js", "assets/models/myResponsibleCluesList.js", "assets/views/myResponsibleCluesList.js"],           
           addmyRespon : ["assets/services/addmyRespon.js", "assets/models/addmyRespon.js", "assets/views/addmyRespon.js"],
           myResponsibleCluesListDetail:["assets/services/myResponsibleCluesListDetail.js", "assets/models/myResponsibleCluesListDetail.js", "assets/views/myResponsibleCluesListDetail.js"], 
           // edit : ["assets/services/myResponedit.js", "assets/models/myResponedit.js", "assets/views/addmyRespon.js"],
           dynamicEdit:['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/dynamicEdit.js']
        },
        routes : {
             "offical" : 'offical',
             "myResponsibleCluesListDetail/:id":'myResponsibleCluesListDetail',           
             "addmyRespon":"addmyRespon",  //添加
             "change/:item" : "change",   //改变
             "toopp/:item" : "toopp",  //转移 机会    
             "edit/:id":"edit",      //编辑
             "transfer/:info":"transfer" ,//转移
             'dynamicEdit/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic'
        },
       offical : function(page) {
            loadSequence(this.deps.offical, function() {             
                myResponsibleCluesListViewInstance.initinfo();
            })
        },
        myResponsibleCluesListDetail : function(id) {
            loadSequence(this.deps.myResponsibleCluesListDetail, function() {             
                myResponsibleCluesListDetailInstance.load(id);
            })
        },
        addmyRespon:function(){    
           loadSequence(this.deps.addmyRespon, function() {                        
                addmyResponInstance.load();
            })
        },
        change : function(id) { 
            loadSequence(this.deps.offical, function() {                            
                myResponsibleCluesListViewInstance.change(id);
            });          
        },
        toopp : function(id) { 
            loadSequence(this.deps.offical, function() {
                myResponsibleCluesListViewInstance.toopp(id);                
            });          
        },
        edit : function(id) { 
            loadSequence(this.deps.addmyRespon, function() {
                addmyResponInstance.load(id);                 
            });          
        },
        transfer: function(info) {          
            loadSequence(this.deps.offical, function() {
                myResponsibleCluesListViewInstance.transfer(info);
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
    appRouter.navigate("offical", {
            trigger : true
        });
})($);

