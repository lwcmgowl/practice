//加载并初始化模板对象
var myResponsCustomerListMainTemplate = loadTemplate("assets/templates/customer/myResponsCustomerList.html");
//列表容器VIEW
var myResponsCustomerListMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();

    },
    el : '#main_content',
    collection : new BaseTableCollection(),
    bindings : {
        "#level" : {
            observe : 'level'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#csmNature" : {
            observe : 'csmNature'
        },
        "#region" : {
            observe : 'region'
        },
        "#csmStatId" : {
            observe : 'csmStatId'
        },
        "#csmName" : {
            observe : 'csmName'
        }
    },
    events : {
        'click #searchbtn' : function() {
            this.loadlist();
        },
        // 'click #exportFile' : 'exportFile',
        // 'click #exportFileEDM' : 'exportFileEDM'
    },
    model : new myResponsCustomerListMainModel(),
    template : myResponsCustomerListMainTemplate,
    //初始化
    initProfession : function() {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#level").html("<option value=''>选择客户级别</option>");
        $("#csmNature").html("<option value=''>选择客户性质</option>" + this.getOption(appcan.customerproperty));
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#csmStatId").html("<option value=''>选择客户状态</option>" + this.getOption(appcan.csmStat));
        $("#level").html("<option value=''>选择客户级别</option>" + this.getOption(appcan.customerlevel));
        this.model.fetch({
            success : function(cols, resp, options) {
                var list = resp.msg.list;
                $("#profession").html("<option value=''>选择行业类别</option>" + self.profession(list));
            },
            error : function(cols, resp, options) {
                //alert(resp.msg);
            }
        });
        $("#exportFile").click(function() {
            self.exportFileconn();
        });
        $("#expedm").click(function() {
            self.exportFileEDMM();
        });
        $("#add").attr("href", "#addCustomer")
        //加载数据
        this.loadlist();
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
                myResponsCustomerListMainViewInstance.loadlist();
            }
        };
    },
    profession : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            for (var j = i; j < arry.length; j++) {
                if (arry[i].orderId < arry[j].orderId) {
                    var temp = arry[i];
                    arry[i] = arry[j];
                    arry[j] = temp;
                }
            }
        }
        for (var a = 0; a < arry.length; a++) {
            optionHTML += "<option value='" + arry[a].id + "'>" + arry[a].name + "</option>";
        }
        return optionHTML;
    },
    getOption : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            optionHTML += "<option value='" + i + "' >" + arry[i] + "</option>";
        };
        return optionHTML;
    },
    //文件导出
    exportFileconn : function() {
        var data = {
            "entityType" : "exportCustom",
            "salesUserId" : appcanUserInfo.userId,
            "level" : $('#level').val(),
            "profession" : $('#profession').val(),
            "csmNature" : $('#csmNature').val(),
            "region" : $('#region').val(),
            "csmStatId" : $('#csmStatId').val(),
            "csmName" : $.trim($('#salesUserId').val())
        };
        var type = "exportFile";
        var url = "/custom/exportCustom";
        //调用通用导出服务
        exportFileService.exportFile(data, type, url);
    },
    exportFileEDMM : function() {
        var data = {
            "entityType" : "exportCusContactEDM",
            "customId" : this.model.id,
            "contactName" : $.trim($('#name').val()),
            "subordinateFlg" : '1'
        };
        var url = "/contact/exportContact";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    loadlist : function(direction) {
        var self = this;
        var param = {
            "salesUserId" : appcanUserInfo.userId,
            "level" : $('#level').val(),
            "profession" : $('#profession').val(),
            "csmNature" : $('#csmNature').val(),
            "region" : $('#region').val(),
            "csmStatId" : $('#csmStatId').val(),
            "csmName" : $.trim($('#salesUserId').val())
            // "condition" : {
            // "pageNo" : 1,
            // "rowCnt" : 10
            // }
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/custom/page',
                data : param
            },
            columns : [{
                "data" : "csmName",
                "title" : "客户名称"
            }, {
                "data" : "level",
                "title" : "客户级别"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "csmNature",
                "title" : "客户性质"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "csmStatId",
                "title" : "客户状态"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 1,
                render : function(i, j, c) {
                    if (c.level)
                        return appcan.customerlevel[parseInt(c.level)];
                    else
                        return '';
                }
            }, {
                targets : 3,
                render : function(i, j, c) {
                    if (c.csmNature)
                        return appcan.customerproperty[parseInt(c.csmNature)];
                    else
                        return '';
                }
            }, {
                targets : 5,
                render : function(i, j, c) {
                    if (c.csmStatId)
                        return appcan.csmStat[parseInt(c.csmStatId)];
                    else
                        return '';
                }
            }, {
                targets : 6,
                render : function(i, j, c) {
                    // var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(c.csmName) + "/operatelog/2/1";
                    // var hrefDynamicURL = "<a class='btn btn-default btn-xs'  href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";
                    var detail = "#detail/" + c.id;
                    var detailURL = "<a class='btn btn-default btn-xs' href='" + detail + "' >查看</a> " + '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">';
                    var chance = "#chance/" + c.id + "/" + decodeURI(c.csmName) + "/4";
                    var chanceURL = "<a class='btn btn-default btn-xs' href='" + chance + "'>机会</a> &nbsp";
                    var customer = "#customer/" + c.id + "/" + decodeURI(c.csmName) + "/4/null";
                    var customerURL = "<a class='btn btn-default btn-xs'  href='" + customer + "'>联系人</a> &nbsp";
                    //拼装 html
                    var html = customerURL + chanceURL + detailURL + handlerRow(c.id, "adjust");
                    return html;
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
    deliver : function(id) {
        var self = this;
        var assignInfo = this.collection.get(id).toJSON();
        var csmName = assignInfo.csmName;
        var regionName = assignInfo.regionName;
        var professionName = assignInfo.professionName;
        var region = assignInfo.region;
        var profession = assignInfo.profession;
        var curName = assignInfo.curName;
        bootbox.dialog({
            message : $("#deliverCustomTemplate").html(),
            title : '客户转交',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var salesUserList = $('#salesUserList').val();
                        if (salesUserList == '') {
                            $.danger('请选择负责人');
                            $("#salesUserList").parent().addClass("has-error");
                            $("#salesUserList").focus();
                            return false;
                        }
                        if (salesUserList == curName) {
                            $.danger('请调整负责人');
                            return false;
                        }
                        var param = {
                            id : id,
                            csmName : csmName,
                            salesUserId : salesUserList
                        };
                        ajax({
                            url : '/custom/deliver',
                            data : param,
                            success : function(data) {
                                $.success("转交成功！", null, null, function() {
                                    appRouter.navigate("loadMyResponsCustomerList", {
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
                        appRouter.navigate("loadMyResponsCustomerList", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#csmName1").html(csmName);
                $('#region1').html(regionName);
                $("#profession1").html(professionName);
                self.getSalesUserList(region, profession, function() {
                    $("#salesUserList").html("<option value=''>请选择负责人</option>" + salesUserOption);
                });
            }
        });

    },
    change : function(id) {
        var self = this;
        var assignInfo = this.collection.get(id).toJSON();
        var csmStatId = assignInfo.csmStatId;
        var csmName = assignInfo.csmName;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : '调整机会阶段',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var opptStatId1 = $('#opptStatId1').val();
                        if (opptStatId1 == '') {
                            $.danger('请选择机会阶段');
                            return false;
                        }
                        if (opptStatId1 == csmStatId) {
                            $.danger('请调整机会阶段');
                            return false;
                        }
                        var param = {
                            // opptTtl : opptTtl,
                            opptStatId : opptStatId1,
                            id : id,
                            customId : csmStatId
                        };
                        ajax({
                            url : '/opport/adjust',
                            data : param,
                            success : function(data) {
                                $.success("调整成功！", null, null, function() {
                                    appRouter.navigate("loadMyResponsCustomerList", {
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
                        appRouter.navigate("loadMyResponsCustomerList", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#opptStatId1").html($("#csmStatId").html());
                $('#opptStatId1').val(csmStatId);
                $('#csmName1').html(csmName);
            }
        });

    },
    getSalesUserList : function(regionId, tradeId, cb) {
        salesUserOption = '';
        var data = {
            "regionId" : regionId,
            "tradeId" : tradeId,
            "roleType" : "0",
            "staffId" : appcanUserInfo.userId
        };
        ajax({
            url : "/clue/listStaff",
            data : data,
            success : function(data) {
                var arr = data.msg.list;
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i]["fullName"]){
                    salesUserOption += "<option value='" + arr[i]["staffId"] + "'>" + arr[i]["fullName"] + "</option>";
                    }
                }
                cb(salesUserOption);
            }
        });
    }
});
var myResponsCustomerListMainViewInstance = new myResponsCustomerListMainView();
