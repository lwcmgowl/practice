//加载并初始化模板对象
var chanceListMainTemplate = loadTemplate("assets/templates/chance/chanceListMainTemplate.html");
//列表容器VIEW
var chanceListMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    bindings : {
        "#name" : {
            observe : 'name'
        }
    },
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #backHref' : 'backHref'
    },
    backHref : function() {
    },
    model : new chanceListMainModel(),
    template : chanceListMainTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    exportFile : function() {
        var data = {
            "entityType" : "exportOpport",
            "opptStatId" : $('#opptStatId').val(),
            "opptTtl" : $.trim($('#name').val())
        };
        var url = "/opport/exportOpport";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    getOption : function(opptStat) {
        $("#opptStatId").html("<option value=''>选择机会阶段</option>");
        for (var i in appcan.opptStat) {
            var str = '<option value="' + (i) + '">' + appcan.opptStat[i] + '</option>'
            $("#opptStatId").append(str);
        }
    },
    load : function(id, name, type) {
        var flag = '2';
        var editType = '2';
        var req = new Request();
        flag = req.getParameter('flag');
        var self = this;
        if (id != undefined) {
            self.model.id = id;
        }
        if (name != undefined) {
            self.model.csmNametitle = name;
        }
        if (type != undefined) {
            self.model.type = type;
        }
        var param = {
            "opptTtl" : $.trim($('#name').val()),
            "salesUserId" : '',
            "opptStatId" : $('#opptStatId').val(),
            "subordinateFlg" : ''
        };
        self.getOption(appcan.opptStat);
        self.render();
        switch(flag) {
        case '1':
            //我负责的机会
            $('#addContact').removeClass('hide');
            param.salesUserId = appcanUserInfo.userId;
            columns.splice(5, 1);
            editType = '1';
            $('h1').html('我负责的机会');
            break;
        case '2':
            //全部机会
            $('h1').html('机会查看');
            break;
        case '3':
            //我下属的机会
            param.subordinateFlg = '1';
            $('h1').html('我下属的机会');
            break;
        }
        //$("#csmNametitle").html(self.model.csmNametitle);
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/opport/page',
                data : param
            },
            columns : [{
                "data" : "opptTtl",
                "title" : "机会名称"
            }, {
                "data" : "opptStatId",
                "title" : "机会阶段"
            }, {
                "data" : "vndtAmt",
                "title" : "预计金额"
            }, {
                "data" : "startDate",
                "title" : "发现日期"
            }, {
                "data" : "sttlDate",
                "title" : "预计签单日期"
            }, {
                "data" : "salesUserName",
                "title" : "机会负责人"
            }, {
                "data" : "csmName",
                "title" : "客户名称"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 1,
                render : function(i, j, c) {
                    return appcan.opptStat[parseInt(c.opptStatId)];
                }
            }, {
                targets : 3,
                render : function(i, j, c) {
                    if (c.startDate)
                        return c.startDate.substring(0, 4) + '-' + c.startDate.substring(4, 6) + '-' + c.startDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 4,
                render : function(i, j, c) {
                    if (c.sttlDate)
                        return c.sttlDate.substring(0, 4) + '-' + c.sttlDate.substring(4, 6) + '-' + c.sttlDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : (flag == '1' ? 6 : 7),
                width : (flag == '1' ? "200px" : "152px"),
                render : function(i, j, c) {
                    var html = '';
                    //锚点操作 路由配置  如下：待修改
                    // var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(c.csmName) + "/03/"+editType";
                    // var hrefDynamicURL = "<a class='btn btn-default btn-xs' id='dynamic' href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";
                    // var detail = "#connectionCustomerDetail/" + c.id + "/1";
                    // var detailURL = "<a class='btn btn-default btn-xs' id='customerDetail' href='" + detail + "' >查看</a> &nbsp";                  // var html = hrefDynamicURL + detailURL;
                    // return html;

                    //var html = '<a class="btn btn-default btn-xs" href="javascript:;" onclick="dynamicOppt(\'' + encodeURIComponent(JSON.stringify(c)) + '\');">跟进动态</a> ' + '<a class="btn btn-default btn-xs" href="opport_Details.html?id=' + c.id + '">查看</a> ' + '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu">'
                    html += hrefDynamic + detailURL;
                    if (flag == '2')
                        html += handlerRow(encodeURIComponent(JSON.stringify(c)));
                    if (flag == '3')
                        html += handlerRow(encodeURIComponent(JSON.stringify(c)));
                    if (flag == '1')
                        html += handlerRow(encodeURIComponent(JSON.stringify(c)));
                    return html;
                }
            }]

        });
    },
    pagecountchange : function(e) {
        console.log("select ", e);
    },
    changeOppt : function(item) {
        item = JSON.parse(decodeURIComponent(item));
        curOppt = item.opptStatId;
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
                            $("#opptStatId1").parent().addClass("has-error");
                            $("#opptStatId1").focus();
                            return false;
                        }
                        if (opptStatId1 == curOppt) {
                            $.danger('请调整机会阶段');
                            $("#opptStatId1").parent().addClass("has-error");
                            $("#opptStatId1").focus();
                            return false;
                        }
                        var param = {
                            opptTtl : item.opptTtl,
                            opptStatId : opptStatId1,
                            id : item.id,
                            customId : item.customId
                        };
                        ajax({
                            url : '/opport/adjust',
                            data : param,
                            success : function(data) {
                                $.success("调整成功！", null, null, function() {
                                    window.location.reload();
                                });
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                    }
                }
            },
            complete : function() {
                $("#opptStatId1").html($("#opptStatId").html());
                $('#opptStatId1').val(item.opptStatId);
                $('#csmName1').html(item.csmName);
            }
        });
    },
});
var chanceListMainViewInstance = new chanceListMainView();
