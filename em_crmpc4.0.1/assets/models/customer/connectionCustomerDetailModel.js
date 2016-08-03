var connectionCustomerDetailModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : connectionCustomerDetailService,
    parse : function(resp) {
       return resp;
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            connectionCustomerDetailService.getDetailData(options.id,options.name,options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



