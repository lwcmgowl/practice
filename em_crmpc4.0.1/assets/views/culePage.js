//加载并初始化模板对象
var culePageTemplate = loadTemplate("assets/templates/staff/culePage.html");

//列表容器VIEW
var culePageView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#notAssign',
    collection : new BaseTableCollection(),
    bindings : {

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : function() {
            this.exportFile();
        },
        'click #add' : 'add',
        'click #clear' : 'clear',
        'click #resubmit' : 'resubmit',
        "click #mask" : function() {
            this.hideDetail();
        },
        "click #clueDynamic" : function() {
            this.reportClueDynamic()
        },
        "click #clueInfo" : function() {
            this.reportClueDetailList(this.model.get("id"));
        },
    },
    model : new culePageModel(),
    template : culePageTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    notAssign : function() {
        $("#assign").empty();
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        //行业类别
        self.model.fetch({
            success : function(cols, resp, options) {
                var list = resp.msg.tradeList;
                var team = resp.msg.teamList;
                $("#industrycategory").html("<option value=''>选择行业类别</option>" + profession(list));
                $("#bigRegions").html("<option value=''>选择所属团队</option>" + profession(team));
            },
            error : function(cols, resp, options) {
            },
            type : 1
        });

        //大区
        $("#bigRegions").html("<option value=''>选择所属团队</option>" + getRegionOption());
        $('#pageNotAssign,#pageIsAssign').attr("href", function() {
            return this.href + btnHandler.btns;
        });
        $('#pageNotAssign,#pageIsAssign').hide();
        self.search();
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
                culePageViewInstance.search();
                $('.dropdown').removeClass('open');
            }
        };
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    search : function() {
        var self = this;
        var loginId = appcanUserInfo.userId;
        var param = {
            // "assigner":user.userId,
            "marketUserId" : loginId,
            "submitState" : $('#submitState').val(),
            "profession" : $('#industrycategory').val(),
            "region" : $('#bigRegions').val(),
            "companyName" : $.trim($('#csmName').val()),
            "dataType" : 1
        };

        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/clue/pageNotAssign',
                data : param
            },
            columns : [{
                "data" : "companyName",
                "title" : "客户名称"
            }, {
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
            }, {
                "data" : "assignerName",
                "title" : "线索分配人"
            }, {
                "data" : "salesUserName",
                "title" : "线索负责人"
            }, {
                "data" : "clueState",
                "title" : "分配状态"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='culePageViewInstance.reportClueDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;

                }
            }, {
                targets : 8,
                render : function(i, j, c) {
                    if (c.clueState)
                        return appcan.submitState[parseInt(c.submitState)];
                    else
                        return '';
                }
            }],
            complete : function(list) {
                self.collection.set(list);
            }
        });
    },
    reportClueDetail : function(id) {
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
        self.reportClueDetailList(id);
    },
    reportClueDetailList : function(id) {
        var self = this;
        $("#clueInfo").addClass("active");
        $("#clueDynamic").removeClass("active");
        var flag = 3;
        myResponsibleCluesListDetail = ["assets/services/myResponsibleCluesListDetail.js", "assets/models/myResponsibleCluesListDetail.js", "assets/views/myResponsibleCluesListDetail.js"];
        loadSequence(myResponsibleCluesListDetail, function() {
            var myResponsibleCluesListDetailInstance = new myResponsibleCluesListDetailView();
            myResponsibleCluesListDetailInstance.load(id, flag);
        });

    },
    reportClueDynamic : function() {
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
    resubmit : function() {
        var self = this
        var id = self.model.get("id");
        var item = this.collection.get(id).toJSON();
        var productType = item.productType;
        self.getCluePerson(item);
        assigner = item.assigner;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : '重新提交',
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var assigner1 = $('#assigner').val();
                        var assigner2 = item.assigner;
                        if (assigner1 == 00) {
                            $.danger('请选择线索分配人');
                            return false;
                        }
                        var param = {
                            id : item.id,
                            assigner : assigner1
                        };
                        self.model.fetch({
                            type : 5,
                            param : param,
                            url : '/clue/resubmit',
                            success : function(cols, resp, options) {
                                $.success("调整成功！", null, null, function() {
                                    appRouter.navigate("notAssign", {
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

                    }
                }
            },
            complete : function() {
                $('#rproductType').append("<option value='" + item.profession + "'>" + item.professionName + "</option>");
                $('#companyName1').html(item.companyName);
                $("#team").append("<option value='" + item.region + "'>" + item.regionName + "</option>")
                // 线索分配人
            }
        });
    },
    exportFile : function() {
        var param = {
            "entityType" : "reportNotFenpei",
            "marketUserId" : appcanUserInfo.userId,
            "submitState" : $('#submitState').val(),
            "profession" : $('#profession').val(),
            "region" : $('#bigRegions').val(),
            "companyName" : $('#csmName').val(),
            "dataType" : '1'
        };
        this.model.fetch({
            type : 5,
            param : param,
            url : '/clue/exportClue',
            success : function(cols, resp, options) {
                var url = urlIp + '/excel/out?path=' + encodeURIComponent(resp.msg.message);
                window.location = url;
            },
            error : function(cols, resp, options) {
            }
        });
    },
    getCluePerson : function(item) {
        var self = this
        // /clue/listStaff
        var assigner = item.assigner;
        //线索分配人id
        var data = {
            "roleType" : 3,
            "regionId" : item.region,
            "tradeId" : item.profession
        };
        self.model.fetch({
            type : 5,
            param : data,
            url : "/clue/listStaff",
            success : function(cols, resp, options) {
                var perArr = resp.msg.list;
                for (var i = 0; i < perArr.length; i++) {
                    var staffId = perArr[i].staffId;
                    //员工号
                    var fullName = perArr[i].fullName;
                    //真实姓名
                    if (fullName) {
                        var str = '<option value="' + staffId + '">' + fullName + '</option>';
                        $("#assigner").append(str);
                    }
                    // if (assigner == staffId) {
                    // // var str = '<option value="' + staffId + '">' + fullName + '</option>';
                    // // $("#assigner").append(str);
                    // } else {
                    // var str = '<option value="' + staffId + '">' + fullName + '</option>';
                    // $("#assigner").append(str);
                    // }

                }
            },
            error : function(cols, resp, options) {
            }
        });
    }
});
var culePageViewInstance = new culePageView();

