//加载并初始化模板对象
var customerListMainTemplate = loadTemplate("assets/templates/customer/customerListMainTemplate.html");
//列表容器VIEW
var customerListMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();

    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
    bindings : {
        "#level" : {
            observe : 'level'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#csmNature" : {
            observe : 'csmNature'
        },
        "#region" : {
            observe : 'region'
        },
        "#csmStatId" : {
            observe : 'csmStatId'
        },
        "#csmName" : {
            observe : 'csmName'
        }
    },
    events : {
        'click #searchbtn' : function() {
              $('.dropdown').removeClass('open');
              $("#dropdownMenu1").attr("aria-expanded", "false")
              this.load();
        },
        'click #cancel' : "cancel",
         'click #clear' : "clear",
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
    },
    model : new customerListMainModel(),
    template : customerListMainTemplate,
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
        this.model.fetch({
            success : function(cols, resp, options) {
                var list = resp.msg.list;
                $("#profession").html("<option value=''>选择行业类别</option>" + self.profession(list));
            },
            error : function(cols, resp, options) {
            }
        });
        $("#exportFile").click(function() {
            self.exportFile();
        });
        //加载数据
        this.load();
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
                customerListMainViewInstance.load();
            }
        }
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
    exportFile : function() {
        var data = {
            "entityType" : "exportCustom",
            "level" : $('#level').val(),
            "profession" : $('#profession').val(),
            "csmNature" : $('#csmNature').val(),
            "region" : $('#region').val(),
            "csmStatId" : $('#csmStatId').val(),
            "csmName" : $.trim($('#business').val())
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
    load : function(direction) {
        var self = this;
        var param = {
            "level" : $('#level').val(),
            "profession" : $('#profession').val(),
            "csmNature" : $('#csmNature').val(),
            "region" : $('#region').val(),
            "csmStatId" : $('#csmStatId').val(),
            "csmName" : $.trim($('#business').val())
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
                "data" : "salesUserName",
                "title" : "负责人"
            }, {
                "data" : "csmStatId",
                "title" : "客户状态"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                        var maxwidth=8;
                        if(c.csmName.length>maxwidth){
                             var html = "<a href='javascript:;' onclick='customerListMainViewInstance.customerDetail(\"" + c.id + "\")' title=" + c.csmName + ">" + c.csmName.substring(0,maxwidth)+"..." + "</a>";
                              return html;
                        }else{
                             var html = "<a href='javascript:;' onclick='customerListMainViewInstance.customerDetail(\"" + c.id + "\")' title=" + c.csmName + ">" + c.csmName + "</a>";
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
                targets : 6,
                render : function(i, j, c) {
                    if (c.csmStatId)
                        return appcan.csmStat[parseInt(c.csmStatId)];
                    else
                        return '';
                }
            }
            // , {
                // targets : 7,
                // render : function(i, j, c) {
                    // var dynamicParam = {
                        // "objEntityId" : c.id,
                        // "companyName" : encodeURIComponent(c.csmName),
                        // "objEntityTypeId" : "operatelog",
                        // "cusotm" : 1
                    // };
// 
                    // var customerAndChanceParam = {
                        // "customId" : c.id,
                        // "csmName" : decodeURI(c.csmName),
                        // "type" : "2"
                    // };
                    // var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(c.csmName) + "/operatelog/1";
                    // var hrefDynamicURL = "<a class='btn btn-default btn-xs' id='dynamic' href='" + hrefDynamic + "' >动态</a> &nbsp;";
                    // var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(c.csmName) + "/operatelog/2/1";
                    // var hrefDynamicURL = "<a class='btn btn-default btn-xs'  href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";                      var detail = "#detail/" + c.id;
                    // var detailURL = "<a class='btn btn-default btn-xs'  href='" + detail + "' >查看</a> &nbsp";
                    // var chance = "#mystaffchance/" + c.id + "/" + decodeURI(c.csmName)+"/2";
                    // var chanceURL = "<a class='btn btn-default btn-xs'  href='" + chance + "'>机会</a> &nbsp";
                    // var customer = "#customer/" + c.id + "/" + decodeURI(c.csmName)+"/2/null";
                    // var customerURL = "<a class='btn btn-default btn-xs'  href='" + customer + "'>联系人</a> &nbsp";
                    // //拼装 html
                    // var html = customerURL + chanceURL + detailURL;
                    // return html;
                // }
            // }
            ],
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
        this.load();
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
        var type=2;
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
        var type=2;
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
        var flag=3;
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
    }
});
var customerListMainViewInstance = new customerListMainView();
