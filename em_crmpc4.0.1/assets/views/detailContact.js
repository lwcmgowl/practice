//加载并初始化模板对象
var marketdetailTemplate = loadTemplate("assets/templates/staff/detailContact.html");

//列表容器VIEW
var contactDetailView = Backbone.View.extend({
    initialize : function() {
        
    },
    el : '#detailpartdiv',
    render : function() {
        this.$el.empty();
        var el =  $(this.template());
        this.$el.append(el);
    },
    model : new marketDetailModel(),
    template : marketdetailTemplate,
    load : function(direction) {
        var self = this;
        self.render();
        $.fn.editable.defaults.mode = 'inline';
         if(window.screen.width>1440){
            $("#partnerDetail").css("max-height","850px")
        }else{
            $("#partnerDetail").css("max-height","500px")
        }
        self.model.fetch({
            success : function(cols, resp, options) {
               var info=resp.msg.item;
                $(".field_edit_pen").click(function(){
                    self.fieldshow();
                })
                $("#contactTitle").html(info.contactName);
                $("#contactNameDetail").html(info.csmName+'<span id="contactMobi" style="margin-left:10px;margin-right:10px;"></span><span id="division">|</span><span id="contactTele" style="margin-left:10px;"></span>');
                if(info.mobile && info.teleNo){
                   $("#contactMobi").show();
                   $("#contactMobi").html(info.mobile);
                   $("#contactTele").show();
                   $("#contactTele").html(info.teleNo); 
                };
                if(info.teleNo && !info.mobile){
                    $("#contactTele").show();
                    $("#contactTele").html(info.teleNo);
                    $("#division").hide();
                };
                if(!info.teleNo && info.mobile){
                   $("#contactMobi").show();
                   $("#contactMobi").html(info.mobile);
                   $("#division").hide();
                };
               for(var i in info){
                var ele = $('#'+i);
                if(ele[0]){
                    ele.html(info[i]);
                }
            }
            $("#sexType").html(appcan.sex[info.sex]);
            $("#contactType").html(appcan.contactType[info.contactTypeId]);
            if(info.province != '00'){
                $('#area').append(info.province);
                }
            $("#contactName").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '联系人名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '联系人名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            contactName : value.value,
                            id : direction
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
                 $("#mobile").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '手机号码不能为空!';
                        }else if($.trim(value).length>=11){
                            return '手机号码字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            mobile : value.value,
                            id : direction
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
                $("#teleNo").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '电话号码不能为空!';
                        }else if($.trim(value).length>=20){
                            return '电话号码字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            teleNo : value.value,
                            id : direction
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
                $("#contactType").editable({
                   value :info.contactTypeId,
                    source : [{
                        value : 0,
                        text : '普通人'
                    }, {
                        value : 1,
                        text : '决策人'
                    }, {
                        value : 2,
                        text : '分项决策人'
                    }, {
                        value : 3,
                        text : '商务决策人'
                    }, {
                        value : 4,
                        text : '技术决策人'
                    },{
                        value : 5,
                        text : '财务决策人'
                    },{
                        value : 6,
                        text : '使用人'
                    },{
                        value : 7,
                        text : '意见影响人'
                    }],
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            contactTypeId : value.value,
                            id : direction
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
                 $("#sexType").editable({
                   value :info.sex,
                    source : [{
                        value : 1,
                        text : '男'
                    }, {
                        value : 2,
                        text : '女'
                    }],
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            sex : value.value,
                            id : direction
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
                 $("#birthDay").editable({
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
                    },
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            birthDay : value.value,
                            id : direction
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
                $("#department").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            department : value.value,
                            id : direction
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
                $("#post").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            post : value.value,
                            id : direction
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
                 $("#mail").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            mail : value.value,
                            id : direction
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
                 $("#qq").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            qq : value.value,
                            id : direction
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
                $("#weChat").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            weChat : value.value,
                            id : direction
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
                $("#area").editable({
                    value : info.province,
                    source : [{
                        value :"北京",
                        text : "北京"
                    }, {
                        value : "天津",
                        text : '天津'
                    }, {
                        value : "山东",
                        text : '山东'
                    }, {
                        value : "山西",
                        text : '山西'
                    }, {
                        value : "黑龙江",
                        text : '黑龙江'
                    }, {
                        value : "吉林",
                        text : '吉林'
                    }, {
                        value : "辽宁",
                        text : '辽宁'
                    }, {
                        value : "河北",
                        text : '河北'
                    }, {
                        value : "河南",
                        text : '河南'
                    }, {
                        value : "内蒙古自治区",
                        text : '内蒙古自治区'
                    }, {
                        value : "上海",
                        text : '上海'
                    }, {
                        value : "江苏",
                        text : '江苏'
                    },{
                        value : "浙江",
                        text : '浙江'
                    }, {
                        value : "安徽",
                        text : '安徽'
                    }, {
                        value : "广东",
                        text : '广东'
                    }, {
                        value : "广西",
                        text : '广西'
                    }, {
                        value : "福建",
                        text : '福建'
                    }, {
                        value : "海南",
                        text : '海南'
                    }, {
                        value : "湖北",
                        text : '湖北'
                    }, {
                        value : "湖南",
                        text : '湖南'
                    }, {
                        value : "江西",
                        text : '江西'
                    }, {
                        value : "陕西",
                        text : '陕西'
                    }, {
                        value : "甘肃",
                        text : '甘肃'
                    }, {
                        value : "青海",
                        text : '青海'
                    },{
                        value : "宁夏",
                        text : '宁夏'
                    },{
                        value : "新疆",
                        text : '新疆'
                    },{
                        value : "重庆",
                        text : '重庆'
                    },{
                        value : "四川",
                        text : '四川'
                    },{
                        value : "贵州",
                        text : '贵州'
                    },{
                        value : "云南",
                        text : '云南'
                    },{
                        value : "西藏",
                        text : '西藏'
                    },{
                        value : "香港",
                        text : '香港'
                    },{
                        value : "澳门",
                        text : '澳门'
                    },{
                        value : "台湾",
                        text : '台湾'
                    }],
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            province : value.value,
                            id : direction
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
                $("#address").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            address : value.value,
                            id : direction
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
                $("#postcode").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            postcode : value.value,
                            id : direction
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
                $("#remark").editable({
                    url : function(value) {
                        return $.post(urlIp + '/contact/edit', {
                            remark : value.value,
                            id : direction
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
                $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().hide();
                    }
                });
                     var req = new Request();
                     var flag = req.getParameter('flag');
                     if(flag!=1){
                         $('#e_contact .editable').editable('disable');
                          $(".field_edit_pen").hide();
                     }
            },
            error : function(cols, resp, options) {

            },
            id : direction
        });
         
    },
    fieldshow : function() {
          $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().toggle("slow");
                    }
                });
    }
});


