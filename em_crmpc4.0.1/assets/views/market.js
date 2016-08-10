//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/marketList.html");

//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#offical',
    collection : new BaseTableCollection(),
    bindings : {
        "#clueSource" : {
            observe : 'clueSource'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#region" : {
            observe : 'region'
        },
        "#province" : {
            observe : 'province'
        },
        "#companyName" : {
            observe : 'companyName'
        },
        "#principal" : {
            observe : 'principal'
        }

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        'click #expedm' : 'exportFileEDM',
        'click #add' : 'add',
        'click #clear':'clear'
    },
    model : new marketModel(),
    template : marketTemplate,
    // collection : new marketCollection(),

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        $('#pending').empty();
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#province").html("<option value=''>选择所属省份</option>" + getOption(appcan.province));
        for (var n = 0; n < appcan.clueSources.length; n++) {
            var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
            $("#clueSource").append(str);
        };
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#region").html("<option value=''>选择所属团队</option>" + profession(resp.msg.teamList));
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.tradeList));

            },
            error : function(cols, resp, options) {

            },
            type : 1
        });
        $("#add").attr("href", "#addMarket/1");
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
        }
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    delinfo : function(id) {
        var self = this;
        this.model.set({
            id : id
        });
        bootbox.dialog({
            message : $("#delState").html(),
            title : "确定删除此条营销数据?",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        self.model.destroy({
                            success : function(cols, resp, options) {
                                $.success("删除成功", null, null, function() {
                                    // marketViewInstance.load();
                                    appRouter.navigate("offical", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("offical", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function(list) {

            }
        });
    },
    exportFileEDM : function() {
        var marketUserId = appcanUserInfo.userId;
        var marketQuery = $.trim($("#principal").val());
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "marketingDataEDM",
            "dataType" : "0",
            "ifAffirm" : "0",
            "profession" : $("#profession").val(),
            "region" : $("#region").val(),
            "dataSource" : $("#clueSource").val(),
            "province" : province,
            "marketQuery" : marketQuery,
            "companyName" : $.trim($("#companyName").val())
        };
        var url = "/marketing/expedmExportNotAuthority";
        marketViewService.exportFile(data, url)

    },
    assign : function(id) {
        var self = this;
        var assignInfo = this.collection.get(id).toJSON();
        this.listDict(assignInfo);
        bootbox.dialog({
            message : $("#transfer1").html(),
            title : "分配营销数据",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        var region = $("#transferTeam").val();
                        var assigner = $("#transferPerson").val();
                        var profession = $('#transferProductType').val();
                        if (assigner == '00') {
                            $("#transferPerson").parent().addClass("has-error");
                            $("#transferPerson").focus();
                            $.danger('请选择营销数据负责人');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("分配成功", null, null, function() {
                                    // marketViewInstance.load();
                                    appRouter.navigate("offical", {
                                        trigger : true
                                    });
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 4,
                            id : assignInfo.id,
                            marketUserId : assigner,
                            region : region,
                            profession : profession

                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        appRouter.navigate("offical", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                var region = assignInfo.region;
                var profession = assignInfo.profession;
                $("#tmplCompanyName").html(assignInfo.companyName);
                $("#transferTeam").change(function() {
                    if ($("select option").is(":selected")) {
                        region = $(this).val();
                        self.getMarketPerson(region, profession);
                    }
                });
                $("#transferProductType").change(function() {
                    if ($("select option").is(":selected")) {
                        profession = $(this).val();
                        self.getMarketPerson(region, profession);
                        ;
                    }
                });
            }
        });

    },
    listDict : function(assignInfo) {
        var self = this;
        var region = assignInfo.region;
        var profession = assignInfo.profession;
        this.model.fetch({
            success : function(cols, resp, options) {
                var optionHTML = "";
                var tradeHTML = "";
                var teamList = resp.msg.teamList;
                //行业
                var tradeList = resp.msg.tradeList;
                for (var i = 0; i < teamList.length; i++) {
                    optionHTML += "<option value='" + teamList[i].id + "' >" + teamList[i].name + "</option>";
                }
                $("#transferTeam").append(optionHTML);
                $('#transferTeam  option[value=' + region + ']').attr("selected", true)
                for (var i = 0; i < tradeList.length; i++) {
                    tradeHTML += "<option value='" + tradeList[i].id + "' >" + tradeList[i].name + "</option>";
                }
                $("#transferProductType").append(tradeHTML);
                $('#transferProductType  option[value=' + profession + ']').attr("selected", true);
                self.getMarketPerson(region, profession);
            },
            error : function(cols, resp, options) {
            },
            type : 2
        });
    },
    getMarketPerson : function(region, profession) {
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                var arr = ['<option value="00">请选择营销数据负责人</option>'];
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if (fullName) {
                        var str = '<option value="' + staffId + '">' + fullName + '</option>';
                        arr.push(str);
                    }

                }
                $("#transferPerson").html(arr.join(''));
            },
            error : function(cols, resp, options) {

            },
            type : 3,
            region : region,
            profession : profession
        });
    },
    load : function() {
        var self = this;
        //行业类别
        var professiona = $("#profession").val();
        //所属团队
        var region = $("#region").val();
        //数据来源
        var dataSource = $("#clueSource").val();
        //客户名称
        var companyName = $.trim($("#companyName").val());
        //省
        var province = $.trim($("#province").val());
        var marketUserId = appcanUserInfo.userId;
        var marketQuery = $.trim($("#principal").val());
        var param = {
            dataType : "0",
            ifAffirm : "0",
            profession : professiona,
            region : region,
            dataSource : dataSource,
            companyName : companyName,
            marketQuery : marketQuery,
            province : province,
            condition : {
                "pageNo" : 1,
                "rowCnt" : 10
            }
        };
        new DataTable({
            id : '#datatableOffical',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/marketing/pageNotAuthority',
                // url : urlIp+'/marketing/pageNotAuthority',
                data : param
            },
            columns : [
            //{
            // "data" : "",
            // "title" : ""
            // },
            {
                "data" : "contactName",
                "width" : "100px",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "class" : "tel",
                "tip" : true,
                "width" : "110px",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "class" : "tel",
                "tip" : true,
                "width" : "120px",
                "title" : "电话"
            }, {
                "data" : "companyName",
                "title" : "客户名称"
            }, {
                "data" : "dataSource",
                "width" : "80px",
                "title" : "数据来源"
            }, {
                "data" : "conferenceName",
                "class" : "ut-s",
                "tip" : true,
                "width" : "80px",
                "title" : "会议名称"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "class" : "ut-s",
                "tip" : true,
                width:"80px",
                "title" : "所属团队"
            }, {
                "data" : "province",
                "width" : "80px",
                "title" : "所属省份"
            }, {
                "data" : "marketUserName",
                "width" : "60px",
                "title" : "负责人"
            }, {
                "data" : null,
                "width" : "180px",
                "title" : "操作"
            }],
            columnDefs : [
            // {
            // targets : 0,
            // width : "80px",
            // render : function(i, j, c) {
            // return '<input type="checkbox" name="Industry" value="' + c.id + '">';
            // }
            // },
            {
                targets : 4,
                render : function(i, j, c) {
                    if (c.dataSource)
                        return '<div class="ut-s">' + appcan.clueSources[c.dataSource] + '</div>';
                    //return appcan.clueSources[c.dataSource];
                    else
                        return '';
                }
            }, {
                targets : 10,
                render : function(i, j, c) {
                    //editType 1 可编辑 2 不可编辑
                    var editType = 2;
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicOffical/' + c.id + '/01/' + editType + '/' + encodeURIComponent(c.companyName) + '">跟进动态</a> ' +
                    //'<a href="#" onclick="plroleof(0,\'' + encodeURIComponent(JSON.stringify(c)) + '\')">提交上报</a> '
                    '<a class="btn btn-default btn-xs" href="#marketDetail/' + c.id + '">查看</a> '
                    // +      '<a href="marketing_add.html?id='+c.id+'" id="edit">编辑</a> '
                    //                                          + '<a href="#" onclick="delMarket(\''+c.id+'\')">删除</a> ';
                    +'<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">'
                    html += handlerRow(c.id + '-1');
                    html += '</ul></div>';
                    return html;
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
    exportFile : function() {
        var marketUserId = appcanUserInfo.userId;
        var marketQuery = $.trim($("#principal").val());
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "officialMarketing",
            "dataType" : "0",
            //"ifAffirm" : "0",
            "profession" : $("#profession").val(),
            "region" : $("#region").val(),
            "dataSource" : $("#clueSource").val(),
            "companyName" : $.trim($("#companyName").val()),
            "marketQuery" : marketQuery,
            "province" : province
        };
        var url = "/marketing/exportNotAuthority";
        marketViewService.exportFile(data, url)
    }
});
var marketViewInstance = new marketListView();