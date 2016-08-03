var dynamicEditModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : dynamicEditService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            dynamicEditService.getDynamicData(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



