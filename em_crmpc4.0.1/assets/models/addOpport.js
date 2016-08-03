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
            var id = this.id;
            var info = this.attributes.data;
            this.service.edittglrequest(id, info, options);
        case "patch":
            break;
        case "read":
        if(options.type=='1'){
            addMarketService.request(options);
        }
        if(options.type=='2'){
            addMarketService.listContactName(options);
        }
         if(options.type=='3'){
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