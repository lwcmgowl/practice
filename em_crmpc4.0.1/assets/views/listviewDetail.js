//加载并初始化模板对象
var marketdetailTemplate = loadTemplate("assets/templates/staff/listviewDetail.html");

//列表容器VIEW
var marketdetailView = Backbone.View.extend({
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
    load : function(direction,flag) {
        var self = this;
        self.render();
        if(window.screen.width>1440){
            $("#partnerDetail").css("max-height","820px")
        }else{
            $("#partnerDetail").css("max-height","470px")
        }
        $.fn.editable.defaults.mode = 'inline';
        this.model.fetch({
            success : function(cols, resp, options) {
                var info=resp.msg.item;
                $(".field_edit_pen").click(function(){
                    self.fieldshow();
                });
                $("#contactTitle").html(info.contactName);
                $("#contactNameDetail").html(info.companyName+'<span id="contactMobi" style="margin-left:10px;margin-right:10px;"></span><span id="division">|</span><span id="contactTele" style="margin-left:10px;"></span>');
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
                $("#ecompanyName").html(info.companyName);
                $("#ecompanyName").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '客户名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '客户名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            companyName : value.value,
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
                $("#contactName").html(info.contactName);
                $("#contactName").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '联系人名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '联系人名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                 $("#emobile").html(info.mobile);
                 $("#eteleNo").html(info.teleNo);
               $("#emobile").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '手机号码不能为空!';
                        }else if($.trim(value).length>12){
                            return '手机号码字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                $("#eteleNo").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '电话号码不能为空!';
                        }else if($.trim(value).length>=20){
                            return '电话号码字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                $('#region1').editable({
                    value: info.region,    
                    source:getMyRegion().regions,
                      url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            region : value.value,
                            id : direction
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
                $('#profession1').editable({
                    value: info.profession,    
                    source:getPro(info.region),
                     url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            profession : value.value,
                            id : direction
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
                $('#province1').editable({
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
                            return $.post(urlIp + '/marketing/edit',{
                                province : value.value,
                                id : direction
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
                $("#QQ").html(info.qq);
                 $("#QQ").editable({
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                $("#weChat").html(info.weChat);
                $("#weChat").editable({
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                $("#email").html(info.email);
                 $("#email").editable({
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            email : value.value,
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
                $("#department").html(info.department);
                $("#department").editable({
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                 $("#post").html(info.post);
                $("#post").editable({
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                $('#edataSource').editable({
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
                            return $.post(urlIp + '/marketing/edit',{
                                dataSource : value.value,
                                id : direction
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
                    $("#meeting").removeClass("hide");
                    $("#meetingName").html(info.conferenceName==""?"必填!":info.conferenceName);
                    $('#meetingName').editable({
                    type : "text",
                    validate : function(value) {
                        if ($.trim(value) == '')
                            return '会议名称不能为空!';
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            conferenceName : value.value,
                            id : direction
                        });
                    },
                    success : function(response) {
                        if (response.status == "000") {
                            $.success("编辑成功!")
                            self.load();
                           self.myReportClue(id);
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
                 $('#eproductType').editable({
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
                            return $.post(urlIp + '/marketing/edit',{
                                productType : value.value,
                                id : direction
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
                 $('#eCustomerlevel').editable({
                    value : info.level==''?"无":info.level,
                    source : [{
                        value : 0,
                        text : 'A1'
                    }, {
                        value : 1,
                        text : 'A2'
                    }, {
                        value : 2,
                        text : 'A3'
                    }, {
                        value : 3,
                        text : 'A4'
                    },{
                        value : 4,
                        text : 'B1'
                    },{
                        value : 5,
                        text : 'B2'
                    },{
                        value : 6,
                        text : 'C1'
                    }, {
                        value : 7,
                        text : 'C2'
                    },{
                        value : 8,
                        text : 'D'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/marketing/edit',{
                                level : value.value,
                                id : direction
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
                $('#ecsmNature').editable({
                    value : info.csmNature==''?"空":info.csmNature,
                    source : [{
                        value : 0,
                        text : '央企'
                    }, {
                        value : 1,
                        text : '民营企业'
                    }, {
                        value : 2,
                        text : '地市国企'
                    }, {
                        value : 3,
                        text : '股份公司'
                    },{
                        value : 4,
                        text : '事业单位'
                    },{
                        value : 5,
                        text : '上市公司'
                    },{
                        value : 6,
                        text : '中外合资'
                    }, {
                        value : 7,
                        text : '外商独资'
                    },{
                        value : 8,
                        text : '港澳台投资'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/marketing/edit',{
                                csmNature : value.value,
                                id : direction
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
                $('#ecsmScale').editable({
                    value : info.csmNature==''?"空":info.csmNature,
                    source : [{
                        value : 0,
                        text : '0-20人'
                    }, {
                        value : 1,
                        text : '20-50人'
                    }, {
                        value : 2,
                        text : '50-100人'
                    }, {
                        value : 3,
                        text : '100-200人'
                    },{
                        value : 4,
                        text : '200-500人'
                    },{
                        value : 5,
                        text : '500-1000人'
                    },{
                        value : 6,
                        text : '1000人以上'
                    }],
                     url : function(value) {
                            return $.post(urlIp + '/marketing/edit',{
                                csmNature : value.value,
                                id : direction
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
                $("#address").html(info.address);
                 $("#address").editable({
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
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
                $("#postcode").html(info.postcode);
                 $("#postcode").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!re2.test($.trim(value))){
                                   return "请输入正确的邮政编码!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            postcode : value.value,
                            id : direction
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
                 $("#website").html(info.website);
                 $("#website").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!Expression.test($.trim(value))){
                                   return "请输入正确的网址!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            website : value.value,
                            id : direction
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
                 $("#fax").html(info.fax);
                 $("#fax").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            fax : value.value,
                            id : direction
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
                    type : 'textarea',
                    rows: 10,
                    url : function(value) {
                        return $.post(urlIp + '/marketing/edit', {
                            remark : value.value,
                            id : direction
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
               $("#fzr").html(info.marketUserName);
               $(".form-group a.editable").each(function() {
                    if ($(this).text() == '' || $(this).text()=="空") {
                        $(this).parent().hide();
                    }
                });
               if(flag){
                   $("#marketDetail .editable").editable('disable');
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

var marketdetailInstance = new marketdetailView();
