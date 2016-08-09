var customerConnectionChanceModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : customerConnectionChanceService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            if(options.type==3){
                customerConnectionChanceService.getDetail(options);
            }else{
                 customerConnectionChanceService.request(options);
            }
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})



