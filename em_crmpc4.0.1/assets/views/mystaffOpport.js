//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/mystaffOpport.html");
var detailOpportTemplate = loadTemplate("assets/templates/staff/detailOpport.html");

//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection:new BaseTableCollection(),
    bindings : {

    },
    events : {
        'click #searchbtn' : function() {
            this.load();
            $('.dropdown').removeClass('open');
            $("#dropdownMenu1").attr("aria-expanded", "false")
        },
        'click #cancel' : "cancel",
        'click #clear' : "clear",
        'click #exportFile' : 'exportFile',
        "click #mask":function(){
            this.hideDetail();
        },
         "click #dynamic":function(){
            this.dynamic()
        },
         "click #businessInfo":function(){
            this.myStaffDetailList(this.model.get("id"));
        },
         "click #contact":function(){
            this.contactList()
        },
    },
    model : new marketModel(),
    template : marketTemplate,

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        for (var i in appcan.opptStat) {
            var str = '<option value="' + (i) + '">' + appcan.opptStat[i] + '</option>'
            $("#opptStatId").append(str);
        }
        $("#sandbox-container .input-daterange").datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });
        $("#update .input-daterange").datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });
        ajax({
            url : "/opport/trade/listTrade",
            data : {
            superId:'0'
          },
            success : function(data) {
                var perArr = data.msg.list;
                $("#bigRegion").html(' <option value="">选择所属团队</option>'+profession(perArr));
            }
        });
        self.load();
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
                    self.load();
                     $('.dropdown').removeClass('open');
                     $("#dropdownMenu1").attr("aria-expanded", "false")
                }
            };
    },
    cancel : function() {
        $('.dropdown').removeClass('open');
        $("#dropdownMenu1").attr("aria-expanded", "false")
    },
    //查询重置
    clear : function() {
        $("#customer").val('');
        $("#business").val('');
        $("#findDate").val('');
        $("#findEndDate").val('');
        $("#signingDate").val('');
        $("#signingEndDate").val('');
        $("#updateDate").val('');
        $("#updateEndDate").val('');
        $("#opptStatId").val('');
        $("#responsible").val('');
        $("#bigRegion").val(''),
        this.load();
    },
    load : function() {
        var self=this;
         var param = {
            opptTtl : $.trim($('#business').val()),
            csmName:$.trim($("#customer").val()),
            salesUserName:$.trim($("#responsible").val()),
            beforeStartDate:$("#findDate").val(),
            afterStartDate:$("#findEndDate").val(),
            beforeSttlDate:$("#signingDate").val(),
            afterSttlDate:$("#signingEndDate").val(),
            beforeCreatedAt:$("#updateDate").val(),
            afterCreatedAt:$("#updateEndDate").val(),
            //salesUserId : appcanUserInfo.userId,
            opptStatId : $('#opptStatId').val(),
            region:$("#bigRegion").val(),
            subordinateFlg:'1'
         };
        new DataTable({
            el : 'datatable',
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/opport/page',
                data : param
            },
           columns:[{
                        "data" : "opptTtl",
                        "title" : "商机名称"
                    }, {
                        "data" : "opptStatId",
                        "tip" : true,
                        "title" : "商机阶段"
                    }, {
                        "data" : "vndtAmt",
                        "tip" : true,
                        "title" : "预计金额"
                    }, {
                        "data" : "startDate",
                        "tip" : true,
                        "title" : "发现日期"
                    }, {
                        "data" : "sttlDate",
                        "tip" : true,
                        "title" : "预计签单日期"
                    },{
                        "data" : "csmName",
                        "tip" : true,
                        "title" : "客户名称"
                    },{
                        "data" : "region",
                        "tip" : true,
                        "title" : "所属团队"
                    },{
                        "data" : "salesUserName",
                        "tip" : true,
                        "title" : "商机负责人"
                    },{
                        "data" : "createdAt",
                        "tip" : true,
                        "title" : "创建时间"
                    }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                   var maxwidth=8;
                        if(c.opptTtl.length>maxwidth){
                             var html = "<a href='javascript:;' onclick='marketListViewInstance.myStaffDetail(\"" + c.id + "\")' title=" + c.opptTtl + ">" + c.opptTtl.substring(0,maxwidth)+"..." + "</a>";
                              return html;
                        }else{
                             var html = "<a href='javascript:;' onclick='marketListViewInstance.myStaffDetail(\"" + c.id + "\")' title=" + c.opptTtl + ">" + c.opptTtl + "</a>";
                             return html;
                        };
                }
            },{
                targets : 1,
                render : function(i, j, c) {
                    return appcan.opptStat[parseInt(c.opptStatId)];
                }
            }, {
                targets : 2,
                render : function(i, j, c) {
                    if (c.vndtAmt)
                        return c.vndtAmt;
                    else
                        return '';
                }
            },{
                targets : 3,
                render : function(i, j, c) {
                    if (c.startDate)
                        return c.startDate.substring(0, 4) + '-' + c.startDate.substring(4, 6) + '-' + c.startDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 4,
                render : function(i, j, c) {
                    if (c.sttlDate)
                        return c.sttlDate.substring(0, 4) + '-' + c.sttlDate.substring(4, 6) + '-' + c.sttlDate.substring(6, 8);
                    else
                        return '';
                }
            },{
                targets : 5,
                render : function(i, j, c) {
                    if (c.csmName){
                        var maxwidth=12;
                        if(c.csmName.length>maxwidth){
                         return  c.csmName.substring(0,maxwidth)+"...";
                        }else{
                           return c.csmName;
                        }
                    }else{
                        return "";
                    }
                }
            }, {
                targets : 8,
                render : function(i, j, c) {
                    if (c.createdAt)
                        return toDateString(c.createdAt);
                    else
                        return '';
                }
            }],
             complete : function (list) {
              self.collection.set(list);
            },
            dataTableCb:function(n){
                self.pageNo = n;
            }

        });
    },
    pageNo:1,
    exportFile : function() {
            var data = {
                "entityType" : "exportOpport",
                opptTtl : $.trim($('#business').val()),
                csmName:$.trim($("#customer").val()),
                salesUserName:$.trim($("#responsible").val()),
                beforeStartDate:$("#findDate").val(),
                afterStartDate:$("#findEndDate").val(),
                beforeSttlDate:$("#signingDate").val(),
                afterSttlDate:$("#signingEndDate").val(),
                beforeCreatedAt:$("#updateDate").val(),
                afterCreatedAt:$("#updateEndDate").val(),
                //salesUserId : appcanUserInfo.userId,
                opptStatId : $('#opptStatId').val(),
                region:$("#bigRegion").val(),
                subordinateFlg:'1'
            }
        var url = "/opport/exportOpport";
        marketViewService.exportFile(data, url)
    },
    myStaffDetail:function(id){
       var self=this;
       var pushRight = document.getElementById( 'pushRight' );
            classie.addClass( pushRight, 'cbp-spmenu-open' );
                $("#mask").css("height",$(document).height());     
                $("#mask").css("width",$(document).width());     
                $("#mask").show();
            self.model.set("id",id); 
            self.myStaffDetailList(id);
    },
     hideDetail:function(){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.removeClass( pushRight, 'cbp-spmenu-open' );
            $("#mask").hide();
    },
    myStaffDetailList:function(id){
        var self=this;
        $("#businessInfo").addClass("active");
        $("#dynamic").removeClass("active");
        $("#contact").removeClass("active");
        $.fn.editable.defaults.mode = 'inline';
        $("#detailpartdiv").html(detailOpportTemplate);
         self.model.set({
            id : id
        });
        self.model.fetch({
              success : function(cols, resp, options) {
              var info=resp.msg.item;
               self.model.set("customId",info.customId);
               $("#title").html(info.opptTtl);
               $("#customerNameDetail").html(info.csmName);
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
                        return $.post(urlIp + '/opport/edit', {
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
                            return $.post(urlIp + '/opport/edit',{
                                opptStatId : value.value,
                                id : id
                            });
                        },
                         success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!");
                            self.load();
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
                        return $.post(urlIp + '/opport/edit', {
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
                        return $.post(urlIp + '/opport/edit', {
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
                        return $.post(urlIp + '/opport/edit', {
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
                            return $.post(urlIp + '/opport/edit',{
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
                        return $.post(urlIp + '/opport/edit', {
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
                            return $.post(urlIp + '/opport/edit',{
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
                        return $.post(urlIp + '/opport/edit', {
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
                  $('#detailOpport .editable').editable('disable');
                  $('#topOpptStat').editable('disable');
                  
            },
            error : function(cols, resp, options) {

            },
            type:3,
            id : id
        });
        
    },
    //跟进动态
     dynamic:function(){
        $("#businessInfo").removeClass("active");
        $("#dynamic").addClass("active");
        $("#contact").removeClass("active");
         var objEntityTypeId="03";
         var editType=2;
         var objId=this.model.get("id");
         var dynamicOffical=['assets/services/dynamicOfficalTest.js','assets/models/dynamicOfficalTest.js','assets/views/dynamicOfficalTest.js'];
         loadSequence(dynamicOffical,function(){
                dynamicViewObj.getDynamicData(objId,objEntityTypeId,editType);
            });
    },
    //联系人
    contactList:function(){
        $("#businessInfo").removeClass("active");
        $("#dynamic").removeClass("active");
        $("#contact").addClass("active");
        var contactId=this.model.get("id");
        var customId=this.model.get("customId");
        var opportContact=["assets/services/contact.js", "assets/models/contact.js", "assets/views/contact.js"];
        loadSequence(opportContact,function(){
                marketListViewInstances.initinfo(contactId,customId);
            });
    },
     milliFormat:function(s){//添加千位符  
        if(/[^0-9\.]/.test(s)) return "invalid value";  
        s=s.replace(/^(\d*)$/,"$1.");  
        s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");  
        s=s.replace(".",",");  
        var re=/(\d)(\d{3},)/;  
        while(re.test(s)){  
            s=s.replace(re,"$1,$2");  
        }  
        s=s.replace(/,(\d\d)$/,".$1");  
        return s.replace(/^\./,"0.")  
    }  
});
var marketListViewInstance = new marketListView();
