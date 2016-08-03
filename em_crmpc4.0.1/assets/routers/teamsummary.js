(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            tmarketing: ["assets/services/personal.js", "assets/models/personal.js", "assets/views/team.js"],
            tclue: ["assets/services/personal.js", "assets/models/personal.js", "assets/views/tclue.js"],
            tbusiness:["assets/services/personal.js", "assets/models/personalcusm.js", "assets/views/tbusiness.js"],
        },
        routes : {
            "tmarketing":"tmarketing",
            "tclue":"tclue",
            "tbusiness":"tbusiness",
            // "*actions" : "pmarketing"
        },
        tmarketing:function(){
            $('#myTab a[href="#tmarketing"]').tab('show');
            loadSequence(this.deps.tmarketing, function() {
                 summaryListView.initinfo();
            })
        },
        tclue:function(){
           $('#myTab a[href="#tclue"]').tab('show');
            loadSequence(this.deps.tclue, function() {
                 pclueView.initinfo();
            }) 
        },
        tbusiness:function(){
            $('#myTab a[href="#tbusiness"]').tab('show');
            loadSequence(this.deps.tbusiness, function() {
                 pbusinessView.initinfo();
            }) 
        }
       
    });
    window.appRouter = new AppRouter();
     Backbone.history.start();
 // if (routerType == "pmarketing") {
         appRouter.navigate("tmarketing", {
            trigger : true
        });
    // } else if (routerType == "team") {
        // appRouter.navigate("team", {
            // trigger : true
        // });
    // }

})($);

