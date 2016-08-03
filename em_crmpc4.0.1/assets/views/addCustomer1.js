//加载并初始化模板对象
var addMarketTemplate = loadTemplate("assets/templates/staff/addCustomer.html");
var addtype = '';
var tips = '';
var objid = '';
//列表容器VIEW
var addMarketView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#main_content',
    bindings : {
    },
    events : {
        'submit' : 'addMarket',
        'click #addinfo' : function() {
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
    load : function(id) {
        this.render();
        $("#level").html("<option value=''>选择客户级别</option>" + getJOption(appcan.customerlevel));
        $("#csmNature").html("<option value=''>选择客户性质</option>" + getJOption(appcan.customerproperty));
        $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#csmStatId").html("<option value=''>选择客户状态</option>" + getJOption(appcan.csmStat));
        $("#csmScale").html("<option value=''>选择客户规模</option>" + getJOption(appcan.customersize));
        $("#s_province").html('<option value="00">选择所属省份</option>' + getOptions(appcan.province))
        if (id && id != "null") {
            objid = id;
            var self = this;
            addtype = "edit"
            tips = '编辑成功！';
            $("#title").html('编辑客户');
            $("#csmName").blur(function() {
                if (addtype == "add" || (addtype == "edit" && oldName != $.trim($("#csmName").val())))
                    if ($.trim($("#csmName").val()) != '') {
                        self.testName($.trim($("#csmName").val()), function(sta) {
                            if (parseInt(sta) != 0) {
                                $.danger("客户已存在");
                            }
                            single = sta;
                        });

                    }
            });
            self.model.fetch({
                success : function(cols, resp, options) {
                    var info = resp.msg.item;
                    if(info!=undefined){
                    for (var i in info) {
                        var ele = $('#' + i);
                        ele.val(info[i]);
                    }
                    $("#csmStatId").val(info.csmStatId).attr("disabled", true);
                    $("#_region").val(info.region);
                    getInd();
                    $("#s_province").val(info.province);
                    $("#profession").val(info.profession);
                    oldName = info.csmName;
                    self.getcstm(info.upperCompanyName, function(str) {
                        $("#upperCompany").html("<option value=''>选择上级公司</option>" + str);
                        $('.selectpicker').selectpicker({
                            style : 'btn-default',
                            size : 4,
                        });
                      });
                    }
                },
                error : function(cols, resp, options) {
                    if (resp.status == "L001") {
                        $.warning("系统错误");
                    } else {
                        $.warning(resp);
                    }

                },
                type : 1,
                id : id
            });
        } else {
            var self = this;
            // self.model.clear("id");
            tips = '添加成功！';
            addtype = "add"
            $("#csmName").blur(function() {
                if (addtype == "add" || (addtype == "edit" && oldName != $.trim($("#csmName").val())))
                    if ($.trim($("#csmName").val()) != '') {
                        self.testName($.trim($("#csmName").val()), function(sta) {
                            if (parseInt(sta) != 0) {
                                $.danger("客户已存在");
                            }
                            single = sta;
                        });

                    }
            });
            $("#csmStatId").val("0").attr("disabled", true)
            self.getcstm(null, function(str) {
                $("#upperCompany").html(str);
                 $('.selectpicker').selectpicker({
                        style : 'btn-default',
                        size : 4,
                    });
            });
        }
    },
    //获取上级公司
    getcstm : function(upperCompanyName, cb) {
        var self = this;
        var ucompanyHtml = '<option value="">请选择上级公司</option>';
        //$("#upperCompany").attr("title", "请选择上级公司")
        self.model.fetch({
            success : function(cols, resp, options) {
                var arr = resp.msg.list;
                if (arr != undefined) {
                    for (var i = 0; i < arr.length; i++) {
                        if (upperCompanyName && (upperCompanyName == arr[i]["csmName"])) {
                            ucompanyHtml += "<option selected=true value='" + arr[i]["id"] + "'>" + arr[i]["csmName"] + "</option>";
                        } else {
                            ucompanyHtml += "<option value='" + arr[i]["id"] + "'>" + arr[i]["csmName"] + "</option>";
                        }
                    }
                    cb(ucompanyHtml);
                }
            },
            error : function(cols, resp, options) {

            }
        });

    },
    testName : function(name, cb) {
        var data = {
            "csmName" : name
        };
        ajax({
            url : "/custom/viewcsmcheck",
            data : data,
            success : function(data) {
                single = data.msg.message;
                cb(single);
            }
        });
    },
    addMarket : function() {
        var csmName = $.trim($("#csmName").val());
        if (csmName === '') {
            $.danger("客户名称不能为空");
            $("#csmName").parent().addClass("has-error");
            $("#csmName").focus();
            return;
        }else{
            $("#csmName").parent().removeClass("has-error");
        }
        if (addtype == "add" || (addtype == "edit" && oldName != $.trim($("#csmName").val()))) {
            if (parseInt(single) != 0) {
                $.danger("该客户名称已存在");
                $("#csmName").parent().addClass("has-error");
                $("#csmName").focus();
                return;
            }
        }else{
            $("#csmName").parent().removeClass("has-error"); 
        }
        var re = /^[0-9a-zA-Z\u4E00-\u9FA5\(\)（）]*$/g;
        if (!re.test(csmName)) {
            $.danger("客户名称只能包含数字字母汉字括号");
            $("#csmName").parent().addClass("has-error");
            $("#csmName").focus();
            return;
        }else{
            $("#csmName").parent().removeClass("has-error");
        }
        var csmStatId = $("#csmStatId").val();
        var upperCompany = $("#upperCompany").val();
        var post = $("#post").val();
        var level = $("#level").val();
        var region = $("#_region").val();
        if (region === '') {
            $.danger("请选择所属团队");
            $("#region").parent().addClass("has-error");
            $("#region").focus();
            return;
        }else{
           $("#region").parent().removeClass("has-error"); 
        }
        var profession = $("#profession").val();
        if (profession == 00) {
            $.danger("请选择行业类别");
            $("#profession").parent().addClass("has-error");
            $("#profession").focus();
            return;
        }else{
           $("#profession").parent().removeClass("has-error"); 
        }
        var sprovince = $("#s_province").val();
        if (sprovince == '00') {
            $.danger("请选择所属省份");
            $("#s_province").parent().addClass("has-error");
            $("#s_province").focus();
            return;
        }else{
             $("#s_province").parent().removeClass("has-error");
        }
        var csmNature = $("#csmNature").val();
        var csmScale = $("#csmScale").val();

        var address = $.trim($("#address").val());
        var postcode = $("#postcode").val();
        if (postcode === '') {

        } else if (!re2.test(postcode)) {
            $.danger("邮编格式不正确!");
            $("#postcode").parent().addClass("has-error");
            $("#postcode").focus();
            return;
        }else{
            $("#postcode").parent().removeClass("has-error"); 
        }
        var website = $("#website").val();
        if (website === '') {

        } else if (!Expression.test(website)) {
            $.danger("官网格式不正确!");
            $("#website").parent().addClass("has-error");
            $("#website").focus();
            return;
        }else{
           $("#website").parent().removeClass("has-error");  
        }
        var fax = $("#fax").val();
        if (fax === '') {

        } else if (!patternfax.test(fax)) {
            $.danger("公司传真格式有误!例如:010-xxxxxxx");
            $("#fax").parent().addClass("has-error");
            $("#fax").focus();
            return;
        }else{
          $("#fax").parent().removeClass("has-error");  
        }
        var remark = $("#remark").val();
        var data = {
            // "id" : id,
            "csmName" : csmName,
            "csmStatId" : csmStatId,
            "upperCompany" : upperCompany,
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
            "remark" : remark
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
                        appRouter.navigate("loadMyResponsCustomerList", {
                            trigger : true
                        });
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
            this.model.save({
                data : data
            }, {
                success : function(cols, resp, options) {
                    $.success(tips, null, null, function() {
                        appRouter.navigate("loadMyResponsCustomerList", {
                            trigger : true
                        });
                    });
                },
                error : function(cols, resp, options) {
                    if (resp.status == "001") {
                        $.warning(resp.msg.message);
                    } else if (resp.status == "002") {
                        $.warning(resp.msg.message);
                    };
                },
            });
        };
    }
});

var addMarketInstance = new addMarketView();
