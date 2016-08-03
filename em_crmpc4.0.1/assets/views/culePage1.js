//加载并初始化模板对象
var culePage1Template = loadTemplate("assets/templates/staff/culePage1.html");

//列表容器VIEW
var culePage1View = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#assign',
    bindings : {

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        'click #add' : 'add'
    },
    model : new culePageModel(),
    template : culePage1Template,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initInfo : function() {
         $("#notAssign").empty();
        //-----------------
        var clueState = "";

        //------------------------------------
        var self = this;
        self.render();
        // handlerTop('btnWrapper');
        var str = "";
        self.model.fetch({
            success : function(cols, resp, options) {
                //var list = resp.msg.list;
                //$("#industrycategory1").html("<option value=''>选择行业类别</option>" + profession(list));
                 var list = resp.msg.tradeList;
                var team=resp.msg.teamList;
                $("#industrycategory1").html("<option value=''>选择行业类别</option>" + profession(list));
                $("#bigRegions1").html("<option value=''>选择所属团队</option>" + profession(team));
            },
            error : function(cols, resp, options) {
            },
             type : 1
        });
        $("#bigRegions1").html("<option value=''>选择所属团队</option>" + getRegionOption());
        // $('#pageNotAssign,#pageIsAssign').attr("href", function() {
            // return this.href + btnHandler.btns;
        // });
        for (var i in appcan.clueState) {
            clueState += '<option value="' + i + '">' + appcan.clueState[i] + '</option>';
        }
        $("#clueState1").append(clueState);
        $('#pageNotAssign,#pageIsAssign').hide();
         self.search();
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
                    culePage1ViewInstance.search();
                }
            }
        // $("#add").parent().css("display", "block");
        // $('#pageNotAssign,#pageIsAssign').attr("href", function() {
            // return this.href + btnHandler.btns;
        // });
        // var btn = btnHandler.btns;
        // var isAssignNum = btn.indexOf("pageIsAssign");
        // var notAssignNum = btn.indexOf("pageNotAssign");
        // if (isAssignNum >= 0 && notAssignNum >= 0) {
            // $("#IsAssign").addClass("deviation");
            // $("#pageNotAssign").removeClass("btn-primary")
        // } else {
            // if (notAssignNum >= 0) {
                // self.search();
            // }
        // }
    },
    search : function() {
        var param = {
            "clueState" : $('#clueState1').val(),
            "marketUserId" : appcanUserInfo.userId,
            "submitState" : 1,
            "profession" : $('#industrycategory1').val(),
            "region" : $('#bigRegions1').val(),
            "companyName" : $.trim($('#csmName1').val()),
            "dataType" : 1
        };
        new DataTable({
            id : '#datatable1',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/clue/pageIsAssign',
                data : param
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
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "assignerName",
                "title" : "线索分配人"
            }, {
                "data" : "salesUserName",
                "title" : "线索负责人"
            }, {
                "data" : "clueState",
                "title" : "线索状态"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 8,
                render : function(i, j, c) {
                    if (c.clueState)
                        return appcan.clueState[parseInt(c.clueState)];
                    else
                        return '';
                }
            }, {
                targets : 9,
                render : function(i, j, c) {
                    var html = "<a class='btn btn-default btn-xs' href='#getAllotedDynamic/" + c.id + "/02/2/" + encodeURIComponent(c.companyName) + "' >跟进动态</a> " + "<a class='btn btn-default btn-xs' href='#assignClueDetail/" + c.id + "' >查看</a>";
                    return html;
                }
            }]
        });
    },
    resubmit : function(info) {
        var self = this
        var item = info
        var productType = item.productType;
        self.getCluePerson(item);
        assigner = item.assigner;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : '重新提交',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var productType = $('#productType').val();
                        if (clueState1 == '00') {
                            $.danger('请选择线索状态');
                            return false;
                        }
                        var param = {
                            productType : productType,
                            closeReason : closeReason1,
                            id : item.id,
                            contactName : item.contactName,
                            companyName : item.companyName
                        };
                        self.model.fetch({
                            type : 5,
                            param : param,
                            url : '/clue/edit',
                            success : function(cols, resp, options) {
                                $.success("调整成功！", null, null, function() {
                                    appRouter.navigate("assign", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {
                            }
                        });

                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("assign", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#clueState1").html($("#clueState").html());
                $('#clueState1').val(item.clueState);
                $("#closeReason1").html($("#closeReason").html());
                $('#closeReason1').val(item.closeReason);
                $('#contactName1').html(item.contactName);
                $('#companyName1').html(item.companyName);
            }
        });
    },
    exportFile : function() {
        var self = this
        var param = {
            "entityType" : "reportIsFenpei",
            "marketUserId" : appcanUserInfo.userId,
            "submitState" : 1,
            "profession" : $('#profession').val(),
            "region" : $('#bigRegions').val(),
            "companyName" : $.trim($('#csmName').val()),
            "clueState" : $('#clueState').val(),
            "dataType" : 1
        };
        self.model.fetch({
            type : 5,
            param : param,
            url : '/clue/exportClue',
            success : function(cols, resp, options) {
                var url = urlIp + '/excel/out?path=' + encodeURIComponent(resp.msg.message);
                window.location = url;
            },
            error : function(cols, resp, options) {
            }
        });
    }
});

var culePage1ViewInstance = new culePage1View();

