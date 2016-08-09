//加载并初始化模板对象
var detailEditMainTemplate = loadTemplate("assets/templates/customer/detailEdit.html");
//列表容器VIEW
var detailEditModelMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#detailpartdiv',
    model : new detailEditModel(),
    template : detailEditMainTemplate,
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    events : {
        'class #btn btn-default' : 'backHref'
    },
    intInfo : function(id) {
        var self=this;
        self.render();
        self.getDetailData(id);
    },
    getDetailData : function(detailId) {
        var self = this;
        $.fn.editable.defaults.mode = 'inline';
        this.model.fetch({
            success : function(cols, resp, options) {
                var info=resp.msg.item;
                $('#topCusStat').editable({
                    value : info.csmStatId,
                    source : [{
                        value : 0,
                        text : '目标客户'
                    }, {
                        value : 1,
                        text : '意向客户'
                    }, {
                        value : 2,
                        text : '成单客户'
                    }, {
                        value : 3,
                        text : '长期客户'
                    }],
                });
                $("#title").html(info.csmName);
                $("#editCsmName").html(info.csmName);
                $("#editCsmName").editable({
                   validate : function(value) {
                        if ($.trim(value) == ''){
                            return '客户名称不能为空!';
                        }else if($.trim(value).length>=40){
                            return '客户名称字符个数超过限制!';
                        }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            csmName : value.value,
                            id : detailId
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
                $('#editcsmStatId').editable({
                    value : info.csmStatId,
                    source : [{
                        value : 0,
                        text : '目标客户'
                    }, {
                        value : 1,
                        text : '意向客户'
                    }, {
                        value : 2,
                        text : '成单客户'
                    }, {
                        value : 3,
                        text : '长期客户'
                    }],
                });
                $('#editLevel').editable({
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
                            return $.post(urlIp + '/custom/edit',{
                                level : value.value,
                                id : detailId
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
                $('#editRegion').editable({
                    value: info.region,    
                    source:getMyRegion().regions,
                      url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            region : value.value,
                            id : detailId
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
                $('#editProfession').editable({
                    value: info.profession,    
                    source:getPro(info.region),
                     url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            profession : value.value,
                            id : detailId
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
                $('#editProvince').editable({
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
                            return $.post(urlIp + '/custom/edit',{
                                province : value.value,
                                id : detailId
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
                $('#editCsmNature').editable({
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
                            return $.post(urlIp + '/custom/edit',{
                                csmNature : value.value,
                                id : detailId
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
                $('#editCsmScale').editable({
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
                            return $.post(urlIp + '/custom/edit',{
                                csmNature : value.value,
                                id : detailId
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
                 self.getCustom(info.upperCompany,function(str){
                                     $('#upperCompanyName').editable({
                                        type: 'text',
                                        value : info.upperCompany,
                                        source : str,
                                        url : function(value) {
                                            return $.post(urlIp + '/custom/edit',{
                                                upperCompany : value.value,
                                                id : detailId
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
                 });
              $("#editaddress").html(info.address);
                    $("#editaddress").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            address : value.value,
                            id : detailId
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
                $("#editpostcode").html(info.postcode);
                 $("#editpostcode").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!re2.test($.trim(value))){
                                   return "请输入正确的邮政编码!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            postcode : value.value,
                            id : detailId
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
                 $("#editwebsite").html(info.website);
                 $("#editwebsite").editable({
                    type : 'text',
                    validate : function(value) {
                             if (!Expression.test($.trim(value))){
                                   return "请输入正确的网址!";
                              }
                    },
                    url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            website : value.value,
                            id : detailId
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
                 $("#editfax").html(info.fax);
                 $("#editfax").editable({
                    type : 'text',
                    url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            fax : value.value,
                            id : detailId
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
                $("#editremark").html(info.remark);
                 $("#editremark").editable({
                    type : 'textarea',
                    rows: 10,
                    url : function(value) {
                        return $.post(urlIp + '/custom/edit', {
                            remark : value.value,
                            id : detailId
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
                 $("#editsalesUserId").html(info.salesUserName);
                 $('#topCusStat,#editcsmStatId,#editsalesUserId').editable('disable');
            },
            error : function(cols, resp, options) {
            },
            id : detailId
        });
    },
     getCustom : function(upperCompanyId, cb) {
        var self = this;
        var customers=[];
        self.model.fetch({
            success : function(cols, resp, options) {
                var arr = resp.msg.list;
                if (arr != undefined) {
                    for (var i = 0; i < arr.length; i++) {
                        if (upperCompanyId && (upperCompanyId == arr[i]["id"])) {
                        var str = {
                            text : arr[i].csmName,
                            value : arr[i].id
                              };
                        customers.push(str);
                        } else {
                        var str = {
                            text : arr[i].csmName,
                            value : arr[i].id
                                  };
                        customers.push(str);
                        }
                    }
                    cb(customers);
                }
            },
            error : function(cols, resp, options) {

            },
            type:1
        });

    }
});

