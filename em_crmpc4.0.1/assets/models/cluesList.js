var cluesListModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : cluesListViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":      
        case "update":
        case "patch":
            break;
        case "read":
          if(options.type==1){
           cluesListViewService.request(options);
           }
           if(options.type==2){
           cluesListViewService.listDict(options);
           }
           if(options.type==3){
           cluesListViewService.exportFile(options);
           }          
            break;
        case "delete":
           //options.id = this.id;
            //this.service.delinfo(options);
            break;
        default:
            break;
        }
    }
})

