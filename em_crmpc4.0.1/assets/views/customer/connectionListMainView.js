//加载并初始化模板对象
var connectionListMainTemplate = loadTemplate("assets/templates/customer/connectionListMainTemplate.html");
//列表容器VIEW
var types = '';
var objId = '';
var cusId = null;
var peoples = [];
var customIds = "";
var names = '';
var connectionListMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    bindings : {
        "#name" : {
            observe : 'name'
        }
    },
    events : {
        'click #searchcontact' : function() {
            this.loadcontact(objId, names, types, customIds);
        },
        'click #setcontact' : function() {
            this.Radioroleof();
        },
        // 'click #exportFile' : 'exportFileconn',
        //'click #exportFileEDM' : 'exportFileEDM',
        'click #backHref' : 'backHref'
    },
    backHref : function() {
        //window.history.back();
    },
    model : new connectionListMainModel(),
    template : connectionListMainTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
        var self = this;
        $("#exportFile").click(function() {
            self.exportFileconn();
        });
        $("#exportFileEDM").click(function() {
            self.exportFileEDM();
        });

    },
    exportFileconn : function() {
        if (types == 1) {
            data = {
                "entityType" : "exportCusContact",
                "customId" : this.model.id,
                "contactName" : $.trim($('#name').val())
                // "subordinateFlg":'1'
            }
            var url = "/contact/exportContact";
            var type = 'exportFile';
            exportFileService.exportFile(data, type, url);
        }
        if (types == 4) {
            var data = {
                "entityType" : "exportCusContact",
                "customId" : this.model.id,
                "contactName" : $.trim($('#name').val())
            };
            var url = "/contact/exportContact";
            var type = 'exportFile';
            exportFileService.exportFile(data, type, url);

        };
        if (types == 5) {
            var data = {
                "entityType" : "exportOppContact",
                "opportId" : this.model.id,
                "contactName" : $('#csmName').val()
            };
            var url = "/opport/contact/exportOppContact";
            var type = 'exportFile';
            exportFileService.exportFile(data, type, url);
        };
        var data = {
            "entityType" : "exportOppContact",
            "opportId" : this.model.id,
            "contactName" : $('#csmName').val()
        };
        var url = "/opport/contact/exportOppContact";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    exportFileEDM : function() {
        if (types == 1) {
            data = {
                "entityType" : "exportCusContactEDM",
                "customId" : this.model.id,
                "contactName" : $.trim($('#name').val())
                // "subordinateFlg":'1'
            }
            var url = "/contact/expedm";
            var type = 'exportFile';
            exportFileService.exportFile(data, type, url);
        } else {
            var data = {
                "entityType" : "exportCusContactEDM",
                "customId" : this.model.id,
                "contactName" : $.trim($('#name').val())
                // "subordinateFlg" : '1'
            };
            var url = "/contact/exportContact";
            var type = 'exportFile';
            exportFileService.exportFile(data, type, url);
        }
    },
    initinfo : function(id, name, type, customId) {
        var self = this;
        self.render();
        self.loadcontact(id, name, type, customId);
        $("#addcustomer").attr("href", '#addcustomer/' + cusId + '/' + objId + '/custom');
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
                connectionListMainViewInstance.loadcontact(id, name, type, customId);
            }
        };
    },
    loadcontact : function(id, name, type, customId) {
        types = type;
        objId = id;
        // customIds = customId;
        names = name;
        var self = this;
        if (id != undefined) {
            self.model.id = id;
        }
        if (name != undefined) {
            self.model.csmNametitle = name;
        }
        if (type != undefined) {
            self.model.type = type;
        }
        if (customId != undefined) {
            self.model.customId = customId;
        }
        var param = {
            "customId" : this.model.id,
            "contactName" : $.trim($('#name').val()),
        };
        $("#csmNametitle").html(self.model.csmNametitle);
        if (types == 1) {
            $("#add").hide();
        }
        if (types == 2) {
            // $("#exportFileEDM").hide();
            $("#add").hide();
        };
        if (types == 3) {
            $("#exportFileEDM").hide();
            $("#add").hide();
            var param = {
                "opportId" : this.model.id,
                "contactName" : $.trim($('#name').val()),
            };
            new DataTable({
                id : '#datatable',
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
                        var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(self.model.csmNametitle) + "/04/2/1";
                        var hrefDynamicURL = "<a class='btn btn-default btn-xs' id='dynamic' href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";
                        var detail = "#connectionCustomerDetail/" + c.id + "/1";
                        var detailURL = "<a class='btn btn-default btn-xs' id='customerDetail' href='" + detail + "' >查看</a> &nbsp";
                        var html = hrefDynamicURL + detailURL;
                        return html;
                    }
                }]

            });

        } else if (types == 4) {
            $("#Radioroleof").hide()
            new DataTable({
                id : '#datatable',
                paging : true,
                pageSize : 10,
                ajax : {
                    url : '/custom/contact/page',
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
                    "data" : "contactTypeId",
                    "title" : "角色关系"
                }, {
                    "data" : null,
                    "title" : "操作"
                }],
                columnDefs : [{
                    targets : 5,
                    render : function(i, j, c) {
                        if (c.contactTypeId) {
                            return appcan.contactType[parseInt(c.contactTypeId)];
                        } else {
                            return '';
                        }
                    }
                }, {
                    targets : 6,
                    width : "200px",
                    render : function(i, j, c) {
                        var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(self.model.csmNametitle) + "/04/1/1";
                        var hrefDynamicURL = "<a class='btn btn-default btn-xs' id='dynamic' href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";
                        var editUrl = '<a class="btn btn-default btn-xs" href="#editCont/' + c.id + '/' + c.customId + '/custom" >编辑</a> ';
                        var detail = "#connectionCustomerDetail/" + c.id + "/1";
                        var detailURL = "<a class='btn btn-default btn-xs' id='customerDetail' href='" + detail + "' >查看</a> &nbsp";
                        var html = hrefDynamicURL + editUrl + detailURL;
                        return html;
                    }
                }]
            });
        } else if (type == 5) {
            $("#exportFileEDM").hide();
            $("#add").hide();
            var param = {
                "opportId" : id,
                "contactName" : $('#name').val()
            };
            new DataTable({
                id : '#datatable',
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
                        var editType = '1';
                        // if(flag==1){
                        // editType='1'
                        // }
                        var html = "<a class='btn btn-default btn-xs' href='#dynamic/" + c.id + '/' + encodeURIComponent(c.csmName) + "/04/" + editType + "/1' >跟进动态</a> &nbsp;" + "<a class='btn btn-default btn-xs' href='#connectionCustomerDetail/" + c.id + "/1' >查看</a> &nbsp;";

                        // if(flag==1){
                        html += " <a class='btn btn-default btn-xs' href='javascript:;' onclick='connectionListMainViewInstance.Cancelgl(" + c.relationId + ");'>取消关联</a> &nbsp;";
                        // ;
                        // }
                        return html;
                    }
                }]

            });
        } else if (type == 6) {
            $("#exportFileEDM").hide();
            $("#add").hide();
            $("#Radioroleof").hide()
            var param = {
                "opportId" : id,
                "contactName" : $('#name').val()
            };
            new DataTable({
                id : '#datatable',
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
                        var editType = '2';
                        // if(flag==1){
                        // editType='1'
                        // }
                        var html = "<a class='btn btn-default btn-xs' href='#dynamic/" + c.id + '/' + encodeURIComponent(c.csmName) + "/04/" + editType + "/1' >跟进动态</a> &nbsp;" + "<a class='btn btn-default btn-xs' href='#connectionCustomerDetail/" + c.id + "/1' >查看</a> &nbsp;";

                        // if(flag==1){
                        // html+=" <a class='btn btn-default btn-xs' href='javascript:;' onclick='Cancelgl("+c.relationId+");'>取消关联</a> &nbsp;";
                        // ;
                        // }
                        return html;
                    }
                }]

            });
        } else {
            $("#Radioroleof").hide()
            new DataTable({
                id : '#datatable',
                paging : true,
                pageSize : 10,
                ajax : {
                    url : '/custom/contact/page',
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
                    "data" : "contactTypeId",
                    "title" : "角色关系"
                }, {
                    "data" : null,
                    "title" : "操作"
                }],
                columnDefs : [{
                    targets : 5,
                    render : function(i, j, c) {
                        if (c.contactTypeId) {
                            return appcan.contactType[parseInt(c.contactTypeId)];
                        } else {
                            return '';
                        }
                    }
                }, {
                    targets : 6,
                    width : "200px",
                    render : function(i, j, c) {

                        //var html = '<a class="btn btn-default btn-xs" href="javascript:;" onclick="dynamicOppt(\'' + encodeURIComponent(JSON.stringify(c)) + '\');">跟进动态</a> ' + '<a class="btn btn-default btn-xs" href="javascript:;"  onclick="detailContact(\'' + encodeURIComponent(JSON.stringify(c)) + '\');">查看</a>';
                        var hrefDynamic = "#dynamic/" + c.id + "/" + encodeURIComponent(self.model.csmNametitle) + "/04/2/1";
                        var hrefDynamicURL = "<a class='btn btn-default btn-xs' id='dynamic' href='" + hrefDynamic + "' >跟进动态</a> &nbsp;";
                        var detail = "#connectionCustomerDetail/" + c.id + "/1";
                        var detailURL = "<a class='btn btn-default btn-xs' id='customerDetail' href='" + detail + "' >查看</a> &nbsp";
                        var html = hrefDynamicURL + detailURL;
                        return html;
                    }
                }]
            });

        }
    },
    Radioroleof : function() {
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
                        // var req = new Request();
                        // var id = req.getParameter('id');
                        var data = {
                            "opportId" : objId,
                            "ids" : contactId
                        };
                        ajax({
                            url : "/opport/contact/addRelationKey",
                            data : data,
                            success : function(data) {
                                $.success("设置联系人成功！", null, null, function() {
                                    self.loadcontact(objId, names, types, self.model.customId);
                                    // window.location.reload();
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
                    }
                }
            },
            complete : function() {
                self.peoplelist();
            }
        });

    },
    peoplelist : function() {
        var param = {
            "opportId" : objId,
            "customId" : this.model.customId
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
                    var html = '<a href="javascript:;" onclick="connectionListMainViewInstance.Radiopersonnel(\'' + c.id + '\',\'' + c.contactName + '\');">加入</a> &nbsp;'
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
        var str = '<div>' + name + '<img src="img/del.png" onclick="connectionListMainViewInstance.remove(this,' + (peoples.length - 1) + ');"/></div>';
        $("#xzpeople").append(str);
    },
    remove : function(obj, index) {
        peoples[index] = null;
        $(obj).parent().remove();
    },
    Cancelgl : function(id) {
        var self = this;
        bootbox.confirm("您确认取消关联吗？", function(result) {
            if (result) {
                var data = {
                    "relationId" : id
                };
                ajax({
                    url : "/custom/contact/delRelationId",
                    data : data,
                    success : function(data) {
                        $.success("取消成功！", null, null, function() {
                            self.loadcontact(objId, names, types,self.model.customId);
                        });
                    }
                });
            } else {
            }
        });
    }
});
var connectionListMainViewInstance = new connectionListMainView();

