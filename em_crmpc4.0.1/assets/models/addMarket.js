var addMarketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : addMarketService,
    parse : function(resp) {
       return resp
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
         addMarketService.addMarket(model);
         break;
        case "update":
        case "patch":
            break;
        case "read":
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})