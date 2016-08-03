var clueDetailTemplate = loadTemplate('assets/templates/staff/clueDetail1.html');

var clueDetailView = Backbone.View.extend({
	initialize:function(){},
	el:'#unallot',
	template:clueDetailTemplate,
	render:function(){
		this.$el.empty();
		this.$el.append($(this.template()));
	},
	model:new allotClueModel(),
	getDetail:function(id){
		this.render();
		var dataObj = {
			"id":id
		};
		this.model.fetch({
			param:dataObj,
			URL:'/clue/view',
			success:function(cols,resp,options){
				var detail = resp.msg.item;
				$("#companyName").html(detail.companyName);
				$("#contactName").html(detail.contactName);
				$("#mobile").html(detail.mobile);
				$("#teleNo").html(detail.teleNo);
				$("#QQ").html(detail.qq);
				$("#weChat").html(detail.weChat);
				$("#email").html(detail.email);
				$("#department").html(detail.department);
				$("#post").html(detail.post);
				if(detail.dataSource){
				   $("#dataSource").html(appcan.clueSources[detail.dataSource]); 
				}
				if(detail.productType){
				   $("#productType").html(appcan.producttype[detail.productType]); 
				}
				if(detail.level){
				    $("#level").html(appcan.customerlevel[detail.level]);
				}
				if(detail.profession){
				    $("#profession").html(detail.professionName);
				}
				if(detail.csmNature){
				    $("#csmNature").html(appcan.customerproperty[detail.csmNature]);
				}
				if(detail.csmScale){
				    $("#csmScale").html(appcan.customersize[detail.csmScale]);  
				}
				if(detail.region){
				    var region =detail.regionName;
				} 
				$("#region").html(region);
				$("#province").html(detail.province);
				$("#address").html(detail.address);
				$("#postcode").html(detail.postcode);
				$("#website").html(detail.website);
				$("#fax").html(detail.fax);
				$("#remark").html(detail.remark);
				$("#marketUserName").html(detail.marketUserName);
				$("#assignerName").html(detail.assignerName);
				if(detail.submitTime){
					$("#reportTime").html(toDateString(detail.submitTime)); 
				}
			},
			error:function(cols,error,options){}
		});
	}
});

var clueDetailViewObj = new clueDetailView();