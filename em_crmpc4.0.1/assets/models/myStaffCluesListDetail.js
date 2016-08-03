var myStaffCluesListDetailModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myStaffCluesListDetailService,
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
            myStaffCluesListDetailService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})