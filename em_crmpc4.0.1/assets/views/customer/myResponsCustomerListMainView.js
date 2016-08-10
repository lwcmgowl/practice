//加载并初始化模板对象
var myResponsCustomerListMainTemplate = loadTemplate("assets/templates/customer/myResponsCustomerList.html");
//列表容器VIEW
var myResponsCustomerListMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();

    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
    events : {
        'click #searchbtn' : function() {
            this.loadlist();
            $('.dropdown').removeClass('open');
            $("#dropdownMenu1").attr("aria-expanded", "false")
        },
        'click #cancel' : "cancel",
        'click #clear' : "clear",
        'click #add':function(){
            this.addCustomer();
        },
       "click #mask":function(){
            this.hideDetail();
        },
        "click #customerInfo":function(){
            this.customerDetailList(this.model.get("id"));
        },
         "click #businessInfo":function(){
            this.businessInfo();
        },
        "click #cuscontactInfo":function(){
            this.cuscontactInfo();
        },
        "click #deliver":function(){
            this.deliver(this.model.get("id"));
        },
        
    },
    model : new myResponsCustomerListMainModel(),
    template : myResponsCustomerListMainTemplate,
    //初始化
    initProfession : function() {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#level").html("<option value=''>选择客户级别</option>");
        $("#csmNature").html("<option value=''>选择客户性质</option>" + this.getOption(appcan.customerproperty));
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#csmStatId").html("<option value=''>选择客户状态</option>" + this.getOption(appcan.csmStat));
        $("#level").html("<option value=''>选择客户级别</option>" + this.getOption(appcan.customerlevel));
        self.model.fetch({
            success : function(cols, resp, options) {
                var list = resp.msg.list;
                $("#sprofession").html("<option value=''>选择行业类别</option>" + self.profession(list));
            },
            error : function(cols, resp, options) {
            }
        });
        $("#exportFile").click(function() {
            self.exportFileconn();
        });
        //加载数据
        this.loadlist();
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
                myResponsCustomerListMainViewInstance.loadlist();
            }
        };
    },
    profession : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            for (var j = i; j < arry.length; j++) {
                if (arry[i].orderId < arry[j].orderId) {
                    var temp = arry[i];
                    arry[i] = arry[j];
                    arry[j] = temp;
                }
            }
        }
        for (var a = 0; a < arry.length; a++) {
            optionHTML += "<option value='" + arry[a].id + "'>" + arry[a].name + "</option>";
        }
        return optionHTML;
    },
    getOption : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            optionHTML += "<option value='" + i + "' >" + arry[i] + "</option>";
        };
        return optionHTML;
    },
    //文件导出
    exportFileconn : function() {
        var data = {
            "entityType" : "exportCustom",
            "salesUserId" : appcanUserInfo.userId,
            "level" : $('#level').val(),
            "profession" : $('#sprofession').val(),
            "csmNature" : $('#csmNature').val(),
            "region" : $('#region').val(),
            "csmStatId" : $('#csmStatId').val(),
            "csmName" : $.trim($('#salesUserId').val())
        };
        var type = "exportFile";
        var url = "/custom/exportCustom";
        //调用通用导出服务
        exportFileService.exportFile(data, type, url);
    },
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    loadlist : function() {
        var self = this;
        var param = {
            "salesUserId" : appcanUserInfo.userId,
            "level" : $('#level').val(),
            "profession" : $('#sprofession').val(),
            "csmNature" : $('#csmNature').val(),
            "region" : $('#region').val(),
            "csmStatId" : $('#csmStatId').val(),
            "csmName" : $.trim($('#salesUserId').val())
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/custom/page',
                data : param
            },
            columns : [{
                "data" : "csmName",
                "title" : "客户名称"
            }, {
                "data" : "level",
                "title" : "客户级别"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "csmNature",
                "title" : "客户性质"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "csmStatId",
                "title" : "客户状态"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                        var maxwidth=8;
                        if(c.csmName.length>maxwidth){
                             var html = "<a href='javascript:;' onclick='myResponsCustomerListMainViewInstance.customerDetail(\"" + c.id + "\")' title=" + c.csmName + ">" + c.csmName.substring(0,maxwidth)+"..." + "</a>";
                              return html;
                        }else{
                             var html = "<a href='javascript:;' onclick='myResponsCustomerListMainViewInstance.customerDetail(\"" + c.id + "\")' title=" + c.csmName + ">" + c.csmName + "</a>";
                             return html;
                        };
                }
            },{
                targets : 1,
                render : function(i, j, c) {
                    if (c.level)
                        return appcan.customerlevel[parseInt(c.level)];
                    else
                        return '';
                }
            }, {
                targets : 3,
                render : function(i, j, c) {
                    if (c.csmNature)
                        return appcan.customerproperty[parseInt(c.csmNature)];
                    else
                        return '';
                }
            }, {
                targets : 5,
                render : function(i, j, c) {
                    if (c.csmStatId)
                        return appcan.csmStat[parseInt(c.csmStatId)];
                    else
                        return '';
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
     cancel : function() {
        $('.dropdown').removeClass('open');
        $("#dropdownMenu1").attr("aria-expanded", "false")
    },
    //查询重置
    clear : function() {
        $("#level").val('');
        $("#sprofession").val('');
        $("#csmNature").val('');
        $("#region").val('');
        $("#csmStatId").val('');
        $("#business").val('');
        this.loadlist();
    },
    customerDetail:function(id){
         var self=this;
         var pushRight = document.getElementById( 'pushRight' );
            classie.addClass( pushRight, 'cbp-spmenu-open' );
                $("#mask").css("height",$(document).height());     
                $("#mask").css("width",$(document).width());     
                $("#mask").show();
            self.model.set("id",id); 
            self.customerDetailList(id);
    },
    //详情
    customerDetailList:function(id){
         var self=this;
       var html = '<div style="border-bottom: 1px solid #ededed; position: absolute;width: 100%;left: 0;top: 30px;"> </div>';
        html += handlerRow(id, "edit");
        $("#buttons").html(html);
        $("#customerInfo").addClass("active");
        $("#businessInfo").removeClass("active");
        $("#cuscontactInfo").removeClass("active");
        var type=null;
       var customerDetail=["assets/services/customer/detailEditService.js", "assets/models/customer/detailEditModel.js", "assets/views/customer/detailEditView.js"];
         loadSequence(customerDetail,function(){
                 var detailEditModelMainViewInstance = new detailEditModelMainView();
                 detailEditModelMainViewInstance.intInfo(id,type);
            });
    },
    //商机信息
    businessInfo:function(){
         var self=this;
        $("#customerInfo").removeClass("active");
        $("#businessInfo").addClass("active");
        $("#cuscontactInfo").removeClass("active");
         var type=null;
        var chanceId=self.model.get("id");
        var  chance=["assets/services/customer/customerConnectionChanceService.js", "assets/models/customer/customerConnectionChanceModel.js", "assets/views/customer/customerConnectionChanceView.js"];
        loadSequence(chance,function(){
                 customerConnectionChanceMainViewInstance.initInfo(chanceId,type);
            });
    },
    //联系人信息
    cuscontactInfo:function(){
         var self=this;
        $("#customerInfo").removeClass("active");
        $("#businessInfo").removeClass("active");
        $("#cuscontactInfo").addClass("active");
        var contactCsId=self.model.get("id");
        var customerName=this.collection.get(contactCsId).toJSON().csmName;
        var flag=2;
        var objId=null;
        var opportContact=["assets/services/customerContact.js", "assets/models/contact.js", "assets/views/myresCustomerContact.js?"+Date.parse(new Date())];
        loadSequence(opportContact,function(){
                marketListViewInstances.initinfo(contactCsId,objId,flag,customerName);
            });
    },
     hideDetail:function(){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.removeClass( pushRight, 'cbp-spmenu-open' );
            $("#mask").hide();
    },
    addCustomer:function(){
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
                                $("#_profession").parent().addClass("has-error");
                                $("#_profession").focus();
                                return false;
                            }else{
                               $("#_profession").parent().removeClass("has-error"); 
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
                                       self.loadlist();
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
     getcstm : function(upperCompanyName, cb) {
        var self = this;
        var ucompanyHtml = '';
        $("#upperCompany").attr("title", "请选择上级公司")
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

            },
            type:1
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
    deliver : function(id) {
        var self = this;
        var assignInfo = this.collection.get(id).toJSON();
        var csmName = assignInfo.csmName;
        var regionName = assignInfo.regionName;
        var professionName = assignInfo.professionName;
        var region = assignInfo.region;
        var profession = assignInfo.profession;
        var curName = assignInfo.curName;
        bootbox.dialog({
            message : $("#deliverCustomTemplate").html(),
            title : '客户转交',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var salesUserList = $('#salesUserList').val();
                        if (salesUserList == '') {
                            $.danger('请选择负责人');
                            $("#salesUserList").parent().addClass("has-error");
                            $("#salesUserList").focus();
                            return false;
                        }
                        if (salesUserList == curName) {
                            $.danger('请调整负责人');
                            return false;
                        }
                        var param = {
                            id : id,
                            csmName : csmName,
                            salesUserId : salesUserList
                        };
                        ajax({
                            url : '/custom/deliver',
                            data : param,
                            success : function(data) {
                                $.success("转交成功！", null, null, function() {
                                    var self=this;
                                    var pushRight = document.getElementById( 'pushRight' );
                                        classie.removeClass( pushRight, 'cbp-spmenu-open' );
                                        $("#mask").hide();
                                        self.loadlist();
                                   
                                });
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("loadMyResponsCustomerList", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#csmName1").html(csmName);
                $('#region1').html(regionName);
                $("#profession1").html(professionName);
                self.getSalesUserList(region, profession, function() {
                    $("#salesUserList").html("<option value=''>请选择负责人</option>" + salesUserOption);
                });
            }
        });

    },
    change : function(id) {
        var self = this;
        var assignInfo = this.collection.get(id).toJSON();
        var csmStatId = assignInfo.csmStatId;
        var csmName = assignInfo.csmName;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : '调整机会阶段',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var opptStatId1 = $('#opptStatId1').val();
                        if (opptStatId1 == '') {
                            $.danger('请选择机会阶段');
                            return false;
                        }
                        if (opptStatId1 == csmStatId) {
                            $.danger('请调整机会阶段');
                            return false;
                        }
                        var param = {
                            // opptTtl : opptTtl,
                            opptStatId : opptStatId1,
                            id : id,
                            customId : csmStatId
                        };
                        ajax({
                            url : '/opport/adjust',
                            data : param,
                            success : function(data) {
                                $.success("调整成功！", null, null, function() {
                                    appRouter.navigate("loadMyResponsCustomerList", {
                                        trigger : true
                                    });
                                });
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("loadMyResponsCustomerList", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#opptStatId1").html($("#csmStatId").html());
                $('#opptStatId1').val(csmStatId);
                $('#csmName1').html(csmName);
            }
        });

    },
    getSalesUserList : function(regionId, tradeId, cb) {
        salesUserOption = '';
        var data = {
            "regionId" : regionId,
            "tradeId" : tradeId,
            "roleType" : "0",
            "staffId" : appcanUserInfo.userId
        };
        ajax({
            url : "/clue/listStaff",
            data : data,
            success : function(data) {
                var arr = data.msg.list;
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i]["fullName"]){
                    salesUserOption += "<option value='" + arr[i]["staffId"] + "'>" + arr[i]["fullName"] + "</option>";
                    }
                }
                cb(salesUserOption);
            }
        });
    }
});
var myResponsCustomerListMainViewInstance = new myResponsCustomerListMainView();
