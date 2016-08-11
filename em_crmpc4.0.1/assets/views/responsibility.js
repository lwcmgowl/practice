//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/responsibility.html");

//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #add' : 'addMarket',
        'click #del' : 'delMarket',
        'click #report' : 'reportMarket',
        'click #transfer' : 'transferMarket',
        'click #import' : 'import',
        'click #expedm' : 'expedm',
        'click #clear' : 'clear',
        "click #mask" : function() {
            this.hideDetail();
        },
        "click #marketDynamic" : function() {
            this.marketDynamic()
        },
        "click #marketInfo" : function() {
            this.marketInfoList(this.model.get("id"));
        },
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
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    delMarket : function() {
        var self = this;
        var id = self.model.get("id");
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
                                    self.load();
                                    self.hideDetail();
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

                    }
                }
            },
            complete : function() {

            }
        });
    },
    assign : function() {
        var self = this;
        var id = self.model.get("id")
        var assignInfo = this.collection.get(id).toJSON();
        self.listDict(assignInfo);
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
                    if (fullName) {
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
    load : function() {
        var self = this;
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
                "data" : "companyName",
                "title" : "客户名称"
            }, {
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
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "dataSource",
                "title" : "数据来源"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "province",
                "title" : "所属省份"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='marketViewInstance.marketDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;

                }
            }, {
                targets : 5,
                render : function(i, j, c) {
                    if (c.dataSource)
                        return '<div class="ut-s">' + appcan.clueSources[c.dataSource] + '</div>';
                    else
                        return '';
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
    marketDetail : function(id) {
        var self = this;
        var pushRight = document.getElementById('pushRight');
        classie.addClass(pushRight, 'cbp-spmenu-open');
        $("#mask").css("height", $(document).height());
        $("#mask").css("width", $(document).width());
        $("#mask").show();
        self.model.set("id", id);
        var html = '<div style="border-bottom: 1px solid #ededed; position: absolute;width: 100%;left: 0;top: 30px;"> </div>';
        html += handlerRow(id, "edit");
        $("#buttons").html(html);
        self.marketInfoList(id);
    },
    marketInfoList : function(id) {
        var self = this;
        $("#marketInfo").addClass("active");
        $("#marketDynamic").removeClass("active");
        var flag=null;
        var listviewDetail = ["assets/services/listviewDetail.js", "assets/models/listviewDetail.js", "assets/views/listviewDetail.js"];
        loadSequence(listviewDetail, function() {
            var marketdetailInstance = new marketdetailView();
            marketdetailInstance.load(id,flag);
        });
    },
    marketDynamic : function() {
        $("#marketInfo").removeClass("active");
        $("#marketDynamic").addClass("active");
        var objEntityTypeId = "01";
        var editType = 1;
        var objId = this.model.get("id");
        var dynamicOffical = ['assets/services/dynamicOfficalTest.js', 'assets/models/dynamicOfficalTest.js', 'assets/views/dynamicOfficalTest.js'];
        loadSequence(dynamicOffical, function() {
            dynamicViewObj.getDynamicData(objId, objEntityTypeId, editType);
        });
    },
    hideDetail : function() {
        var self = this;
        var pushRight = document.getElementById('pushRight');
        classie.removeClass(pushRight, 'cbp-spmenu-open');
        $("#mask").hide();
    },
    //添加营销数据
    addMarket : function() {
        var self = this;
        bootbox.dialog({
            message : $("#addMarket").html(),
            title : "添加营销数据",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var loginId = appcanUserInfo.userId;
                        var companyNames = $("#acompanyName").val();
                        if (!isDefine(companyNames)) {
                            $.danger("请输入客户名称!");
                            $("#acompanyName").parent().addClass("has-error");
                            $("#acompanyName").focus();
                            return false;
                        } else if (!reg1.test(companyNames)) {
                            $.danger("客户名称格式有误!");
                            $("#acompanyName").parent().addClass("has-error");
                            $("#acompanyName").focus();
                            return false;
                        } else {
                            $("#acompanyName").parent().removeClass("has-error");
                        }
                        var contactName = $("#acontactName").val();
                        if (!isDefine(contactName)) {
                            $.danger("请输入姓名!");
                            $("#acontactName").parent().addClass("has-error");
                            $("#acontactName").focus();
                            return false;
                        } else if (!patrn.exec(contactName)) {
                            $.danger("姓名格式有误!");
                            $("#acontactName").parent().addClass("has-error");
                            $("#acontactName").focus();
                            return false;
                        } else {
                            $("#acontactName").parent().removeClass("has-error");
                        }
                        var mobile = $.trim($("#amobile").val());
                        var teleNo = $.trim($("#ateleNo").val());
                        if (mobile === '' && teleNo === '') {
                            $.danger("请填写手机号或者座机号!");
                            $("#amobile").parent().addClass("has-error");
                            $("#amobile").focus();
                            $("#ateleNo").parent().addClass("has-error");
                            $("#ateleNo").focus();
                            return false;
                        } else if (!mob.test(mobile) && !tele.test(teleNo)) {
                            $.danger("手机号或者座机号格式有误!");
                            $("#amobile").parent().addClass("has-error");
                            $("#amobile").focus();
                            $("#ateleNo").parent().addClass("has-error");
                            $("#ateleNo").focus();
                            return false;
                        } else {
                            $("#amobile").parent().removeClass("has-error");
                            $("#ateleNo").parent().removeClass("has-error");
                        }
                        var QQ = $("#aQQ").val();
                        var weChat = $("#aweChat").val();
                        var email = $("#aemail").val();
                        if (email === '') {
                        } else if (!pattern.test(email)) {
                            $.danger("电子邮件格式不正确!");
                            $("#aemail").parent().addClass("has-error");
                            $("#aemail").focus();
                            return false;
                        } else {
                            $("#aemail").parent().removeClass("has-error");
                        }
                        var department = $("#adepartment").val();
                        var post = $("#apost").val();
                        var dataSource = $("#dataSource").val() != "" ? $("#dataSource").val() : "";
                        var conferenceName = "";
                        if ($("#dataSource").find("option:selected").text() == "行业会议") {
                            conferenceName = $.trim($("#meetingName").val());
                            if (conferenceName == '') {
                                $.danger("请填写会议名称!");
                                $("#meetingName").parent().addClass("has-error");
                                $("#meetingName").focus();
                                return false;
                            } else {
                                $("#meetingName").parent().removeClass("has-error");
                            }
                        }
                        var csmNature = $("#csmNature").val() != "" ? $("#csmNature").val() : "";
                        var csmScale = $("#csmScale").val() != "" ? $("#csmScale").val() : "";
                        var region = $("#_region").val();
                        if (!isDefine(region) || region.indexOf("选择") > 0) {
                            $.danger("请选择所属团队");
                            $("#_region").parent().addClass("has-error");
                            $("#_region").focus();
                            return false;
                        } else {
                            $("#_region").parent().removeClass("has-error");
                        }
                        var profession = $("#_profession").val();
                        if (!isDefine(profession) || profession == "00") {
                            $.danger("请选择行业类别");
                            $("#_profession").parent().addClass("has-error");
                            $("#_profession").focus();
                            return false;
                        } else {
                            $("#_profession").parent().removeClass("has-error");
                        }
                        var sprovince = $("#aprovince").val();
                        if (sprovince == '') {
                            $.danger("请选择所属省份");
                            $("#aprovince").parent().addClass("has-error");
                            $("#aprovince").focus();
                            return false;
                        } else {
                            $("#aprovince").parent().removeClass("has-error");
                        }
                        var productType = $("#aproductType").val() != "" ? $("#productType").val() : "";
                        var level = $("#acustomerLevel").val() != "" ? $("#Customerlevel").val() : "";
                        var address = $("#aaddress").val();
                        var postcode = $("#apostcode").val();
                        if (postcode === '') {
                        } else if (!re2.test(postcode)) {
                            $.danger("邮编格式不正确!");
                            $("#apostcode").parent().addClass("has-error");
                            $("#apostcode").focus();
                            return false;
                        } else {
                            $("#apostcode").parent().removeClass("has-error");
                        }
                        var website = $("#awebsite").val();
                        if (website === '') {
                        } else if (!Expression.test(website)) {
                            $.danger("官网格式不正确!");
                            $("#awebsite").parent().addClass("has-error");
                            $("#awebsite").focus();
                            return false;
                        } else {
                            $("#awebsite").parent().removeClass("has-error");
                        }
                        var fax = $("#afax").val();
                        if (fax === '') {

                        } else if (!patternfax.test(fax)) {
                            $.danger("公司传真格式有误!例如:010-xxxxxxx");
                            $("#afax").parent().addClass("has-error");
                            $("#afax").focus();
                            return false;
                        } else {
                            $("#afax").parent().removeClass("has-error");
                        }
                        var remark = $("#aremark").val();
                        var data = {
                            "companyName" : companyNames,
                            "contactName" : contactName,
                            "mobile" : mobile,
                            "teleNo" : teleNo,
                            "qq" : QQ,
                            "weChat" : weChat,
                            "email" : email,
                            "department" : department,
                            "post" : post,
                            "dataSource" : dataSource,
                            "conferenceName" : conferenceName,
                            "productType" : productType,
                            "level" : level,
                            "profession" : profession,
                            "csmNature" : csmNature,
                            "csmScale" : csmScale,
                            "region" : region,
                            "province" : sprovince,
                            "address" : address,
                            "postcode" : postcode,
                            "website" : website,
                            "fax" : fax,
                            "remark" : remark,
                            "dataType" : "0",
                            "marketUserId" : loginId,
                            "submitState" : "0"
                        };
                        ajax({
                            url : "/marketing/add",
                            data : data,
                            success : function(data) {
                                $.success("添加成功！", null, null, function() {
                                    self.load();
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
                $("#show").click(function() {
                    $(this).parent().hide();
                    $("#more").slideToggle("slow");
                });
                $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
                $("#aprovince").html('<option value="">选择所属省份</option>' + getOption(appcan.province))
                for (var n = 0; n < appcan.clueSources.length; n++) {
                    var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
                    $("#dataSource").append(str);
                }
                selectOpt("aproductType", appcan.producttype);
                selectOpt("acustomerLevel", appcan.customerlevel);
                selectOpt("acsmNature", appcan.customerproperty);
                selectOpt("acsmScale", appcan.customersize);

            }
        });

    },
    reportMarket : function() {
        var self = this;
        var id = self.model.get("id");
        var report = this.collection.get(id).toJSON();
        var region = report.region;
        var profession = report.profession;
        var assigner = report.assigner;
        if (appcanUserInfo.userRole.roleType3 == 1) {
            bootbox.dialog({
                message : $("#reportMarket").html(),
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
                                        self.load();
                                        self.hideDetail();
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
                                        self.load();
                                        self.hideDetail();
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
                    },
                    "cancel" : {
                        label : "取消",
                        className : "btn-default",
                        callback : function() {

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
    transferMarket : function() {
        var self = this;
        var id = self.model.get("id");
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
                                    self.load();
                                    self.hideDetail();
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 8,
                            "id" : info.id,
                            "marketUserId" : assigner
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
                    if (fullName) {
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
        var self = this;
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
