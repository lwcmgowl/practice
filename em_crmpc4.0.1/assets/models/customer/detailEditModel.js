var detailEditModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : detailEditService,
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
            if(options.type==1){
                detailEditService.getCustomer(options);
            }else{
              detailEditService.getDetailData(options.id,options);  
            }
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



