var marketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : marketViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
          if(options.type==1){
           marketViewService.request(options);
           }
           if(options.type==2){
            marketViewService.listDict(options);
           }
           if(options.type==3){
            marketViewService.getMarketPerson(options);
           }
           if(options.type==4){
            marketViewService.report(options);
           }
            if(options.type==5){
            marketViewService.addMarket(options);
           }
           if(options.type==6){
            marketViewService.reportrole(options);
           }
           if(options.type==7){
            marketViewService.getMarketPersons(options);
           }
            if(options.type==8){
            marketViewService.transfer(options);
           }
            break;
        case "delete":
           options.id = this.id;
            this.service.delinfo(options);
            break;
        default:
            break;
        }
    }
})

// var marketCollection = Backbone.Collection.extend({
    // model : marketModel,
    // parse : function(resp) {
        // return resp.data;
    // },
    // sync : function(method, model, options) {
        // switch(method) {
        // case "create":
        // case "update":
        // case "patch":
            // break;
        // case "read":
           // marketViewService.request({}, options);
            // break;
        // case "delete":
            // break;
        // default:
            // break;
        // }
    // }
// })

