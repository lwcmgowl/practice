var dynamicEditModel = Backbone.Model.extend({
	initialize:function(){
		this.set({});
	},
	service:allotClueService,
	sync:function(method,model,options){
		switch(method){
			case 'create':
			case 'update':
			case 'patch':
				break;
			case 'read':
				this.service.getAjaxRequest(options.param,options);
				break;
			case 'delete':
				break;
			default:
				break;
		}
	}
});