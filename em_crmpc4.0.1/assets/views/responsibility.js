//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/responsibility.html");

//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection:new BaseTableCollection(),
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #add' : 'add',
        'click #import' : 'import',
        'click #expedm' : 'expedm'
    },
    model : new marketModel(),
    template : marketTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#province").html("<option value=''>选择所属省份</option>" + getOption(appcan.province));
        for (var n = 0; n < appcan.clueSources.length; n++) {
            var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
            $("#clueSource").append(str);
        };
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));

            },
            error : function(cols, resp, options) {

            },
            type : 1

        });
        self.load();
        $("#add").attr("href", "#addResponsibility");
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
                    marketViewInstance.load();
                }
            }
    },
    delinfo : function(id) {
        var self = this;
        this.model.set({
            id : id
        });
        bootbox.dialog({
            message : $("#delState").html(),
            title : "确定删除此条营销数据?",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        self.model.destroy({
                            success : function(cols, resp, options) {
                                $.success("删除成功", null, null, function() {
                                    // marketViewInstance.load();
                                     appRouter.navigate("responsibility", {
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
                        appRouter.navigate("responsibility", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {

            }
        });
    },
    assign : function(id) {
        var self = this;
        var assignInfo = this.collection.get(id).toJSON();
        this.listDict(assignInfo);
        bootbox.dialog({
            message : $("#transfer1").html(),
            title : "分配营销数据",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        var region = $("#transferTeam").val();
                        var assigner = $("#transferPerson").val();
                        var profession = $('#transferProductType').val();
                        if (assigner == '00') {
                            $("#transferPerson").parent().addClass("has-error");
                            $("#transferPerson").focus();
                            $.danger('请选择营销数据负责人');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("分配成功", null, null, function() {
                                    appRouter.navigate("responsibility", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 4,
                            id : assignInfo.id,
                            marketUserId : assigner,
                            region : region,
                            profession : profession

                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("responsibility", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                var region = assignInfo.region;
                var profession = assignInfo.profession;
                $("#tmplCompanyName").html(assignInfo.companyName);
                $("#transferTeam").change(function() {
                    if ($("select option").is(":selected")) {
                        region = $(this).val();
                        self.getMarketPerson(region, profession);
                    }
                });
                $("#transferProductType").change(function() {
                    if ($("select option").is(":selected")) {
                        profession = $(this).val();
                        self.getMarketPerson(region, profession);
                        ;
                    }
                });
            }
        });

    },
    listDict : function(assignInfo) {
        var self = this;
        var region = assignInfo.region;
        var profession = assignInfo.profession;
        this.model.fetch({
            success : function(cols, resp, options) {
                var optionHTML = "";
                var tradeHTML = "";
                var teamList = resp.msg.teamList;
                //行业
                var tradeList = resp.msg.tradeList;
                for (var i = 0; i < teamList.length; i++) {
                    optionHTML += "<option value='" + teamList[i].id + "' >" + teamList[i].name + "</option>";
                }
                $("#transferTeam").append(optionHTML);
                $('#transferTeam  option[value=' + region + ']').attr("selected", true)
                for (var i = 0; i < tradeList.length; i++) {
                    tradeHTML += "<option value='" + tradeList[i].id + "' >" + tradeList[i].name + "</option>";
                }
                $("#transferProductType").append(tradeHTML);
                $('#transferProductType  option[value=' + profession + ']').attr("selected", true);
                self.getMarketPerson(region, profession);
            },
            error : function(cols, resp, options) {
            },
            type : 2
        });
    },
    getMarketPerson : function(region, profession) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                var arr = ['<option value="00">请选择营销数据负责人</option>'];
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if(fullName){
                         var str = '<option value="' + staffId + '">' + fullName + '</option>';
                         arr.push(str);
                    }
                   
                }
                $("#transferPerson").html(arr.join(''));
            },
            error : function(cols, resp, options) {

            },
            type : 3,
            region : region,
            profession : profession
        });
    },
    load : function(){
        var self=this;
        var profession = $("#profession").val();
        //所属团队
        var region = $("#region").val();
        //数据来源
        var dataSource = $("#clueSource").val();
        //客户名称
        var companyName = $.trim($("#companyName").val());
        //省
        var province = $.trim($("#province").val());
        var marketUserId = appcanUserInfo.userId;
        if (companyName === '') {
        } else if (!reg1.test(companyName)) {
            $.danger("请输入正确的客户名称/联系人/会议名称!");
            return;
        }
        var param = {
            dataType : "0",
            profession : profession,
            region : region,
            dataSource : dataSource,
            companyName : companyName,
            province : province,
            marketUserId : marketUserId
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/marketing/page',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "class" : "tel",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "class" : "tel",
                "title" : "电话"
            }, {
                "data" : "companyName",
                "title" : "客户名称"
            }, {
                "data" : "dataSource",
                "title" : "数据来源"
            }, {
                "data" : "conferenceName",
                "class" : "ut-s",
                "tip" : true,
                "width" : "80px",
                "title" : "会议名称"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "province",
                "title" : "所属省份"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 4,
                render : function(i, j, c) {
                    if (c.dataSource)
                        return '<div class="ut-s">' + appcan.clueSources[c.dataSource] + '</div>';
                    else
                        return '';
                }
            }, {
                targets : 9,
                render : function(i, j, c) {
                    //editType 1 可编辑 2 不可编辑
                    var editType = 1;
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/01/' + editType + '/' + encodeURIComponent(c.companyName) + '">跟进动态</a> ' +
                    //'<a href="#" onclick="plroleof(0,\'' + encodeURIComponent(JSON.stringify(c)) + '\')">提交上报</a> '
                    '<a class="btn btn-default btn-xs" href="#listviewDetail/' + c.id + '">查看</a> '
                    // +       '<a href="marketing_add.html?id='+c.id+'" id="edit">编辑</a> '
                    //                                          + '<a href="#" onclick="delMarket(\''+c.id+'\')">删除</a> ';
                    +'<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">'
                    html += handlerRow(c.id,c.regionName,c.professionName);
                    html += '</ul></div>';
                    return html;
                }
            }],
             complete : function (list) {
              self.collection.set(list);
            }

        });
    },
    report : function(id) {
        var self = this;
        var report  = this.collection.get(id).toJSON();
        var region = report.region;
        var profession = report.profession;
        var assigner = report.assigner;
        if (appcanUserInfo.userRole.roleType3 == 1) {
            bootbox.dialog({
                message : $("#report").html(),
                title : "温馨提示",
                className : "",
                buttons : {
                    ok : {
                        label : "确定",
                        className : "btn-success",
                        callback : function() {
                            self.model.fetch({
                                success : function(cols, resp, options) {
                                    $.success("提交成功", null, null, function() {
                                        appRouter.navigate("responsibility", {
                                            trigger : true
                                        });
                                    });
                                },
                                error : function(cols, resp, options) {

                                },
                                type : 6,
                                "id" : id,
                                "dataType" : "1",
                                "clueType" : "0",
                                "salesUserId" : appcanUserInfo.userId,
                                "submitState" : "1",
                                "clueState" : "0"
                            });
                        }
                    },
                    "cancel" : {
                        label : "取消",
                        className : "btn-default",
                        callback : function() {
                            appRouter.navigate("responsibility", {
                                trigger : true
                            });
                        }
                    }
                },
                complete : function() {

                }
            });
        } else {
            var tmplTitle = "提交上报";
            //批量上传
            bootbox.dialog({
                message : $("#organizationTemplate").html(),
                title : tmplTitle,
                className : "",
                buttons : {
                    ok : {
                        label : "提交",
                        className : "btn-success",
                        callback : function() {
                            var productType = $("#tmplProductType").val();
                            var assigner = $("#tmplAssigner").val();
                            if (assigner == '00') {
                                $("#tmplAssigner").parent().addClass("has-error");
                                $("#tmplAssigner").focus();
                                $.danger('请选择线索分配人');
                                return false;
                            }
                            self.model.fetch({
                                success : function(cols, resp, options) {
                                    $.success("提交上报成功", null, null, function() {
                                        appRouter.navigate("responsibility", {
                                            trigger : true
                                        });
                                    });
                                },
                                error : function(cols, resp, options) {

                                },
                                type : 4,
                                "id" : id,
                                "assigner" : assigner,
                                "dataType" : "1",
                                "submitState" : "0",
                                "clueState" : "0"

                            });
                        }
                        //marketReport(info);
                    },
                    "cancel" : {
                        label : "取消",
                        className : "btn-default",
                        callback : function() {
                            appRouter.navigate("responsibility", {
                                trigger : true
                            });
                        }
                    }
                },
                complete : function() {
                    if (id) {
                        $(".uhide").removeClass("uhide");
                        $("#tmplCompanyName").html(report.companyName);
                        $("#tmplTeam").html("<option value='" + report.region + "'>" + report.regionName + "</option>");
                        $("#tmplProductType").html("<option value='" + report.profession + "'>" + report.professionName + "</option>");
                        self.getMarketPerson(region, profession, assigner);
                    }
                }
            });
        }
    },
    getMarketPerson : function(region, profession, assigner) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                var arr = ['<option value="00">请选择营销数据负责人</option>'];
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if (assigner == staffId) {
                        var str = '<option value="' + staffId + '" selected>' + fullName + '</option>';
                        $("#tmplAssigner").append(str);
                    } else {
                        var str = '<option value="' + staffId + '">' + fullName + '</option>';
                        $("#tmplAssigner").append(str);
                    }

                }
                $("#transferPerson").html(arr.join(''));
            },
            error : function(cols, resp, options) {

            },
            type : 3,
            region : region,
            profession : profession
        });
    },
    transfer : function(id) {
        var self = this;
        var info = this.collection.get(id).toJSON();
        var region = info.region;
        var profession = info.profession;
        var tmplTitle = "转移营销数据";
        bootbox.dialog({
            message : $("#transfer1").html(),
            title : tmplTitle,
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
                                    appRouter.navigate("responsibility", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 8,
                            "id" : info.id,
                            "marketUserId" : assigner
                        });
                    }
                    //marketReport(info);
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("responsibility", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                if (info) {
                    $(".uhide").removeClass("uhide");
                    $("#tmplCompanyName").html(info.companyName);
                    $("#transferTeam").html("<option value='" + info.region + "'>" + info.regionName + "</option>");
                    $("#transferProductType").html("<option value='" + info.profession + "'>" + info.professionName + "</option>");
                    self.getMarketPersons(region, profession);
                }
            }
        });

    },
    getMarketPersons : function(region, profession) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                var arr = ['<option value="00">请选择营销数据负责人</option>'];
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if(fullName){
                    var str = '<option value="' + staffId + '">' + fullName + '</option>';
                    $("#transferPerson").append(str);
                    }
                }
            },
            error : function(cols, resp, options) {

            },
            type : 7,
            "regionId" : region,
            "tradeId" : profession,
            "staffId" : appcanUserInfo.userId
        });
    },
    exportFile : function() {
        var marketUserId = appcanUserInfo.userId;
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "followMarketing",
            "dataType" : "0",
            "profession" : $("#profession").val(),
            "region" : $("#region").val(),
            "dataSource" : $("#clueSource").val(),
            "companyName" : $.trim($("#companyName").val()),
            "marketUserId" : marketUserId,
            "province" : province
        };
        var url = "/marketing/exportClue";
        marketViewService.exportFile(data, url)
    },
    expedm : function() {
        var marketUserId = appcanUserInfo.userId;
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "followMarketingEDM",
            "dataType" : "0",
            "profession" : $("#profession").val(),
            "region" : $("#region").val(),
            "dataSource" : $("#clueSource").val(),
            "marketUserId" : marketUserId,
            "province" : province,
            "companyName" : $.trim($("#companyName").val())
        };
        var url = "/marketing/exportClue";
        marketViewService.exportFile(data, url)
    },
    import : function() {
        var self=this;
        var tmplTitle = "导入";
        //批量上传
        bootbox.dialog({
            message : $("#importTemplate").html(),
            title : tmplTitle,
            className : "",
            buttons : {
                ok : {
                    label : "导入",
                    className : "btn-success",
                    callback : function() {
                        $("#loading").show();
                        var excelPath = $('#file').val();
                        if (!excelPath) {
                            $.danger('请选择导入文件');
                            $("#loading").hide();
                            return;
                        }
                        var elementIds = ["entityType"];
                        //flag为id、name属性名
                        $.ajaxFileUpload({
                            url : urlIp + "/marketing/importData",
                            type : 'post',
                            data : {
                                "entityType" : 'importData'
                            },
                            secureuri : false, //一般设置为false
                            fileElementId : 'file', // 上传文件的id、name属性名
                            dataType : 'json', //返回值类型，一般设置为json、application/json
                            success : function(data, status) {
                                $("#loading").hide();
                                if (data.status == '000') {
                                    if (data.msg.status == 'fail') {
                                        var url = urlIp + '/excel/out?path=' + encodeURIComponent(data.msg.path);
                                        var a = document.createElement("a");
                                        //导入导出!!!
                                        a.href = url;
                                        a.target = "_self";
                                        a.type = "hidden";
                                        a.download = "营销数据.xlsx";
                                        a.click();
                                        $.danger('导入数据格式不正确，请查看返回的文件');
                                    } else {
                                        $.success("导入成功！", null, null, function() {
                                            self.load(); 
                                        });
                                    }

                                } else if (data.status == "L001") {
                                    window.location = 'login.html';
                                } else {
                                    $.danger(data.msg.message)
                                }
                            },
                            error : function(data, status, e) {
                                $.danger('网络错误');
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

            }
        });
    }
});


var marketViewInstance = new marketListView();
