//加载并初始化模板对象
var customerConnectionChanceTemplate = loadTemplate("assets/templates/customer/customerConnectionChanceTemplate.html");
var detailOpportTemplate = loadTemplate("assets/templates/staff/cusDetailOpport.html");
//列表容器VIEW
var objId = '';
var customerConnectionChanceMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#detailpartdiv',
    bindings : {
        "#name" : {
            observe : 'name'
        },
        "opptStatId" : {
            observe : 'opptStatId'
        }
    },
    events : {
        'click #searchchance' : function() {
            this.load(objId);
        },
         'click #hrefBack' : 'hrefBack',
         "click #chanceDynamic":function(){
            this.chanceDynamic();
        },
        'click #chanceInfo':function(){
            this.myResDetail(this.model.get("cusChanceId"))
        },
        'click #chanceContact':function(){
            this.chanceContact();
        },
    },
    model : new customerConnectionChanceModel(),
    template : customerConnectionChanceTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    exportCsOppFile : function() {
        var self = this;
        var data = {
            "entityType" : "exportCusOpport",
            "customId" : objId,
            "opptTtl" : $.trim($('#name').val()),
            "opptStatId" : $('#opptStatId').val()
        };
        var url = "/custom/opport/exportOpport";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    getOption : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            optionHTML += "<option value='" + i + "' >" + arry[i] + "</option>";
        };
        return optionHTML;
    },
    initInfo : function(id,type) {
        var self = this;
        self.render();
        self.load(id);
        self.model.set("type",type);
        $("#opptStatus").html("<option value=''>选择机会阶段</option>" + self.getOption(appcan.opptStat));
         $("#exportCsOppFile").click(function() {
            self.exportCsOppFile();
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
                customerConnectionChanceMainViewInstance.load(id);
            }
        }
    },
    load : function(id) {
        objId = id;
        var self = this;
        var param = {
            "customId" : id,
            "opptStatId" : $('#opptStatus').val(),
            "opptTtl" : $.trim($('#name').val())
        };
        new DataTable({
            id : '#customerChanceTable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/custom/opport/page',
                data : param
            },
            columns : [{
                "data" : "opptTtl",
                "title" : "商机名称"
            }, {
                "data" : "opptStatId",
                "title" : "商机阶段"
            }, {
                "data" : "vndtAmt",
                "title" : "预计金额"
            }, {
                "data" : "startDate",
                "title" : "发现日期"
            }, {
                "data" : "sttlDate",
                "title" : "预计结单日期"
            }, {
                "data" : "salesUserName",
                "title" : "负责人"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                   var maxwidth=8;
                        if(c.opptTtl.length>maxwidth){
                             var html = "<a href='javascript:;' onclick='customerConnectionChanceMainViewInstance.myResDetail(\"" + c.id + "\")' title=" + c.opptTtl + ">" + c.opptTtl.substring(0,maxwidth)+"..." + "</a>";
                              return html;
                        }else{
                             var html = "<a href='javascript:;' onclick='customerConnectionChanceMainViewInstance.myResDetail(\"" + c.id + "\")' title=" + c.opptTtl + ">" + c.opptTtl + "</a>";
                             return html;
                        };
                }
            },{
                targets : 1,
                render : function(i, j, c) {
                    if (c.opptStatId)
                        return appcan.opptStat[c.opptStatId];
                    else
                        return '';
                }
            }, {
                targets : 3,
                render : function(i, j, c) {
                    if (c.startDate)
                        return c.startDate.substring(0, 4) + "-" + c.startDate.substring(4, 6) + "-" + c.startDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 4,
                render : function(i, j, c) {
                    if (c.sttlDate)
                        return c.sttlDate.substring(0, 4) + "-" + c.sttlDate.substring(4, 6) + "-" + c.sttlDate.substring(6, 8);
                    else
                        return '';
                }
            }]
        });
    },
    myResDetail:function(id){
        var self=this;
        self.model.set("cusChanceId",id);
         var chanceSlider = document.getElementById( 'chanceSlider' );
            classie.addClass( chanceSlider, 'cbp-spmenu-open' );
            $("#chanceInfo").addClass("active");
            $("#chanceDynamic").removeClass("active");
            $("#chanceContact").removeClass("active");
             $.fn.editable.defaults.mode = 'inline';
        $("#chanceDetail").html(detailOpportTemplate);
         self.model.set({
            id : id
        });
        self.model.fetch({
              success : function(cols, resp, options) {
              var info=resp.msg.item;
               self.model.set("customId",info.customId);
               $("#cusChancetitle").html(info.opptTtl);
               $("#customerChanceNameDetail").html(info.csmName);
               $("#opptTtl").html(info.opptTtl);
               $("#opptTtl").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '商机名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '商机名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/opport/edit', {
                            opptTtl : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                    },
                    error : function(response){
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 var sta = "";
                switch (parseInt(info.opptStatId)) {
                case 0:
                    sta = "初步接洽 (10%)";
                    break;
                case 1:
                    sta = "需求确定 (30%)";
                    break;
                case 2:
                    sta = "方案报价 (50%)";
                    break;
                case 3:
                    sta = "谈判审核 (80%)";
                    break;
                case 4:
                    sta = "赢单 (100%)";
                    break;
                case 5:
                    sta = "输单";
                    break;
                }
                $("#opptStat").html(sta);
                 $('#topOpptStat').editable({
                    value :info.opptStatId,
                    source : [{
                        value : 0,
                        text : '初步接洽 (10%)'
                    }, {
                        value : 1,
                        text : '需求确定 (30%)'
                    }, {
                        value : 2,
                        text : '方案报价 (50%)'
                    }, {
                        value : 3,
                        text : '谈判审核 (80%)'
                    }, {
                        value : 4,
                        text : '赢单 (100%)'
                    },{
                        value : 5,
                        text : '输单'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/custom/opport/adjust',{
                                opptStatId : value.value,
                                id : id,
                                opptTtl : info.opptTtl,
                                customId : objId
                               });
                        },
                         success : function(response) {
                                    if (response.status == "000") {
                                        $.success("编辑成功!");
                                      }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                $('#vndtAmt').html(info.vndtAmt);
                $('#vndtAmt').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '预计金额不能为空!';
                        }else{
                            var re = /^[0-9]+.?[0-9]*$/; 
                             if (!re.test($.trim(value))){
                                   return "请输入数字";
                                 }
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/opport/edit', {
                            vndtAmt : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                }); 
                 if (info.startDate == "" || info.startDate==null) {
                    $("#startDate").html("");
                } else {
                    $("#startDate").html(info.startDate.substr(0, 4) + "-" + info.startDate.substr(4, 2) + "-" + info.startDate.substr(6, 2));
                }
                $("#sttlDate").html(info.sttlDate.substr(0, 4) + "-" + info.sttlDate.substr(4, 2) + "-" + info.sttlDate.substr(6, 2));
                $('#startDate').editable({
                    type : "text",
                    validate : function(value) {
                            var  re =/^(\d{4})-(\d{2})-(\d{2})$/; 
                           if(re.test($.trim(value)))//判断日期格式符合YYYY-MM-DD标准 
                           { 
                            var   dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3); 
                             if(!((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3))))//判断日期逻辑 
                             { 
                               return  "日期格式为(yyyy-mm-dd)!"; 
                              } 
                           }else{
                               return  "日期格式为(yyyy-mm-dd)!"; 
                           }
                           if(value.replace(/-/g, '')>$('#sttlDate').text().replace(/-/g, '')){
                            return "预计签单日期不能小于发现日期!"
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/opport/edit', {
                            startDate : value.value.replace(/-/g, ''),
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#sttlDate').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == ''){
                            return '预计签单日期不能为空!';
                        }else{
                            var  re =/^(\d{4})-(\d{2})-(\d{2})$/; 
                           if(re.test($.trim(value)))//判断日期格式符合YYYY-MM-DD标准 
                           { 
                            var   dateElement=new Date(RegExp.$1,parseInt(RegExp.$2,10)-1,RegExp.$3); 
                             if(!((dateElement.getFullYear()==parseInt(RegExp.$1))&&((dateElement.getMonth()+1)==parseInt(RegExp.$2,10))&&(dateElement.getDate()==parseInt(RegExp.$3))))//判断日期逻辑 
                             { 
                               return  "日期格式为(yyyy-mm-dd)!"; 
                              } 
                           }else{
                               return  "日期格式为(yyyy-mm-dd)!"; 
                           }
                        }
                        if($('#startDate').text().replace(/-/g,'')!="空"){
                           if($('#startDate').text().replace(/-/g,'')>value.replace(/-/g, '')){
                            return "预计签单日期不能小于发现日期!"
                          }  
                        }
                       
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/opport/edit', {
                            sttlDate : value.value.replace(/-/g, ''),
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#csmName").html(info.csmName);
                $('#Source').editable({
                    value : info.dataSource==''?"无":info.dataSource,
                    source : [{
                        value : 0,
                        text : '400电话'
                    }, {
                        value : 1,
                        text : '百度推广'
                    }, {
                        value : 2,
                        text : '电话营销'
                    }, {
                        value : 3,
                        text : '个人开发'
                    }, {
                        value : 4,
                        text : '公司资源'
                    }, {
                        value : 5,
                        text : '客户维护'
                    }, {
                        value : 6,
                        text : '朋友介绍'
                    }, {
                        value : 7,
                        text : '网络营销'
                    }, {
                        value : 8,
                        text : '展会营销'
                    }, {
                        value : 9,
                        text : 'AppCan官网'
                    }, {
                        value : 10,
                        text : '行业会议'
                    }, {
                        value : 11,
                        text : '其他'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/custom/opport/edit',{
                                dataSource : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
                if(info.dataSource==10){
                    $("#meeting").show();
                    $("#conferenceName").html(info.conferenceName);
                    $('#conferenceName').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '会议名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/opport/edit', {
                            conferenceName : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                }else{
                    $("#meeting").hide();
                };
                 $('#ProductType').editable({
                    value : info.productType==''?"无":info.productType,
                    source : [{
                        value : 0,
                        text : '企业版'
                    }, {
                        value : 1,
                        text : '企业移动信息平台'
                    }, {
                        value : 2,
                        text : 'app外包项目'
                    }, {
                        value : 3,
                        text : '其他'
                    }, {
                        value : 4,
                        text : '平台+实施'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/custom/opport/edit',{
                                productType : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                        },
                        error : function(response) {
                            if (response.status == "001") {
                                $.danger(response.message);
                            }
                        }
                });
              $("#remark").html(info.remark);
                $("#remark").editable({
                    url : function(value) {
                        return $.post(urlIp + '/custom/opport/edit', {
                            remark : value.value,
                            id : id
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                  $("#salesUserName").html(info.salesUserName);
                  if(self.model.get("type")==2){
                      $("#detailOpport .editable").editable('disable');
                      $('#topOpptStat,#editcsmStatId,#editsalesUserId').editable('disable');
                  }
            },
            error : function(cols, resp, options) {

            },
            type:3,
            id : id
        });
        
    },
    chanceDynamic:function(){
        var self=this;
        $("#chanceInfo").removeClass("active");
        $("#chanceDynamic").addClass("active");
        $("#chanceContact").removeClass("active");
         var objEntityTypeId="03";
         if(self.model.get("type")==2){
            var editType=2;  
         }else{
            var editType=1;
         }
         var cusChanceId=self.model.get("cusChanceId");
         var dynamicOffical=['assets/services/dynamicOfficalTest.js','assets/models/dynamicOfficalTest.js','assets/views/dynamicCusChance.js'];
          loadSequence(dynamicOffical,function(){
                var dynamicViewObj = new dynamicEditModelMainView();
                dynamicViewObj.getDynamicData(cusChanceId,objEntityTypeId,editType,"/custom");
            });
        
    },
    chanceContact:function(){
        var self=this;
        $("#chanceInfo").removeClass("active");
        $("#chanceDynamic").removeClass("active");
        $("#chanceContact").addClass("active");
         if(self.model.get("type")==2){
            var  flag=3;  
         }else{
             var flag=1;
         }
        var csChContactId=self.model.get("cusChanceId");
        var opportContact=["assets/services/customerContact.js", "assets/models/contact.js", "assets/views/customerContact.js?"+Date.parse(new Date())];
        loadSequence(opportContact,function(){
                customerContactViewInstance.initinfo(csChContactId,objId,flag);
            });
        
    },
     hrefBack : function() {
         var chanceSlider = document.getElementById('chanceSlider' );
            classie.removeClass( chanceSlider, 'cbp-spmenu-open' );
    }
   
});
var customerConnectionChanceMainViewInstance = new customerConnectionChanceMainView();
