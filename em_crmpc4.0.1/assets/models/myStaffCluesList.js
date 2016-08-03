var myStaffCluesListModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myStaffCluesListViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":      
        case "update":
        case "patch":
            break;
        case "read":
          if(options.type==1){
           myStaffCluesListViewService.request(options);
           }
           if(options.type==2){
           myStaffCluesListViewService.listDict(options);
           }
           if(options.type==3){
           myStaffCluesListViewService.exportFile(options);
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