// function Radioroleof() {
// bootbox.dialog({
// message : $("#organizationTemplate").html(),
// title : '设置联系人',
// className : "tcwith",
// closeButton : true,
// buttons : {
// ok : {
// label : "提交",
// className : "btn-success",
// callback : function() {
// var arr = [];
// for (var i = 0; i < peoples.length; i++) {
// if (peoples[i]) {
// arr.push(peoples[i].userId);
// }
// }
// peoples = [];
// var contactId = arr.toString();
// // var req = new Request();
// // var id = req.getParameter('id');
// var data = {
// "opportId" : objId,
// "ids" : contactId
// };
// ajax({
// url : "/opport/contact/addRelationKey",
// data : data,
// success : function(data) {
// $.success("设置联系人成功！", null, null, function() {
//
// // window.location.reload();
// });
// }
// });
// }
// },
// "cancel" : {
// label : "取消",
// className : "btn-default",
// callback : function() {
// peoples = [];
// }
// }
// },
// complete : function() {
// peoplelist();
// }
// });
// }
//
// function peoplelist() {
// var req = new Request();
// // id = req.getParameter('id');
// // var customId = req.getParameter('customId');
// var param = {
// "opportId" : objId,
// "customId" : customIds
// };
//
// new DataTable({
// id : '#datatablepeo',
// paging : true,
// pageSize : 6,
// ajax : {
// url : '/opport/contact/pageContactNotId',
// data : param
// },
// columns : [{
// "data" : "contactName",
// "title" : "姓名"
// }, {
// "data" : "department",
// "title" : "部门"
// }, {
// "data" : "post",
// "title" : "职务"
// }, {
// "data" : "mobile",
// "title" : "手机"
// }, {
// "data" : "teleNo",
// "title" : "电话"
// }, {
// "data" : "contactTypeId",
// "title" : "角色关系"
// }, {
// "data" : null,
// "title" : "操作"
// }],
// columnDefs : [{
// targets : 5,
// render : function(i, j, c) {
// return appcan.contactType[c.contactTypeId];
// }
// }, {
// targets : 6,
// width : "200px",
// render : function(i, j, c) {
// var html = '<a href="javascript:;" onclick="Radiopersonnel(\'' + encodeURIComponent(JSON.stringify(c)) + '\');">加入</a> &nbsp;'
// return html;
// }
// }]
//
// });
// }
//
// //右边显示所选人员
// function Radiopersonnel(item) {
// item = JSON.parse(decodeURIComponent(item));
// var name = item.contactName;
// var Personnel = {
// name : item.contactName,
// userId : item.id
// }
// for (var i = peoples.length - 1; i >= 0; i--) {
// if (peoples[i] == null) {
// peoples.splice(i, 1);
// continue;
// }
// if (name == peoples[i].name) {
// alert("不能重复添加人员");
// return;
// }
// }
// peoples.push(Personnel);
// var str = '<div>' + name + '<img src="img/del.png" onclick="remove(this,' + (peoples.length - 1) + ');"/></div>';
// $("#xzpeople").append(str);
// }
//
// function remove(obj, index) {
// peoples[index] = null;
// $(obj).parent().remove();
// }
//
// function Cancelgl(id) {
// bootbox.confirm("您确认取消关联吗？", function(result) {
// if (result) {
// var data = {
// "relationId" : id
// };
// ajax({
// url : "/custom/contact/delRelationId",
// data : data,
// success : function(data) {
// $.success("取消成功！", null, null, function() {
// window.location.reload();
// });
// }
// });
// } else {
// }
// });
// }
