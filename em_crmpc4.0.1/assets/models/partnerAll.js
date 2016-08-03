var marketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : partnerViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        break;
        case "update":
            break;
        case "patch":
            break;
        case "read":
           if(options.type==2){
           partnerViewService.request(options);
            };
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})


