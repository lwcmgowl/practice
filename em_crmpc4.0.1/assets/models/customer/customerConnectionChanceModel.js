var customerConnectionChanceModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : customerConnectionChanceService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            customerConnectionChanceService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



