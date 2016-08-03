var marketDetailModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : marketDetailService,
    parse : function(resp) {
       return resp.msg.item.entity;
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            marketDetailService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})