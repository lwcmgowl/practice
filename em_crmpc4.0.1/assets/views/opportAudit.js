//加载并初始化模板对象
var myReportTemplate = loadTemplate("assets/templates/staff/opportAudit.html");
var myReportDetailTemplate = loadTemplate("assets/templates/staff/myReportDetail.html");
var myReportCluesListDetail = loadTemplate("assets/templates/staff/myReportCluesListDetail.html");
//列表容器VIEW
var objId = "";
var clueId = "";
var industry = "";
var myReportListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
    events : {
        'click #show-opport' : function() {
            this.load();
            $('.dropdown').removeClass('open');
            $("#dropdownMenu1").attr("aria-expanded", "false")
        },
        'click #exportFile' : 'exportFile',
        'click #cancel' : "cancel",
        'click #clear' : "clear",
        "click #dynamic" : function() {
            this.dynamic(objId)
        },
        "click #partner" : function() {
            this.myReportDetailList(objId);
        },
        "click #clue" : function() {
            this.myReportClue(clueId);
        },
        "click #examine" : function() {
            this.examine();
        },
        "click #mask":function(){
            this.hideDetail();
        }
    },
    model : new myReportModel(),
    template : myReportTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function() {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#bigRegions").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#examineStatus").html("<option value=''>全部状态</option>" + getJOption(appcan.examineStatus));
        $("#add").click(function() {
            self.add();
        });
        $("#sandbox-container .input-daterange").datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });
        $("#update .input-daterange").datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
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
                self.load();
            $('.dropdown').removeClass('open');
            $("#dropdownMenu1").attr("aria-expanded", "false")
            }
        };
    },
    //查询取消
    cancel : function() {
        $('.dropdown').removeClass('open');
        $("#dropdownMenu1").attr("aria-expanded", "false")
    },
    //查询重置
    clear : function() {
        $("#customer").val('');
        $("#business").val('');
        $("#findDate").val('');
        $("#findEndDate").val('');
        $("#signingDate").val('');
        $("#signingEndDate").val('');
        $("#updateDate").val('');
        $("#updateEndDate").val('');
        $("#examineStatus").val('');
        $("#smarketUserName").val('');
        $("#bigRegions").val('')
        this.load();
    },
    load : function() {
        var self = this;
        //商机名称
        var business = $.trim($("#business").val());
        var findDate = $("#findDate").val();
        var findEndDate = $("#findEndDate").val();
        var signingDate = $("#signingDate").val();
        var signingEndDate = $("#signingEndDate").val();
        var updateDate = $("#updateDate").val();
        var updateEndDate = $("#updateEndDate").val();
        var examineStatus = $("#examineStatus").val();
        //客户名称
        var companyName = $.trim($("#customer").val());
        //登录人ID
        var userId = appcanUserInfo.userId;
        var param = {
            // marketUserId : userId,
            opptTtl : business,
            csmName : companyName,
            beforeStartDate : findDate,
            afterStartDate : findEndDate,
            beforeSttlDate : signingDate,
            afterSttlDate : signingEndDate,
            beforeUpdatedAt : updateDate,
            afterUpdatedAt : updateEndDate,
            examineState : examineStatus,
            marketUserName : $("#smarketUserName").val(),
            region : $("#bigRegions").val()
        };
        new DataTable({
            id : '#datatableEnterprise',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/opport/pageTemp',
                data : param
            },
            columns : [{
                "data" : "opptTtl",
                "title" : "商机名称"
            }, {
                "data" : "vndtAmt",
                "tip" : true,
                "title" : "预计金额"
            }, {
                "data" : "startDate",
                "tip" : true,
                "title" : "发现日期"
            }, {
                "data" : "sttlDate",
                "tip" : true,
                "title" : "预计签单日期"
            }, {
                "data" : "csmName",
                "tip" : true,
                "title" : "客户名称"
            }, {
                "data" : "region",
                "tip" : true,
                "title" : "所属团队"
            }, {
                "data" : "marketUserName",
                "tip" : true,
                "title" : "上报人"
            }, {
                "data" : "updatedAt",
                "tip" : true,
                "title" : "更新时间"
            }, {
                "data" : "examineState",
                "tip" : true,
                "title" : "审核状态"
            }, {
                "data" : "assignerName",
                "tip" : true,
                "title" : "审核人"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var maxwidth=8;
                        if(c.opptTtl.length>maxwidth){
                             var html = "<a href='javascript:;' onclick='myReportListView.myReportDetail(\"" + c.id + "\")' title=" + c.opptTtl + ">" + c.opptTtl.substring(0,maxwidth)+"..." + "</a>";
                              return html;
                        }else{
                             var html = "<a href='javascript:;' onclick='myReportListView.myReportDetail(\"" + c.id + "\")' title=" + c.opptTtl + ">" + c.opptTtl + "</a>";
                             return html;
                        };
                }
            }, {
                targets : 1,
                render : function(i, j, c) {
                    if (c.vndtAmt)
                        return self.milliFormat(c.vndtAmt);
                    else
                        return '';
                }
            }, {
                targets : 2,
                render : function(i, j, c) {
                    if (c.startDate)
                        return c.startDate.substring(0, 4) + '-' + c.startDate.substring(4, 6) + '-' + c.startDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 3,
                render : function(i, j, c) {
                    if (c.sttlDate)
                        return c.sttlDate.substring(0, 4) + '-' + c.sttlDate.substring(4, 6) + '-' + c.sttlDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 4,
                render : function(i, j, c) {
                        var maxwidth=8;
                        if(c.csmName.length>maxwidth){
                              return c.csmName.substring(0,maxwidth)+"...";
                        }else{
                             return c.csmName;
                        };
                }
            }, {
                targets : 7,
                render : function(i, j, c) {
                    if (c.updatedAt)
                        return toDateString(c.updatedAt);
                    else
                        return '';
                }
            }, {
                targets : 8,
                render : function(i, j, c) {
                    if (c.examineState != null) {
                        var d = parseInt(c.examineState)
                        switch (d) {
                        case 0:
                            x = "待审核";
                            break;
                        case 1:
                            x = "通过";
                            break;
                        case 2:
                            x = "驳回";
                            break;
                        }
                        return x;
                    } else {
                        return '';
                    }
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
    //导出
    exportFile : function() {
        var business = $.trim($("#business").val());
        var findDate = $("#findDate").val();
        var findEndDate = $("#findEndDate").val();
        var signingDate = $("#signingDate").val();
        var signingEndDate = $("#signingEndDate").val();
        var updateDate = $("#updateDate").val();
        var updateEndDate = $("#updateEndDate").val();
        var examineStatus = $("#examineStatus").val();
        //客户名称
        var companyName = $.trim($("#customer").val());
        //登录人ID
        var userId = appcanUserInfo.userId;
        var data = {
            marketUserId : userId,
            opptTtl : business,
            csmName : companyName,
            beforeStartDate : findDate,
            afterStartDate : findEndDate,
            beforeSttlDate : signingDate,
            afterSttlDate : signingEndDate,
            beforeUpdatedAt : updateDate,
            afterUpdatedAt : updateEndDate,
            examineState : examineStatus,
            entityType : examineOpport,
            region : $("#bigRegions").val(),
            marketUserName : $("#smarketUserName").val()
        };
        var url = "/opport/exportAllTemp";
        myReportViewService.exportFile(data, url)
    },
    examine : function() {
        var self = this;
        bootbox.dialog({
            message : $("#transfer1").html(),
            title : "商机审核",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var setvalue = $("input:radio[name=optionsRadiosinline]:checked").val();
                        if (setvalue == 1) {
                            if ($("#transferPerson").val() =='') {
                                $.warning("请选择分配人!");
                                return false;
                            }
                            var data = {
                                opportTempId : objId,
                                examineState : 1,
                                csmName : $.trim($("#e_companyName").val()),
                                region : $("#transferTeam").val(),
                                salesUserId : $("#transferPerson").val()
                            }
                        } else {
                            var data = {
                                opportTempId : objId,
                                examineState : 2,
                                advice : $("#rejection").val()
                            }
                        }
                        ajax({
                            url : "/opport/examine",
                            data : data,
                            success : function(data) {
                                $.success("商机审核完成!")
                                self.load();
                                 var pushRight = document.getElementById( 'pushRight' );
                                 classie.toggle( pushRight, 'cbp-spmenu-open' );
                                 $("#mask").hide(); 
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
                $("input:radio[name=optionsRadiosinline]").change(function() {
                    var optionsRadios1 = $('#optionsRadios1').is(':checked');
                    var optionsRadios2 = $('#optionsRadios2').is(':checked');
                    if (optionsRadios1) {
                        $("#yes").show();
                        $("#no").addClass("hide");
                    } else if (optionsRadios2) {
                        $("#no").removeClass("hide");
                        $("#yes").hide();
                    }
                });
                $("#e_companyName").val(self.model.get("csmName"));
                self.searchCompany($("#e_companyName").val());
                $("#e_companyName").change(function() {
                    self.searchCompany($(this).val());
                })
                //获取团队
                self.getTeam();
                var regionId = self.model.get("regionId");
                //获取分配人
                self.getMarketPerson(regionId);
                $("#transferTeam").change(function() {
                    self.getMarketPerson($(this).val());
                    self.model.unset("marketUserId");
                    self.model.set("marketUserId", "");
                });
               if (self.model.get("customId") != null && self.model.get("customId") != "") {
                    $("#transferTeam").attr("disabled", "disabled");
                    $("#transferPerson").attr("disabled", "disabled");
                    $("#e_companyName").attr("disabled", "disabled");
                    $("#transferTeam").val(self.model.get("disabledRegionId"));
                    $("#transferPerson").val(self.model.get("disabledSalesUserId"));
                }  
            }
        });
    },
     getTeam : function() {
        var self = this;
        var data = {
            superId : '0'
        };
        ajax({
            url : "/opport/trade/listTrade",
            data : data,
            success : function(data) {
                var perArr = data.msg.list;
                $("#transferTeam").html(profession(perArr));
                $("#transferTeam").val(self.model.get("regionId"));
            }
        });
    },
    getMarketPerson : function(regionId) {
        var self = this;
        var data = {
            "region" : regionId
        };
        ajax({
            url : "/opport/listStaff",
            data : data,
            success : function(data) {
                var perArr = data.msg.list;
                $("#transferPerson").empty();
                var str=""
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    if(fullName){
                     str += '<option value="' + staffId + '">' + fullName + '</option>';
                     }
                 }
                 $("#transferPerson").html('<option value="">请选择分配人</option>'+str);
                  $("#transferPerson").val(self.model.get("marketUserId"));
            }
        });
    },
    //对比客户名称
    searchCompany : function(companyName) {
        var self = this;
        var data = {
            csmName : $.trim(companyName)
        };
        ajax({
            url : "/opport/custom/viewNameCheck",
            data : data,
            success : function(data) {
                var msg = data.msg.message;
                var state=data.msg.state;
                self.model.set("disabledRegionId",data.msg.regionId);
                self.model.set("disabledSalesUserId",data.msg.salesUserId);
                if (state == 0) {
                    $("#notEmpty").addClass("hassuccess");
                    $("#notEmpty").removeClass("haserror");
                } else {
                    $("#notEmpty").addClass("haserror");
                }
                $("#notEmpty").html(msg);
            }
        });
    },
    //获取团队
    myReportDetail:function(id){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.toggle( pushRight, 'cbp-spmenu-open' );
             $("#mask").css("height",$(document).height());     
                $("#mask").css("width",$(document).width());     
                $("#mask").show();  
            self.myReportDetailList(id);
    },
    hideDetail:function(){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.toggle( pushRight, 'cbp-spmenu-open' );
            $("#mask").hide(); 
             self.load();
    },
    myReportDetailList : function(id) {
        var self = this;
        objId = id;
        $("#partner").addClass("active");
        $("#dynamic").removeClass("active");
        $("#clue").removeClass("active");
        $.fn.editable.defaults.mode = 'inline';
        $("#detailpartdiv").html(myReportDetailTemplate);
        var html = '';
        html += handlerRow(id, "edit");
        $("#buttons").html(html);
        self.model.set({
            id : id
        });
        self.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                clueId = info.clueId;
                industry = info.profession;
                self.model.set("regionId", info.regionId)
                self.model.set("professionId", info.professionId);
                self.model.set("csmName", info.csmName);
                self.model.set("marketUserId", info.marketUserId);
                self.model.set("customId", info.customId);
                var pitchContacts = resp.msg.pitchContact;
                var listContact = resp.msg.listContact;
                if (info.examineState != 0) {
                    $("#examine").hide();
                }
                if (info.clueId == null) {
                    $("#clue").hide();
                    $("#transfer").hide();
                } else {
                    $("#clue").show();
                }
                if (info.examineState == 2) {
                    $("#againExamine").show();
                } else {
                    $("#againExamine").hide();
                }
                $("#title").html(info.opptTtl);
                if (info.examineState == 1) {
                    $("#customerNameDetail").html(info.historyCsmName);
                    $("#e_csmName").html(info.historyCsmName);
                    $("#dynamic").hide();
                    $("#clue").hide();
                } else {
                    $("#dynamic").show();
                    $("#customerNameDetail").html(info.csmName);
                    $("#e_csmName").html(info.csmName);
                }
                var exa = ""
                switch (parseInt(info.examineState)) {
                case 0:
                    exa = "待审核";
                    break;
                case 1:
                    exa = "通过";
                    break;
                case 2:
                    exa = "驳回";
                    break;
                }
                $("#status").html("审核状态:" + exa);
                $("#marketUserName").html(info.marketUserName);
                $("#region").html(info.region);
                $("#opptTtl").html(info.opptTtl);
                var sta = "";
                switch (parseInt(info.opptStatId)) {
                case 0:
                    sta = "初步接洽 (10%)";
                    break;
                case 1:
                    sta = "需求确定 (30%)";
                    break;
                case 2:
                    sta = "方案报价 (50%)";
                    break;
                case 3:
                    sta = "谈判审核 (80%)";
                    break;
                case 4:
                    sta = "赢单 (100%)";
                    break;
                case 5:
                    sta = "输单";
                    break;
                }
                $("#e_opptStat").html(sta);
                $("#e_vndtAmt").html(self.milliFormat(info.vndtAmt));
                if (info.startDate == "" || info.startDate==null) {
                    $("#e_startDate").html("");
                } else {
                    $("#e_startDate").html(info.startDate.substr(0, 4) + "-" + info.startDate.substr(4, 2) + "-" + info.startDate.substr(6, 2));
                }
                $("#e_sttlDate").html(info.sttlDate.substr(0, 4) + "-" + info.sttlDate.substr(4, 2) + "-" + info.sttlDate.substr(6, 2));
                $("#contactName").html(info.contactName);
                $('#e_productType').html(appcan.producttype[info.productType])
                $("#e_remark").html(info.remark);
                $("#createdAt").html(toDateString(info.createdAt));
                if (info.examineState == 1) {
                    $('#e_contactName').html(info.historyConName);
                } else {
                    if (info.customId == null) {
                        $('#e_contactName').html(info.contactName);
                    } else {
                        var countries = [];
                        for (var i = 0; i < listContact.length; i++) {
                            var str = {
                                text : listContact[i].contactName,
                                value : listContact[i].id
                            };
                            countries.push(str);
                        }
                        var contacts = [];
                        for (var i = 0; i < pitchContacts.length; i++) {
                            var contact = pitchContacts[i].id;
                            contacts.push(contact);
                        };
                        $('#e_contactName').editable({
                            type : 'text',
                            value : contacts,
                            select2 : {
                                multiple : true
                            },
                            source : countries
                        });
                    };
                }
                $('#e_dataSource').html(appcan.clueSources[info.dataSource]);
                if (info.dataSource == 10) {
                    $("#e_conferenceName").show();
                    $("#e_meeting").html(info.conferenceName==""?"无":info.conferenceName);
                     if($("#e_meeting").text()=="必填!"){
                        $("#tip").show();
                    }else{
                        $("#tip").hide();
                    };
                } else {
                    $("#e_conferenceName").hide();
                };
                  $('#editpart .editable').editable('disable');
                  $(".field_edit_pen").hide();
                   $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().hide();
                    }
                });
            },
            error : function(cols, resp, options) {
                if (resp == "L001") {
                    $.warning("当前用户登录超时，请重新登录！");
                    window.location = 'login.html';
                } else {
                    $.warning(resp);
                }
            },
            type : 3,
            id : id
        });
        var settings = {
            trigger : 'click',
            title : '审核信息',
            content : '',
            width : "auto",
            multi : true,
            closeable : false,
            style : '',
            delay : 300,
            padding : true,
            backdrop : false
        };
        var asyncSettings = {
            width : '240',
            height : '200',
            closeable : true,
            padding : false,
            cache : false,
            url : urlIp + '/opport/examine/listExamine?objEntityId=' + objId,
            type : 'async',
            content : function(data) {
                var info = data.msg.list
                var html = '<ul class="list-group">';
                for (var i = 0; i < info.length; i++) {
                    if (info[i].examineState == 1) {
                        html += '<li class="list-group-item" style="background-color:#F9F9F9;margin-bottom:4px;"><ul class="list-unstyled"><li>审核状态:<span>通过</span></li><li>审核时间:<span>' + toDateString(info[i].updatedAt) + '</span></li><li>审核人:<span>' + info[i].fullName + '</span></li></ul></li>'
                    } else {
                        html += '<li class="list-group-item" style="background-color:#F9F9F9;margin-bottom:4px;"><ul class="list-unstyled"><li>审核状态:<span>驳回</span></li><li>审核意见:<span style="word-wrap:break-word;word-break:break-all;">' + info[i].advice + '</span></li><li>审核时间:<span>' + toDateString(info[i].updatedAt) + '</span></li><li>审核人:<span>' + info[i].fullName + '</span></li></ul></li>'
                    }
                }
                html += '</ul>';
                return html;
            }
        };
        $('#listExamine').webuiPopover('destroy').webuiPopover($.extend({}, settings, asyncSettings));
    },
    dynamic : function(objId) {
        $("#partner").removeClass("active");
        $("#dynamic").addClass("active");
        $("#clue").removeClass("active");
        var objEntityTypeId = "08";
        var editType = 2;
        var dynamicEdit = ['assets/services/dynamicEdit.js', 'assets/models/dynamicEdit.js', 'assets/views/myOpportdynamicEdit.js'];
        loadSequence(dynamicEdit, function() {
            dynamicViewObj.getDynamicData(objId, objEntityTypeId, editType);
        });
    },
    //线索信息
    myReportClue : function(id) {
        var self = this;
        $("#partner").removeClass("active");
        $("#dynamic").removeClass("active");
        $("#clue").addClass("active");
        $("#detailpartdiv").html(myReportCluesListDetail);
        self.model.set({
            id : id
        });
        self.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                $("#salesUserName").html(info.salesUserName);
                $("#contactName").html(info.contactName);
                $("#mobile").html(info.mobile);
                $("#teleNo").html(info.teleNo);
                $('#profession').html(info.professionName);
                $('#region').html(info.regionName);
                $("#companyName").html(info.companyName);
                var exa = ""
                switch (parseInt(info.clueState)) {
                case 0:
                    exa = "未处理";
                    break;
                case 1:
                    exa = "已联系";
                    break;
                case 2:
                    exa = "转商机";
                    break;
                case 3:
                    exa = "不合格";
                    break;
                }
                $("#clueState1").html(exa);
                $('#province').html(info.province);
                $("#department").html(info.department);
                $("#post").html(info.post);
                $("#email").html(info.email);
                $("#qq").html(info.qq);
                $("#weChat").html(info.weChat);
                $('#level').html(appcan.customerlevel[info.level]);
                $('#csmNature').html(appcan.customersize[info.csmNature]);
                $('#csmScale').html(appcan.customersize[info.csmScale]);
                $("#address").html(info.address);
                $("#postcode").html(info.postcode);
                $("#website").html(info.website);
                $("#fax").html(info.fax);
                $('#c_dataSource').html(appcan.clueSources[info.dataSource]);
                if (info.dataSource == 10) {
                    $("#c_conferenceName").removeClass("hide");;
                    $("#conferenceName").html(info.conferenceName==""?"无":info.conferenceName);
                     if($("#conferenceName").text()=="必填!"){
                        $("#tip").show();
                    }else{
                        $("#tip").hide();
                    };
                } else {
                    $("#c_conferenceName").hide();
                };
                $('#productType').html(appcan.producttype[info.productType]);
                $("#remark").html(info.remark);
                $("#createdAt").html(toDateString(info.createdAt));
                if (info.submitState == "1") {
                    var submitState = "已分配"
                } else {
                    submitState = "待分配"
                }
                $("#submitState").html(submitState);
                $("#marketUserName").html(info.marketUserName);
                if (info.submitTime == null) {
                    $("#submitTime").html("");
                } else {
                    $("#submitTime").html(toDateString(info.submitTime));
                }
                $("#assignerName").html(info.assignerName);
                if (info.distributionTime == null) {
                    $("#distributionTime").html("");
                } else {
                    $("#distributionTime").html(toDateString(info.distributionTime));
                };
                $("#editpart .editable").addClass("editable-disabled");
                 $(".field_edit_pen").hide();
                 $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().hide();
                    }
                });
            },
            error : function(cols, resp, options) {
                if (resp == "L001") {
                    $.warning("当前用户登录超时，请重新登录！");
                    window.location = 'login.html';
                } else {
                    $.warning(resp);
                }
            },
            type : 4,
            id : id
        });
    },
     milliFormat:function(s){//添加千位符  
        if(/[^0-9\.]/.test(s)) return "invalid value";  
        s=s.replace(/^(\d*)$/,"$1.");  
        s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");  
        s=s.replace(".",",");  
        var re=/(\d)(\d{3},)/;  
        while(re.test(s)){  
            s=s.replace(re,"$1,$2");  
        }  
        s=s.replace(/,(\d\d)$/,".$1");  
        return s.replace(/^\./,"0.")  
    }  
});
var myReportListView = new myReportListView();

