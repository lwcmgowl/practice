//加载并初始化模板对象
var clueTemplate = loadTemplate("assets/templates/staff/clueList.html");
//列表容器VIEW
var clueListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection : new BaseTableCollection(),
    bindings : {
        "#industrycategory" : {
            observe : 'industrycategory'
        },
        "#bigRegions" : {
            observe : 'bigRegions'
        },
        "#clueState" : {
            observe : 'clueState'
        },
        "#csmName" : {
            observe : 'csmName'
        },
        "#reportPeople" : {
            observe : 'reportPeople'
        },
        "#responsibilityPeople" : {
            observe : 'responsibilityPeople'
        }

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        'click #distribution' : function() {
            this.assign();
        },
        'click #transfer' : 'transfer',
        'click #assign' : 'assign',
        'click #cancel' : 'cancel',
         "click #mask" : function() {
            this.hideDetail();
        },
        "click #clueDynamic" : function() {
            this.clueManageDynamic()
        },
        "click #clueInfo" : function() {
            this.clueManageDetailList(this.model.get("id"));
        },
    },
    model : new clueModel(),
    template : clueTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#clueState").html("<option value=''>选择线索状态</option>" + getJOption(appcan.clueState));
        $("#bigRegions").html("<option value=''>选择所属团队</option>" + getRegionOption());
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.tradeList));
            },
            error : function(cols, resp, options) {

            },
            type : 1
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
                clueViewInstance.load();
                $('.dropdown').removeClass('open');
            }
        }
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function(direction) {
        var self = this;
        var loginId = appcanUserInfo.userId;
        var param = {
            "profession" : $('#profession').val(),
            "region" : $('#bigRegions').val(),
            "csmName" : $.trim($('#csmName').val()),
            "companyName" : $.trim($('#csmName').val()),
            "clueState" : $('#clueState').val(),
            "dataType" : 1,
            "salesQuery" : $.trim($('#responsibilityPeople').val()),
            "marketQuery" : $.trim($('#reportPeople').val())
        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/clue/pageNotAuthority',
                data : param
            },
            columns : [ {
                "data" : "companyName",
                "title" : "客户名称"
            },{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "title" : "电话"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {//线索上报人
                "data" : "marketUserName",
                "title" : "线索上报人"
            }, {
                "data" : "salesUserName",
                "title" : "线索负责人"
            }, {
                "data" : "clueState",
                "title" : "线索状态"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='clueViewInstance.clueManageDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;
                }
            },{
                targets : 8,
                render : function(i, j, c) {
                    if (c.clueState) {
                        return appcan.clueState[parseInt(c.clueState)];
                    } else {
                        return '';
                    }
                }
            }, {
                targets : 9,
                render : function(i, j, c) {
                    var submitState = parseInt(c.submitState);
                    var salesUserId = c.salesUserId;
                    var clueState = parseInt(c.clueState);
                    var marketUserId = c.marketUserId;
                    var html = "<a class='btn btn-default btn-xs' href='#dynamicEdit/" + c.id + "/02/2/" + encodeURIComponent(c.companyName) + "'>跟进动态</a> &nbsp;" + '<a class="btn btn-default btn-xs" href="#clueDetail/' + c.id + '">查看</a> ';
                    html += handlerRow(encodeURIComponent(JSON.stringify(c)), 'transfer', 'assign', 'cancel');
                    var req = new Request();
                    var btns = req.getParameter('btns');
                    btns = btns.split(',');
                    for (var i = 0; i < btns.length; i++) {
                        if (clueState != 2) {
                            if (btns[i] == "transfer") {
                                if (salesUserId != null) {
                                    html += '<a class="btn btn-default btn-xs" href="#transfer/' + c.id + '">转移 </a>';
                                }
                            }
                            if (btns[i] == "assign") {
                                if (salesUserId == null) {
                                    html += '<a class="btn btn-default btn-xs" href="#assign/' + c.id + '">分配 </a>';
                                }
                            }
                            if (btns[i] == "cancel") {
                                if (salesUserId == null && marketUserId != null) {
                                    html += '<a class="btn btn-default btn-xs" href="#cancel/' + c.id + '">取消上报 </a>';
                                }
                            }
                        }
                    }
                    return html;
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });

    },
   clueManageDetail:function(id){
        var self = this;
        var pushRight = document.getElementById('pushRight');
        var info = this.collection.get(id).toJSON();
        var submitState = parseInt(info.submitState);
        var salesUserId = info.salesUserId;
        var clueState = parseInt(info.clueState);
        var marketUserId = info.marketUserId;
        classie.addClass(pushRight, 'cbp-spmenu-open');
        $("#mask").css("height", $(document).height());
        $("#mask").css("width", $(document).width());
        $("#mask").show();
        self.model.set("id", id);
        var html = '<div style="border-bottom: 1px solid #ededed; position: absolute;width: 100%;left: 0;top: 30px;"> </div>';
         html += handlerRow(id, 'transfer', 'assign', 'cancel');
                    var req = new Request();
                    var btns = req.getParameter('btns');
                    btns = btns.split(',');
                    for (var i = 0; i < btns.length; i++) {
                        if (clueState != 2) {
                            if (btns[i] == "transfer") {
                                if (salesUserId != null) {
                                    html += '<a href="javascript:;" class="rowstyle" id="transfer"><i class="fa fa-retweet" aria-hidden="true"></i>转移 </a>';
                                }
                            }
                            if (btns[i] == "assign") {
                                if (salesUserId == null) {
                                    html += '<a href="javascript:;" class="rowstyle" id="assign"><i class="fa fa-share-alt" aria-hidden="true"></i>分配 </a>';
                                }
                            }
                            if (btns[i] == "cancel") {
                                if (salesUserId == null && marketUserId != null) {
                                    html += '<a href="javascript:;" class="rowstyle" id="cancel"><i class="fa fa-times-circle" aria-hidden="true"></i>取消上报 </a>';
                                }
                            }
                        }
                    }
        $("#buttons").html(html);
        self.clueManageDetailList(id);
    },
    clueManageDetailList:function(id){
            var self = this;
            $("#clueInfo").addClass("active");
            $("#clueDynamic").removeClass("active");
            var flag=3;
            myResponsibleCluesListDetail=["assets/services/myResponsibleCluesListDetail.js", "assets/models/myResponsibleCluesListDetail.js", "assets/views/myResponsibleCluesListDetail.js"];
            loadSequence(myResponsibleCluesListDetail, function() {
           var myResponsibleCluesListDetailInstance = new myResponsibleCluesListDetailView();
            myResponsibleCluesListDetailInstance.load(id,flag);
        });
        
    },
    clueManageDynamic:function(){
        $("#clueInfo").removeClass("active");
        $("#clueDynamic").addClass("active");
        var objEntityTypeId = "02";
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
    assign : function() {//分配
        var self = this;
        var id=self.model.get("id");
        var info = this.collection.get(id).toJSON();
        this.listDict(info);
        var region = info.region;
        var profession = info.profession;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : "分配线索",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        // var data = {};
                        //行业类别
                        var region = $("#aregion").val();
                        var profession = $('#aprofession').val();
                        var assigner = $("#assigner").val();
                        if (assigner == '00') {
                            $("#assigner").parent().addClass("has-error");
                            $("#assigner").focus();
                            $.danger('请选择线索分配人');
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
                            type : 2,
                            "id" : info.id,
                            "assigner" : assigner,
                            "region" : region,
                            "clueType" : 1,
                            "profession" : profession
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
                $("#companyName1").html(info.companyName);
                $("#tregion").change(function() {
                    if ($("select option").is(":selected")) {
                        region = $(this).val();
                        self.getMarketPerson(region, profession);
                        ;
                    }
                });
                $("#tprofession").change(function() {
                    if ($("select option").is(":selected")) {
                        profession = $(this).val();
                        self.getMarketPerson(region, profession);
                        ;
                    }
                });
            }
        });
    },
    listDict : function(info) {
        var self = this;
        var region = info.region;
        var profession = info.profession;
        this.model.fetch({
            success : function(cols, resp, options) {
                var optionHTML = "";
                var tradeHTML = "";
                var teamList = resp.msg.teamList;
                //大区
                var tradeList = resp.msg.tradeList;
                //行业
                for (var i = 0; i < teamList.length; i++) {
                    optionHTML += "<option value='" + teamList[i].id + "' >" + teamList[i].name + "</option>";
                }
                $("#tregion").append(optionHTML);
                $('#tregion  option[value=' + region + ']').attr("selected", true)
                for (var i = 0; i < tradeList.length; i++) {
                    tradeHTML += "<option value='" + tradeList[i].id + "' >" + tradeList[i].name + "</option>";
                }
                $("#tprofession").append(tradeHTML);
                $('#tprofession  option[value=' + profession + ']').attr("selected", true)
                self.getMarketPerson(region, profession);
            },
            error : function(cols, resp, options) {
            },
            type : 3
        });
    },
    getMarketPerson : function(region, profession) {//选择负责人
        var self = this;
        this.model.fetch({
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                var arr = ['<option value="00">请选择线索分配人</option>'];
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if (fullName) {
                        var str = '<option value="' + staffId + '">' + fullName + '</option>';
                        arr.push(str)
                    }
                }
                $("#assigner").html(arr.join(''));
            },
            error : function(cols, resp, options) {

            },
            type : 4,
            region : region,
            profession : profession
        });
    },
    delinfo : function() {
        var self = this;
        var id=self.model.get("id");
        this.model.set({
            id : id
        });
        bootbox.dialog({
            message : $("#delinfo").html(),
            title : "您确认取消上报此数据吗?",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        self.model.destroy({
                            success : function(cols, resp, options) {
                                $.success("取消上报成功", null, null, function() {
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
            complete : function() {

            }
        });
    },
    //转移
    transfer : function() {
        var self = this;
        var id=self.model.get("id");
        var info = this.collection.get(id).toJSON();
        this.listDict(info);
        var region = info.region;
        var profession = info.profession;
        self.getMarketPerson1(region, profession);
        bootbox.dialog({
            message : $("#transfer1").html(),
            title : "转移线索",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var region = $("#tregion").val();
                        var profession = $('#tprofession').val();
                        var assigner = $("#transferPerson").val();
                        if (assigner == '00') {
                            $("#transferPerson").parent().addClass("has-error");
                            $("#transferPerson").focus();
                            $.danger('请选择线索负责人');
                            return false;
                        }
                        self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("转移成功", null, null, function() {
                                    self.load();
                                    self.hideDetail();
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                            type : 5,
                            "id" : info.id,
                            "salesUserId" : assigner,
                            "region" : region,
                            "profession" : profession
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
                $("#tmplCompanyName").html(info.companyName);
                $("#tregion").change(function() {
                    if ($("select option").is(":selected")) {
                        region = $(this).val();
                        self.getMarketPerson1(region, profession);
                        ;
                    }
                });
                $("#tprofession").change(function() {
                    if ($("select option").is(":selected")) {
                        profession = $(this).val();
                        self.getMarketPerson1(region, profession);
                        ;
                    }
                });
            }
        });
    },
    getMarketPerson1 : function(region, profession) {
        var data = {
            "roleType" : 0,
            "regionId" : region,
            "tradeId" : profession
        };
        ajax({
            url : "/clue/listStaff",
            data : data,
            success : function(data) {
                var arr = ['<option value="00">请选择线索负责人</option>'];
                var perArr = data.msg.list;
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if (fullName) {
                        var str = '<option value="' + staffId + '">' + fullName + '</option>';
                        arr.push(str)
                    }

                }
                $("#transferPerson").html(arr.join(''));
            }
        });
    },
    exportFile : function() {
        var data = {
            "entityType" : "exportClueManage",
            "profession" : $('#profession').val(),
            "region" : $('#bigRegions').val(),
            "companyName" : $.trim($('#csmName').val()),
            "clueState" : $('#clueState').val(),
            "salesQuery" : $.trim($('#responsibilityPeople').val()),
            "marketQuery" : $.trim($('#reportPeople').val()),
            "dataType" : '1'
        };
        var url = "/clue/exportClue";
        clueViewService.exportFile(data, url)
    }
});

var clueViewInstance = new clueListView();
