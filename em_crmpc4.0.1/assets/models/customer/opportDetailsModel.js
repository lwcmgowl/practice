var opportDetailsModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : opportDetailsService,
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
            opportDetailsService.getDetailData(options.id,options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



