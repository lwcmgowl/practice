//加载并初始化模板对象
var addMarketTemplate = loadTemplate("assets/templates/staff/addMarket1.html");

//列表容器VIEW
var addMarketView = Backbone.View.extend({
    initialize : function() {
        
    },
    el : '#pending',
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
        'click #addInfo' : "addMarket"
        },
    render : function() {
        this.$el.empty();
        var el =  $(this.template());
        this.$el.append(el);
    },
    model : new addMarketModel(),
    template : addMarketTemplate,
    load : function(direction) {
       var self=this;
       this.render();
       $("#_region").html("<option value=''>选择所属团队</option>"+getRegionOption());
        var req = new Request();
        id = req.getParameter('id');
         $("#s_province").html('<option value="00">选择所属省份</option>'+ getOption(appcan.province))
        for(var n=0;n<appcan.clueSources.length;n++){
                        var str = '<option value="'+ n +'">'+ appcan.clueSources[n] +'</option>';
                           $("#dataSource").append(str); 
                    }
        selectOpt("productType",appcan.producttype);
        selectOpt("Customerlevel",appcan.customerlevel);
        selectOpt("csmNature",appcan.customerproperty);
        selectOpt("csmScale",appcan.customersize);
       
    },
    addMarket:function(){
        var self = this;
        var loginId = appcanUserInfo.userId;
                        var companyName = $("#_companyName").val();
                        if (!isDefine(companyName)) {
                            $.danger("请输入客户名称!");
                            $("#_companyName").parent().addClass("has-error");
                            $("#_companyName").focus();
                            return false;
                        } else if (!reg1.test(companyName)) {
                            $.danger("客户名称格式有误!");
                            $("#_companyName").parent().addClass("has-error");
                            $("#_companyName").focus();
                            return false;
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
                        }
                        var department = $("#department").val();
                        var post = $("#post").val();
                        var dataSource = $("#dataSource").val() != "00" ? $("#dataSource").val() : "";
                        var conferenceName = "";
                        if ($("#dataSource").find("option:selected").text() == "行业会议") {
                            conferenceName = $.trim($("#meetingName").val());
                            if (conferenceName == '') {
                                $.danger("请填写会议名称!");
                                $("#meeting").parent().addClass("has-error");
                                $("#meeting").focus();
                                 return false;
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
                        }
                        var profession = $("#_profession").val();
                        if (!isDefine(profession) || profession == "00") {
                            $.danger("请选择行业类别");
                            $("#_profession").parent().addClass("has-error");
                            $("#_profession").focus();
                            return false;
                        }
                        var sprovince = $("#s_province").val();
                        if (sprovince == '00') {
                            $.danger("请选择所属省份");
                            $("#s_province").parent().addClass("has-error");
                            $("#s_province").focus();
                            return false;
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
                        }
                        var website = $("#website").val();
                        if (website === '') {
                        } else if (!Expression.test(website)) {
                            $.danger("官网格式不正确!");
                            $("#website").parent().addClass("has-error");
                            $("#website").focus();
                             return false;
                        }
                        var fax = $("#fax").val();
                        if (fax === '') {

                        } else if (!patternfax.test(fax)) {
                            $.danger("公司传真格式有误!例如:010-xxxxxxx");
                            $("#fax").parent().addClass("has-error");
                            $("#fax").focus();
                            return false;
                        }
                        var remark = $("#remark").val();
        self.model.save({
                            "companyName":companyName,
                            "contactName":contactName,
                            "mobile":mobile,
                            "teleNo":teleNo,
                            "qq":QQ,
                            "weChat":weChat,
                            "email":email,
                            "department":department,
                            "post":post,
                            "dataSource":dataSource,
                            "conferenceName":conferenceName,
                            "productType":productType,
                            "level":level,
                            "profession":profession,
                            "csmNature":csmNature,
                            "csmScale":csmScale,
                            "region":region,
                            "province":sprovince,
                            "address":address,
                            "postcode":postcode,
                            "website":website,
                            "fax":fax,
                            "remark":remark,
                            "dataType":"0",
                            "marketUserId":loginId,//
                            "submitState":"0"
            
           })
    }
});

var addMarketPendingInstance = new addMarketView();
