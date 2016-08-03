//加载并初始化模板对象
var connectionListMainTemplate = loadTemplate("assets/templates/customer/connectionListMainTemplate.html");
//列表容器VIEW
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
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #exportFileEDM' : 'exportFileEDM',
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
    },
    exportFile : function() {
        var data = {
            "entityType" : "exportCusContact",
            "customId" : this.model.id,
            "contactName" : $.trim($('#name').val())
        };
        var url = "/contact/exportContact";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    exportFileEDM : function() {
        var data = {
            "entityType" : "exportCusContactEDM",
            "customId" : this.model.id,
            "contactName" : $.trim($('#name').val()),
            "subordinateFlg" : '1'
        };
        var url = "/contact/exportContact";
        var type = 'exportFile';
        exportFileService.exportFile(data, type, url);
    },
    load : function(id, name, type) {
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
        var param = {
            "customId" : this.model.id,
            "contactName" : $.trim($('#name').val()),
        };
        self.render();
        $("#csmNametitle").html(self.model.csmNametitle);
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
                    if (c.contactTypeId)
                        return appcan.contactType[parseInt(c.contactTypeId)];
                    else
                        return '';
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
    },
    pagecountchange : function(e) {
        console.log("select ", e);
    }
});
var connectionListMainViewInstance = new connectionListMainView();
