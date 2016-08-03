//加载并初始化模板对象
var customerConnectionChanceTemplate = loadTemplate("assets/templates/customer/customerConnectionChanceTemplate.html");
//列表容器VIEW
var cusId = null;
var objId = '';
var curOppt = '';
var customerConnectionChanceMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    bindings : {
        "#name" : {
            observe : 'name'
        },
        "opptStatId" : {
            observe : 'opptStatId'
        }
    },
    events : {
        'click #searchchance' : function() {
            this.load();
        },
        // 'click #exportFile' : 'exportFile',
        'click #backHref' : 'backHref'
    },
    backHref : function() {
        //通用 返回 待完善 是否带有处理条件 如 下拉条件 分页等
    },
    model : new customerConnectionChanceModel(),
    template : customerConnectionChanceTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    exportFile : function() {
        var self = this;
        var data = {
            "entityType" : "exportCusOpport",
            "customId" : self.model.id,
            "opptTtl" : $.trim($('#name').val()),
            "opptStatId" : $('#opptStatId').val()
        };
        var url = "/opport/exportOpport";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    getOption : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            optionHTML += "<option value='" + i + "' >" + arry[i] + "</option>";
        };
        return optionHTML;
    },
    initinfo : function(id, name, type) {
        var self = this;
        self.render();
        self.load(id, name, type)
        $("#addChances").attr("href", '#addChances/' + cusId + '/' + objId + '/custom');
        $("#opptStatId").html("<option value=''>选择机会阶段</option>" + self.getOption(appcan.opptStat));
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
                customerConnectionChanceMainViewInstance.load(id, name, type);
            }
        }
    },
    load : function(id, name, type) {
        objId = id;
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
            "customId" : self.model.id,
            "opptStatId" : $('#opptStatId').val(),
            "opptTtl" : $.trim($('#name').val())
        };
        $("#exportFile").click(function() {
            self.exportFile();
        });
        document.getElementById("csmNameTitle").innerHTML = self.model.csmNametitle;
        var chanceURL = location.hash;
        chanceURL = historyBackCommon.changePointParam(chanceURL);
        //chanceURL.substring(1,chanceURL.length).replace(/\//g,',');
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/custom/opport/page',
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
                "title" : "预计结单日期"
            }, {
                "data" : "salesUserName",
                "title" : "负责人"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 1,
                render : function(i, j, c) {
                    if (c.opptStatId)
                        return appcan.opptStat[c.opptStatId];
                    else
                        return '';
                }
            }, {
                targets : 3,
                render : function(i, j, c) {
                    if (c.startDate)
                        return c.startDate.substring(0, 4) + "-" + c.startDate.substring(4, 6) + "-" + c.startDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 4,
                render : function(i, j, c) {
                    if (c.sttlDate)
                        return c.sttlDate.substring(0, 4) + "-" + c.sttlDate.substring(4, 6) + "-" + c.sttlDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 6,
                width : "200px",
                render : function(i, j, c) {
                    var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(self.model.csmNametitle) + "/03/1/1";
                    var hrefDynamicURL = "<a class='btn btn-default btn-xs'  href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";

                    var editChane = '<a class="btn btn-default btn-xs" href="#editChane/' + c.id + '/' + c.customId + '/custom" >编辑</a> '
                    var changeChance = '<a class="btn btn-default btn-xs" href="javascript:;"  onclick="customerConnectionChanceMainViewInstance.changeOppt(\'' + encodeURIComponent(JSON.stringify(c)) + '\');">调整阶段</a> '

                    var detail = "#opportDetails/" + c.id + "/" + chanceURL;
                    var detailURL = "<a class='btn btn-default btn-xs'  href='" + detail + "' >查看</a> &nbsp";

                    var customer = "#customer/" + c.id + "/" + c.opptTtl + "/5/" + objId + "";
                    var customerURL = "<a class='btn btn-default btn-xs'  href='" + customer + "'>联系人</a> &nbsp";
                    var html = hrefDynamicURL + editChane + changeChance + detailURL + customerURL;

                    return html;
                }
            }]
        });
    },
    changeOppt : function(item) {
        var self = this;
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
                            return false;
                        }
                        if (opptStatId1 == curOppt) {
                            $.danger('请调整机会阶段');
                            return false;
                        }
                        var param = {
                            opptTtl : item.opptTtl,
                            opptStatId : opptStatId1,
                            id : item.id,
                            customId : item.customId
                        };
                        ajax({
                            url : '/custom/opport/adjust',
                            data : param,
                            success : function(data) {
                                $.success("调整成功！", null, null, function() {
                                    self.load(objId)
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
                $("#csmName1").html($("#csmNameTitle").html())
            }
        });
    }
});
var customerConnectionChanceMainViewInstance = new customerConnectionChanceMainView();
