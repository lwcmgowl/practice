//加载并初始化模板对象
var myReportTemplate = loadTemplate("assets/templates/staff/myReport.html");
var myReportDetailTemplate = loadTemplate("assets/templates/staff/myReportDetail.html");
var myReportCluesListDetail=loadTemplate("assets/templates/staff/myReportCluesListDetail.html");
//列表容器VIEW
var objId="";
var clueId="";
var industry="";
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
        'click #transfer':function(){
            this.transfer(this.model.get("id"));
        },
        "click #dynamic":function(){
            this.dynamic(objId)
        },
        "click #partner":function(){
            this.myReportDetailList(objId);
        },
        "click #clue":function(){
            this.myReportClue(clueId);
        },
        "click #againExamine":function(){
            this.againExamine();
        },
        "click #mask":function(){
            this.hideDetail();
        },
        'click .field_edit_pen' : "fieldshow",
        
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
        this.load();
    },
    load : function() {
        var self = this;
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
            notExamineState:1
        };
        new DataTable({
            el : 'datatableEnterprise',
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
            },{
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
                targets : 5,
                render : function(i, j, c) {
                    if (c.updatedAt)
                        return toDateString(c.updatedAt);
                    else
                        return '';
                }
            }, {
                targets : 6,
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
            },
            dataTableCb:function(n){
                self.pageNo = n;
            }
        });
    },
     pageNo:1,
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
            entityType:reportOpport
        };
        var url = "/opport/exportAllTemp";
        myReportViewService.exportFile(data, url)
    },
    transfer:function(id){
         var self = this;
        var info  = this.collection.get(id).toJSON();
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
                            $.danger('请选择线索负责人');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("转移成功", null, null, function() {
                                   var pushRight = document.getElementById( 'pushRight' );
                                   classie.toggle( pushRight, 'cbp-spmenu-open' );
                                    $("#mask").hide();
                                     self.load();
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 5,
                            "id" : clueId,
                            "salesUserId" : assigner
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
                $("#tmplCompanyName").html(info.csmName);
                $("#transferTeam").html(info.region);
                $("#transferProductType").html(industry);
                self.getMarketPerson();
            }
        });
    },
    getMarketPerson : function() {
        var self=this;
        var data = {
            "roleType" : 0,
            "regionId" : self.model.get("regionId"),
            "tradeId" : self.model.get("professionId"),
            "staffId" : appcanUserInfo.userId
        };
        ajax({
            url : "/opport/clue/listStaff",
            data : data,
            success : function(data) {
                var perArr = data.msg.list;
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    if(fullName){
                    var str = '<option value="' + staffId + '">' + fullName + '</option>';
                    $("#transferPerson").append(str);
                    }
                }
            }
        });
    },
    againExamine:function(){
        var self=this;
         bootbox.confirm("您确认再次送审商机吗？", function(result) {
        if (result) {
            var data = {
                "id" : objId,
                "examineState":0
            };
            ajax({
                url :"/opport/againExamine",
                data : data,
                success : function(data) {
                    $.success("再次送审成功！", null, null, function() {
                            self.load();
                            self.myReportDetailList(objId);
                    });
                }
            });
        } else {
        }
    });
    },
    //显示空白项
     fieldshow : function() {
          $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().toggle("slow");
                    }
                });
            if($("#e_dataSource").text()!="行业会议"){
               $("#e_meeting").parent().parent().hide();
            }
    },
    //弹出窗口控制
    myReportDetail:function(id){
        var self=this;
        self.model.set("id",id)
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
    },
    myReportDetailList : function(id) {
        var self = this;
            objId=id;
        $("#partner").addClass("active");
        $("#dynamic").removeClass("active");
        $("#clue").removeClass("active");
        $.fn.editable.defaults.mode = 'inline';
        $("#detailpartdiv").html(myReportDetailTemplate);
        if(window.screen.width>1440){
            $("#partnerDetail").css("max-height","850px")
        }else{
            $("#partnerDetail").css("max-height","500px")
        }
        var html = '<div style="border-bottom: 1px solid #ededed; position: absolute;width: 100%;left: 0;top: 30px;"></div><a href="javascript:;"id="againExamine"class="rowstyle"><i class="fa fa-history"aria-hidden="true"></i>再次送审商机</a><a href="javascript:;"id="listExamine"class="rowstyle"><i class="fa fa-info-circle"aria-hidden="true"></i>审核信息</a>';
        // html += handlerRow(id, "edit");
        $("#buttons").html(html);
       $('#transfer').html("<i class='fa fa-retweet' aria-hidden='true'></i>转移线索");
        self.model.set({
            id : id
        });
        self.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                clueId=resp.msg.item.clueId;
                industry=info.profession
                self.model.set("regionId",info.regionId)
                self.model.set("professionId",info.professionId);
                self.model.set("examineState",info.examineState);
                var pitchContacts = resp.msg.pitchContact;
                var listContact = resp.msg.listContact;
                if(info.clueId==null || info.clueId==''){
                    $("#clue").hide();
                    $('#transfer').hide();
                }else{
                    $("#clue").show();
                }
                if(info.examineState==2){
                    $("#againExamine").show();
                    if(info.clueId==null || info.clueId==''){
                        $('[href="#transfer/' + id + '"]').hide();
                    }else{
                        $('[href="#transfer/' + id + '"]').show(); 
                    }
                }else{
                     $("#againExamine").hide();
                     $('[href="#transfer/' + id + '"]').hide();
                }
                $("#title").html(info.opptTtl);
                $("#customerNameDetail").html(info.csmName);
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
                $("#e_vndtAmt").html(info.vndtAmt);
                if (info.startDate == "" || info.startDate==null) {
                    $("#e_startDate").html("");
                } else {
                    $("#e_startDate").html(info.startDate.substr(0, 4) + "-" + info.startDate.substr(4, 2) + "-" + info.startDate.substr(6, 2));
                }
                $("#e_sttlDate").html(info.sttlDate.substr(0, 4) + "-" + info.sttlDate.substr(4, 2) + "-" + info.sttlDate.substr(6, 2));
                $("#e_csmName").html(info.csmName);
                $("#e_contactName").html(info.contactName);
                $('#e_productType').editable({
                    value : info.productType==''?"无":info.productType,
                    source : [{
                        value : 0,
                        text : '企业版'
                    }, {
                        value : 1,
                        text : '企业移动信息平台'
                    }, {
                        value : 2,
                        text : 'app外包项目'
                    }, {
                        value : 3,
                        text : '其他'
                    }, {
                        value : 4,
                        text : '平台+实施'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/editTemp',{
                                productType : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                $("#e_remark").html(info.remark);
                $("#e_remark").editable({
                    url : function(value) {
                        return $.post(urlIp + '/opport/editTemp', {
                            remark : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#createdAt").html(toDateString(info.createdAt))
                $('#opptTtl').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                            return '商机名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '商机名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/editTemp', {
                            opptTtl : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#e_vndtAmt').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '预计金额不能为空!';
                        }else{
                            var re = /^[0-9]+.?[0-9]*$/; 
                             if (!re.test($.trim(value))){
                                   return "请输入数字";
                                 }
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/editTemp', {
                            vndtAmt : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#e_startDate').editable({
                    type : "text",
                    validate : function(value) {
                         if($.trim(value)){
                            var  re =/^(\d{4})-(\d{2})-(\d{2})$/; 
                           if(re.test($.trim(value)))//判断日期格式符合YYYY-MM-DD标准 
                           { 
                            var   dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3); 
                             if(!((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3))))//判断日期逻辑 
                             { 
                               return  "日期格式为(yyyy-mm-dd)!"; 
                              } 
                           }else{
                               return  "日期格式为(yyyy-mm-dd)!"; 
                           }
                           if(value.replace(/-/g, '')>$('#e_sttlDate').text().replace(/-/g, '')){
                            return "预计签单日期不能小于发现日期!"
                        }
                      }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/editTemp', {
                            startDate : value.value.replace(/-/g, ''),
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#e_sttlDate').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == ''){
                            return '预计签单日期不能为空!';
                        }else{
                            var  re =/^(\d{4})-(\d{2})-(\d{2})$/; 
                           if(re.test($.trim(value)))//判断日期格式符合YYYY-MM-DD标准 
                           { 
                            var   dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3); 
                             if(!((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3))))//判断日期逻辑 
                             { 
                               return  "日期格式为(yyyy-mm-dd)!"; 
                              } 
                           }else{
                               return  "日期格式为(yyyy-mm-dd)!"; 
                           }
                        }
                        if($('#e_startDate').text().replace(/-/g,'')!="空"){
                           if($('#e_startDate').text().replace(/-/g,'')>value.replace(/-/g, '')){
                            return "预计签单日期不能小于发现日期!"
                          }  
                        }
                       
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/editTemp', {
                            sttlDate : value.value.replace(/-/g, ''),
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                if (info.customId == null) {
                    $('#contactName').html(info.contactName);
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
                        type: 'text',
                        value : contacts,
                        select2 : {
                            multiple : true
                        },
                        source : countries,
                        validate : function(value) {
                            if ($.trim(value) == '')
                                return '联系人不能为空!';
                        },
                        url : function(value) {
                            return $.post(urlIp + '/opport/editTemp',{
                                contactIds : value.value.join(","),
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                    });
                };
                $('#e_dataSource').editable({
                    value : info.dataSource==''?"无":info.dataSource,
                    source : [{
                        value : 0,
                        text : '400电话'
                    }, {
                        value : 1,
                        text : '百度推广'
                    }, {
                        value : 2,
                        text : '电话营销'
                    }, {
                        value : 3,
                        text : '个人开发'
                    }, {
                        value : 4,
                        text : '公司资源'
                    }, {
                        value : 5,
                        text : '客户维护'
                    }, {
                        value : 6,
                        text : '朋友介绍'
                    }, {
                        value : 7,
                        text : '网络营销'
                    }, {
                        value : 8,
                        text : '展会营销'
                    }, {
                        value : 9,
                        text : 'AppCan官网'
                    }, {
                        value : 10,
                        text : '行业会议'
                    }, {
                        value : 11,
                        text : '其他'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/editTemp',{
                                dataSource : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                if(info.dataSource==10){
                    $("#e_conferenceName").show();
                    $("#e_meeting").html(info.conferenceName==""?"必填!":info.conferenceName);
                    if($("#e_meeting").text()=="必填!"){
                        $("#tip").show();
                    }else{
                        $("#tip").hide();
                    };
                    $('#e_meeting').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '会议名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/editTemp', {
                            conferenceName : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                }else{
                    $("#e_conferenceName").hide();
                }
                $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().hide();
                    }
                });
                if(info.examineState!=2){
                    $('#editpart .editable').editable('toggleDisabled');
                    $(".field_edit_pen").hide();
                }else{
                    $(".field_edit_pen").show();
                }
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
        //审核信息
        var settings = {
                        trigger:'click',
                        title:'审核信息',
                        content:'',
                        width:"auto",                     
                        multi:true,                     
                        closeable:false,
                        style:'',
                        delay:300,
                        padding:true,
                        backdrop:false
                  };
                             var asyncSettings = {   
                                            width:'240',
                                            height:'200',
                                            closeable:true,
                                            padding:false,
                                            cache:false,
                                            url:urlIp+'/opport/examine/listExamine?objEntityId='+objId,
                                            type:'async',
                                            content:function(data){
                                                var info=data.msg.list
                                                var html = '<ul class="list-group">';
                                                for(var i=0;i<info.length;i++){
                                                   if(info[i].examineState==1){
                                                     html+='<li class="list-group-item" style="background-color:#F9F9F9;margin-bottom:4px;"><ul class="list-unstyled"><li>审核状态:<span>通过</span></li><li>审核时间:<span>'+toDateString(info[i].updatedAt)+'</span></li><li>审核人:<span>'+info[i].fullName+'</span></li></ul></li>' 
                                                   }else{
                                                     html+='<li class="list-group-item" style="background-color:#F9F9F9;margin-bottom:4px;"><ul class="list-unstyled"><li>审核状态:<span>驳回</span></li><li>审核意见:<span style="word-wrap:break-word;word-break:break-all;">'+info[i].advice+'</span></li><li>审核时间:<span>'+toDateString(info[i].updatedAt)+'</span></li><li>审核人:<span>'+info[i].fullName+'</span></li></ul></li>'    
                                                   }
                                                }
                                                html+='</ul>';
                                                return html;
                                            }
                                            };
             $('#listExamine').webuiPopover('destroy').webuiPopover($.extend({},settings,asyncSettings));
    },
    dynamic:function(objId){
         $("#partner").removeClass("active");
         $("#dynamic").addClass("active");
          $("#clue").removeClass("active");
         var objEntityTypeId="08";
         var editType=1;
         var dynamicEdit=['assets/services/dynamicEdit.js','assets/models/dynamicEdit.js','assets/views/myOpportdynamicEdit.js'];
         loadSequence(dynamicEdit,function(){
                dynamicViewObj.getDynamicData(objId,objEntityTypeId,editType);
            });
    },
    //线索信息
    myReportClue:function(id){
        var self=this;
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
                 $('#contactName').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '联系人名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            contactName : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#mobile").html(info.mobile);
                $('#mobile').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '手机号码不能为空!';
                        }else{
                             if (!mob.test($.trim(value))){
                                   return "请输入正确的手机号码!";
                                 }
                        }
                           
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            mobile : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#teleNo").html(info.teleNo);
                $('#teleNo').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '电话号码不能为空!';
                        }else{
                             if (!tele.test($.trim(value))){
                                   return "请输入正确的电话号码!";
                                 }
                        }
                           
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            teleNo : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#profession').editable({
                    value: info.profession,    
                    source:getPro(info.region),
                     url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            profession : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                    
                });
                 $('#c_region').editable({
                    value: info.region,    
                    source:getMyRegion().regions,
                      url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            region : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id);
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#companyName").html(info.companyName);
                 $('#companyName').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '客户名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            companyName : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
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
                 $('#province').editable({
                    value : info.province,
                    source : [{
                        value :"北京",
                        text : "北京"
                    }, {
                        value : "天津",
                        text : '天津'
                    }, {
                        value : "山东",
                        text : '山东'
                    }, {
                        value : "山西",
                        text : '山西'
                    }, {
                        value : "黑龙江",
                        text : '黑龙江'
                    }, {
                        value : "吉林",
                        text : '吉林'
                    }, {
                        value : "辽宁",
                        text : '辽宁'
                    }, {
                        value : "河北",
                        text : '河北'
                    }, {
                        value : "河南",
                        text : '河南'
                    }, {
                        value : "内蒙古自治区",
                        text : '内蒙古自治区'
                    }, {
                        value : "上海",
                        text : '上海'
                    }, {
                        value : "江苏",
                        text : '江苏'
                    },{
                        value : "浙江",
                        text : '浙江'
                    }, {
                        value : "安徽",
                        text : '安徽'
                    }, {
                        value : "广东",
                        text : '广东'
                    }, {
                        value : "广西",
                        text : '广西'
                    }, {
                        value : "福建",
                        text : '福建'
                    }, {
                        value : "海南",
                        text : '海南'
                    }, {
                        value : "湖北",
                        text : '湖北'
                    }, {
                        value : "湖南",
                        text : '湖南'
                    }, {
                        value : "江西",
                        text : '江西'
                    }, {
                        value : "陕西",
                        text : '陕西'
                    }, {
                        value : "甘肃",
                        text : '甘肃'
                    }, {
                        value : "青海",
                        text : '青海'
                    },{
                        value : "宁夏",
                        text : '宁夏'
                    },{
                        value : "新疆",
                        text : '新疆'
                    },{
                        value : "重庆",
                        text : '重庆'
                    },{
                        value : "四川",
                        text : '四川'
                    },{
                        value : "贵州",
                        text : '贵州'
                    },{
                        value : "云南",
                        text : '云南'
                    },{
                        value : "西藏",
                        text : '西藏'
                    },{
                        value : "香港",
                        text : '香港'
                    },{
                        value : "澳门",
                        text : '澳门'
                    },{
                        value : "台湾",
                        text : '台湾'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/clue/edit',{
                                province : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                $("#department").html(info.department);
                $("#department").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            department : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#post").html(info.post);
                 $("#post").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            post : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#email").html(info.email);
                $("#email").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!pattern.test($.trim(value))){
                                   return "请输入正确的邮箱地址!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            email : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#qq").html(info.qq);
                $("#qq").editable({
                    type : 'text',
                    validate : function(value) {
                             var regqq=/^[1-9][0-9]{4,10}$/;
                             if (!regqq.test($.trim(value))){
                                   return "请输入正确QQ号码!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            qq : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#weChat").html(info.weChat);
                 $("#weChat").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            weChat : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#level').editable({
                    value : info.level==''?"无":info.level,
                    source : [{
                        value : 0,
                        text : 'A1'
                    }, {
                        value : 1,
                        text : 'A2'
                    }, {
                        value : 2,
                        text : 'A3'
                    }, {
                        value : 3,
                        text : 'A4'
                    },{
                        value : 4,
                        text : 'B1'
                    },{
                        value : 5,
                        text : 'B2'
                    },{
                        value : 6,
                        text : 'C1'
                    }, {
                        value : 7,
                        text : 'C2'
                    },{
                        value : 8,
                        text : 'D'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/clue/edit',{
                                level : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                $('#csmNature').editable({
                    value : info.csmNature==''?"空":info.csmNature,
                    source : [{
                        value : 0,
                        text : '央企'
                    }, {
                        value : 1,
                        text : '民营企业'
                    }, {
                        value : 2,
                        text : '地市国企'
                    }, {
                        value : 3,
                        text : '股份公司'
                    },{
                        value : 4,
                        text : '事业单位'
                    },{
                        value : 5,
                        text : '上市公司'
                    },{
                        value : 6,
                        text : '中外合资'
                    }, {
                        value : 7,
                        text : '外商独资'
                    },{
                        value : 8,
                        text : '港澳台投资'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/clue/edit',{
                                csmNature : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                 $('#csmScale').editable({
                    value : info.csmScale==''?"空":info.csmScale,
                    source : [{
                        value : 0,
                        text : '0-20人'
                    }, {
                        value : 1,
                        text : '20-50人'
                    }, {
                        value : 2,
                        text : '50-100人'
                    }, {
                        value : 3,
                        text : '100-200人'
                    },{
                        value : 4,
                        text : '200-500人'
                    },{
                        value : 5,
                        text : '500-1000人'
                    },{
                        value : 6,
                        text : '1000人以上'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/clue/edit',{
                                csmNature : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                 $("#address").html(info.address);
                 $("#address").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            address : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#postcode").html(info.postcode);
                 $("#postcode").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!re2.test($.trim(value))){
                                   return "请输入正确的邮政编码!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            postcode : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#website").html(info.website);
                 $("#website").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!Expression.test($.trim(value))){
                                   return "请输入正确的网址!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            website : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#fax").html(info.fax);
                 $("#fax").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            fax : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#c_dataSource').editable({
                    value : info.dataSource==''?"空":info.dataSource,
                    source : [{
                        value : 0,
                        text : '400电话'
                    }, {
                        value : 1,
                        text : '百度推广'
                    }, {
                        value : 2,
                        text : '电话营销'
                    }, {
                        value : 3,
                        text : '个人开发'
                    }, {
                        value : 4,
                        text : '公司资源'
                    }, {
                        value : 5,
                        text : '客户维护'
                    }, {
                        value : 6,
                        text : '朋友介绍'
                    }, {
                        value : 7,
                        text : '网络营销'
                    }, {
                        value : 8,
                        text : '展会营销'
                    }, {
                        value : 9,
                        text : 'AppCan官网'
                    }, {
                        value : 10,
                        text : '行业会议'
                    }, {
                        value : 11,
                        text : '其他'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/clue/edit',{
                                dataSource : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                if(info.dataSource==10){
                    $("#c_conferenceName").removeClass("hide");
                    $("#conferenceName").html(info.conferenceName==""?"必填!":info.conferenceName);
                    if($("#conferenceName").text()=="必填!"){
                        $("#tip").show();
                    }else{
                        $("#tip").hide();
                    };
                    $('#conferenceName').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '会议名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            conferenceName : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                           self.myReportClue(id);
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                }else{
                   $("#c_conferenceName").hide();
                };
                $('#c_productType').editable({
                    value : info.productType==''?"空":info.productType,
                    source : [{
                        value : 0,
                        text : '企业版'
                    }, {
                        value : 1,
                        text : '企业移动信息平台'
                    }, {
                        value : 2,
                        text : 'app外包项目'
                    }, {
                        value : 3,
                        text : '其他'
                    }, {
                        value : 4,
                        text : '平台+实施'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/opport/clue/edit',{
                                productType : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id);
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                 $("#remark").html(info.remark);
                 $("#remark").editable({
                    type : 'textarea',
                    rows: 10,
                    url : function(value) {
                        return $.post(urlIp + '/opport/clue/edit', {
                            remark : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportClue(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
               $("#createdAt").html(toDateString(info.createdAt));
               if(info.submitState=="1"){
                   var submitState="已分配"
               }else{
                   submitState="待分配"
               }
               $("#submitState").html(submitState); 
               $("#marketUserName").html(info.marketUserName);
               if(info.submitTime==null){
                   $("#submitTime").html("");
               }else{
                 $("#submitTime").html(toDateString(info.submitTime));  
               }
               $("#assignerName").html(info.assignerName);
                if(info.distributionTime==null){
                   $("#distributionTime").html("");
               }else{
                $("#distributionTime").html(toDateString(info.distributionTime));
               }
               $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().hide();
                    }
                });
                if(self.model.get("examineState")!=2){
                    $('#editpart .editable').editable('disable');
                    $(".field_edit_pen").hide();
                }else{
                    $(".field_edit_pen").show();
                }
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
    add : function() {
        var self = this;
        bootbox.dialog({
            message : $("#enterprisePartner").html(),
            title : "申请创建商机",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        //判断添加条件
                        $('#productForm').bootstrapValidator('validate');
                        //商机名称
                        var opptTtl = $.trim($("#businessName").val());
                        if(opptTtl==''){
                            return false;
                        }
                        //商机阶段
                        var opptStatId = $("#opptStatId").val();
                        var vndtAmt = $.trim($("#vndtAmt").val());
                        if(vndtAmt==''){
                            return false;
                        }
                        var startDate = $("#startDate").val().replace(/-/g, '');
                        var sttlDate = $("#sttlDate").val().replace(/-/g, '');
                        if (sttlDate == '') {
                            $.warning("请选择预计签单日期!");
                            $("#sttlDate").parent().addClass("has-error");
                            return false;
                        } else if (sttlDate < startDate) {
                            $.warning("发现日期必须小于预计签单日期!");
                            $("#startDate").parent().addClass("has-error");
                            $("#sttlDate").parent().addClass("has-error");
                            $("#startDate").focus();
                            return false;
                        }else{
                             $("#startDate").parent().removeClass("has-error");
                             $("#sttlDate").parent().removeClass("has-error");
                        }
                        var customId = $("#customerName").val();
                        if (customId === '00') {
                            $.warning("请选择所属客户");
                            $("#customId").focus();
                            return false;
                        }
                        if ($("#contacts").val() == null) {
                            $.warning("请选择联系人!");
                            $("#contacts").focus();
                            return false;
                        }
                        var contactIds = $("#contacts").val().join(",");
                        var dataSource = $("#dataSource").val();
                        var conferenceName = "";
                        if ($("#dataSource").find("option:selected").text() == "行业会议") {
                            conferenceName = $.trim($("#meeting").val());
                            if (conferenceName == '') {
                                $.warning("请填写会议名称");
                                $("#meeting").focus();
                                return false;
                            }
                        }
                        //var conferenceName=$("#meeting").val();
                        var productType = $("#productType").val();
                        var remark = $("#remark").val();
                        var param = {
                            opptTtl : opptTtl,
                            opptStatId : opptStatId,
                            vndtAmt : vndtAmt,
                            startDate : startDate,
                            sttlDate : sttlDate,
                            customId : customId,
                            contactIds : contactIds,
                            dataSource : dataSource,
                            conferenceName:conferenceName,
                            productType : productType,
                            remark : remark
                        };
                        self.model.clear("id");
                        self.model.save({
                            param : param
                        }, {
                            success : function(cols, resp, options) {
                                $.success("添加成功", null, null, function() {
                                    self.load();
                                });
                            },
                            error : function(cols, resp, options) {
                                if (resp == "001") {
                                    $.warning("当前用户登录超时，请重新登录！");
                                    window.location = 'login.html';
                                } else {
                                    $.warning(resp);
                                }
                            },
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
                    $(this).hide();
                    $("#more").slideToggle("slow");
                });
                self.getcstm();
                self.findContactListByCustomerId();
                $('#customerName').change(function() {
                    var customId = $('#customerName option:selected').val();
                    if (customId == null) {
                        return false;
                    } else {
                        self.findContactListByCustomerId(customId);
                    }

                });
                $("#startDate").datepicker({
                    format : 'yyyy-mm-dd',
                    weekStart : 0,
                    todayHighlight : true,
                    autoclose : true,
                });
                $("#sttlDate").datepicker({
                    format : 'yyyy-mm-dd',
                    weekStart : 0,
                    todayHighlight : true,
                    autoclose : true,
                });
                for (var i = 0,
                    l = appcan.opptStat.length; i < l; i++) {
                    var str = '<option value="' + (i) + '">' + appcan.opptStat[i] + '</option>'
                    $("#opptStatId").append(str);
                }
                $("#opptStatId").val('0');
                $("#opptStatId")[0].disabled = true;
                for (var i = 0,
                    l = appcan.clueSources.length; i < l; i++) {
                    var str = '<option value="' + (i) + '">' + appcan.clueSources[i] + '</option>'
                    $("#dataSource").append(str);
                }
                $('#dataSource').change(function() {
                    var meeting = $('#dataSource option:selected').text();
                    if (meeting === "行业会议") {
                        $("#conferenceName").removeClass("hide");
                    } else {
                        $("#conferenceName").addClass("hide");
                    }
                })
                for (var i in appcan.contactType) {
                    var str = '<option value="' + (i) + '">' + appcan.contactType[i] + '</option>'
                    $("#contactTypeId").append(str);
                }
                for (var i = 0,
                    l = appcan.producttype.length; i < l; i++) {
                    var str = '<option value="' + (i) + '">' + appcan.producttype[i] + '</option>'
                    $("#productType").append(str);
                }
                $('#productForm').bootstrapValidator({
                    message : '无效的数值!',
                    feedbackIcons : {
                        valid : 'glyphicon glyphicon-ok',
                        invalid : 'glyphicon glyphicon-remove',
                        validating : 'glyphicon glyphicon-refresh'
                    },
                    fields : {
                        businessName : {
                            validators : {
                                notEmpty : {
                                    message : '商机名称不能为空!'
                                }
                            }
                        },
                        price : {
                            validators : {
                                notEmpty : {
                                    message : '预计金额不能为空!'
                                },
                                regexp : {
                                    regexp : /^\d+(\.\d+)?$/,
                                    message : "数据格式有误!"
                                }
                            }
                        },
                        meeting : {
                            validators : {
                                notEmpty : {
                                    message : '会议名称不能为空!'
                                }
                            }

                        }
                    }
                });
            }
        });
    },
    //获取客户名称
    getcstm : function(customId) {
        var self = this;
        self.model.fetch({
            success : function(cols, resp, options) {
                var cstms = resp.msg.list;
                if (cstms != undefined) {
                    for (var i in cstms) {
                        if (customId && customId == cstms[i].id) {
                            var str = '<option selected value="' + cstms[i].id + '">' + cstms[i].csmName + '</option>'
                        } else {
                            var str = '<option value="' + cstms[i].id + '">' + cstms[i].csmName + '</option>'
                        }
                        $("#customerName").append(str);
                    }
                    $('#customerName').selectpicker({
                        style : 'btn-default',
                        size : 10,
                    });
                }
            },
            error : function(cols, resp, options) {

            },
            type : 1
        });
    },
    //获取联系人
    findContactListByCustomerId : function(customId) {
        if (customId == undefined || customId == 00) {
            var $selectContact = $('#contacts');
            $selectContact.empty();
            $('#contacts').selectpicker('refresh');
            $('#contacts').selectpicker({
                style : 'btn-default',
                size : 10,
            });
        } else {
            this.model.fetch({
                success : function(cols, resp, options) {
                    var $selectContact = $('#contacts');
                    var list = resp.msg.list;
                    var html = '';
                    for (var i = 0; i < list.length; i++) {
                        html += '<option value="' + list[i].id + '">' + list[i].contactName + '</option>';
                    }
                    $selectContact.empty();
                    $selectContact.append(html);
                    $('#contacts').selectpicker('refresh');
                    $('#contacts').selectpicker({
                        style : 'btn-default',
                        size : 10,
                    });
                },
                error : function(cols, resp, options) {
                },
                type : 2,
                customId : customId
            });

        }
    },
    //千位分隔符
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

