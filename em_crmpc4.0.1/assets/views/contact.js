//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/contact.html");
//列表容器VIEW
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
            this.load(this.model.get("opportId"));
        },
         'click #contactDynamic' : function() {
            this.contactDynamic(this.model.get("contactId"));
        },
         'click #contactInfo' : function() {
            this.contactDetail(this.model.get("contactId"));
        },
        'click #contactHrefBack' : 'hrefBack',
        "click #Radioroleof" : "Radioroleof"
    },
    model : new marketModel(),
    template : marketTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(id,customId) {
        var self = this;
        self.render();
        self.model.set("opportId",id);
        self.model.set("customId",customId);
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
        }else{
            $("#cusAddcontact").hide();
            $("#exportContactCus").hide();
        }
        var param = {
            "opportId" : id,
            "contactName" : $('#contacName').val()
        };
        new DataTable({
            el : 'contactTable',
            id : '#contactTable',
            paging : true,
            pageSize : 6,
            ajax : {
                url : '/opport/contact/pageOpportContact',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "department",
                "tip" : true,
                "title" : "部门"
            }, {
                "data" : "post",
                "tip" : true,
                "title" : "职务"
            }, {
                "data" : "mobile",
                "tip" : true,
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "tip" : true,
                "title" : "电话"
            }, {
                "data" : "csmName",
                "tip" : true,
                "title" : "客户名称"
            }, {
                "data" : "contactTypeId",
                "tip" : true,
                "title" : "角色关系"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                     var html = "<a href='javascript:;' onclick='marketListViewInstances.contactDetail(\"" + c.id + "\")' title=" + c.contactName + ">" + c.contactName+"</a>";
                        return html;
                }
            },{
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
                    var html="";
                    //var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/04/'+editType+'/' + encodeURIComponent(c.csmName) + '">跟进动态</a> '+ "<a class='btn btn-default btn-xs' href='#opptcontactDetails/" + c.id + "' >查看</a> &nbsp;"
                    if (flag === '1')
                        html += "<a href='javascript:;' onclick='marketListViewInstances.Cancelgl("+c.relationId+")'>移出</a>";

                    return html;
                }
            }],
            dataTableCb:function(n){
                self.pageNo = n;
            }
        },1);
    },
    pageNo:1,
    exportFileContact : function() {
            var data = {
                "entityType" : "exportOppContact",
                "opportId" : this.model.get("opportId"),
                "contactName" : $('#contacName').val()
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
                            "opportId" : self.model.get("opportId"),
                            "ids" : contactId
                        };
                        ajax({
                            url : "/opport/contact/addRelationKey",
                            data : data,
                            success : function(data) {
                                $.success("设置联系人成功！", null, null, function() {
                                   self.load(self.model.get('opportId'));
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
                         self.load(self.model.get("opportId"));
                    }
                }
            },
            complete : function() {
                var objid = self.model.get("opportId");
                var customIdcon = self.model.get("customId");
                self.peoplelist(objid, customIdcon);
            }
        });
    },
    contactDetail:function(id){
        this.model.set("contactId",id);
         var contactSlider = document.getElementById( 'contactSlider' );
            classie.addClass( contactSlider, 'cbp-spmenu-open' );
            $("#contactInfo").addClass("active");
            $("#contactDynamic").removeClass("active");
            var opptcontactDetails=["assets/services/opptcontactDetails.js", "assets/models/opptcontactDetails.js", "assets/views/opptcontactDetails.js"];
             loadSequence(opptcontactDetails,function(){
                 var marketdetailInstance = new opprotContactdetailView();
                marketdetailInstance.load(id);
            });
        
    },
    contactDynamic:function(id){
            var req = new Request();
            $("#contactInfo").removeClass("active");
            $("#contactDynamic").addClass("active");
            var objEntityTypeId="04";
            var flag = req.getParameter('flag');
            var editType = 2;
            if (flag === "1") {
                 editType = 1;
            }
             var dynamicOffical=['assets/services/dynamicOfficalTest.js','assets/models/dynamicOfficalTest.js','assets/views/contactDynamic.js'];
              loadSequence(dynamicOffical,function(){
                var contactDynamicView= new contactDynamicEditModel();
                contactDynamicView.getDynamicData(id,objEntityTypeId,editType);
            });
    },
     hrefBack : function() {
         var contactSlider = document.getElementById('contactSlider' );
            classie.removeClass( contactSlider, 'cbp-spmenu-open' );
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
            title : "确定移除联系人?",
            className : "",
            buttons : {
                ok : {
                    label : "确定",
                    className : "btn-success",
                    callback : function() {
                        self.model.destroy({
                            success : function(cols, resp, options) {
                                $.success("移除成功!", null, null, function() {
                                     self.load(self.model.get("opportId"));
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
                    }
                }
            },
            complete : function() {

            }
        });
    }
});
var marketListViewInstances= new marketListView();
