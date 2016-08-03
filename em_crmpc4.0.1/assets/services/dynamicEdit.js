var allotClueService = {
	getAjaxRequest : function(param,options){
		ajax({
			url:options.URL,
			data:param,
			success:function(data){
				if(data.status == '000'){
					options.success(data);
				}
			},
			error:function(err){
				options.error(err);
			}
		});
	},
};

_.extend(allotClueService, Backbone.Events);