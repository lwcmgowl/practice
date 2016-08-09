//列表容器VIEW
var addMarketView = Backbone.View.extend({
    initialize : function() {

    },
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
    load : function() {
        var self = this;
        var addtype ="add";
        tips = '添加成功！';
        bootbox.dialog({
            message : $("#addCustomerTemplate").html(),
            title : '添加客户',
            closeButton : true,
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                         var csmName = $.trim($("#csmName").val());
                            if (csmName === '') {
                                $.danger("客户名称不能为空");
                                $("#csmName").parent().addClass("has-error");
                                $("#csmName").focus();
                                return false;
                            }else{
                                $("#csmName").parent().removeClass("has-error");
                            }
                            if (addtype == "add" || (addtype == "edit" && oldName != $.trim($("#csmName").val()))) {
                                if (parseInt(single) != 0) {
                                    $.danger("该客户名称已存在");
                                    $("#csmName").parent().addClass("has-error");
                                    $("#csmName").focus();
                                   return false;
                                }
                            }else{
                                $("#csmName").parent().removeClass("has-error"); 
                            }
                            var re = /^[0-9a-zA-Z\u4E00-\u9FA5\(\)（）]*$/g;
                            if (!re.test(csmName)) {
                                $.danger("客户名称只能包含数字字母汉字括号");
                                $("#csmName").parent().addClass("has-error");
                                $("#csmName").focus();
                               return false;
                            }else{
                                $("#csmName").parent().removeClass("has-error");
                            }
                            var csmStatId = $("#ecsmStatId").val();
                            var upperCompany = $("#upperCompany").val();
                            var post = $("#post").val();
                            var level = $("#elevel").val();
                            var region = $("#_region").val();
                            if (region === '') {
                                $.danger("请选择所属团队");
                                $("#region").parent().addClass("has-error");
                                $("#region").focus();
                               return false;
                            }else{
                               $("#region").parent().removeClass("has-error"); 
                            }
                            var profession = $("#_profession").val();
                            if (profession =='') {
                                $.danger("请选择行业类别");
                                $("#profession").parent().addClass("has-error");
                                $("#profession").focus();
                                return false;
                            }else{
                               $("#profession").parent().removeClass("has-error"); 
                            }
                            var sprovince = $("#es_province").val();
                            if (sprovince == '') {
                                $.danger("请选择所属省份");
                                $("#s_province").parent().addClass("has-error");
                                $("#s_province").focus();
                               return false;
                            }else{
                                 $("#s_province").parent().removeClass("has-error");
                            }
                            var csmNature = $("#ecsmNature").val();
                            var csmScale = $("#ecsmScale").val();
                    
                            var address = $.trim($("#address").val());
                            var postcode = $("#postcode").val();
                            if (postcode === '') {
                    
                            } else if (!re2.test(postcode)) {
                                $.danger("邮编格式不正确!");
                                $("#postcode").parent().addClass("has-error");
                                $("#postcode").focus();
                               return false;
                            }else{
                                $("#postcode").parent().removeClass("has-error"); 
                            }
                            var website = $("#website").val();
                            if (website === '') {
                    
                            } else if (!Expression.test(website)) {
                                $.danger("官网格式不正确!");
                                $("#website").parent().addClass("has-error");
                                $("#website").focus();
                                return false;
                            }else{
                               $("#website").parent().removeClass("has-error");  
                            }
                            var fax = $("#fax").val();
                            if (fax === '') {
                    
                            } else if (!patternfax.test(fax)) {
                                $.danger("公司传真格式有误!例如:010-xxxxxxx");
                                $("#fax").parent().addClass("has-error");
                                $("#fax").focus();
                                return false;
                            }else{
                              $("#fax").parent().removeClass("has-error");  
                            }
                            var remark = $("#remark").val();
                            var data = {
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
                            self.model.unset("id");
                            self.model.save({
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
                $("#elevel").html("<option value=''>选择客户级别</option>" + getJOption(appcan.customerlevel));
                $("#ecsmNature").html("<option value=''>选择客户性质</option>" + getJOption(appcan.customerproperty));
                $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
                $("#ecsmStatId").html("<option value=''>选择客户状态</option>" + getJOption(appcan.csmStat));
                $("#ecsmScale").html("<option value=''>选择客户规模</option>" + getJOption(appcan.customersize));
                $("#es_province").html('<option value="">选择所属省份</option>' + getOptions(appcan.province));
                $("#ecsmStatId").val("0").attr("disabled", true);
                self.getcstm(null, function(str) {
                $("#upperCompany").html(str);
                 $('.selectpicker').selectpicker({
                        style : 'btn-default',
                        size : 4,
                    });
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
            });   
            }
        });
       
    },
    //获取上级公司
    getcstm : function(upperCompanyName, cb) {
        var self = this;
        var ucompanyHtml = '<option value="">请选择上级公司</option>';
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

var addCustomerInstance = new addMarketView();
