var myResponsCustomerListMainModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myResponsCustomerListMainService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            myResponsCustomerListMainService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})