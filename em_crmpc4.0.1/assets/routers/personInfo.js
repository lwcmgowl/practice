(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            personInfoDetail:["assets/services/personInfoDetail.js", "assets/models/personInfoDetail.js", "assets/views/personInfoDetail.js"],
         },
        routes : {
            "personInfoDetail":'personInfoDetail',
        },
        personInfoDetail: function() {
            loadSequence(this.deps.personInfoDetail, function() {
                 personInfoDetailInstance.load();
            })
        }
       
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
    appRouter.navigate("personInfoDetail",{trigger: true});
    
})($);

