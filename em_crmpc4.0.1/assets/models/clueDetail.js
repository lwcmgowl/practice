var clueDetailModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : clueDetailService,
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
            clueDetailService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})