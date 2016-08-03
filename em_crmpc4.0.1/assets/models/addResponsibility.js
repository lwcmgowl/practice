var addMarketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : addMarketService,
    parse : function(resp) {
       return resp
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
        case "patch":
            break;
        case "read":
            var id=this.id;    
            this.service.gettail(id, options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})