(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            pmarketing: ["assets/services/personal.js", "assets/models/personal.js", "assets/views/personal.js"],
            pclue: ["assets/services/personal.js", "assets/models/personal.js", "assets/views/pclue.js"],
            pbusiness:["assets/services/personal.js", "assets/models/personalcusm.js", "assets/views/pbusiness.js"],
        },
        routes : {
            "pmarketing":"pmarketing",
            "pclue":"pclue",
            "pbusiness":"pbusiness",
            // "*actions" : "pmarketing"
        },
        pmarketing:function(){
            $('#myTab a[href="#pmarketing"]').tab('show');
            loadSequence(this.deps.pmarketing, function() {
                 summaryListView.initinfo();
            })
        },
        pclue:function(){
           $('#myTab a[href="#pclue"]').tab('show');
            loadSequence(this.deps.pclue, function() {
                 pclueView.initinfo();
            }) 
        },
        pbusiness:function(){
            $('#myTab a[href="#pbusiness"]').tab('show');
            loadSequence(this.deps.pbusiness, function() {
                 pbusinessView.initinfo();
            }) 
        },
        team:function(){
            loadSequence(this.deps.team, function() {
                summaryListView.initinfo();
            })
        },
       
    });
    window.appRouter = new AppRouter();
     Backbone.history.start();
 // if (routerType == "pmarketing") {
         appRouter.navigate("pmarketing", {
            trigger : true
        });
    // } else if (routerType == "team") {
        // appRouter.navigate("team", {
            // trigger : true
        // });
    // }

})($);

