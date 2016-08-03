var marketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : opportViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        break;
        case "update":
        break;
        case "patch":
            break;
        case "read":
           if(options.type==3){
            opportViewService.getDetail(options);
           }
           if(options.type==4){
            opportViewService.adjust(options);
           }
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})

