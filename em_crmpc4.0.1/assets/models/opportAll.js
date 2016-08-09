var marketModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : marketViewService,
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
            marketViewService.opportAllDetail(options);
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

