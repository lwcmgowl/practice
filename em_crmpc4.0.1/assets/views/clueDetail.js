var clueDetailTemplate = loadTemplate('assets/templates/staff/clueDetail.html');

var clueDetailView = Backbone.View.extend({
	initialize:function(){},
	el:'#contentdiv',
	template:clueDetailTemplate,
	render:function(){
		this.$el.empty();
		this.$el.append($(this.template()));
	},
	model:new clueDetailModel(),
	getDetail:function(id){
		this.render();
		this.model.fetch({
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
                        if (detail.dataSource) {
                            $("#dataSource").html(appcan.clueSources[detail.dataSource]);
                        }
                        if (detail.productType) {
                            $("#productType").html(appcan.producttype[detail.productType]);
                        }
                        if (detail.level) {
                            $("#level").html(appcan.customerlevel[detail.level]);
                        }
                        if (detail.profession) {
                            $("#profession").html(detail.professionName);
                        }
                        if (detail.csmNature) {
                            $("#csmNature").html(appcan.customerproperty[detail.csmNature]);
                        }
                        if (detail.csmScale) {
                            $("#csmScale").html(appcan.customersize[detail.csmScale]);
                        }
                        if (detail.region) {
                            var region = detail.regionName;
                        }
                        $("#region").html(region);
                        $("#province").html(detail.province);
                        $("#address").html(detail.address);
                        $("#postcode").html(detail.postcode);
                        $("#website").html(detail.website);
                        $("#fax").html(detail.fax);
                        $("#remark").html(detail.remark);
                        //$("#marketUserName").html(detail.marketUserName);
                        $("#assignerName").html(detail.assignerName);
                        $("#salesUserName").html(detail.salesUserName);
                        if(detail.distributionTime){
                        $("#distributionTime").html(toDateString(detail.distributionTime));
                        }
                        if(detail.submitTime){
                        $("#reportTime").html(toDateString(detail.submitTime));
                        }
                        $("#reportPeople").html(detail.marketUserName);
                        if (detail.clueState) {
                            $("#clueState").html(appcan.clueState[detail.clueState]);
                            $("#closeReason1").hide();
                        }
                        if (detail.closeReason) {
                            $("#closeReason").html(appcan.closeReason[detail.closeReason]);
                            //不合格原因

                        }
			},
			error:function(cols,error,options){},
			 id : id
		});
	}
});

var clueDetailViewObj = new clueDetailView();