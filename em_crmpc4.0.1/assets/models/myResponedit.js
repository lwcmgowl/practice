var myResponeditModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myResponeditService,
    parse : function(resp) {
       return resp
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
         myResponeditService.myResponedit(model);
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