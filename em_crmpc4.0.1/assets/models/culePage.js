var culePageModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : culePageViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        // marketViewService.addMarket(options);
        case "update":
        case "patch":
            break;
        case "read":
            switch(options.type) {
            case 1:
                options.url ="/clue/trade/listDict";
                // options.param = {};
                culePageViewService.request(options);
                break;
            case 3:
                options.url = "/clue/view";
                options.param = {
                    id : options.id
                };
                culePageViewService.request(options);
                break;
            case 4:
                culePageViewService.request(options);
                break;
            case 5:
                culePageViewService.request(options);
                break;
            }
            break;

        case "delete":
            options.id = this.id;
            //this.service.delinfo(options);
            break;
        default:
            break;
        }
    }
})

