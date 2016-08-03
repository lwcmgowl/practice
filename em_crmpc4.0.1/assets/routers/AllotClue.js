(function(){
	var AppRouter = Backbone.Router.extend({
		initialize:function(){
			console.log('AllotClueRouter initialize');
		},
		deps:{
			unallot:['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/allotClue.js'],
			alloted:['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/allotedClue.js'],
			clueDetail:['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/clueDetail1.js'],
			allotedClueDetail:['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/allotedClueDetail.js'],
			getDynamic:['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/unAllotDynamic.js'],
			getAllotedDynamic:['assets/services/allotClueService.js','assets/models/allotClue.js','assets/views/allotedDynamic.js']
		},
		routes:{
			'alloted':'getAllotList',
			'unallot':'getUnallotList',
			'clueDetail/:id':'getClueDetail',
			'allotedClueDetail/:id':'getAllotedClueDetail',
			'getDynamic/:objEntityId/:objEntityTypeId/:editType/:companyName':'getUnallotDynamic',
			'assign/:item':'assign',
			'getAllotedDynamic/:objEntityId/:objEntityTypeId/:editType/:companyName':'getAllotedDynamic',
			'*actions':'getUnallotList',
		},
		getAllotList:function(){
			loadSequence(this.deps.alloted,function(){
				$('#myTab a[href="#alloted"]').tab('show');
				allotedClueViewObj.getList();
			});
		},
		getUnallotList:function(){
			loadSequence(this.deps.unallot,function(){
				$('#myTab a[href="#unallot"]').tab('show');
				allotClueViewObj.getList();
			});
		},
		getClueDetail:function(id){
			loadSequence(this.deps.clueDetail,function(){
				clueDetailViewObj.getDetail(id);
			});
		},
		getAllotedClueDetail:function(id){
			loadSequence(this.deps.allotedClueDetail,function(){
				allotedClueDetailViewObj.getDetail(id);
			});
		},
		getUnallotDynamic:function(objEntityId,objEntityTypeId,editType,companyName){
			loadSequence(this.deps.getDynamic,function(){
				dynamicViewObj.init(objEntityId,objEntityTypeId,editType,companyName);
			});
		},
		assign:function(id){
			//loadSequence(this.deps.unallot,function(){
			allotClueViewObj.assign(id);
			//});
		},
		getAllotedDynamic:function(objEntityId,objEntityTypeId,editType,companyName){
			loadSequence(this.deps.getAllotedDynamic,function(){
				allotedDynamicViewObj.init(objEntityId,objEntityTypeId,editType,companyName);
			});
		}
	});
	window.appRouter = new AppRouter();
	// Backbone.history.start();
})($);