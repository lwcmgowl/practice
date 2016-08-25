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
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #expedm' : 'exportFileEDM',
        'click #clear':'clear',
        'click #del' : 'delMarket',
        'click #assign' : 'assignMarket',
        "click #mask" : function() {
            this.hideDetail();
        },
        "click #marketDynamic" : function() {
            this.marketManageDynamic()
        },
        "click #marketInfo" : function() {
            this.marketManageInfoList(this.model.get("id"));
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
                $('.dropdown').removeClass('open');
            }
        }
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    delMarket : function() {
        var self = this;
        var id=self.model.get("id");
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
                                    self.load();
                                    self.hideDetail();
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
    assignMarket : function() {
        var self = this;
        var id=self.model.get("id");
        var assignInfo = this.collection.get(id).toJSON();
        self.listDict(assignInfo);
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
                                   self.load();
                                   self.hideDetail();
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
            ifAffirm : "",
            profession : professiona,
            region : region,
            dataSource : dataSource,
            companyName : companyName,
            marketQuery : marketQuery,
            province : province,
        };
        new DataTable({
            id : '#datatableOffical',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/marketing/pageNotAuthority',
                data : param
            },
            columns : [{
                "data" : "companyName",
                "title" : "客户名称"
            },{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "tip" : true,
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "tip" : true,
                "title" : "电话"
            }, {
                "data" : "dataSource",
                "title" : "数据来源"
            }, {
                "data" : "professionName",
                 "tip" : true,
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "tip" : true,
                "title" : "所属团队"
            }, {
                "data" : "province",
                 "tip" : true,
                "title" : "所属省份"
            }, {
                "data" : "marketUserName",
                 "tip" : true,
                "title" : "负责人"
            },{
                "data" : "createdAt",
                 "tip" : true,
                "title" : "创建时间"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='marketManageViewInstance.marketManageDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;

                }
            },{
                targets : 4,
                render : function(i, j, c) {
                    if (c.dataSource)
                        return '<div class="ut-s" title='+appcan.clueSources[c.dataSource]+'>' + appcan.clueSources[c.dataSource] + '</div>';
                    else
                        return '';
                }
            },{
                targets : 9,
                render : function(i, j, c) {
                     if (c.createdAt)
                        return toDateString(c.createdAt);
                    else
                        return '';
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
    marketManageDetail:function(id){
        var self = this;
        var pushRight = document.getElementById('pushRight');
        classie.addClass(pushRight, 'cbp-spmenu-open');
        $("#mask").css("height", $(document).height());
        $("#mask").css("width", $(document).width());
        $("#mask").show();
        self.model.set("id", id);
        var html = '<div style="border-bottom: 1px solid #ededed; position: absolute;width: 100%;left: 0;top: 30px;"> </div>';
        html += handlerRow(id, "edit");
        $("#buttons").html(html);
        self.marketManageInfoList(id);
    },
    marketManageInfoList:function(id){
         var self = this;
        $("#marketInfo").addClass("active");
        $("#marketDynamic").removeClass("active");
        var flag=1;
        var listviewDetail = ["assets/services/listviewDetail.js", "assets/models/listviewDetail.js", "assets/views/listviewDetail.js"];
        loadSequence(listviewDetail, function() {
            var marketdetailInstance = new marketdetailView();
            marketdetailInstance.load(id,flag);
        });
    },
     marketManageDynamic : function() {
        $("#marketInfo").removeClass("active");
        $("#marketDynamic").addClass("active");
        var objEntityTypeId = "01";
        var editType = 2;
        var objId = this.model.get("id");
        var dynamicOffical = ['assets/services/dynamicOfficalTest.js', 'assets/models/dynamicOfficalTest.js', 'assets/views/dynamicOfficalTest.js'];
        loadSequence(dynamicOffical, function() {
            dynamicViewObj.getDynamicData(objId, objEntityTypeId, editType);
        });
    },
      hideDetail : function() {
        var self = this;
        var pushRight = document.getElementById('pushRight');
        classie.removeClass(pushRight, 'cbp-spmenu-open');
        $("#mask").hide();
    },
    exportFile : function() {
        var marketUserId = appcanUserInfo.userId;
        var marketQuery = $.trim($("#principal").val());
        var province = $.trim($("#province").val());
        var data = {
            "entityType" : "officialMarketing",
            "dataType" : "0",
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
var marketManageViewInstance = new marketListView();