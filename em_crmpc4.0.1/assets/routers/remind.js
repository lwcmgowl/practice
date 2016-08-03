(function() {
    var AppRouter = Backbone.Router.extend({
        initialize : function() {
            console.log("Route initialize");
        },
        deps : {
            menuList : ["assets/services/remindmenuList.js", "assets/models/remindmenuList.js", "assets/views/remindmenuList.js"],
            remindDetail : ['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/clueDetail2.js']
           
        },
        routes : {
            "menuList" : 'menuList',
            "clueDetail/:objEntityTypeId/:remindId" : "remindDetail",
            "*actions" : "menuList"
        },
        menuList : function() {
            loadSequence(this.deps.menuList, function() {
                remindDetailInstance.search();
            })
        },
        remindDetail : function(id,remindId) {
            loadSequence(this.deps.remindDetail, function() {
               clueDetailViewObj.getDetail(id,remindId);
            })
        }
    });
    window.appRouter = new AppRouter();
    Backbone.history.start();
})($);

