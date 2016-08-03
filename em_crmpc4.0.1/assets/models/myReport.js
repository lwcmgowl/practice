var myReportModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : myReportViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        this.service.addMyReport(this.attributes.param, options);
        break;
        case "update":
            var id = this.id;
            var param = this.attributes.param;
            this.service.editPartner(id, param, options);
            break;
        case "patch":
            break;
        case "read":
           if(options.type==1){
             myReportViewService.customerList(options);  
           }
           if(options.type==2){
             myReportViewService.contactList(options);
            };
            if(options.type==3){
            myReportViewService.myReportDetail(options);
           };
            if(options.type==4){
            myReportViewService.clueDetail(options);
           }
           if(options.type==5){
            myReportViewService.assign(options);
           }
           if(options.type==6){
            myReportViewService.getListExamine(options);
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


