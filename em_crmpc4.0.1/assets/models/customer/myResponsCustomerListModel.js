var myResponsCustomerListMainModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myResponsCustomerListMainService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        myResponsCustomerListMainService.addCustomer(this.attributes.data,options);
        break;
        case "update":
         break;
        case "patch":
            break;
        case "read":
           if(options.type==1){
               myResponsCustomerListMainService.getcstm(options);
           }else{
                myResponsCustomerListMainService.request(options);
           }
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})