var myResponsibleCluesListDetailModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myResponsibleCluesListDetailService,
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
            myResponsibleCluesListDetailService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})