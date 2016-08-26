var remindDetailTemplate = loadTemplate("assets/templates/staff/remindDetail.html");
//列表容器VIEW
var remindDetailView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#contentdiv',
    model : new remindModel(),
    template : remindDetailTemplate,
    events : {
        'click #readAll' : "readAll"
    },
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    search : function() {
        var self = this;
        self.render();
        var param = {
            // objEntityTypeId : "02",
            ifRead : "0"
            // remindUserId:appcanUserInfo.userId,
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/remind/page',
                data : param
            },
            columns : [{
                "data" : null,
                "title" : ""
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    console.log(c)
                    var html = "";
                    switch (c.remindType) {
                    case 0:
                        html += '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="#clueDetail/' + c.objEntityId + '/' + c.id + '">【线索】您有一条待分配的线索，线索联系人：' + c.contactName + '&nbsp&nbsp客户名称：' + c.csmName + '</a>';
                        break;
                    case 1:
                        html += '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="javascript:;" onclick="remindDetailInstance.audit(\'' +c.objEntityId + '\',\'' +c.id + '\')">【商机审核】您有一条待审核的商机，商机名称：' + c.opptTtl + '&nbsp&nbsp商机上报人：' + c.marketUserName + '</a>';
                        break;
                    case 2:
                        html += '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="javascript:;" onclick="remindDetailInstance.audited(\'' +c.objEntityId + '\',\'' +c.id + '\')">【商机审核】您提交的商机：' + c.opptTtl + ',审核通过,请及时跟进</a>';
                        break;
                    case 3:
                        html += '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="javascript:;" onclick="remindDetailInstance.reject(\'' +c.objEntityId + '\',\'' +c.id + '\')">【商机审核】您提交的商机：' + c.opptTtl + ',审核驳回</a>';
                        break;
                    case 4:
                        html += '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="javascript:;" onclick="remindDetailInstance.audited(\'' +c.objEntityId + '\',\'' +c.id + '\')">【商机审核】现有：' + c.marketUserName + '&nbsp&nbsp上报的商机：' + c.opptTtl + ',分配给你,请及时跟进</a>';
                        break;
                    case 5:
                        html += '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="javascript:;">【商机审核】您提交的商机：' + c.opptTtl + '&nbsp&nbsp审核通过,已经调至：' + c.salesUserName + '名下,请协助沟通</a>';
                        break;
                    }
                    return html;
                }
            }]
        });
    },
    readAll : function() {
        var self = this;
        var param = {
            // ifRead : "0"
        };
        ajax({
            url : '/remind/batchEdit',
            data : param,
            success : function(data) {
                $.success("操作成功！", null, null, function() {
                    self.search();
                    self.readNum();
                });
            },
        });
    },
    readDetail:function(remindId){
         var self=this;
         var param = {
             ifRead : "1",
             id:remindId
        };
        ajax({
            url : '/remind/edit',
            data : param,
            success : function(data) {
               self.readNum();
            },
        });
        
    },
    readNum:function(){
        var self=this;
         var param = {
             ifRead : "0"
        };
        ajax({
            url : '/remind/remindTotal',
            data : param,
            success : function(data) {
                if(data.msg.total==0){
                    
                }else{
                    $("#tips").html(data.msg.total);
                }
            },
        });
    },
    //待审核
    audit:function(id,remindId){
        var self=this;
        var opportAudit=["assets/services/myReport.js", "assets/models/myReport.js", "assets/views/remindOpportAudit.js"];
         loadSequence(opportAudit, function() {
            myReportListView.myReportDetail(id);
        });
        self.readDetail(remindId);
    },
    //已审核/我负责
    audited:function(id,remindId){
        var self=this;
        var opportAudited=["assets/services/myresOpport.js", "assets/models/myresOpport.js", "assets/views/remindMyresOpport.js"];
         loadSequence(opportAudited, function() {
            marketListViewInstance.myResDetail(id);
        });
        self.readDetail(remindId);
    },
    //驳回
    reject:function(id,remindId){
        var self=this;
        var reject=["assets/services/myReport.js", "assets/models/myReport.js", "assets/views/remindMyReport.js"];
         loadSequence(reject, function() {
            myReportListView.myReportDetail(id);
        });
        self.readDetail(remindId);
    },
    
});
var remindDetailInstance = new remindDetailView();

