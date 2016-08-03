(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            // console.log("Route initialize");
        },
        deps : {
            modifyPwd:["assets/services/modifyPwd.js", "assets/models/modifyPwd.js", "assets/views/modifyPwd.js"],
        },
        routes : {
            "modifyPwd":"modifyPwd",
        },
        modifyPwd: function() {
            loadSequence(this.deps.modifyPwd, function() {
                modifyPwdViewInstance.edit();
            })
        }
    });
    window.appRouter = new AppRouter();
   if(location.hash==''){
      Backbone.history.start();
      }
    //appRouter.navigate("notice",{trigger: true});
    
})($);

