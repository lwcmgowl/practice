//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/partnerInfo.html");
var picurllist = "";
//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#partnerInfo',
    collection : new BaseTableCollection(),
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        'click #add' : 'add',
        'click #import' : 'import',
        'click #expedm' : 'expedm'
    },
    model : new marketModel(),
    template : marketTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function() {
        var self = this;
        // self.render();
         // $('#myTab a[href="#partnerInfo/'+id+'"]').tab('show');
        // var html = '';
        // html += handlerRow(id);
        // $("#back").before(html);
        // $('[href="#partnerInfo"]').attr("href",'#partnerInfo/'+id+'');
        // $('[href="#edit/'+id+'"]').attr("href",'#edit/'+id+'/1');
        // $('[href="#del/'+id+'"]').attr("href",'#del/'+id+'/1')
        // $('[href="#convert/'+id+'"]').attr("href",'#convert/'+id+'/1')
        // self.load();
    },
    load : function(id) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                $("#partnerUserName").html(info.partnerUserName);
                $("#title").html(info.companyName);
                $("#companyName").html(info.companyName);
                $("#contactName").html(info.contactName);
                $("#mobile").html(info.mobile);
                $("#teleNo").html(info.teleNo);
                $("#region1").html(info.regionName);
                $("#level").html(info.level);
                $("#address").html(info.address);
                $("#postcode").html(info.postcode);
                $("#legalPerson").html(info.legalPerson);
                $("#registerFund").html(info.registerFund);
                $("#yearIncome").html(info.yearIncome);
                $("#csmScale").html(info.csmScale);
                $("#website").html(info.website);
                $("#complainTeleNo").html(info.complainTeleNo);
                $("#fax").html(info.fax);
                $("#enterpriseCode").html(info.enterpriseCode);
                $("#operation").html(info.operation);
                $("#introduce").html(info.introduce);
                $("#personConstitute").html(info.personConstitute);
                $("#caseIntroduce").html(info.caseIntroduce);
                if(attachment){
                var attachment = info.attachment;
                var piclist = attachment.split(",");
                $("#_uppictr").html("");
                for (var p in piclist) {
                    var urldownshow = picviewPath + "/" + piclist[p];
                    $("#_uppictr").append("<td><a href='" + urldownshow + "'><img src='" + urldownshow + "' width='200px'  height='200px'/></a></td>");
                   }
                }
            },
            error : function(cols, resp, options) {
                if (resp == "L001") {
                    $.danger("当前用户登录超时，请重新登录！");
                    window.location = 'login.html';
                } else {
                    $.danger(resp);
                };

            },
            type:2,
            id : id
        });

    },
    //上传图片
    preview : function(urlVal) {
        var self = this;
        //设定图片上传地址
        document.getElementById("imgForm").action = picviewPath;
        var imgUrls = urlVal;
        var attcId = imgUrls.substr(imgUrls.lastIndexOf('.')).toLowerCase();
        if (attcId == '.jpg' || attcId == '.gif' || attcId == '.png') {
            //上传 图片
            $("#imgForm").ajaxSubmit({
                dataType : 'json',
                success : function(data) {
                    var urldownshow = picviewPath + "/" + data.msg.objectId;
                    $("#uppictr").append("<td id='pic" + data.msg.objectId + "'><img src='" + urldownshow + "' width='60px'  height='60px'/><a href='#delpic/" + data.msg.objectId + "/1'>删除</a> </td>");
                    picurllist += (data.msg.objectId + ",");
                    var html = document.getElementById('uploadSpan').innerHTML;
                    document.getElementById('uploadSpan').innerHTML = html;

                },
                error : function(err) {
                    $.warning("图片上传出错，请检查图片是否过大!");
                    return;
                },
                complete : function() {

                }
            })
        } else {
            $.warning("图片格式仅支持jpeg、jpg、png,请重新选择!");
            return;
        }
    },
    delpic : function(objid) {
        var self = this;
        $("#pic" + objid).remove();
        picurllist = picurllist.replace((objid + ","), "");
    },
    exportFile : function() {
        var marketUserId = appcanUserInfo.userId;
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "followMarketing",
            "dataType" : "0",
            "profession" : $("#profession").val(),
            "region" : $("#region").val(),
            "dataSource" : $("#clueSource").val(),
            "companyName" : $.trim($("#companyName").val()),
            "marketUserId" : marketUserId,
            "province" : province
        };
        var url = "/marketing/exportClue";
        marketViewService.exportFile(data, url)
    },
    expedm : function() {
        var marketUserId = appcanUserInfo.userId;
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "followMarketingEDM",
            "dataType" : "0",
            "profession" : $("#profession").val(),
            "region" : $("#region").val(),
            "dataSource" : $("#clueSource").val(),
            "marketUserId" : marketUserId,
            "province" : province,
            "companyName" : $.trim($("#companyName").val())
        };
        var url = "/marketing/exportClue";
        marketViewService.exportFile(data, url)
    },
    delPartner : function(id) {
        var self = this;
        bootbox.dialog({
            message : $("#delTemplate").html(),
            title : "确定删除?",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        self.model.set({
                            id : id
                        });
                        self.model.destroy({
                            id : id,
                            success : function(cols, resp, options) {
                                $.success("删除成功", null, null, function() {
                                    appRouter.navigate("enterprise", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {
                                if (resp == "L001") {
                                    $.danger("当前用户登录超时，请重新登录！");
                                    window.location = 'login.html';
                                } else {
                                    $.danger(resp);
                                };
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate('partnerDetail/' + id + '', {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {

            }
        });
    },
    edit : function(id) {
        var self = this;
        bootbox.dialog({
            message : $("#enterprisePartner").html(),
            title : "编辑企业伙伴",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        var loginId = appcanUserInfo.userId;
                        var companyName = $("#_companyName").val();
                        if (!isDefine(companyName)) {
                            $.danger("请输入企业名称!");
                            $("#_companyName").parent().addClass("has-error");
                            $("#_companyName").focus();
                            return false;
                        } else if (!reg1.test(companyName)) {
                            $.danger("客户名称格式有误!");
                            $("#_companyName").parent().addClass("has-error");
                            $("#_companyName").focus();
                            return false;
                        }
                        var contactName = $("#_contactName").val();
                        if (!isDefine(contactName)) {
                            $.danger("请输入姓名!");
                            $("#_contactName").parent().addClass("has-error");
                            $("#_contactName").focus();
                            return false;
                        } else if (!patrn.exec(contactName)) {
                            $.danger("姓名格式有误!");
                            $("#_contactName").parent().addClass("has-error");
                            $("#_contactName").focus();
                            return false;
                        }
                        var mobile = $.trim($("#_mobile").val());
                        var teleNo = $.trim($("#_teleNo").val());
                        if (mobile === '' && teleNo === '') {
                            $.danger("请填写手机号或者座机号!");
                            $("#_mobile").parent().addClass("has-error");
                            $("#_mobile").focus();
                            $("#_teleNo").parent().addClass("has-error");
                            $("#_teleNo").focus();
                            return false;
                        } else if (!mob.test(mobile) && !tele.test(teleNo)) {
                            $.danger("手机号或者座机号格式有误!");
                            $("#_mobile").parent().addClass("has-error");
                            $("#_mobile").focus();
                            $("#_teleNo").parent().addClass("has-error");
                            $("#_teleNo").focus();
                            return false;
                        }
                        ;
                        var region = $("#_region").val();
                        if (!isDefine(region) || region.indexOf("选择") > 0) {
                            $.danger("请选择所属团队");
                            $("#_region").parent().addClass("has-error");
                            $("#_region").focus();
                            return false;
                        }
                        var level = $("#_level").val() != "00" ? $("#level").val() : "";
                        var address = $("#_address").val();
                        var postcode = $("#_postcode").val();
                        if (postcode === '') {
                        } else if (!re2.test(postcode)) {
                            $.danger("邮编格式不正确!");
                            $("#postcode").parent().addClass("has-error");
                            $("#postcode").focus();
                            return false;
                        }
                        //企业法人
                        var legalPerson = $("#_legalPerson").val();
                        //注册资金
                        var registerFund = $("#_registerFund").val();
                        //年度收入额
                        var yearIncome = $("#_yearIncome").val();
                        //企业规模
                        var csmScale = $("#_csmScale").val();
                        //官网
                        var website = $("#_website").val();
                        if (website === '') {
                        } else if (!Expression.test(website)) {
                            $.danger("官网格式不正确!");
                            $("#website").parent().addClass("has-error");
                            $("#website").focus();
                            return false;
                        }
                        //投诉电话
                        var complainTeleNo = $("#_complainTeleNo").val();
                        //传真电话
                        var fax = $("#_fax").val();
                        if (fax === '') {

                        } else if (!patternfax.test(fax)) {
                            $.danger("公司传真格式有误!例如:010-xxxxxxx");
                            $("#fax").parent().addClass("has-error");
                            $("#fax").focus();
                            return false;
                        }
                        //企业代码
                        var enterpriseCode = $("#_enterpriseCode").val();
                        //主营业务
                        var operation = $("#_operation").val();
                        //业务介绍
                        var introduce = $("#_introduce").val();
                        //人员组成
                        var personConstitute = $("#_personConstitute").val();
                        //相关案例
                        var caseIntroduce = $("#_caseIntroduce").val();
                        var picturelista = [];
                        var picArray = new Array();
                        picArray = picurllist.split(",");
                        for (var i = 0; i < picArray.length - 1; i++) {
                            picturelista.push(picArray[i]);
                        }
                        var attachment = picturelista.join(",");
                        var param = {
                            "companyName" : companyName,
                            "contactName" : contactName,
                            "mobile" : mobile,
                            "teleNo" : teleNo,
                            "region" : region,
                            "level" : level,
                            "address" : address,
                            "postcode" : postcode,
                            "legalPerson" : legalPerson,
                            "yearIncome" : yearIncome,
                            "registerFund" : registerFund,
                            "csmScale" : csmScale,
                            "website" : website,
                            "complainTeleNo" : complainTeleNo,
                            "fax" : fax,
                            "enterpriseCode" : enterpriseCode,
                            "operation" : operation,
                            "introduce" : introduce,
                            "personConstitute" : personConstitute,
                            "caseIntroduce" : caseIntroduce,
                            "attachment" : attachment,
                            "dataType" : "1"
                        };
                        self.model.set({
                            id : id
                        });
                        self.model.save({
                            param : param
                        }, {
                            success : function(cols, resp, options) {
                                $.success("编辑成功", null, null, function() {
                                    appRouter.navigate('partnerDetail/' + id + '', {
                                        trigger : true
                                    });
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
                            id : id
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("partnerDetail", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#_region").html("<option value=''>选择所属团队</option>" + getRegionOption());
                self.model.set({
                    id : id
                });
                self.model.fetch({
                    success : function(cols, resp, options) {
                        var info = resp.msg.item;
                        $("#_companyName").val(info.companyName);
                        $("#_contactName").val(info.contactName);
                        $("#_mobile").val(info.mobile);
                        $("#_teleNo").val(info.teleNo);
                        $("#_region").val(info.region);
                        $("#_postcode").val(info.postcode);
                        $("#_legalPerson").val(info.legalPerson);
                        $("#_registerFund").val(info.registerFund);
                        $("#_yearIncome").val(info.yearIncome);
                        $("#_csmScale").val(info.csmScale);
                        $("#_website").val(info.website);
                        $("#_complainTeleNo").val(info.complainTeleNo);
                        $("#_fax").val(info.fax);
                        $("#_enterpriseCode").val(info.enterpriseCode);
                        $("#_operation").val(info.operation);
                        $("#_introduce").val(info.introduce);
                        $("#_personConstitute").val(info.personConstitute);
                        $("#_caseIntroduce").val(info.caseIntroduce);
                        var attachment = info.attachment;
                        var piclist = attachment.split(",");
                        $("#uppictr").html("");
                        for (var p in piclist) {
                            var urldownshow = picviewPath + "/" + piclist[p];
                            //$("#uppictr").append("<td><img src='" + urldownshow + "' width='60px'  height='60px'/> </td>");
                            $("#uppictr").append("<td  id='pic" + piclist[p] + "'><img src='" + urldownshow + "' width='60px'  height='60px'/><a href='#delpic/" + piclist[p] + "/1'>删除</a> </td>");
                            picurllist += (piclist[p] + ",");
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
                    type:2,
                    id : id
                });
            }
        });
    },
    convert : function(id) {
        var self = this;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : "转交合作伙伴",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                         var region = $("#tmplTeam").val();
                        var assigner = $("#tmplAssigner").val();
                        if (assigner == '00') {
                            $("#tmplAssigner").parent().addClass("has-error");
                            $("#tmplAssigner").focus();
                            $.danger('请选择合作伙伴负责人');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("转交成功", null, null, function() {
                                    appRouter.navigate("enterprise", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 4,
                            id :id,
                            partnerUserId : assigner,
                            region : region

                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("partnerDetail", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#tmplTeam").html(getRegionOption());
                var region= $("#tmplTeam").val();
                self.getMarketPerson(region); 
                 $("#tmplTeam").change(function() {
                    if ($("select option").is(":selected")) {
                        region = $(this).val();
                        self.getMarketPerson(region, profession);
                    }
                });
            }
        });
    },
    getMarketPerson : function(region) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                var arr = [' <option value="00">请选择合作伙伴负责人</option>'];
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    var str = '<option value="' + staffId + '">' + fullName + '</option>';
                    arr.push(str);
                }
                $("#tmplAssigner").html(arr.join(''));
            },
            error : function(cols, resp, options) {

            },
            type : 3,
            region : region,
            roleType : "0"
        });
    }
});
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
        marketViewInstance.load();
    }
};
var partnerInfoDetailInstance = new marketListView();
function preview(urlVal) {
    partnerDetailInstance.preview(urlVal);
}
