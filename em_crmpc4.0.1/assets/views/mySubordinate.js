//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/mySubordinate.html");
var mySubordinate=loadTemplate("assets/templates/staff/mySubordinateDetail.html");
//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection:new BaseTableCollection(),
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        // 'click #exportFile' : 'exportFile',
        'click #add' : 'add',
        'click #import' : 'import',
        'click #expedm' : 'expedm',
        "click #mask":function(){
            this.hideDetail();
        }
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
        $('#mySubordinatePersonal').empty();
        $("#detailpartdiv").html(mySubordinate);
        handlerTop('btnWrapper');
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#exportFile").click(function(){
            self.exportFile();
        })
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
                }
            };
    },
    load : function(){
        var self=this;
        //所属团队
        var region = $("#region").val();
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
            dataType:"1",
            enterpriseUserName:companyName,
            region:region
        };
        new DataTable({
            id : '#datatableEnterprise',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/partner/pageSubordinate',
                data : param
            },
            columns : [{
                "data" : "companyName",
                "title" : "企业名称"
            },{
                "data" : "contactName",
                 "tip" : true,
                "title" : "联系人"
            }, {
                "data" : "mobile",
                 "tip" : true,
                "class" : "tel",
                "title" : "手机"
            }, {
                "data" : "taskAmount",
                "tip" : true,
                "title" : "任务额"
            },{
                "data" : "regionName",
                "tip" : true,
                "title" : "所属团队"
            },{
                "data" : "authorityRegion",
                "tip" : true,
                "title" : "授权地区"
            },{
                "data" : "authorityProfession",
                "tip" : true,
                "title" : "授权行业"
            },{
                "data" : "partnerUserName",
                "tip" : true,
                "title" : "负责人"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='enterpriseViewInstance.mySubordinateDetail(\"" + c.id + "\")' title="+c.companyName+">" + c.companyName + "</a>";
                    return html;
                }
            }],
             complete : function (list) {
              self.collection.set(list);
            }

        });
    },
    exportFile:function(){
         var data = {
               dataType:1,
               entityType:"exportPartner",
               enterpriseUserName:$("#companyName").val(),
               region:$("#region").val()
            }
            var url = "/partner/exportPartnerSubordinate";
            partnerViewService.exportFile(data, url)
    },
     hideDetail:function(){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.toggle( pushRight, 'cbp-spmenu-open' );
            $("#mask").hide();
    },
    mySubordinateDetail:function(id){
        var self = this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.toggle( pushRight, 'cbp-spmenu-open' );
             $("#mask").css("height",$(document).height());     
                $("#mask").css("width",$(document).width());     
                $("#mask").show();
        var piclist='';
        self.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                $("#partnerUserName").html(info.partnerUserName);
                $("#title").html(info.companyName);
                 $("#_companyName").html(info.companyName);
                $('#_companyName').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                            return '企业名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '企业名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            companyName : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_contactName").html(info.contactName);
                $('#_contactName').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '联系人名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            contactName : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_mobile").html(info.mobile);
                $('#_mobile').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '手机号码不能为空!';
                        }else{
                             if (!mob.test($.trim(value))){
                                   return "请输入正确的手机号码!";
                                 }
                        }
                           
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            mobile : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_teleNo").html(info.teleNo);
                $('#_teleNo').editable({
                    type : 'text',
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '电话号码不能为空!';
                        }else{
                             if (!tele.test($.trim(value))){
                                   return "请输入正确的电话号码!";
                                 }
                        }
                           
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            teleNo : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                    var teams = [];
                    for (var i = 0; i < appcanUserInfo.regionTrade.length; i++) {
                        var str = {
                            text : appcanUserInfo.regionTrade[i].regionName,
                            value : appcanUserInfo.regionTrade[i].regionId
                        };
                        teams.push(str);
                    }
                $('#_region').editable({
                    value: info.region, 
                    source : teams,
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '所属团队不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            region : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_address").html(info.address);
                $('#_address').editable({
                     validate : function(value) {
                        if ($.trim(value) == '')
                            return '联系地址不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            address : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_postcode").html(info.postcode);
                $('#_postcode').editable({
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '邮政编码不能为空!';
                    },
                    validate : function(value) {
                             if (!re2.test($.trim(value))){
                                   return "请输入正确的邮政编码!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            postcode : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_legalPerson").html(info.legalPerson);
                 $('#_legalPerson').editable({
                     validate : function(value) {
                        if ($.trim(value) == '')
                            return '企业法人不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            legalPerson : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_registerFund").html(info.registerFund);
                $('#_registerFund').editable({
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '注册资金不能为空!';
                        }else{
                            var re = /^[0-9]+.?[0-9]*$/; 
                             if (!re.test($.trim(value))){
                                   return "请输入数字";
                                 }
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            registerFund : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#e_city_1 .city").html(info.city);
                $("#e_city_1 .prov").html(info.province);
                $("#_authorityRegion").html(info.authorityRegion);
                $('#_authorityRegion').editable({
                     validate : function(value) {
                        if ($.trim(value) == '')
                            return '授权地区不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            authorityRegion : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_authorityProfession").html(info.authorityProfession);
                 $('#_authorityProfession').editable({
                      validate : function(value) {
                        if ($.trim(value) == '')
                            return '授权行业不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            authorityProfession : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#_startTime").html(info.startTime);
                 $('#_startTime').editable({
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
                           if(value.replace(/-/g, '')>$('#e_sttlDate').text().replace(/-/g, '')){
                            return "授权结束日期日期不能小于授权开始日期!"
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            startTime : value.value.replace(/-/g, ''),
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                  $("#_endTime").html(info.endTime);
                  $('#_endTime').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == ''){
                            return '授权日期不能为空!';
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
                        if($('#e_startDate').text().replace(/-/g, '')>value.replace(/-/g, '')){
                            return "授权结束日期不能小于授予开始日期!"
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit',{
                            endTime : value.value.replace(/-/g, ''),
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.myReportDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#_agencyAuthority').editable({
                     value : info.agencyAuthority,
                    source : [{
                        value : 0,
                        text : '独家'
                    }, {
                        value : 1,
                        text : '排他'
                    }, {
                        value : 2,
                        text : '普通'
                    }],
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            agencyAuthority : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_pledgeMoney").html(info.pledgeMoney);
                 $('#_pledgeMoney').editable({
                     validate : function(value) {
                        if ($.trim(value) == ''){
                             return '保证金不能为空!';
                        }else{
                            var re = /^[0-9]+.?[0-9]*$/; 
                             if (!re.test($.trim(value))){
                                   return "请输入数字";
                                 }
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            pledgeMoney : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $('#_productDiscount').editable({
                    value : info.productDiscount,
                    source : [{
                        value : 0,
                        text : '两折'
                    }, {
                        value : 1,
                        text : '三折'
                    }],
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            productDiscount : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_remark").html(info.remark);
                $('#_remark').editable({
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            remark : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_price").html(info.price);
                $('#_price').editable({
                    validate : function(value) {
                        if ($.trim(value) == ''){
                             return '价格不能为空!';
                        }else{
                            var re = /^[0-9]+.?[0-9]*$/; 
                             if (!re.test($.trim(value))){
                                   return "请输入数字";
                                 }
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            price : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $("#_taskAmount").html(info.taskAmount);
                 $('#_taskAmount').editable({
                     validate : function(value) {
                        if ($.trim(value) == ''){
                             return '任务额不能为空!';
                        }else{
                            var re = /^[0-9]+.?[0-9]*$/; 
                             if (!re.test($.trim(value))){
                                   return "请输入数字";
                                 }
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            taskAmount : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                $('#_contractType').editable({
                     value:info.contractType,
                     source: [
                          {value: 0, text: '标准渠道协议'},
                          {value: 1, text: '框架合同协议'}
                       ],
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            contractType : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                            self.partnerDetailList(id)
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 var attachment = info.attachment;
                if(attachment){
                 piclist = attachment.split(",");
                $("#_uppictr").html("");
                for (var p in piclist) {
                    var urldownshow = picviewPath + "/" + piclist[p];
                    $("#_uppictr").append("<td><a href='" + urldownshow + "'  target='_blank'><img src='" + urldownshow + "' width='80px'  height='80px'/></a></td>");
                   }
                }else{
                    $("#_uppictr").html("");
                }
                $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().hide();
                    }else{
                         $(this).parent().parent().show();
                    }
                });
                 $('#mystaffDetail .editable').editable('disable');
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
    }
    
});
var enterpriseViewInstance = new marketListView();

