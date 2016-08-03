var customerListMainModel = Backbone.Model.extend({
    initialize : function() {
        this.set();
    },
    service : customerListMainService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            customerListMainService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



