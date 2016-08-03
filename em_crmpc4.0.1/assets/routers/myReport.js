(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
               myReport : ["assets/services/myReport.js", "assets/models/myReport.js", "assets/views/myReport.js"],
        },
        routes : {
             "myReport" : "myReport",
             //"transfer/:id":"transfer"
        },
        //我负责的
        myReport : function() {
            loadSequence(this.deps.myReport, function() {
                myReportListView.initinfo();
            })
        }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
        appRouter.navigate("myReport", {
            trigger : true
        });

})($);

