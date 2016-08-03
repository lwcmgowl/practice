//加载并初始化模板对象
var marketUnclearTemplate = loadTemplate("assets/templates/staff/unclear.html");

//列表容器VIEW
var marketUnclearListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#pending',
    collection:new BaseTableCollection(),
    bindings : {
        "#clueSource1" : {
            observe : 'clueSource1'
        },
        "#profession1" : {
            observe : 'profession1'
        },
        "#region1" : {
            observe : 'region1'
        },
        "#province1" : {
            observe : 'province1'
        },
        "#companyName1" : {
            observe : 'companyName1'
        },
        "#principal1" : {
            observe : 'principal1'
        }

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile'
    },
    model : new marketModel(),
    template : marketUnclearTemplate,
    // collection : new marketCollection(),

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        $('#offical').empty();
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#expedm").parent().hide();
        $("#province1").html("<option value=''>选择所属省份</option>" + getOption(appcan.province));
        for (var n = 0; n < appcan.clueSources.length; n++) {
            var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
            $("#clueSource1").append(str);
        };
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#region1").html("<option value=''>选择所属团队</option>" + profession(resp.msg.teamList));
                $("#profession1").html("<option value=''>选择行业类别</option>" + profession(resp.msg.tradeList));

            },
            error : function(cols, resp, options) {

            },
            type : 1
        });
        $("#add").attr("href", "#addMarket/2");
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
                                    appRouter.navigate("pending", {
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
                        appRouter.navigate("pending", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {

            }
        });
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
                                    appRouter.navigate("pending", {
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
                        appRouter.navigate("pending", {
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
                    if(fullName){
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
        //alert(this.model.get("noticeTtl"));
        var self = this;
        //行业类别
        var professiona = $("#profession1").val();
        //所属团队
        var region = $("#region1").val();
        //数据来源
        var dataSource = $("#clueSource1").val();
        //客户名称
        var companyName = $.trim($("#companyName1").val());
        //省
        var province = $.trim($("#province1").val());
        var marketUserId = appcanUserInfo.userId;
        var marketQuery = $.trim($("#principal1").val());
        var param = {
            dataType : "0",
            ifAffirm : "1",
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
            id : '#datatablePending',
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
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "class" : "tel",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "class" : "tel",
                "title" : "电话"
            }, {
                "data" : "companyName",
                "title" : "客户名称"
            }, {
                "data" : "dataSource",
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
                "title" : "所属团队"
            }, {
                "data" : "province",
                "title" : "所属省份"
            }, {
                "data" : "marketUserName",
                "title" : "负责人"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
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
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicEditUnclear/' + c.id + '/01/' + editType + '/' + encodeURIComponent(c.companyName) + '">跟进动态</a> ' +
                    //'<a href="#" onclick="plroleof(0,\'' + encodeURIComponent(JSON.stringify(c)) + '\')">提交上报</a> '
                    '<a class="btn btn-default btn-xs" href="#marketpeingDetail/' + c.id + '">查看</a> '
                    // +       '<a href="marketing_add.html?id='+c.id+'" id="edit">编辑</a> '
                    //                                          + '<a href="#" onclick="delMarket(\''+c.id+'\')">删除</a> ';
                    +'<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">'
                    html += handlerRow(c.id + '-2');
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
        var marketQuery = $.trim($("#principal1").val());
        var province = $.trim($("#province1").val());
        var data = {
            "entityType" : "officialMarketing",
            "dataType" : "0",
            "ifAffirm" : "1",
            "profession" : $("#profession1").val(),
            "region" : $("#region1").val(),
            "dataSource" : $("#clueSource1").val(),
            "companyName" : $.trim($("#companyName1").val()),
            "marketQuery" : marketQuery,
            "province" : province
        };
        var url = "/marketing/exportNotAuthority";
        marketViewService.exportFile(data, url)
    }
});
var unclearViewInstance = new marketUnclearListView();
