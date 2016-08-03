//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/contact.html");
//列表容器VIEW
var objid = '';
var customIdcon = '';
var peoples = [];
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#detailpartdiv',
    bindings : {

    },
    events : {
        'click #searchcon' : function() {
            this.load(objid);
        },
        // 'click #exportFile' : 'exportFileContact',
        'click #hrefBack' : 'hrefBack',
        "click #Radioroleof" : "Radioroleof"
    },
    model : new marketModel(),
    template : marketTemplate,
    hrefBack : function() {
        var self = this;
        historyBackCommon.callBackHistory(self.model.chanceURL, self.model.chanceURL);
    },
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(id) {
        var self = this;
        self.render();
        // var info=marketListViewInstances.baseView.collection.get(id);
        // var customId=info.attributes.customId;
        // var id=info.attributes.id;
        // objid = id;
        // customIdcon = customId;
        // $("#tiltlename").html(info.attributes.csmName);
         $("#exportFiles").click(function(){
             self.exportFileContact();
            });
        self.load(id);
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
                    marketListViewInstances.load(id);
                }
            }
    },
    load : function(id) {
        var self = this;
        var req = new Request();
        var flag = req.getParameter('flag');
        if (flag != "1") {
            $("#Setcontact").hide();
        }
        var param = {
            "opportId" : objid,
            "contactName" : $('#csmName').val()
        };
        new DataTable({
            id : '#contactTable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/opport/contact/pageOpportContact',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "department",
                "title" : "部门"
            }, {
                "data" : "post",
                "title" : "职务"
            }, {
                "data" : "mobile",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "title" : "电话"
            }, {
                "data" : "csmName",
                "title" : "客户名称"
            }, {
                "data" : "contactTypeId",
                "title" : "角色关系"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 6,
                render : function(i, j, c) {
                    return appcan.contactType[c.contactTypeId];
                }
            }, {
                targets : 7,
                render : function(i, j, c) {
                    var editType = 2;
                    if (flag === "1") {
                        editType = 1;
                    }
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/04/'+editType+'/' + encodeURIComponent(c.csmName) + '">跟进动态</a> '+ "<a class='btn btn-default btn-xs' href='#opptcontactDetails/" + c.id + "' >查看</a> &nbsp;"
                    if (flag === '1')
                        html += "<a class='btn btn-default btn-xs' href='#Cancelgl/"+c.relationId+"'>取消关联</a> &nbsp;";

                    return html;
                }
            }]

        });
    },
    exportFileContact : function() {
       // var req = new Request();
       // var flag = req.getParameter('flag');
            var data = {
                "entityType" : "exportOppContact",
                "opportId" : objid,
                "contactName" : $('#csmName').val()
            };
            var url = "/opport/contact/exportOppContact";
            contactViewService.exportFile(data, url)
        
    },
    Radioroleof : function(){
        var self = this;
        bootbox.dialog({
            message : $("#organizationTemplate").html(),
            title : '设置联系人',
            className : "tcwith",
            closeButton : true,
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        var arr = [];
                        for (var i = 0; i < peoples.length; i++) {
                            if (peoples[i]) {
                                arr.push(peoples[i].userId);
                            }
                        }
                        peoples = [];
                        var contactId = arr.toString();
                        if (contactId == "") {
                            $.warning("请选择联系人！", null, null, function() {
                            });
                            return false;
                        }
                        var data = {
                            "opportId" : objid,
                            "ids" : contactId
                        };
                        ajax({
                            url : "/opport/contact/addRelationKey",
                            data : data,
                            success : function(data) {
                                $.success("设置联系人成功！", null, null, function() {
                                   // appRouter.navigate("contact", {
                                        // trigger : true
                                    // });
                                   self.load(objid);
                                });
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        peoples = [];
                         self.load(objid);
                        // appRouter.navigate("contact", {
                            // trigger : true
                        // });
                        // history.back();
                    }
                }
            },
            complete : function() {
                self.peoplelist(objid, customIdcon);
            }
        });
    },
    peoplelist : function(objid, customIdcon) {
        var param = {
            "opportId" : objid,
            "customId" : customIdcon
        };

        new DataTable({
            id : '#datatablepeo',
            paging : true,
            pageSize : 6,
            ajax : {
                url : '/opport/contact/pageContactNotId',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "title" : "姓名"
            }, {
                "data" : "department",
                "title" : "部门"
            }, {
                "data" : "post",
                "title" : "职务"
            }, {
                "data" : "mobile",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "title" : "电话"
            }, {
                "data" : "contactTypeId",
                "title" : "角色关系"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 5,
                render : function(i, j, c) {
                    return appcan.contactType[c.contactTypeId];
                }
            }, {
                targets : 6,
                width : "200px",
                render : function(i, j, c) {
                    var html = '<a href="javascript:;" onclick="marketListViewInstances.Radiopersonnel(\'' + c.id + '\',\'' + c.contactName + '\')">加入</a> &nbsp;'
                    return html;
                }
            }]

        });

    },
    Radiopersonnel : function(id, name) {
        var Personnel = {
            name : name,
            userId : id
        }
        for (var i = peoples.length - 1; i >= 0; i--) {
            if (peoples[i] == null) {
                peoples.splice(i, 1);
                continue;
            }
            if (id == peoples[i].userId) {
                $.warning("不能重复添加人员");
                return;
            }
        }
        peoples.push(Personnel);
        var str = '<div onclick="marketListViewInstances.remove(this,' + (peoples.length - 1) + ');">' + name + '<img src="img/del.png"></div>';
        $("#xzpeople").append(str);
    },
   remove: function (obj,index){
    peoples[index] = null;
    $(obj).remove();
   },
    Cancelgl:function(id){
         var self = this;
        this.model.set({
            id : id
        });
        bootbox.dialog({
            message : $("#delState").html(),
            title : "确定取消关联?",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        self.model.destroy({
                            success : function(cols, resp, options) {
                                $.success("取消关联成功!", null, null, function() {
                                    // appRouter.navigate("contact", {
                                        // trigger : true
                                    // });
                                    // history.back();
                                     self.load(objid);
                                });
                            },
                            error : function(cols, resp, options) {
                                $.warning(resp.msg.message)
                            }
                        });
                    }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                        // appRouter.navigate("contact", {
                            // trigger : true
                        // });
                         self.load(objid);
                    }
                }
            },
            complete : function() {

            }
        });
    }
});
var marketListViewInstances= new marketListView();
