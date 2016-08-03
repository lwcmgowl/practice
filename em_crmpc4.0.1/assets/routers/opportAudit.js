(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
               opportAudit : ["assets/services/myReport.js", "assets/models/myReport.js", "assets/views/opportAudit.js"],
        },
        routes : {
             "opportAudit" : "opportAudit"
        },
        //我负责的
        opportAudit : function() {
            loadSequence(this.deps.opportAudit, function() {
                myReportListView.initinfo();
            })
        }
        
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
        appRouter.navigate("opportAudit", {
            trigger : true
        });

})($);

