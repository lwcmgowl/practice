var clueModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : clueViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        // marketViewService.addMarket(options);
        case "update":
        case "patch":
            break;
        case "read":
          if(options.type==1){
            clueViewService.request(options);
          }
          if(options.type==2){
            clueViewService.assign(options);
          }
          if(options.type==3){
            clueViewService.listDict(options);
           }  
           if(options.type==4){
            clueViewService.getMarketPerson(options);
           } 
           if(options.type==5){
            clueViewService.transfer(options);
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
