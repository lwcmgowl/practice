var cluesListDetailModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : cluesListDetailService,
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
            cluesListDetailService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})