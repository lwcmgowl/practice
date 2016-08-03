(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            jobtargetResponsList:["assets/services/jobtargetResponsList.js", "assets/models/jobtargetResponsList.js", "assets/views/jobtargetResponsList.js"],
            addtgl:["assets/services/jobtargetAdd.js", "assets/models/jobtargetAdd.js", "assets/views/jobtargetAdd.js"]
           },
        routes : {
            "jobtargetResponsList":'jobtargetResponsList',
            "addtgl":"addtgl"
        },
        jobtargetResponsList: function(page) {
            loadSequence(this.deps.jobtargetResponsList, function() {
                jobtargetResponsListViewInstance.load();
            })
        },
        addtgl:function() {
            $template.loadByUrl($("#jobtargetcontentdiv"), "assets/templates/staff/jobtargetAdd.html");
            loadSequence(this.deps.addtgl, function() {
               
            })
        },
       
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
    
    appRouter.navigate("jobtargetResponsList",{trigger: true});
    
})($);

