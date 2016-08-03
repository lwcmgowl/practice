//加载并初始化模板对象
var culeAddTemplate = loadTemplate("assets/templates/staff/culeAdd.html");
var id = "";
var urlTYpe = "add";
var sucMsg = "创建成功！";
//列表容器VIEW
var culeAddlView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#main_content',
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    model : new culePageModel(),
    template : culeAddTemplate,
    load : function(direction) {
        var self = this;
        self.render();

        //var req = new Request();
        id = direction
        $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#myself").html(appcanUserInfo.userName);
        selectOpt("profession", appcan.industrycategory);
        //行业类别
        selectOpt("dataSource", appcan.clueSources);
        //数据来源
        selectOpt("productType", appcan.producttype);
        //产品类型
        selectOpt("level", appcan.customerlevel);
        //客户级别

        selectOpt("csmNature", appcan.customerproperty);
        //客户性质
        selectOpt("csmScale", appcan.customersize);
        //客户规模
        $("#s_province").html('<option value="00">选择所属省份</option>' + getOption(appcan.province))//加载所属大区省市选项
        // selectOpt("clueState",appcan.clueState);//线索状态
        for (var k = 0; k < appcan.clueState.length; k++) {
            var str = '<option value="' + k + '">' + appcan.clueState[k] + '</option>';
            if (k == 2) {
            } else {
                $("#clueState").append(str);
            }
        }
        // if(urlTYpe =="add"){
        // $("#closeReason1").css("display","none");
        // }
        if (clueState == "不合格") {
        } else {
            $("#closeReason1").hide();
        }
        selectOpt("closeReason", appcan.closeReason);
        //不合格原因
        if (id) {
            $("#title").html("编辑销售线索");
            $("#clueState").attr('disabled', true);
            //编辑的时候线索状态不可点击
            $("#closeReason").attr('disabled', true);
            urlTYpe = "edit";
            sucMsg = "编辑成功！";
            getDetail();
        }
        $('#dataSource').change(function() {
            var meeting = $('#dataSource option:selected').text();
            if (meeting === "行业会议") {
                $("#conferenceName").css("display", "block");
            } else {
                $("#conferenceName").css("display", "none");
            }
        })
    },
    addClue : function() {
        var loginId = appcanUserInfo.userId;
        var companyName = $("#companyName").val();
        if (!isDefine(companyName)) {
            $.danger("请输入客户名称");
            $("#companyName").parent().addClass("has-error");
            $("#companyName").focus();
            return;
        } else if (!reg1.test(companyName)) {
            $.danger("客户名称格式有误");
            $("#companyName").parent().addClass("has-error");
            $("#companyName").focus();
            return;
        }
        var conferenceName = "";
        if ($("#dataSource").find("option:selected").text() == "行业会议") {
            conferenceName = $.trim($("#meeting").val());
            if (conferenceName == '') {
                $.danger("请填写会议名称");
                $("#meeting").parent().addClass("has-error");
                $("#meeting").focus();
                return;
            }
        }
        var contactName = $("#contactName").val();
        if (contactName === '') {
            $.danger("姓名不能为空");
            $("#contactName").parent().addClass("has-error");
            $("#contactName").focus();
            return;
        } else if (!patrn.exec(contactName)) {
            $.danger("姓名格式有误");
            $("#contactName").parent().addClass("has-error");
            $("#contactName").focus();
            return;
        }
        var mobile = $("#mobile").val();
        var teleNo = $("#teleNo").val();
        if (mobile === '' && teleNo === '') {
            $.danger("请填写手机号或者座机号");
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
        }
        var QQ = $("#QQ").val();
        var weChat = $("#weChat").val();
        var email = $("#email").val();
        if (email === '') {

        } else if (!pattern.test(email)) {
            $.danger("电子邮件格式不正确!");
            $("#email").parent().addClass("has-error");
            $("#email").focus();
            return;
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
            return;
        }
        var profession = $("#profession").val();
        if (profession == 00) {
            $("#profession").parent().addClass("has-error");
            $("#profession").focus();
            $.danger("请选择行业类别");
            return;
        }
        var sprovince = $("#s_province").val();
        if (sprovince == '00') {
            $.danger("请选择所属省份");
            $("#s_province").parent().addClass("has-error");
            $("#s_province").focus();
            return;
        }

        // if(!isDefine($("#s_province").val()) || sprovince.indexOf("选择")>0){
        // $.danger("请选择相关省市");
        // return;
        // }

        var address = $("#address").val();
        var postcode = $("#postcode").val();
        if (postcode === '') {

        } else if (!re2.test(postcode)) {
            $.danger("邮编格式不正确!");
            $("#postcode").parent().addClass("has-error");
            $("#postcode").focus();
            return;
        }
        var website = $("#website").val();
        if (website === '') {

        } else if (!Expression.test(website)) {
            $.danger("官网格式不正确!");
            $("#website").parent().addClass("has-error");
            $("#website").focus();
            return;
        }
        var fax = $("#fax").val();
        if (fax === '') {

        } else if (!patternfax.test(fax)) {
            $.danger("公司传真格式有误!例如:010-xxxxxxx");
            $("#fax").parent().addClass("has-error");
            $("#fax").focus();
            return;
        }

        var remark = $("#remark").val();
        var clueState = $("#clueState").val();
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
            "conferenceName" : conferenceName
        };
        if (id)
            data = $.extend({
                "id" : id
            }, data);
        this.model.fetch({
            type : 5,
            url : urlIp + "/clue/" + urlTYpe,
            param : data,
            success : function(cols, resp, options) {
                $.success(sucMsg, null, null, function() {
                    history.back();
                });
            },
            error : function(cols, resp, options) {

            }
        });

    },
    pagecountchange : function(e) {
        console.log("select ", e);
    }
});

var culeAddlViewInstance = new culeAddlView();
