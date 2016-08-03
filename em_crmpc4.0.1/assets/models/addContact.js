var addMarketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : addMarketService,
    parse : function(resp) {
       return resp;
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        addMarketService.addMarket(this.attributes.data,options);
        break;
        case "update":
           if(this.id){
            var id = this.id;
            var info = this.attributes.data;
            this.service.edittglrequest(id, info, options);
            }
            break;
        case "patch":
            break;
        case "read":
        if(options.types=='2'){
            addMarketService.request(options);
        }
        if(options.types=='1'){
            addMarketService.gettail(options);
        }
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})