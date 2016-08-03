var remindModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : remindService,
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
            if (options.type == "getmenulist") {
                this.service.getmenulist(options);
            }else if(options.type == "getremindDetail"){
                this.service.getremindDetail(options);
            }else if(options.type == "read"){
                this.service.read(options);
            }
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})