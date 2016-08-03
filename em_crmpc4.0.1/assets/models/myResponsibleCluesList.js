var myResponsibleCluesModel = Backbone.Model.extend({
    initialize : function() {       
        this.set({})
    },
    service : myResponsibleCluesListViewService,
    sync : function(method, model, options) {    
        switch(method) {
        case "create":    //添加
        this.service.addmyRespon(this.attributes.data,options); 
         break;      
        case "update":   //编辑
          // this.service.edit(this.attributes.data,options)
           break;
        case "patch":
            break;
        case "read":
           myResponsibleCluesListViewService.request(options);
         if(options.type==2){
             myResponsibleCluesListViewService.toopp(options)
         }
         if(options.type==3){
             myResponsibleCluesListViewService.change(options)
         }
          if(options.type==4){
             myResponsibleCluesListViewService.transfer(options)
         }
           //if(options.type==2){
          // myResponsibleCluesListViewService.listDict(options);
          // }
           //if(options.type==3){
           // myResponsibleCluesListViewService.transfer(options);
          // }   
           //if(options.type==4){
          // myResponsibleCluesListViewService.toopp(options);
           //} 
          /*if(options.type==3){
              clueViewService.transfer(options);
           } */                      
            break;
        case "delete":          
            break;
        default:
            break;
        }
    }
})

