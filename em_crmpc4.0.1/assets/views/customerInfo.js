//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/customerInfo.html");
var picurllist = "";
//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#customerInfo',
    collection:new BaseTableCollection(),
    events : {
        'submit' : 'load',
       'click #searchCustomer' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
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
        self.render();
        handlerTop('btnWrapper');
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#csmNature").html("<option value=''>选择客户性质</option>" + self.getOption(appcan.customerproperty));
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#csmStatId").html("<option value=''>选择客户状态</option>" + self.getOption(appcan.csmStat));
        $("#c_level").html("<option value=''>选择客户级别</option>" + self.getOption(appcan.customerlevel));
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));
            },
            error : function(cols, resp, options) {

            },
            type : 1

        });
        $("#add").click(function(){
             self.add();
            });
        self.load();
    },
     getOption : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            optionHTML += "<option value='" + i + "' >" + arry[i] + "</option>";
        };
        return optionHTML;
    },
    load : function(){
        var self=this;
        //企业名称
        var companyName = $.trim($("#companyName").val());
        //登录人ID
        var partnerUserId = appcanUserInfo.userId;
        if (companyName === '') {
        } else if (!reg1.test(companyName)) {
            $.danger("请输入正确的客户名称/联系人/会议名称!");
            return;
        }
        var param = {
            //客户名称
            "csmName":companyName,
            //级别
            "level": $('#c_level').val(),
            //行业类别
            "profession": $('#profession').val(),
            //客户性质
            "csmNature" : $('#csmNature').val(),
            //客户状态
            "csmStatId" : $('#csmStatId').val()
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/partner/partnerCustom/page',
                data : param
            },
            columns : [{
                "data" : "csmName",
                "title" : "客户名称"
            },{
                "data" : "level",
                "title" : "客户级别"
            }, {
                "data" : "professionName",
                "class" : "tel",
                "title" : "行业类别"
            }, {
                "data" : "csmNature",
                "class" : "tel",
                "title" : "客户性质"
            },{
                "data" : "csmStatId",
                "title" : "客户状态"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='#partnerDetail/" + c.id + "'>" + c.csmName + "</a>";
                    return html;
                }
            },{
                        targets : 1,
                        render : function(i, j, c) {
                            if (c.level){
                                return appcan.customerlevel[parseInt(c.level)];
                            }
                            else{
                                return '';
                            }
                        }
                    },{
                        targets : 3,
                        render : function(i, j, c) {
                            if (c.csmNature){
                                return appcan.customerproperty[parseInt(c.csmNature)];
                            }
                            else{
                                return '';
                            }
                        }
                    },{
                        targets : 4,
                        render : function(i, j, c) {
                            if (c.csmStatId){
                                return appcan.csmStat[parseInt(c.csmStatId)];
                            }
                            else{
                                return '';
                            }
                        }
                    }],
             complete : function (list) {
              self.collection.set(list);
            }

        });
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
    add : function() {
        var self = this;
        bootbox.dialog({
            message : $("#enterprisePartner").html(),
            title : "添加客户",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        var csmName = $("#_companyName").val();
                        if (!isDefine(csmName)) {
                            $.danger("请输入客户名称!");
                            $("#_companyName").parent().addClass("has-error");
                            $("#_companyName").focus();
                            return false;
                        } else if (!reg1.test(csmName)) {
                            $.danger("客户名称格式有误!");
                            $("#_companyName").parent().addClass("has-error");
                            $("#_companyName").focus();
                            return false;
                        }
                         var profession = $("#_profession").val();
                                    if (profession ==00) {
                                         $.danger("请选择行业类别");
                                       $("#profession").parent().addClass("has-error");
                                        $("#profession").focus();
                                      return;
                         };
                         var sprovince=$("#s_province").val();
                            if(sprovince=='00'){
                               $.danger("请选择所属省份");
                                 $("#s_province").parent().addClass("has-error");
                                $("#s_province").focus();
                                return; 
                            };
                        var csmStatId = $("#_csmStatId").val();
                        var level = $("#_level").val();
                        var csmNature = $("#_csmNature").val();
                        var csmScale = $("#_csmScale").val();
                        var address = $.trim($("#address").val());
                        var postcode = $("#postcode").val();
                         if(postcode===''){
                        }else if(!re2.test(postcode)){
                            $.danger("邮编格式不正确!");
                             $("#postcode").parent().addClass("has-error");
                            $("#postcode").focus();
                            return;
                        }
                        var website = $("#website").val();
                        if(website===''){
                            
                        }else if(!Expression.test(website)){
                            $.danger("官网格式不正确!");
                             $("#website").parent().addClass("has-error");
                            $("#website").focus();
                            return;
                        }
                        var fax = $("#fax").val();
                        if (fax === '') {
                          
                        }else if(!patternfax.test(fax)){
                           $.danger("公司传真格式有误!例如:010-xxxxxxx");
                           $("#fax").parent().addClass("has-error");
                            $("#fax").focus();
                          return; 
                        }
                        var remark = $("#remark").val();
                        var param={
                                "csmName":csmName,
                                "csmStatId":csmStatId,
                                "level":level,
                                "profession":profession,
                                "csmNature":csmNature,
                                "csmScale":csmScale,
                                "province":sprovince,
                                "address":address,
                                "postcode":postcode,
                                "website":website,
                                "fax":fax,
                                "remark":remark,
                                "partnerId":partnerId
                        };
                         self.model.save({
                                param : param
                            }, {
                                success : function(cols, resp, options) {
                                    $.success("添加成功", null, null, function() {
                                        appRouter.navigate("customerInfo", {
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
                              });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("customerInfo", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                self.model.fetch({
                    success : function(cols, resp, options) {
                        $("#_profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));
                    },
                    error : function(cols, resp, options) {
        
             },
            type : 1

        });
                $("#_level").html("<option value=''>选择客户级别</option>"+self.getOption(appcan.customerlevel));
                $("#_csmNature").html("<option value=''>选择客户性质</option>"+self.getOption(appcan.customerproperty));
                $("#_csmStatId").html("<option value=''>选择客户状态</option>"+self.getOption(appcan.csmStat));
                $("#_csmScale").html("<option value=''>选择客户规模</option>"+self.getOption(appcan.customersize));
                $("#_csmStat").html("<option value=''>选择客户状态</option>"+self.getOption(appcan.csmStat));
                $("#s_province").html('<option value="00">选择所属省份</option>'+getOption(appcan.province))
            }
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
var partnerCustomerInfoInstance = new marketListView();
function preview(urlVal) {
    partnerCustomerInfoInstance.preview(urlVal);
}
