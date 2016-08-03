var individualModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : individualService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        this.service.addEnterprise(this.attributes.param, options);
        break;
        case "update":
            var id = this.id;
            var param = this.attributes.param;
            this.service.editPartner(id, param, options);
            break;
        case "patch":
            break;
        case "read":
           if(options.type==2){
           partnerViewService.request(options);
            };
            if(options.type==3){
            partnerViewService.getMarketPerson(options);
           };
            if(options.type==4){
            partnerViewService.assign(options);
           }
            break;
        case "delete":
            options.id = this.id;
            this.service.delPartner(options);
            break;
        default:
            break;
        }
    }
})

