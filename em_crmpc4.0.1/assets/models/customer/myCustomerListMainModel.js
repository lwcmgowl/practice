/**
 *我下属的客户 
 */
var myCustomerListMainModel = Backbone.Model.extend({
    initialize : function() {
        this.set();
    },
    service : myCustomerListMainService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            myCustomerListMainService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



