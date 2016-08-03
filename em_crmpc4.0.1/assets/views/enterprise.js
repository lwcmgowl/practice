//加载并初始化模板对象
var enterpriseTemplate = loadTemplate("assets/templates/staff/enterprise.html");
var partnerDetailTemplate = loadTemplate("assets/templates/staff/partnerDetail.html");
var picurllist = "";
var objId = "";
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
        'click #import' : 'import',
        'click #expedm' : 'expedm',
        'click .field_edit_pen' : "fieldshow",
        "click #mask":function(){
            this.hideDetail();
        }
    },
    model : new enterpriseModel(),
    template : enterpriseTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function() {
        $('#individual').empty();
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $("#add").click(function() {
            self.add();
        });
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
    load : function() {
        var self = this;
        //所属团队
        var region = $("#region").val();
        //企业名称
        var companyName = $.trim($("#companyName").val());
        //登录人ID
        var partnerUserId = appcanUserInfo.userId;
        if (companyName === '') {
        } else if (!reg1.test(companyName)) {
            $.danger("请输入正确的企业名称/联系人/负责人!");
            return;
        }
        var param = {
            dataType : "1",
            companyName : companyName,
            region : region
        };
        new DataTable({
            id : '#datatableEnterprise',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/partner/pageMe',
                data : param
            },
            columns : [{
                "data" : "companyName",
                "title" : "企业名称"
            }, {
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
            }, {
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
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='enterpriseViewInstance.partnerDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
     exportFile : function() {
            var data = {
               dataType:1,
               entityType:"exportPartner",
               companyName:$("#companyName").val(),
               region:$("#region").val()
            }
            var url = "/partner/exportPartnerMe";
            partnerViewService.exportFile(data, url);
    },
    partnerDetail:function(id){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.toggle( pushRight, 'cbp-spmenu-open' );
             $("#mask").css("height",$(document).height());     
                $("#mask").css("width",$(document).width());     
                $("#mask").show();
                self.partnerDetailList(id); 
        
    },
    hideDetail:function(){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.toggle( pushRight, 'cbp-spmenu-open' );
            $("#mask").hide();
    },
    partnerDetailList : function(id) {
        objId = id;
        picurllist = "";
        $("#detailpartdiv").html(partnerDetailTemplate);
        $.fn.editable.defaults.mode = 'inline';
        var self = this;
        var html = '';
        html += handlerRow(id, "edit");
        $("#buttons").html(html);
        $('[href="#del/' + id + '"]').attr("href", '#del/' + id + '/1');
        $('[href="#convert/' + id + '"]').attr("href", '#convert/' + id + '/1');
        self.model.set({
            id : id
        });
        self.model.fetch({
            success : function(cols, resp, options) {
                var info = resp.msg.item;
                $("#e_city_1").citySelect({
                     prov: info.province,
                     city: info.city,
                    required: false
                });
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
                        if($.trim(value) == ''){
                            return '邮政编码不能为空!';
                           }else if(!re2.test($.trim(value))){
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
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                 $("#e_city_1 .city").change(function(){
                    var data={
                          "province":$("#e_city_1 .prov").val(),
                          "city":$("#e_city_1 .city").val(),
                          "dataType":'1',
                          "id":id
                        };
                        ajax({
                            url : '/partner/edit',
                            data: data,
                            success : function(data) {
                                           
                              }
                    });         
                  });
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
                           if(value.replace(/-/g, '')>$('#_endTime').text().replace(/-/g, '')){
                            return "授权结束日期日期不能小于授权开始日期!"
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit', {
                            startTime : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
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
                        if($('#_startTime').text().replace(/-/g, '')>value.replace(/-/g, '')){
                            return "授权结束日期不能小于授予开始日期!"
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/partner/edit',{
                            endTime : value.value,
                            id : id,
                            dataType:1
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
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
                        }
                    },
                    error : function(response) {
                        if (response.status == "001") {
                            $.danger(response.message);
                        }
                    }
                });
                var attachment = info.attachment;
                if (attachment) {
                    var piclist = attachment.split(",");
                    $("#uppictrs").html("");
                    for (var p in piclist) {
                        var urldownshow = picviewPath + "/" + piclist[p];
                        //$("#uppictr").append("<td><img src='" + urldownshow + "' width='60px'  height='60px'/> </td>");
                        $("#uppictrs").append("<td  id='pic" + piclist[p] + "'><img src='" + urldownshow + "' width='60px'  height='60px'/><a href='javascript:;' onclick='enterpriseViewInstance.editdelpic(\"" + piclist[p] + "\")'>删除</a> </td>");
                        picurllist += (piclist[p] + ",");
                    }
                } else {
                    $("#uppictrs").html("");
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
            type : 2,
            id : id
        });
    },
    fieldshow : function() {
         $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().parent().toggle("slow");
                    }
                });
    },
    edit : function() {
        var self = this;
        var picturelista = [];
        var picArray = new Array();
        picArray = picurllist.split(",");
        for (var i = 0; i < picArray.length - 1; i++) {
            picturelista.push(picArray[i]);
        }
        var attachment = picturelista.join(",");
        var param = {
            "attachment" : attachment,
            "dataType" : "1"
        };
        enterpriseViewInstance.model.clear("id");
        enterpriseViewInstance.model.set({
            id : objId
        });
        enterpriseViewInstance.model.save({
            param : param
           }, {
            success : function(cols, resp, options) {
                $.success("编辑成功", null, null, function() {
                    enterpriseViewInstance.load();
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
            id : objId
        });
    },
    //上传图片
    preview : function(urlVal) {
        var self = this;
        //设定图片上传地址
        var formsub = document.getElementById("imgForm");
        formsub.action = picviewPath;
        var imgUrls = urlVal;
        var attcId = imgUrls.substr(imgUrls.lastIndexOf('.')).toLowerCase();
        if (attcId == '.jpg' || attcId == '.gif' || attcId == '.png') {
            //上传 图片
            $("#imgForm").ajaxSubmit({
                dataType : 'json',
                success : function(data) {
                    var urldownshow = picviewPath + "/" + data.msg.objectId;
                    $("#uppictr").append("<td id='pic" + data.msg.objectId + "'><img src='" + urldownshow + "' width='60px'  height='60px'/><a href='javascript:;' onclick='enterpriseViewInstance.delpic(\"" + data.msg.objectId + "\")'>删除</a> </td>");
                    picurllist += (data.msg.objectId + ",");
                    var html = document.getElementById('loadSpan').innerHTML;
                    $("#loadSpan").empty();
                    $("#loadSpan").append(html);
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
    editpreview : function(urlVal) {
        var self = this;
        //设定图片上传地址
        var formsub = document.getElementById("editimgForm");
        formsub.action = picviewPath;
        var imgUrls = urlVal;
        var attcId = imgUrls.substr(imgUrls.lastIndexOf('.')).toLowerCase();
        if (attcId == '.jpg' || attcId == '.gif' || attcId == '.png') {
            //上传 图片
            $("#editimgForm").ajaxSubmit({
                dataType : 'json',
                success : function(data) {
                    var urldownshow = picviewPath + "/" + data.msg.objectId;
                    $("#uppictrs").append("<td id='pic" + data.msg.objectId + "'><img src='" + urldownshow + "' width='60px'  height='60px'/><a href='javascript:;' onclick='enterpriseViewInstance.editdelpic(\"" + data.msg.objectId + "\")'>删除</a> </td>");
                    picurllist += (data.msg.objectId + ",");
                    var html = document.getElementById('uploadSpan').innerHTML;
                    $("#uploadSpan").empty();
                    $("#uploadSpan").append(html);
                    self.edit();
                    // document.getElementById('loadSpan').innerHTML = html;
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
    editdelpic : function(objid) {
        var self = this;
        $("#pic" + objid).remove();
        picurllist = picurllist.replace((objid + ","), "");
        self.edit();
    },
    add : function() {
        var self = this;
        picurllist = "";
        bootbox.dialog({
            message : $("#enterprisePartner").html(),
            title : "添加企业伙伴",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        $('#productForm').bootstrapValidator('validate');
                        var loginId = appcanUserInfo.userId;
                        var companyName = $("#addcompanyName").val();
                        if (!isDefine(companyName)) {
                            $.danger("请输入企业名称!");
                            $("#addcompanyName").focus();
                            return false;
                        } else if (!reg1.test(companyName)) {
                            $.danger("企业名称名称格式有误!");
                            $("#_companyName").focus();
                            return false;
                        } else {
                            $("#addcompanyName").parent().removeClass("has-error");
                        }
                        var contactName = $("#contactName").val();
                        if (!isDefine(contactName)) {
                            $.danger("请输入姓名!");
                            $("#contactName").focus();
                            return false;
                        } else if (!patrn.exec(contactName)) {
                            $.danger("姓名格式有误!");
                            $("#contactName").focus();
                            return false;
                        } else {
                            $("#contactName").parent().removeClass("has-error");
                        }
                        var mobile = $.trim($("#mobile").val());
                        var teleNo = $.trim($("#teleNo").val());
                        if (mobile === '' || teleNo === '') {
                            $.danger("请填写手机号和者座机号!");
                            $("#mobile").focus();
                            $("#teleNo").focus();
                            return false;
                        } else if (!mob.test(mobile) || !tele.test(teleNo)) {
                            $.danger("手机号或者座机号格式有误!");
                            $("#mobile").focus();
                            $("#teleNo").focus();
                            return false;
                        };
                        var region = $("#__region").val();
                        if (!isDefine(region) || region.indexOf("选择") > 0) {
                            $.danger("请选择所属团队");
                            $("#__region").focus();
                            return false;
                        } else {
                        }
                        var province=$(".prov").val()
                        if(province==""){
                            $.danger("选择所属地区!");
                             return false;
                        }
                        var city=$(".city").val();
                         if(city==""){
                            $.danger("选择所属地区!");
                             return false;
                        }
                        var address = $("#address").val();
                        if(address==""){
                            $.danger("请输入地址!!");
                             return false;
                        }
                        var postcode = $("#postcode").val();
                        if (postcode =='') {
                             $.danger("邮政编码不能为空!");
                             return false;
                        } else if(!re2.test(postcode)) {
                            $.danger("邮编格式不正确!");
                            $("#postcode").focus();
                            return false;
                        } 
                        //企业法人
                        var legalPerson = $("#legalPerson").val();
                        if(legalPerson==""){
                            $.danger("请输入企业法人!");
                             return false;
                        }
                        //注册资金
                        var registerFund = $("#registerFund").val();
                         if(registerFund==""){
                            $.danger("请输入注册资金!");
                             return false;
                        }else if(!/^[0-9]+.?[0-9]*$/.test($.trim(registerFund))){
                            $.danger("注册资金格式错误!");
                             return false;
                        }
                        //授权地区
                        var authorizedArea = $("#authorizedArea").val();
                        if(authorizedArea==""){
                            $.danger("请输入授权地区!");
                             return false;
                        }
                        //授权行业
                        var licensingIndustry = $("#licensingIndustry").val();
                        if(licensingIndustry==""){
                            $.danger("请输入授权行业!");
                             return false; 
                        }
                        //
                        var startTime = $("#startTime").val();
                        if(startTime==""){
                            $.danger("请输入授权期限!");
                             return false;
                        }
                        var endTime=$("#endTime").val();
                       var  authorization=$("#authorization").val();
                      if(authorization==""){
                            $.danger("请选择代理权限!");
                             return false;
                        }
                        var bond = $("#bond").val();
                        if(bond==""){
                            $.danger("请输入保证金金额!");
                             return false;
                        }else if(!/^[0-9]+.?[0-9]*$/.test($.trim(bond))){
                            $.danger("保证金格式错误!");
                             return false;
                        }
                        var discount = $("#discount").val();
                        if(discount==""){
                            $.danger("请选择产品折扣!");
                             return false;
                        }
                        var remark=$("#remark").val();
                        var price = $("#price").val();
                        if(price==""){
                            $.danger("请输入价格!");
                             return false;
                        }else if(!/^[0-9]+.?[0-9]*$/.test($.trim(price))){
                            $.danger("价格格式错误!");
                             return false;
                        }
                        var taskAmount = $("#taskAmount").val();
                         if(taskAmount==""){
                            $.danger("请输入任务额!");
                             return false;
                        }else if(!/^[0-9]+.?[0-9]*$/.test($.trim(taskAmount))){
                            $.danger("任务额格式错误!");
                             return false;
                        }
                        var picturelista = [];
                        var setvalue = $("input:radio[name=optionsRadiosinline]:checked").val();
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
                            "province":province,
                            "city":city,
                            "address" : address,
                            "postcode" : postcode,
                            "legalPerson" : legalPerson,
                            "registerFund" : registerFund,
                            "authorityRegion":authorizedArea,
                            "authorityProfession" :licensingIndustry,
                            "startTime" : startTime,
                            "endTime" : endTime,
                            "agencyAuthority" : authorization,
                            "pledgeMoney" : bond,
                            "productDiscount" : discount,
                            "remark" : remark,
                            "price" : price,
                            "taskAmount" : taskAmount,
                            "contractType" : setvalue,
                            "attachment" : attachment,
                            "dataType" : "1"
                        };
                        self.model.unset("id");
                        self.model.save({
                            param : param
                        }, {
                            success : function(cols, resp, options) {
                                $.success("添加成功", null, null, function() {
                                  self.load();
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
                        appRouter.navigate("enterprise", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $("#__region").html("<option value=''>选择所属团队</option>" + getRegionOption());
                $("#authorization").html("<option value=''>选择代理授权</option>"+getJOption(appcan.authorization));
                $("#discount").html("<option value=''>折扣</option>"+getJOption(appcan.discount));
                $(".input-daterange").datepicker({
                        format : 'yyyy-mm-dd',
                        weekStart : 0,
                        todayHighlight : true,
                        autoclose : true,
                    });
                $("#city_1").citySelect({
                    nodata: "none",
                    required: false
                });
                 $('#productForm').bootstrapValidator({
                    message : '无效的数值!',
                    feedbackIcons : {
                        valid : 'glyphicon glyphicon-ok',
                        invalid : 'glyphicon glyphicon-remove',
                        validating : 'glyphicon glyphicon-refresh'
                    },
                    fields : {
                        addcompanyName : {
                            validators : {
                                notEmpty : {
                                    message : '企业名称不能为空!'
                                },
                                stringLength: {
                                    max: 40,
                                    message: '企业名称必须小于40个字'
                                }
                              }
                        },
                         mobile : {
                            validators : {
                                notEmpty : {
                                    message : '手机号码不能为空!'
                                },
                                stringLength: {
                                    max: 11,
                                    message: '手机号码必须小于11个字符'
                                }
                              }
                        },
                         teleNo : {
                            validators : {
                                notEmpty : {
                                    message : '电话不能为空!'
                                }
                              }
                        },
                         contactName : {
                            validators : {
                                notEmpty : {
                                    message : '联系人不能为空!'
                                },
                                stringLength: {
                                    max: 40,
                                    message: '联系人必须小于40个字'
                                }
                              }
                        },
                        __region : {
                            validators : {
                                notEmpty : {
                                    message : '所属团队不能为空!'
                                }
                              }
                        },
                        address : {
                            validators : {
                                notEmpty : {
                                    message : '联系地址不能为空!'
                                }
                              }
                        },
                         postcode : {
                            validators : {
                                notEmpty : {
                                    message : '邮编不能为空!'
                                },
                                regexp: {
                                    regexp: /^[0-9]\d{5}$/,
                                    message: '邮编格式不正确!'
                                },
                              }
                        },
                        legalPerson : {
                            validators : {
                                notEmpty : {
                                    message : '企业法人不能为空!'
                                }
                              }
                        },
                        registerFund : {
                            validators : {
                                notEmpty : {
                                    message : '注册资金不能为空!'
                                },
                                regexp: {
                                    regexp: /^[0-9\.]+$/,
                                    message: '注册资金格式不正确!'
                                },
                              }
                        },
                        authorizedArea : {
                            validators : {
                                notEmpty : {
                                    message : '授权地区不能为空!'
                                }
                              }
                        },
                         licensingIndustry : {
                            validators : {
                                notEmpty : {
                                    message : '授权行业不能为空!'
                                }
                              }
                        },
                         // startTime : {
                            // validators : {
                                // notEmpty : {
                                    // message : '授权期限不能为空!'
                                // }
                              // }
                        // },
                         authorization : {
                            validators : {
                                notEmpty : {
                                    message : '代理授权不能为空!'
                                }
                              }
                        },
                        bond : {
                            validators : {
                                notEmpty : {
                                    message : '保证金不能为空!'
                                },
                                 regexp: {
                                    regexp: /^[0-9\.]+$/,
                                    message: '保证金格式不正确!'
                                },
                              }
                        },
                        price : {
                            validators : {
                                notEmpty : {
                                    message : '价格不能为空!'
                                },
                                regexp: {
                                    regexp: /^[0-9\.]+$/,
                                    message: '价格格式不正确!'
                                },
                              }
                        },
                        taskAmount : {
                            validators : {
                                notEmpty : {
                                    message : '任务额不能为空!'
                                },
                                regexp: {
                                    regexp: /^[0-9\.]+$/,
                                    message: '任务额格式不正确!'
                                },
                              }
                        },
                         optionsRadiosinline : {
                            validators : {
                                notEmpty : {
                                    message : '合同类型不能为空!'
                                },
                              }
                        }
                    }
                });
            }
        });
    }
});
var enterpriseViewInstance = new marketListView();
function preview(urlVal) {
    enterpriseViewInstance.preview(urlVal);
}
