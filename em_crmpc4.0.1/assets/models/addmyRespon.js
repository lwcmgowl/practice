var addmyResponModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : addmyResponService,
    parse : function(resp) {
       return resp
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create": 
        this.service.addmyRespon(this.attributes.data,options); 
        break;      
        case "update":
          var id = this.id;
          var info = this.attributes.data;
          this.service.edit(id,info,options)
        case "patch":
            break;
        case "read":
         var id = this.id;
          this.service.getDetail(id,options)       
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})