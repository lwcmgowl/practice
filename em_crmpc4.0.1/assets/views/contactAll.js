//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/contactAll.html");

//列表容器VIEW
var editType='2';
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection:new BaseTableCollection(),
    bindings : {

    },
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #expedm' : 'expedm'
    },
    model : new marketModel(),
    template : marketTemplate,
    // collection : new marketCollection(),

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        var flag=location.hash;
                if(flag==="#myresContact"){
                    $('h1').html('我负责的联系人')
                }
                if(flag==="#contactAll"){
                  $('h1').html('联系人查看') 
                }
                if(flag==="#mystaffContact"){
                    $('h1').html('我下属的联系人')
                }
                 $("#add").attr("href", "#addContact");
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
                        marketListViewInstance.load();
                    }
                }
    },
    load : function() {
        var self=this; 
             var flag=location.hash;
             var param = {
                    contactName : $.trim($('#name').val()),
                    salesUserId : '',
                    subordinateFlg : ''
                };
                switch(flag) {
                case '#myresContact':
                    //我负责的联系人
                    $('#add').removeClass('hide');
                    $('#EDM').removeClass('hide');
                    param.salesUserId = appcanUserInfo.userId;
                    editType = '1';
                    break;
                case '#contactAll':
                    editType = '2';
                    //全部联系人
                    break;
                case '#mystaffContact':
                    //我下属的联系人
                    param.subordinateFlg = '1';
                    $('#EDM').removeClass('hide');
                     editType = '2';
                    break;
                }
                var dataTable = new DataTable({
                    id : '#datatable',
                    paging : true,
                    pageSize : 10,
                    ajax : {
                        url : '/contact/page',
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
                        width : "150px",
                        render : function(i, j, c) {
                            var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/04/'+editType+'/' + encodeURIComponent(c.contactName) + '">跟进动态</a> '
                            + '<a class="btn btn-default btn-xs" href="#detailContact/' + c.id + '">查看</a> '
                            if (flag ==="#myresContact")
                            html += '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">'+handlerRow(c.id)+'</ul></div>';
                            return html;
                        }
                    }],
                    complete : function (list) {
                          self.collection.set(list);
                        }

                });
    },
    exportFile : function() {
        var flag=location.hash;
            var data;
                if (flag ==="#myresContact") {
                    data = {
                        "entityType" : "exportContact",
                        "salesUserId" : appcanUserInfo.userId,
                        "contactName" : $.trim($('#name').val())
                    };
                } else if ( flag==="#mystaffContact") {
                    data = {
                        "entityType" : "exportContact",
                        "contactName" : $.trim($('#name').val()),
                        "subordinateFlg" : '1'
                    };
                } else {
                    data = {
                        "entityType" : "exportContact",
                        "contactName" : $.trim($('#name').val())
                    };
                }
        var url = "/contact/exportContact";
        marketViewService.exportFile(data, url)
    },
    expedm:function() {
        var flag=location.hash;
            var data;
                if (flag ==="#myresContact") {
                    data = {
                        "entityType" : "exportContactEDM",
                        "salesUserId" : appcanUserInfo.userId,
                        "contactName" : $.trim($('#name').val())
                    };
                } else if ( flag==="#mystaffContact") {
                   data = {
                        "entityType" : "exportContactEDM",
                        "contactName" : $.trim($('#name').val()),
                        "subordinateFlg" : '1'
                    };
                } else {
                    data = {
                        "entityType" : "exportContact",
                        "contactName" : $.trim($('#name').val())
                    };
                }
        var url = "/contact/expedm";
        marketViewService.exportFile(data, url)
    }
});
var marketListViewInstance = new marketListView();
