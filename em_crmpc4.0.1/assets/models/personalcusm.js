var statisticsModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : statisticsViewService,
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
          if(options.type==1){
           statisticsViewService.request(options);
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
var BaseTableModel = Backbone.Model.extend({
  idAttribute : 'opptId'
});
var BaseParamModel = Backbone.Model.extend({});
var BaseTableCollection = Backbone.Collection.extend({
  model: BaseTableModel
});



