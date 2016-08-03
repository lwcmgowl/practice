//加载并初始化模板对象
var marketdetailTemplate = loadTemplate("assets/templates/staff/addOpport.html");
var addtype = '';
var tips = '';
var objid = '';
var urlType = 'add';
var opportUrl = '';
var types = '';
//列表容器VIEW
var addOpportdetailView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#main_content',
    events : {
        'submit' : 'addOpport',
        'click #addOpport' : function() {
            this.addOpport();
        }
    },
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    model : new addMarketModel(),
    template : marketdetailTemplate,
    load : function(id, customId, type) {
        this.render();
        addtype="";
        urlType="";
        $('#startDate').datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true

        });
        $('#sttlDate').datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true

        });
        types = type;
        if (id && id != "null") {
            objid = id;
            var self = this;
            addtype = "edit"
            if (type == "custom") {
                opportUrl = '/custom';
            };
            tips = '编辑成功！';
            $("#title").html('编辑机会');
            for (var i = 0,
                l = appcan.opptStat.length; i < l; i++) {
                var str = '<option value="' + (i) + '">' + appcan.opptStat[i] + '</option>'
                $("#opptStatId").append(str);
            }
            $("#opptStatId").val('0');
            // $("#opptStatId")[0].disabled = true;
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
            for (var i = 0,
                l = appcan.producttype.length; i < l; i++) {
                var str = '<option value="' + (i) + '">' + appcan.producttype[i] + '</option>'
                $("#productType").append(str);
            }
            var timeFormat = function(nn) {
                if (!nn)
                    return "";
                return nn.substring(0, 4) + '-' + nn.substring(4, 6) + '-' + nn.substring(6, 8);
            }
            var self = this;
            self.getcstm(customId);
            self.model.set({
                id : id
            });
            self.model.fetch({
                success : function(cols, resp, options) {
                    urlType = 'edit';
                    var info = resp.msg.item;
                    info.startDate = timeFormat(info.startDate);
                    info.sttlDate = timeFormat(info.sttlDate);
                    for (var key in info) {
                        $('#' + key).val(info[key]);
                    }
                    $('.selectpicker').selectpicker({
                        style : 'btn-default',
                        size : 4,
                    });
                    $('#opptStatId').val(info.opptStatId).attr("disabled", true);
                    $('#customId').attr("disabled", true);
                    if ($("#dataSource").find("option:selected").text() == "行业会议") {//行业会议
                        $("#conferenceName").removeClass("hide");
                        $("#meeting").val(info.conferenceName);
                    }
                    $("#contactC").hide();
                    $("#customId1 .btn").addClass("disabled");
                    $("#customer").hide();
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
        } else {
            var self = this;
             self.model.clear("id");
             tips = '添加成功！';
             urlType="add"
            if (type == "custom") {
                $("#customId").val(customId).attr("disabled", true);
                if (customId == null) {
                    return false;
                } else {
                    self.findContactListByCustomerId(customId);
                }
                opportUrl = '/custom';
            };
            $("#customId").attr("title", "请选择客户名称")
            for (var i = 0,
                l = appcan.opptStat.length; i < l; i++) {
                var str = '<option value="' + (i) + '">' + appcan.opptStat[i] + '</option>'
                $("#opptStatId").append(str);
            }
            $("#opptStatId").val('0');
            $("#customer").hide();
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
            if (document.getElementById("existingContacts").checked == true) {
                document.getElementById("change").style.display = "inline-block";
                $('.hiding').css("display", "none");
            }
            $("#newContact").change(function() {
                if (document.getElementById("existingContacts").checked == true) {
                    document.getElementById("change").style.display = "inline-block";
                    $('.hiding').css("display", "none");
                } else {
                    document.getElementById("change").style.display = "none";
                    $('.hiding').css("display", "block");
                }
            });
            $("#existingContacts").change(function() {
                if (document.getElementById("existingContacts").checked == true) {
                    document.getElementById("change").style.display = "inline-block";
                    $('.hiding').css("display", "none");
                } else {
                    document.getElementById("change").style.display = "none";
                    $('.hiding').css("display", "block");
                }
            });
            self.getcstm(customId);
            $("#selectContact").hide();
            $('#customId').change(function() {
                var customId = $('#customId option:selected').val();
                if (customId == null) {
                    return false;
                } else {
                    self.findContactListByCustomerId(customId);
                }

            });
        }

    },
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
                        $("#customId").append(str);
                    }
                    $('.selectpicker').selectpicker({
                        style : 'btn-default',
                        size : 4,
                    });
                }
            },
            error : function(cols, resp, options) {

            },
            type : 1
        });
    },
    findContactListByCustomerId : function(customId) {
        this.model.fetch({
            success : function(cols, resp, options) {
                var $selectContact = $('#selectContact');
                var list = resp.msg.list;
                var html = '';
                for (var i = 0; i < list.length; i++) {
                    html += '<option value="' + list[i].id + '">' + list[i].contactName + '</option>';
                }
                $selectContact.html('');
                $selectContact.append(html);
                $selectContact.show();
                $("#selectContact").select2({
                    placeholder : "请选择联系人",
                    allowClear : true,
                    tags : true
                });
            },
            error : function(cols, resp, options) {

            },
            type : 2,
            customId : customId
        });

    },
    addOpport : function() {
        var opptTtl = $.trim($("#opptTtl").val());
        if (opptTtl === '') {
            $.danger("机会名称不能为空");
            $("#opptTtl").parent().addClass("has-error");
            $("#opptTtl").focus();
            return;
        } else if (!patrn.exec(opptTtl)) {
            $.danger("机会名称格式有误");
            $("#opptTtl").parent().addClass("has-error");
            $("#opptTtl").focus();
            return;
        }else{
             $("#opptTtl").parent().removeClass("has-error");
        }
        var opptStatId = $.trim($("#opptStatId").val());
        var vndtAmt = $.trim($("#vndtAmt").val());
        if (vndtAmt == '') {
            $.danger("预计金额不能为空");
            $("#vndtAmt").parent().addClass("has-error");
            $("#vndtAmt").focus();
            return;
        }else if(vndtAmt<0){
             $.danger("预计金额不能为负数!");
            $("#vndtAmt").parent().addClass("has-error");
            $("#vndtAmt").focus();
            return;
        }else{
            $("#vndtAmt").parent().removeClass("has-error");
        }
        //判断日期的
        var startDate = $.trim($("#startDate").val().replace(/-/g, ''));
        var sttlDate = $.trim($("#sttlDate").val().replace(/-/g, ''));
        if (sttlDate == '') {
            $.danger("请选择预计签单日期!");
            $("#sttlDate").parent().addClass("has-error");
            //$("#sttlDate").focus();
            return;
        } else if (sttlDate < startDate) {
            $.danger("发现日期必须小于预计签单日期!");
            $("#startDate").parent().addClass("has-error");
            $("#sttlDate").parent().addClass("has-error");
            $("#startDate").focus();
            return;
        }else{
            $("#startDate").parent().removeClass("has-error");
            $("#sttlDate").parent().removeClass("has-error");
        }

        var customId = $.trim($("#customId").val());
        if (customId =='') {
            $.danger("请选择所属客户");
            $("#customId").focus();
            return;
        }
        var dataSource = $.trim($("#dataSource").val());
        var conferenceName = "";
        if ($("#dataSource").find("option:selected").text() == "行业会议") {
            conferenceName = $.trim($("#meeting").val());
            if (conferenceName == '') {
                $.danger("请填写会议名称");
                $("#meeting").parent().addClass("has-error");
                $("#meeting").focus();
                return;
            }else{
                 $("#meeting").parent().removeClass("has-error"); 
            }
        }
        var productType = $.trim($("#productType").val());
        var remark = $.trim($("#remark").val());
        //判断编辑还是添加
        if (urlType == 'add') {
            var temp = document.getElementsByName("optionsRadiosinline");
            var intHot = "";
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].checked)
                    var intHot = temp[i].value;

            }
            if (intHot == "0") {
                var contactName = $.trim($("#contactName").val());
                if (contactName === '') {
                    $.danger("姓名不能为空");
                    $("#contactName").parent().addClass("has-error");
                    $("#contactName").focus();
                    return;
                } else if (!patrn.exec(contactName)) {
                    $.danger("姓名为汉字或者字母,字数在40个以内!");
                    $("#contactName").parent().addClass("has-error");
                    $("#contactName").focus();
                    return;
                }else{
                     $("#contactName").parent().removeClass("has-error");
                }
                var mobile = $.trim($("#mobile").val());
                var teleNo = $.trim($("#teleNo").val());
                if (mobile === '' && teleNo === '') {
                    $.danger("手机和座机至少填写一个");
                    $("#mobile").parent().addClass("has-error");
                    $("#mobile").focus();
                    $("#teleNo").parent().addClass("has-error");
                    $("#teleNo").focus();
                    return;
                } else if (!mob.test(mobile) && !tele.test(teleNo)) {
                    $.danger("手机号或者座机号格式有误!");
                    $("#mobile").parent().addClass("has-error");
                    $("#mobile").focus();
                    $("#teleNo").parent().addClass("has-error");
                    $("#teleNo").focus();
                    return;
                }else{
                  $("#teleNo").parent().removeClass("has-error");  
                  $("#mobile").parent().removeClass("has-error");
                }
                var contactTypeId = $.trim($("#contactTypeId").val());
                if (contactTypeId === '00') {
                    $.danger("请选择角色关系");
                    $("#contactTypeId").parent().addClass("has-error");
                    $("#contactTypeId").focus();
                    return;
                }else{
                    $("#contactTypeId").parent().removeClass("has-error"); 
                }
            } else {
                contactName = '';
                mobile = '';
                teleNo = '';
                contactTypeId = '00';
                var strText = $("#selectContact").find("option:selected").text();
                if (strText == '') {
                    $.danger("请选择已有联系人!");
                    return;
                } else {
                    var contactId = $("#selectContact").val();
                    contactId = contactId.join();
                }
            };
        };
        var data = {
            "opptTtl" : opptTtl,
            "opptStatId" : opptStatId,
            "vndtAmt" : vndtAmt,
            "startDate" : startDate,
            "sttlDate" : sttlDate,
            "customId" : customId,
            "dataSource" : dataSource,
            "productType" : productType,
            "remark" : remark,
            "conferenceName" : conferenceName
        };
        if (intHot == "0") {
            data = {
                "opptTtl" : opptTtl,
                "opptStatId" : opptStatId,
                "vndtAmt" : vndtAmt,
                "startDate" : startDate,
                "sttlDate" : sttlDate,
                "customId" : customId,
                "dataSource" : dataSource,
                "productType" : productType,
                "remark" : remark,
                "contactName" : contactName,
                "mobile" : mobile,
                "teleNo" : teleNo,
                "contactTypeId" : contactTypeId,
                "conferenceName" : conferenceName
            };
        } else {
            data = {
                "opptTtl" : opptTtl,
                "opptStatId" : opptStatId,
                "vndtAmt" : vndtAmt,
                "startDate" : startDate,
                "sttlDate" : sttlDate,
                "customId" : customId,
                "dataSource" : dataSource,
                "productType" : productType,
                "remark" : remark,
                "contactId" : contactId,
                "conferenceName" : conferenceName
            };
        };
        if (addtype === "edit") {
            this.model.set({
                id : objid
            });
            this.model.save({
                data : data
            }, {
                success : function(cols, resp, options) {
                        $.success(tips, null, null, function() {
                            history.back();
                        });
                   
                },
                error : function(cols, resp, options) {
                    if (resp.status == "001") {
                        $.warning(resp.msg.message);
                    } else if (resp.status == "002") {
                        $.warning(resp.msg.message);
                    }
                    ;
                },
            });

        } else {
            this.model.save({
                data : data
            }, {
                success : function(cols, resp, options) {
                        $.success(tips, null, null, function() {
                           history.back();
                        });
                    
                },
                error : function(cols, resp, options) {
                    if (resp.status == "A001") {
                        $.warning(resp.msg.message);
                    } else if (resp.status == "E001") {
                        $.warning(resp.msg.message);
                    }
                    ;
                },
            });
        }

    }
});

var addOpportInstance = new addOpportdetailView();
