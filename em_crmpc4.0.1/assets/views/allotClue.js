var allotClueTemplate = loadTemplate('assets/templates/staff/allotClueList.html');

var allotClueView = Backbone.View.extend({
    initialize : function() {
    },
    el : '#unallot',
    model : new allotClueModel(),
    collection : new BaseTableCollection(),
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
        handlerTop('btnWrapper');
        this.getIndustryList();
        $("#bigRegions").html("<option value=''>选择所属团队</option>" + getRegionOption());
        document.onkeypress = function(e) {
    var code;
    if (!e) {
        e = window.event;
    }
    if (e.keyCode) {
        code = e.keyCode;
    } else if (e.which) {
        code = e.which;
    }
    if (code == 13) {
        allotClueViewObj.search();
    }
};
    },
    template : allotClueTemplate,
    bindings : {
        // '#industrycategory':{
        // 	observe:''
        // }
    },
    events : {
        'click #exportFile' : function() {
            this.exportFile();
        },
        'click #searchBtn' : function() {
            this.search();
        },
        'click #clear':'clear'
    },
     //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    search : function() {
        var self=this;
        var dataObj = {
            "assigner" : appcanUserInfo.userId,
            "profession" : $('#industrycategory').val(),
            "region" : $('#bigRegions').val(),
            "csmName" : $.trim($('#csmName').val()),
            "companyName" : $.trim($('#csmName').val()),
            "dataType" : 1,
            "submitState" : $('#submitState').val(),
           };
                new DataTable({
                    id : '#datatableOffical',
                    paging : true,
                    pageSize : 10,
                    ajax : {
                        url : '/clue/page',
                        data : dataObj
                    },
                    columns : [{
                        "data" : "contactName",
                        "width" : "114px",
                        "title" : "联系人"
                    }, {
                        "data" : "mobile",
                        "width" : "114px",
                        "title" : "手机"
                    }, {
                        "data" : "teleNo",
                        "width" : "114px",
                        "title" : "电话"
                    }, {
                        "data" : "companyName",
                        "title" : "客户名称"
                    }, {
                        "data" : "professionName",
                        "width" : "80px",
                        "title" : "行业类别"
                    }, {
                        "data" : "regionName",
                        "title" : "所属团队"
                    }, {
                        "data" : "marketUserName",
                        "title" : "线索上报人"
                    }],
                    columnDefs : [{
                        targets : 7,
                        render : function(i, j, c) {
                            var html = "<a class='btn btn-default btn-xs' href='#getDynamic/" + c.id + "/02/2/" + encodeURIComponent(c.companyName) + "'>跟进动态</a>&nbsp" + "<a class='btn btn-default btn-xs' href='#clueDetail/" + c.id + "' >查看</a> " + '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">'
                            html += handlerRow(c.id);
                            html += '</ul></div>';
                            return html;
                        }
                    }],
                    complete : function(list) {
                        self.collection.set(list);
                    }
                });
    },
    getList : function() {
        this.render();
        this.search();
    },
    getIndustryList : function() {
        var self = this;
        this.model.fetch({
            param : {},
            URL : '/clue/trade/listTrade',
            success : function(cols, resp, options) {
                var str = '<option value="">选择行业类别</option>';
                $('#industrycategory').html(str + self.profession(resp.msg.list));
            },
            error : function(cols, error, options) {
            }
        });
    },
    profession : function(arr) {
        var optionHTML = "";
        for (var i = 0; i < arr.length; i++) {
            for (var j = i; j < arr.length; j++) {
                if (arr[i].orderId < arr[j].orderId) {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        for (var a = 0; a < arr.length; a++) {
            optionHTML += "<option value='" + arr[a].id + "'>" + arr[a].name + "</option>";
        }
        return optionHTML;
    },
    exportFile : function() {//导出数据
        var dataObj = {
            "entityType" : "allocatedNotFenpei",
            "assigner" : appcanUserInfo.userId,
             "submitState" : $('#submitState').val(),
            "profession" : $('#industrycategory').val(),
            "region" : $('#bigRegions').val(),
            "companyName" : $.trim($('#csmName').val()),
            "dataType" : '1'
        };
        this.model.fetch({
            URL : '/clue/exportClue',
            param : dataObj,
            success : function(cols, resp, options) {
                var url = urlIp + '/excel/out?path=' + encodeURIComponent(resp.msg.message);
                window.location = url;
            },
            error : function(cols, error, options) {
            }
        });
    },
    assign : function(id) {
        var item  = this.collection.get(id).toJSON();
        this.getCluePerson(item);
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : '分配线索负责人',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var salesUserId = $('#salesUserId').val();
                        if (salesUserId == '00') {
                            $.danger('请选择分配销售');
                            return false;
                        }
                        var param = {
                            id : item.id,
                            "submitState" : 1,
                            salesUserId : salesUserId,
                            "clueState" : 0
                        };
                        ajax({
                            url : '/clue/assign',
                            data : param,
                            success : function(data) {
                                $.success("调整成功！", null, null, function() {
                                    appRouter.navigate("unallot", {
                                        trigger : true
                                    });
                                });
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("unallot", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $('#companyName1').html(item.companyName);
                $("#region1").html("<option value='" + item.region + "'>" + item.regionName + "</option>");
                $("#profession").html("<option value='" + item.profession + "'>" + item.professionName + "</option>");
            }
        });
    },
    getCluePerson : function(item) {
        var data = {
            "roleType" : 0,
            "regionId" : item.region,
            "tradeId" : item.profession
        };
        ajax({
            url : "/clue/listStaff",
            data : data,
            success : function(data) {
                var perArr = data.msg.list;
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if(fullName){
                         var salesUserId = '<option value="' + staffId + '">' + fullName + '</option>';
                         $("#salesUserId").append(salesUserId);
                    }
                }
            }
        });
    }
});
var allotClueViewObj = new allotClueView(); 