//加载并初始化模板对象
var addMarketTemplate = loadTemplate("assets/templates/staff/addContact.html");
var addtype = '';
var tips = '';
var objid='';
var urlmaps='';
//列表容器VIEW
var addMarketView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#main_content',
    bindings : {
    },
    events : {
       'submit' : 'addMarket',
        'click #addInfo' : function() {
            this.addMarket();
        }
    },
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    model : new addMarketModel(),
    template : addMarketTemplate,
    load : function(id, customId,type) {
        addtype="";
        this.render();
        $("#company").hide();
        urlmap="";
        if (id && id != "null") {
            objid=id;
            if(type=="custom"){
                urlmaps='/custom';
            };
            var self = this;
            addtype = "edit"
            tips = '编辑成功！';
            $("#title").html('编辑联系人');
            $("#s_province").html('<option value="">选择所属省份</option>' + getOptions(appcan.province))
            for (var i in appcan.sex) {
                var str = '<option value="' + (i) + '">' + appcan.sex[i] + '</option>'
                $("#sexId").append(str);
            }
            for (var i in appcan.contactType) {
                var str = '<option value="' + (i) + '">' + appcan.contactType[i] + '</option>'
                $("#contactTypeId").append(str);
            }
            $('#birthDay').datepicker({
                format : 'yyyy-mm-dd',
                todayHighlight : true,
                weekStart : 0,
                autoclose : true
            });
            self.model.fetch({
                success : function(cols, resp, options) {
                    var info = resp.msg.item;
                    if (info != undefined) {
                        for (var i in info) {
                            var ele = $('#' + i);
                            if (ele[0]) {
                                ele.val(info[i]);
                            }
                        }
                        $("#customId").attr("disabled", true);
                        $("#companys .btn").addClass("disabled");
                        $("#sexId").val(info.sex);
                        $("#s_province").val(info.province);
                    }
                },
                error : function(cols, resp, options) {
                    if (resp.status == "L001") {
                        $.warning("当前用户登录超时，请重新登录！");
                        window.location = 'login.html';
                    } else {
                        $.danger(resp.msg.message);
                    }

                },
                types : 1,
                id : id
            });
            self.getcstm(customId);
        } else {
            var self = this;
           // self.model.clear("id");
            tips = '添加成功！';
            if(type=="custom"){
                $("#customId").val(customId).attr("disabled",true);
                urlmap='/custom';
            }
            $("#customId").attr("title", "请选择客户名称")
            $("#s_province").html('<option value="">选择所属省份</option>' + getOptions(appcan.province))
            for (var i in appcan.sex) {
                var str = '<option value="' + (i) + '">' + appcan.sex[i] + '</option>'
                $("#sexId").append(str);
            }
            for (var i in appcan.contactType) {
                var str = '<option value="' + (i) + '">' + appcan.contactType[i] + '</option>'
                $("#contactTypeId").append(str);
            }
            $('#birthDay').datepicker({
                format : 'yyyy-mm-dd',
                todayHighlight : true,
                weekStart : 0,
                autoclose : true
            });
            self.getcstm(customId);
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
            types:2
        });

    },
    addMarket : function() {
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
        var sexId = $.trim($("#sexId").val());
        var birthDay = $.trim($("#birthDay").val());
        var qq = $.trim($("#qq").val());
        var weChat = $.trim($("#weChat").val());
        var department = $.trim($("#department").val());
        var post = $.trim($("#post").val());
        var mail = $.trim($("#mail").val());
        if (mail === '') {

        } else if (!pattern.test(mail)) {
            $.danger("电子邮件格式不正确!");
            $("#email").parent().addClass("has-error");
            $("#email").focus();
            return;
        }else{
           $("#email").parent().removeClass("has-error"); 
        }
        var sprovince = $("#s_province").find("option:selected").val();
        // if (sprovince == "选择所属省份") {
            // sprovince = "00";
        // }
        var address = $.trim($("#address").val());
        var postcode = $.trim($("#postcode").val());
        var customId = $.trim($("#customId").val());
        if (customId =="") {
            $.danger("请选择客户名称");
            return;
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
        var remark = $.trim($("#remark").val());
        var data = {
            "sex" : sexId,
            "contactName" : contactName,
            "mobile" : mobile,
            "teleNo" : teleNo,
            "birthDay" : birthDay,
            "qq" : qq,
            "weChat" : weChat,
            "department" : department,
            "post" : post,
            "mail" : mail,
            "province" : sprovince,
            "address" : address,
            "postcode" : postcode,
            "contactTypeId" : contactTypeId,
            "customId" : customId,
            "remark" : remark
        };
        if (addtype === "edit") {
            this.model.set({id : objid});
          this.model.save({data : data}, {
                success : function(cols, resp, options) {
                    $.success(tips, null, null, function() {
                        history.back();
                    });
                },
               error : function(cols, resp, options) {
                    if (resp.status == "L001") {
                        $.warning("当前用户登录超时，请重新登录！");
                        window.location = 'login.html';
                    } else {
                        $.danger(resp.msg.message);
                    }

                },
            });

        } else {
            this.model.clear("id");
            this.model.save({data : data }, {
                success : function(cols, resp, options) {
                    history.back();
                    $.success(tips, null, null, function() {
                    });
                },
               error : function(cols, resp, options) {
                    if (resp.status == "L001") {
                        $.warning("当前用户登录超时，请重新登录！");
                        window.location = 'login.html';
                    } else {
                        $.danger(resp.msg.message);
                    }

                },
            });
        };
    }
});

var addMarketInstance = new addMarketView();
