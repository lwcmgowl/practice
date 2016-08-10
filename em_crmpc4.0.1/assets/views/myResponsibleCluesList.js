//加载并初始化模板对象
var myResponsibleCluesListTemplate = loadTemplate("assets/templates/staff/myResponsibleCluesListList.html");

//列表容器VIEW
var curReason = '';
var myResponsibleCluesListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection:new BaseTableCollection(),
    bindings : {
        "#clueType" : {
            observe : 'clueType'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#bigRegions" : {
            observe : 'bigRegions'
        },
        "#clueState" : {
            observe : 'clueState'
        },
        "#csmName" : {
            observe : 'csmName'
        }
    },
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : function() {
            this.exportFile();
        },
        'click #add' : 'add',
        'click #clear':'clear'
    },
    model : new myResponsibleCluesModel(),
    template : myResponsibleCluesListTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#clueState").html("<option value=''>选择线索状态</option>" + getJOption(appcan.clueState));
        $("#bigRegions").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#clueType").html("<option value=''>选择线索类型</option>" + getJOption(appcan.clueType));
         // $("#clueState option[value=2]").hide();
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));
            },
            error : function(cols, resp, options) {

            },
            type : 1
        });
        $("#add").attr("href", "#addmyRespon");
        self.load();
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
                    myResponsibleCluesListViewInstance.load();
                }
            }
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function() {
        var self=this;
        var loginId = appcanUserInfo.userId;
        var param = {
            "clueType" : $('#clueType').val(),
            "profession" : $('#profession').val(),
            //"region": $('#region').val(),
            "region" : $('#bigRegions').val(),
            "clueState" : $('#clueState').val(),
            "companyName" : $.trim($('#csmName').val()),
            "dataType" : 1,
            "salesUserId" : loginId
            // "notClueState" : 2
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/clue/page',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "title" : "手机"
            }, {
                "data" : "teleNo",
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
                "data" : "clueState",
                "title" : "线索状态"
            }],
            columnDefs : [{
                targets : 6,
                render : function(i, j, c) {
                    if (c.clueState)
                        return appcan.clueState[parseInt(c.clueState)];
                    else
                        return '';
                }
            }, {
                targets : 7,
                render : function(i, j, c) {
                    if (Number(c.clueState) == 2) {
                        var html = "<a class='btn btn-default btn-xs' href='#dynamicEdit/" + c.id + "/02/1/" + encodeURIComponent(c.companyName) + "'>跟进动态</a>" + " <a class='btn btn-default btn-xs' href='#myResponsibleCluesListDetail/" + c.id + "' >查看</a> ";

                        return html;
                    } else {
                        var html = "<a class='btn btn-default btn-xs' href='#dynamicEdit/" + c.id + "/02/1/" + encodeURIComponent(c.companyName) + "'>跟进动态</a>" + " <a class='btn btn-default btn-xs' href='#myResponsibleCluesListDetail/" + c.id + "' >查看</a> " + '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">';

                        html += handlerRow(c.id);
                        html += '</ul></div>';
                        return html;
                    }
                }
            }],
             complete : function (list) {
              self.collection.set(list);
            }

        });

    },
    exportFile : function() {
        var data = {
            "entityType" : "followClue",
            "salesUserId" : appcanUserInfo.userId,
            "clueType" : $('#clueType').val(),
            "profession" : $('#profession').val(),
            "clueState" : $('#clueState').val(),
            "companyName" : $.trim($('#csmName').val()),
            "dataType" : '1'
        };
        var url = "/clue/exportClue";
        myResponsibleCluesListViewService.exportFile(data, url)
    },
    //改变状态
    change : function(id) {
        var self = this;
        var item  = this.collection.get(id).toJSON();
        var curState = item.clueState;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : "改变线索状态",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var clueState1 = $('#_clueState').val();
                        if (clueState1 == '00') {
                            $.danger('请选择线索状态');
                            return false;
                        }
                        if (clueState1 == curState) {
                            $("#_clueState").parent().addClass("has-error");
                            $("#_clueState").focus();
                            $.danger('请调整线索状态');
                            return false;
                        }
                        var closeReason1 = $('#closeReason1').val();
                        if (Number(clueState1) == 3 && closeReason1 == '00') {
                            $.danger('请选择不合格原因');
                            return false;
                        }
                        if (closeReason1 == curReason) {
                            $.danger('请调整不合格原因');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("调整成功", null, null, function() {
                                    appRouter.navigate("offical", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 3,
                            clueState : clueState1,
                            closeReason : closeReason1,
                            id : item.id,
                            contactName : item.contactName,
                            companyName : item.companyName
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("offical", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                //线索状态不包含转为商机
                for (var n = 0; n < appcan.clueState.length; n++) {
                    var str = '<option value="' + n + '">' + appcan.clueState[n] + '</option>';
                    if (n == 2) {
                    } else {
                        $("#_clueState").append(str);
                    }
                }
                $('#_clueState').val(item.clueState);
                for (var k = 0; k < appcan.closeReason.length; k++) {
                    var str = '<option value="' + k + '">' + appcan.closeReason[k] + '</option>';
                    $("#closeReason1").append(str);
                }
                if (item.clueState == 3) {
                    $("#closeReason1").attr("disabled", false);
                    $("#closeReason1").val(item.closeReason)
                } else {
                    $("#closeReason2").css("display", "none");
                }
                $('#_clueState').change(function() {
                    var clueState = $('#_clueState').val();
                    if (Number(clueState) == 3) {
                        $("#closeReason2").show();
                        selectOpt("closeReason", appcan.closeReason);
                    } else {
                        $("#closeReason2").hide();
                    }
                });
                $('#contactName1').html(item.contactName);
                $('#companyName1').html(item.companyName);
            }
        });
    },
    //转为机会
    toopp : function(id) {
        var self = this;
        var item  = this.collection.get(id).toJSON();
        var companyName = item.companyName;
        ajax({
            url : "/clue/tooppCheck",
            data : {
                csmName : companyName
            },
            success : function(data) {
                //0客户不存在,1客户存在且无效,2客户存在且有效
                if (Number(data.messsage) == 1) {
                    $.danger('客户存在且无效');
                } else {
                    self.creatChange(item);
                }
            }
        });
    },
    creatChange : function(item) {
        var self=this;
        bootbox.dialog({
            message : $("#intoChange").html(),
            title : '线索转机会',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var opptTtl = $("#opptTtl").val();
                        //机会名称
                        if (!opptTtl) {
                            $("#opptTtl").parent().addClass("has-error");
                            $("#opptTtl").focus();
                            $.danger("请输入机会名称");
                            return false;
                        } else if (!patrn.exec(opptTtl)) {
                            $("#opptTtl").parent().addClass("has-error");
                            $("#opptTtl").focus();
                            $.danger("机会名称格式有误");
                            return false;
                        }else{
                          $("#opptTtl").parent().removeClass("has-error");  
                        }
                        var opptStatId = $("#opptStatId").val();
                        //机会阶段
                        if (opptStatId == "00") {
                            $("#opptStatId").parent().addClass("has-error");
                            $("#opptStatId").focus();
                            $.danger("请选择机会阶段");
                            return false;
                        }else{
                            $("#opptStatId").parent().removeClass("has-error");
                        }
                        var vndtAmt = $("#vndtAmt").val();
                        //预计金额
                        if (!vndtAmt) {
                            $("#vndtAmt").parent().addClass("has-error");
                            $("#vndtAmt").focus();
                            $.danger("请输入预计金额");
                            return false;
                        }else if(vndtAmt<0){
                            $("#vndtAmt").parent().addClass("has-error");
                            $("#vndtAmt").focus();
                            $.danger("预计金额不能为负数!");
                            return false;
                        }else{
                            $("#vndtAmt").parent().removeClass("has-error"); 
                        }
                        var startDate = $.trim($("#startDate").val().replace(/-/g, ''));
                        var sttlDate = $.trim($("#sttlDate").val().replace(/-/g, ''));
                        // if (!sttlDate) {
                        // alert("请选择结单日期");
                        // return false;
                        // }
                        if (sttlDate == '') {
                            $("#sttlDate").parent().addClass("has-error");
                            $.danger("请选择预计结单日期!");
                            return false;
                        } else if (sttlDate < startDate) {
                            $("#startDate").parent().addClass("has-error");
                            $("#sttlDate").parent().addClass("has-error");
                            $.danger("发现时间必须小于结单时间!");
                            return false;
                        }else{
                             $("#startDate").parent().removeClass("has-error");
                             $("#sttlDate").parent().removeClass("has-error");
                        }
                        var remark = $("#remark").val();
                        //备注
                        var dataSource = $("#dataSource").val() != "00" ? $("#dataSource").val() : "";
                        var conferenceName = "";
                        if ($("#dataSource").find("option:selected").text() == "行业会议") {
                            conferenceName = $.trim($("#meeting").val());
                            if (conferenceName == '') {
                                $.danger("请填写会议名称");
                                $("#meeting").parent().addClass("has-error");
                                $("#meeting").focus();
                                return false;
                            }else{
                              $("#meeting").parent().removeClass("has-error");  
                            }
                        }
                        var productType = $("#productType").val() != "00" ? $("#productType").val() : "";

                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("转为机会成功", null, null, function() {
                                    appRouter.navigate("offical", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 2,
                            clueId : item.id,
                            opptTtl : opptTtl,
                            opptStatId : opptStatId,
                            vndtAmt : vndtAmt,
                            startDate : startDate,
                            sttlDate : sttlDate,
                            remark : remark,
                            dataSource : dataSource,
                            productType : productType,
                            conferenceName:conferenceName
                        });

                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("offical", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $('#startDate').datepicker({
                    format : 'yyyy-mm-dd',
                    weekStart : 0,
                    todayHighlight : true,
                    autoclose : true,

                });
                $('#sttlDate').datepicker({
                    format : 'yyyy-mm-dd',
                    weekStart : 0,
                    todayHighlight : true,
                    autoclose : true,

                });
                $('#contactName2').html(item.contactName);
                $('#companyName2').html(item.companyName);
                selectOpt("opptStatId", appcan.opptStat);
                //机会状态
                selectOpt("dataSource", appcan.clueSources);
                //数据来源
                selectOpt("productType", appcan.producttype);
                //产品类型
                $("#conferenceName").hide();
                $('#dataSource').change(function() {
                    var meeting = $('#dataSource option:selected').text();
                    if (meeting === "行业会议") {
                        $("#conferenceName").css("display", "block");
                    } else {
                        $("#conferenceName").css("display", "none");
                    }
                })
                $("#vndtAmt").on('keyup', function(event) {
                    var $amountInput = $(this);
                    //响应鼠标事件，允许左右方向键移动
                    event = window.event || event;
                    if (event.keyCode == 37 | event.keyCode == 39) {
                        return;
                    }
                    //先把非数字的都替换掉，除了数字和.
                    $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
                    //只允许一个小数点
                    replace(/^\./g, "").replace(/\.{2,}/g, ".").
                    //只能输入小数点后两位
                    replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
                });
                $("#vndtAmt").on('blur', function() {
                    var $amountInput = $(this);
                    //最后一位是小数点的话，移除
                    $amountInput.val(($amountInput.val().replace(/\.$/g, "")));
                });
            }
        });
    },
    transfer : function(id) {
        var self = this;
        var info  = this.collection.get(id).toJSON();
        self.getMarketPerson(info);
        bootbox.dialog({
            message : $("#transfer1").html(),
            title : "转移线索",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var assigner = $("#transferPerson").val();
                        if (assigner == '00') {
                            $("#transferPerson").parent().addClass("has-error");
                            $("#transferPerson").focus();
                            $.danger('请选择营销数据负责人');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("转移成功", null, null, function() {
                                    appRouter.navigate("offical", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 4,
                            "id" : info.id,
                            "salesUserId" : assigner
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("offical", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $(".uhide").removeClass("uhide");
                $("#tmplCompanyName").html(info.companyName);
                $("#transferTeam").html("<option value='" + info.region + "'>" + info.regionName + "</option>");
                $("#transferProductType").html("<option value='" + info.profession + "'>" + info.professionName + "</option>");
            }
        });
    },
    getMarketPerson : function(item) {
        var data = {
            "roleType" : 0,
            "regionId" : item.region,
            "tradeId" : item.profession,
            "staffId" : appcanUserInfo.userId
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
                    if(!fullName){
                    }else{
                     var str = '<option value="' + staffId + '">' + fullName + '</option>';
                    $("#transferPerson").append(str);
                    }
                }
            }
        });
    },
    fm:function(t){
                      var stmp = "";
                      if(t.value==stmp) return;
                      var ms = t.value.replace(/[^\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0");
                      var txt = ms.split(".");
                      while(/\d{4}(,|$)/.test(txt[0]))
                        txt[0] = txt[0].replace(/(\d)(\d{3}(,|$))/,"$1,$2");
                      t.value = stmp = txt[0]+(txt.length>1?"."+txt[1]:"");
    }
});
var myResponsibleCluesListViewInstance = new myResponsibleCluesListView();
              
