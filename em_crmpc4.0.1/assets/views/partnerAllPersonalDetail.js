//加载并初始化模板对象
var personalTemplate = loadTemplate("assets/templates/staff/partnerAllPersonalDetail.html");
var picurllist = "";
//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        // 'click #add' : 'add',
        'click #import' : 'import',
        'click #expedm' : 'expedm'
    },
    model : new marketModel(),
    template : personalTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(id) {
        var self = this;
        self.render();
        var html = '';
        html += handlerRow(id);
        $("#back").before(html);
        $('[href="#edit/'+id+'"]').attr("href",'#edit/'+id+'/2')
        $('[href="#del/'+id+'"]').attr("href",'#del/'+id+'/2')
        $('[href="#convert/'+id+'"]').attr("href",'#convert/'+id+'/2')
        self.load(id);
    },
    load : function(id) {
        var self = this;
        self.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                $("#partnerUserName").html(info.partnerUserName);
                $("#title").html(info.contactName);
                $("#companyName").html(info.companyName);
                $("#contactName").html(info.contactName);
                $("#mobile").html(info.mobile);
                $("#teleNo").html(info.teleNo);
                $("#identityCard").html(info.identityCard);
                $("#region1").html(info.regionName);
                $("#level").html(info.level);
                $("#address").html(info.address);
                $("#postcode").html(info.postcode);
                $("#email").html(info.email);
                $("#QQ").html(info.qq);
                $("#weChat").html(info.weChat);
                $("#csmScale").html(info.csmScale);
                $("#website").html(info.website);
                var attachment = info.attachment;
                if(attachment){
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
                                    appRouter.navigate("individual", {
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
                        appRouter.navigate('perPartnerDetail/' + id + '', {
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
            title : "编辑个人伙伴",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        var loginId = appcanUserInfo.userId;
                        var contactName = $("#_contactName").val();
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
                        var mobile = $.trim($("#_mobile").val());
                        var teleNo = $.trim($("#_teleNo").val());
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
                        var identityCard=$("#_identityCard").val();
                        var region = $("#_region").val();
                        if (!isDefine(region) || region.indexOf("选择") > 0) {
                            $.danger("请选择所属团队");
                            $("#_region").parent().addClass("has-error");
                            $("#_region").focus();
                            return false;
                        };
                        // var level = $("#_level").val() != "00" ? $("#level").val() : "";
                        var address=$.trim($("#_address").val());
                         var postcode = $("#_postcode").val();
                        if (postcode === '') {
                        } else if (!re2.test(postcode)) {
                            $.danger("邮编格式不正确!");
                            $("#postcode").parent().addClass("has-error");
                            $("#postcode").focus();
                            return false;
                        };
                        var email = $("#_email").val();
                        if (email === '') {
                        } else if (!pattern.test(email)) {
                            $.danger("电子邮件格式不正确!");
                            $("#email").parent().addClass("has-error");
                            $("#email").focus();
                            return false;
                        }
                        var QQ = $("#_QQ").val();
                        var weChat = $("#_weChat").val();
                        var picturelista = [];
                        var picArray = new Array();
                        picArray = picurllist.split(",");
                        for (var i = 0; i < picArray.length - 1; i++) {
                            picturelista.push(picArray[i]);
                        }
                        var attachment = picturelista.join(",");
                        var param = {
                             "contactName" : contactName,
                            "mobile" : mobile,
                            "teleNo" : teleNo,
                            "identityCard":identityCard,
                            "region" : region,
                            // "level" : level,
                            "address" : address,
                            "postcode" : postcode,
                            "email":email,
                            "qq":QQ,
                            "weChat":weChat,
                            "dataType":"0",
                            "attachment" : attachment
                        };
                        self.model.set({
                            id : id
                        });
                        self.model.save({
                            param : param
                        }, {
                            success : function(cols, resp, options) {
                                $.success("编辑成功", null, null, function() {
                                    appRouter.navigate('perPartnerDetail/' + id + '', {
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
                        appRouter.navigate("perPartnerDetail", {
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
                        $("#_contactName").val(info.contactName);
                        $("#_mobile").val(info.mobile);
                        $("#_teleNo").val(info.teleNo);
                        $("#_identityCard").val(info.identityCard);
                        $("#_region").val(info.region);
                        $("#_level").val(info.level);
                        $("#_address").val(info.address);
                        $("#_postcode").val(info.postcode);
                        $("#_email").val(info.email);
                        $("#_QQ").val(info.qq);
                        $("#_weChat").val(info.weChat);
                        $("#_csmScale").val(info.csmScale);
                        $("#_website").val(info.website);
                        var attachment = info.attachment;
                        if(attachment){
                        var piclist = attachment.split(",");
                        $("#uppictr").html("");
                        for (var p in piclist) {
                            var urldownshow = picviewPath + "/" + piclist[p];
                            //$("#uppictr").append("<td><img src='" + urldownshow + "' width='60px'  height='60px'/> </td>");
                            $("#uppictr").append("<td  id='pic" + piclist[p] + "'><img src='" + urldownshow + "' width='60px'  height='60px'/><a href='#delpic/" + piclist[p] + "/1'>删除</a> </td>");
                            picurllist += (piclist[p] + ",");
                        }
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
                                    appRouter.navigate("individual", {
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
                        appRouter.navigate("perPartnerDetail", {
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
var perPartnerDetailInstance = new marketListView();
function preview(urlVal) {
    perPartnerDetailInstance.preview(urlVal);
}
