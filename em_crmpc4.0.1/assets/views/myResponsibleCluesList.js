//加载并初始化模板对象
var myResponsibleCluesListTemplate = loadTemplate("assets/templates/staff/myResponsibleCluesListList.html");
var addmyResponTemplate = loadTemplate("assets/templates/staff/addmyRespon.html");
//列表容器VIEW
var curReason = '';
var myResponsibleCluesListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
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
        'click #add' : 'addmyRespon',
        'click #clear' : 'clear',
        'click #toopp' : 'toopp',
        'click #change' : 'change',
        'click #transfer' : 'transfer',
         "click #mask" : function() {
            this.hideDetail();
        },
        "click #clueDynamic" : function() {
            this.clueDynamic()
        },
        "click #clueInfo" : function() {
            this.myreponClueDetailList(this.model.get("id"));
        },
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
                myResponsibleCluesListViewInstance.load();
            }
        }
    },
    //添加线索
    addmyRespon : function() {
        var self = this;
        bootbox.dialog({
            message : addmyResponTemplate,
            title : "添加线索",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var loginId = appcanUserInfo.userId;
                        var companyName = $("#companyName").val();
                        if (!isDefine(companyName)) {
                            $.danger("请输入客户名称");
                            $("#companyName").parent().addClass("has-error");
                            $("#companyName").focus();
                            return false;
                        } else if (!reg1.test(companyName)) {
                            $.danger("客户名称格式有误");
                            $("#companyName").parent().addClass("has-error");
                            $("#companyName").focus();
                            return false;
                        } else {
                            self.changeClass("companyName", true);
                        }
                        var conferenceName = "";
                        if ($("#dataSource").find("option:selected").text() == "行业会议") {
                            conferenceName = $.trim($("#meeting").val());
                            if (conferenceName == '') {
                                $.danger("请填写会议名称");
                                $("#meeting").parent().addClass("has-error");
                                $("#meeting").focus();
                                return false;
                            } else {
                                self.changeClass("meeting", true);
                            }
                        }
                        var contactName = $("#contactName").val();
                        if (contactName === '') {
                            $.danger("姓名不能为空");
                            $("#contactName").parent().addClass("has-error");
                            $("#contactName").focus();
                            return false;
                        } else if (!patrn.exec(contactName)) {
                            $.danger("姓名格式有误");
                            $("#contactName").parent().addClass("has-error");
                            $("#contactName").focus();
                            return false;
                        } else {
                            self.changeClass("contactName", true);
                        }
                        var mobile = $("#mobile").val();
                        var teleNo = $("#teleNo").val();
                        if (mobile === '' && teleNo === '') {
                            $.danger("请填写手机号或者座机号");
                            $("#mobile").parent().addClass("has-error");
                            $("#mobile").focus();
                            $("#teleNo").parent().addClass("has-error");
                            $("#teleNo").focus();
                            return false;
                        } else if (!mob.test(mobile) && !tele.test(teleNo)) {
                            $.danger("手机号或者座机号格式有误!");
                            $("#mobile").parent().addClass("has-error");
                            $("#mobile").focus();
                            $("#teleNo").parent().addClass("has-error");
                            $("#teleNo").focus();
                            return false;
                        } else {
                            $("#teleNo").parent().removeClass("has-error");
                            $("#mobile").parent().removeClass("has-error");
                        }
                        var QQ = $("#QQ").val();
                        var weChat = $("#weChat").val();
                        var email = $("#email").val();
                        if (email === '') {

                        } else if (!pattern.test(email)) {
                            $.danger("电子邮件格式不正确!");
                            $("#email").parent().addClass("has-error");
                            $("#email").focus();
                            return false;
                        } else {
                            $("#email").parent().removeClass("has-error");
                        }
                        var department = $("#department").val();
                        var post = $("#post").val();
                        var dataSource = $("#dataSource").val() != "00" ? $("#dataSource").val() : "";
                        var productType = $("#productType").val() != "00" ? $("#productType").val() : "";
                        var closeReason = $("#closeReason").val() != "00" ? $("#closeReason").val() : "";
                        var level = $("#level").val() != "00" ? $("#level").val() : "";
                        var csmNature = $("#csmNature").val() != "00" ? $("#csmNature").val() : "";
                        var csmScale = $("#csmScale").val() != "00" ? $("#csmScale").val() : "";
                        var region = $("#_region").val();
                        if (!isDefine(region) || region.indexOf("选择") > 0) {
                            $.danger("请选择所属团队");
                            return false;
                        }
                        var profession = $("#_profession").val();
                        if (profession =='') {
                            $("#_profession").parent().addClass("has-error");
                            $("#_profession").focus();
                            $.danger("请选择行业类别");
                           return false;
                        } else {
                            $("#profession").parent().removeClass("has-error");
                        }
                        var sprovince = $("#s_province").val();
                        if (sprovince == '') {
                            $.danger("请选择所属省份");
                            $("#s_province").parent().addClass("has-error");
                            $("#s_province").focus();
                            return false;
                        } else {
                            $("#s_province").parent().removeClass("has-error");
                        }
                        var address = $("#address").val();
                        var postcode = $("#postcode").val();
                        if (postcode === '') {

                        } else if (!re2.test(postcode)) {
                            $.danger("邮编格式不正确!");
                            $("#postcode").parent().addClass("has-error");
                            $("#postcode").focus();
                            return false;
                        } else {
                            $("#postcode").parent().removeClass("has-error");
                        }
                        var website = $("#website").val();
                        if (website === '') {

                        } else if (!Expression.test(website)) {
                            $.danger("官网格式不正确!");
                            $("#website").parent().addClass("has-error");
                            $("#website").focus();
                            return false;
                        } else {
                            $("#website").parent().removeClass("has-error");
                        }
                        var fax = $("#fax").val();
                        if (fax === '') {

                        } else if (!patternfax.test(fax)) {
                            $.danger("公司传真格式有误!例如:010-xxxxxxx");
                            $("#fax").parent().addClass("has-error");
                            $("#fax").focus();
                           return false;
                        } else {
                            $("#fax").parent().removeClass("has-error");
                        }
                        var remark = $("#remark").val();
                        var clueState = $("#_clueState").val();
                        if (clueState != 3) {
                            closeReason = "";
                        }
                        var data = {
                            "companyName" : companyName,
                            "contactName" : contactName,
                            "mobile" : mobile,
                            "teleNo" : teleNo,
                            "qq" : QQ,
                            "weChat" : weChat,
                            "email" : email,
                            "department" : department,
                            "post" : post,
                            "dataSource" : dataSource,
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
                            "clueState" : clueState,
                            "dataType" : "1",
                            "clueType" : "0",
                            "salesUserId" : loginId,
                            "closeReason" : closeReason,
                            "conferenceName" : conferenceName,
                            "submitState" : "1"
                        };
                        ajax({
                            url : "/clue/add",
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
                $("#myself").html(appcanUserInfo.userName);
                $("#s_province").html('<option value="">选择所属省份</option>' + getOption(appcan.province))//加载所属大区省市选项
                selectOpt("dataSource", appcan.clueSources);
                //数据来源
                selectOpt("productType", appcan.producttype);
                //产品类型
                selectOpt("level", appcan.customerlevel);
                //客户级别
                selectOpt("profession", appcan.customerlevel);
                //行业类别
                selectOpt("csmNature", appcan.customerproperty);
                //客户性质
                selectOpt("csmScale", appcan.customersize);
                //客户规模
                $('#dataSource').change(function() {
                    var meeting = $('#dataSource option:selected').text();
                    if (meeting === "行业会议") {
                        $("#conferenceName").css("display", "block");
                    } else {
                        $("#conferenceName").css("display", "none");
                    }
                });
                for (var k = 0; k < appcan.clueState.length; k++) {
                    var str = '<option value="' + k + '">' + appcan.clueState[k] + '</option>';
                    if (k == 2) {
                        $("#closeReason1").hide();
                    } else {
                        $("#_clueState").append(str);
                    }
                }
                $('#_clueState').change(function() {
                    var clueState = $('#_clueState').val();
                    if (Number(clueState) == 3) {
                        $("#closeReason1").show();
                        selectOpt("closeReason", appcan.closeReason);
                    } else {
                        $("#closeReason1").hide();
                    }
                });

            }
        });
    },
    changeClass:function(id,isOk){
       if (isOk) {
          $("#"+id).parent().removeClass("has-error");  
       } else{
          $("#"+id).parent().addClass("has-error");
          return; 
       }
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function() {
        var self = this;
        var loginId = appcanUserInfo.userId;
        var param = {
            "clueType" : $('#clueType').val(),
            "profession" : $('#profession').val(),
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
                "data" : "companyName",
                "title" : "客户名称"
            }, {
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "title" : "电话"
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
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='myResponsibleCluesListViewInstance.myreponClueDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;

                }
            },{
                targets : 6,
                render : function(i, j, c) {
                    if (c.clueState)
                        return appcan.clueState[parseInt(c.clueState)];
                    else
                        return '';
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });

    },
    //
    myreponClueDetail:function(id){
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
        self.myreponClueDetailList(id);
    },
    myreponClueDetailList:function(id){
            var self = this;
            $("#clueInfo").addClass("active");
            $("#clueDynamic").removeClass("active");
            var flag=null;
            myResponsibleCluesListDetail=["assets/services/myResponsibleCluesListDetail.js", "assets/models/myResponsibleCluesListDetail.js", "assets/views/myResponsibleCluesListDetail.js"];
            loadSequence(myResponsibleCluesListDetail, function() {
           var myResponsibleCluesListDetailInstance = new myResponsibleCluesListDetailView();
            myResponsibleCluesListDetailInstance.load(id,flag);
        });
    },
    clueDynamic:function(){
        $("#clueInfo").removeClass("active");
        $("#clueDynamic").addClass("active");
        var objEntityTypeId = "02";
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
    change : function() {
        var self = this;
        var id=self.model.get("id");
        var item = this.collection.get(id).toJSON();
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
                        var closeReason1 = $('#closeReason6').val();
                        if (Number(clueState1) == 3 && closeReason1 == '00') {
                            $.danger('请选择不合格原因');
                            return false;
                        }
                        if (closeReason1 == curReason) {
                            $.danger('请调整不合格原因');
                            return false;
                        }
                        var data={
                             clueState : clueState1,
                             closeReason : closeReason1,
                             id : item.id,
                             contactName : item.contactName,
                             companyName : item.companyName
                        }
                         ajax({
                            url : "/clue/edit",
                            data : data,
                            success : function(data) {
                                $.success("调整成功！", null, null, function() {
                                    self.load();
                                    self.hideDetail();
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
                        selectOpt("closeReason6", appcan.closeReason);
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
    toopp : function() {
        var self = this;
        var id=self.model.get("id");
        var item = this.collection.get(id).toJSON();
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
        var self = this;
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
                        } else {
                            $("#opptTtl").parent().removeClass("has-error");
                        }
                        var opptStatId = $("#opptStatId").val();
                        //机会阶段
                        if (opptStatId == "00") {
                            $("#opptStatId").parent().addClass("has-error");
                            $("#opptStatId").focus();
                            $.danger("请选择机会阶段");
                            return false;
                        } else {
                            $("#opptStatId").parent().removeClass("has-error");
                        }
                        var vndtAmt = $("#vndtAmt").val();
                        //预计金额
                        if (!vndtAmt) {
                            $("#vndtAmt").parent().addClass("has-error");
                            $("#vndtAmt").focus();
                            $.danger("请输入预计金额");
                            return false;
                        } else if (vndtAmt < 0) {
                            $("#vndtAmt").parent().addClass("has-error");
                            $("#vndtAmt").focus();
                            $.danger("预计金额不能为负数!");
                            return false;
                        } else {
                            $("#vndtAmt").parent().removeClass("has-error");
                        }
                        var startDate = $.trim($("#startDate").val().replace(/-/g, ''));
                        var sttlDate = $.trim($("#sttlDate").val().replace(/-/g, ''));
                        if (sttlDate == '') {
                            $("#sttlDate").parent().addClass("has-error");
                            $.danger("请选择预计结单日期!");
                            return false;
                        } else if (sttlDate < startDate) {
                            $("#startDate").parent().addClass("has-error");
                            $("#sttlDate").parent().addClass("has-error");
                            $.danger("发现时间必须小于结单时间!");
                            return false;
                        } else {
                            $("#startDate").parent().removeClass("has-error");
                            $("#sttlDate").parent().removeClass("has-error");
                        }
                        var remark = $("#remark").val();
                        //备注
                        var dataSource = $("#chanceDataSource").val() != "00" ? $("#dataSource").val() : "";
                        var conferenceName = "";
                        if ($("#chanceDataSource").find("option:selected").text() == "行业会议") {
                            conferenceName = $.trim($("#meeting").val());
                            if (conferenceName == '') {
                                $.danger("请填写会议名称");
                                $("#meeting").parent().addClass("has-error");
                                $("#meeting").focus();
                                return false;
                            } else {
                                $("#meeting").parent().removeClass("has-error");
                            }
                        }
                        var productType = $("#chanceProductType").val() != "00" ? $("#productType").val() : "";
                        var data={
                             clueId : item.id,
                            opptTtl : opptTtl,
                            opptStatId : opptStatId,
                            vndtAmt : vndtAmt,
                            startDate : startDate,
                            sttlDate : sttlDate,
                            remark : remark,
                            dataSource : dataSource,
                            productType : productType,
                            conferenceName : conferenceName
                        }
                        ajax({
                            url : "/clue/toopp",
                            data : data,
                            success : function(data) {
                                $.success("转为机会成功！", null, null, function() {
                                    self.load();
                                    self.hideDetail();
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
                selectOpt("chanceDataSource", appcan.clueSources);
                //数据来源
                selectOpt("chanceProductType", appcan.producttype);
                //产品类型
                $("#conferenceName").hide();
                $('#chanceDataSource').change(function() {
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
    transfer : function() {
        var self = this;
        var id=self.model.get("id");
        var info = this.collection.get(id).toJSON();
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
                        var data={
                            "id" : info.id,
                            "salesUserId" : assigner
                        }
                        ajax({
                            url : "/clue/transfer",
                            data : data,
                            success : function(data) {
                                $.success("转移成功！", null, null, function() {
                                    self.load();
                                    self.hideDetail();
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
                    if (!fullName) {
                    } else {
                        var str = '<option value="' + staffId + '">' + fullName + '</option>';
                        $("#transferPerson").append(str);
                    }
                }
            }
        });
    }
});
var myResponsibleCluesListViewInstance = new myResponsibleCluesListView();

