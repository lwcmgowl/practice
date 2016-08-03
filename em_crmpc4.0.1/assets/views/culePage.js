//加载并初始化模板对象
var culePageTemplate = loadTemplate("assets/templates/staff/culePage.html");

//列表容器VIEW
var culePageView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#notAssign',
    collection:new BaseTableCollection(),
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
        'click #add' : 'add'
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
        // var str = "";
        //行业类别
        self.model.fetch({
            success : function(cols, resp, options) {
               // var list = resp.msg.list;
               // $("#industrycategory").html("<option value=''>选择行业类别</option>" + profession(list));
                var list = resp.msg.tradeList;
                var team=resp.msg.teamList;
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
            }
        };
        // var btn = btnHandler.btns;
        // $('#pageNotAssign,#pageIsAssign').attr("href", function() {
            // return this.href + btnHandler.btns;
        // });
        // var isAssignNum = btn.indexOf("pageIsAssign");
        // var notAssignNum = btn.indexOf("pageNotAssign");
        // if (isAssignNum >= 0 && notAssignNum >= 0) {
            // self.search();
            // $("#IsAssign").addClass("deviation");
            // $("#pageIsAssign").removeClass("btn-primary")
        // } else {
            // if (isAssignNum >= 0) {
                // window.location = $('#pageIsAssign').attr("href");
            // }
            // if (notAssignNum >= 0) {
                // self.search();
            // }
        // }
    },
    search : function() {
        var self=this;
        var loginId = appcanUserInfo.userId;
        var param = {
            // "assigner":user.userId,
            "marketUserId" : loginId,
            "submitState" : 0,
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
                "data" : "contactName",
                "width" : "114px",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "width" : "114px",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "width" : "114px",
                "title" : "电话"
            }, {
                "data" : "companyName",
                "title" : "客户名称"
            }, {
                "data" : "professionName",
                "width" : "80px",
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "assignerName",
                "title" : "线索分配人"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 7,
                render : function(i, j, c) {
                    var html = "<a class='btn btn-default btn-xs' href='#dynamicEdit/" + c.id + "/02/2/" + encodeURIComponent(c.companyName) + "'>跟进动态</a>&nbsp"
                    // +                                  '<a href="#" onclick="reSubmit(\''+encodeURIComponent(JSON.stringify(c))+'\');">重新提交</a>&nbsp;'
                    +"<a class='btn btn-default btn-xs' href='#notAssignclueDetail/" + c.id + "' >查看</a> " + '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu">'
                    html += handlerRow(c.id);
                    html += '</ul></div>';
                    return html;
                }
            }],
              complete : function (list) {
              self.collection.set(list);
            }
        });
    },
    resubmit : function(id) {
        var self = this
        var item  = this.collection.get(id).toJSON();
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
                            // productType:productType
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
                        appRouter.navigate("notAssign", {
                            trigger : true
                        });
                    }
                }
            },
            complete : function() {
                $('#productType').append("<option value='" + item.profession + "'>" + item.professionName + "</option>");
                $('#companyName1').html(item.companyName);
                $("#team").append("<option value='" + item.region + "'>" + item.regionName + "</option>")
                // 线索分配人
            }
        });
    },
    exportFile : function() {
        // var self = this
        var param = {
            "entityType" : "reportNotFenpei",
            "marketUserId" : appcanUserInfo.userId,
            "submitState" : "0",
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
                    if(fullName){
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

