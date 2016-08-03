var connectionListMainModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : connectionListMainService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            connectionListMainService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



