var marketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : marketViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        marketViewService.addContact(this.attributes.data,options);
          break;
        case "update":
           break;
        case "patch":
            break;
        case "read":
          if(options.type==1){
           marketViewService.request(options);
           }
            break;
        case "delete":
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

