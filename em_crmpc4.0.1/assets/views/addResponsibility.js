//加载并初始化模板对象
var addMarketTemplate = loadTemplate("assets/templates/staff/addMarket.html");
var addtype = '';
var tips = '';
var objid = '';
//列表容器VIEW
var addMarketView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#contentdiv',
    bindings : {
        "#clueSource" : {
            observe : 'clueSource'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#region" : {
            observe : 'region'
        },
        "#province" : {
            observe : 'province'
        },
        "#companyName" : {
            observe : 'companyName'
        },
        "#principal" : {
            observe : 'principal'
        }

    },
    events : {
        'click #addInfo' : function() {
            this.addMyres();
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
        addtype="";
        if (id && id != "null") {
            objid = id;
            var self = this;
            addtype = "edit"
            tips = '编辑成功！';
            $("#title").html('编辑营销数据');
            $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
            $("#s_province").html('<option value="00">选择所属省份</option>' + getOption(appcan.province))
            for (var n = 0; n < appcan.clueSources.length; n++) {
                var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
                $("#dataSource").append(str);
            }
            selectOpt("productType", appcan.producttype);
            selectOpt("Customerlevel", appcan.customerlevel);
            selectOpt("csmNature", appcan.customerproperty);
            selectOpt("csmScale", appcan.customersize);
            var self = this;
            self.model.set({
                id : id
            });
            self.model.fetch({
                success : function(cols, resp, options) {
                    var detail = resp.msg.item;
                    $("#_companyName").val(detail.companyName);
                    $("#contactName").val(detail.contactName);
                    $("#mobile").val(detail.mobile);
                    $("#teleNo").val(detail.teleNo);
                    $("#QQ").val(detail.qq);
                    $("#weChat").val(detail.weChat);
                    $("#email").val(detail.email);
                    $("#department").val(detail.department);
                    $("#post").val(detail.post);
                    if (detail.dataSource) {
                        $("#dataSource").val(detail.dataSource);
                    };
                    if ($("#dataSource").find("option:selected").text() == "行业会议") {
                        $("#meeting").css("display", "block");
                        $("#meetingName").val(detail.conferenceName);
                    }
                    if (detail.productType)
                        $("#productType").val(detail.productType);
                    if (detail.level)
                        $("#Customerlevel").val(detail.level);
                    if (detail.csmNature)
                        $("#csmNature").val(detail.csmNature);
                    if (detail.csmScale)
                        $("#csmScale").val(detail.csmScale);
                    if (detail.region) {
                        $("#_region").val(detail.region);
                        getInd();
                    }
                    if (detail.profession)
                        $("#_profession").val(detail.profession);
                    if (detail.province)
                        $("#s_province").val(detail.province);
                    $("#address").val(detail.address);
                    $("#postcode").val(detail.postcode);
                    $("#website").val(detail.website);
                    $("#fax").val(detail.fax);
                    $("#remark").html(detail.remark);
                },
                error : function(cols, resp, options) {
                    if (resp == "L001") {
                        $.warning("当前用户登录超时，请重新登录！");
                        window.location = 'login.html';
                    } else {
                        $.warning(resp);
                    }

                },
            });
        } else {
            var self=this;
            tips = '添加成功！';
            $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
            $("#s_province").html('<option value="00">选择所属省份</option>' + getOption(appcan.province))
            for (var n = 0; n < appcan.clueSources.length; n++) {
                var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
                $("#dataSource").append(str);
            }
            selectOpt("productType", appcan.producttype);
            selectOpt("Customerlevel", appcan.customerlevel);
            selectOpt("csmNature", appcan.customerproperty);
            selectOpt("csmScale", appcan.customersize);
        }

    },
    addMyres : function() {
        var loginId = appcanUserInfo.userId;
        var companyNames = $("#_companyName").val();
        if (!isDefine(companyNames)) {
            $.danger("请输入客户名称!");
            $("#_companyName").parent().addClass("has-error");
            $("#_companyName").focus();
            return false;
        } else if (!reg1.test(companyNames)) {
            $.danger("客户名称格式有误!");
            $("#_companyName").parent().addClass("has-error");
            $("#_companyName").focus();
            return false;
        }else{
            $("#_companyName").parent().removeClass("has-error"); 
        }
        var contactName = $("#contactName").val();
        if (!isDefine(contactName)) {
            $.danger("请输入姓名!");
            $("#contactName").parent().addClass("has-error");
            $("#contactName").focus();
            return false;
        } else if (!patrn.exec(contactName)) {
            $.danger("姓名格式有误!");
            $("#contactName").parent().addClass("has-error");
            $("#contactName").focus();
            return false;
        }else{
             $("#contactName").parent().removeClass("has-error");
        }
        var mobile = $.trim($("#mobile").val());
        var teleNo = $.trim($("#teleNo").val());
        if (mobile === '' && teleNo === '') {
            $.danger("请填写手机号或者座机号!");
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
        }else{
            $("#mobile").parent().removeClass("has-error");
            $("#teleNo").parent().removeClass("has-error");
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
        }else{
            $("#email").parent().removeClass("has-error"); 
        }
        var department = $("#department").val();
        var post = $("#post").val();
        var dataSource = $("#dataSource").val() != "00" ? $("#dataSource").val() : "";
        var conferenceName = "";
        if ($("#dataSource").find("option:selected").text() == "行业会议") {
            conferenceName = $.trim($("#meetingName").val());
            if (conferenceName == '') {
                $.danger("请填写会议名称!");
                $("#meetingName").parent().addClass("has-error");
                $("#meetingName").focus();
                return false;
            }else{
                 $("#meetingName").parent().removeClass("has-error");
            }
        }
        var csmNature = $("#csmNature").val() != "00" ? $("#csmNature").val() : "";
        var csmScale = $("#csmScale").val() != "00" ? $("#csmScale").val() : "";
        var region = $("#_region").val();
        if (!isDefine(region) || region.indexOf("选择") > 0) {
            $.danger("请选择所属团队");
            $("#_region").parent().addClass("has-error");
            $("#_region").focus();
            return false;
        }else{
             $("#_region").parent().removeClass("has-error");
        }
        var profession = $("#_profession").val();
        if (!isDefine(profession) || profession == "00") {
            $.danger("请选择行业类别");
            $("#_profession").parent().addClass("has-error");
            $("#_profession").focus();
            return false;
        }else{
            $("#_profession").parent().removeClass("has-error"); 
        }
        var sprovince = $("#s_province").val();
        if (sprovince == '00') {
            $.danger("请选择所属省份");
            $("#s_province").parent().addClass("has-error");
            $("#s_province").focus();
            return false;
        }else{
             $("#s_province").parent().removeClass("has-error");
        }
        var productType = $("#productType").val() != "00" ? $("#productType").val() : "";
        var level = $("#Customerlevel").val() != "00" ? $("#Customerlevel").val() : "";
        var address = $("#address").val();
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
            "marketUserId" : loginId, //
            "submitState" : "0"
        };
        if (addtype == "edit") {
            // $("#loading").show();
            this.model.set({
                id : objid
            });
            this.model.save({
                data : data
            }, {
                success : function(cols, resp, options) {
                    // $("#loading").hide();
                    $.success(tips, null, null, function() {
                        appRouter.navigate("responsibility", {
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
            // $("#loading").show();
            this.model.save({
                data : data
            }, {
                success : function(cols, resp, options) {
                    $.success(tips, null, null, function() {
                        // $("#loading").hide();
                        appRouter.navigate("responsibility", {
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
        }
    }
});

var addMarketInstance = new addMarketView();
