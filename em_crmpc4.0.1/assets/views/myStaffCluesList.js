//加载并初始化模板对象
var myStaffCluesListTemplate = loadTemplate("assets/templates/staff/myStaffCluesListList.html");

//列表容器VIEW
var myStaffCluesListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    bindings : {   
        "#clueType" : {   
            observe : 'clueType'
        },
        "#profession" : {   
            observe : 'profession'
        },
        "#region" : {  
            observe : 'region'
        },
        "#clueState" : {
            observe : 'clueState'    
        },
        "#csmName" : {
            observe : 'csmName'  
        },
        "#people" : {
            observe : 'people'  
        }
    },
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
       'click #exportFile' : 'exportFile',
       'click #clear':'clear'
    },
    model : new myStaffCluesListModel(),
    template : myStaffCluesListTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');         
        $("#region").html("<option value=''>选择所属团队</option>"+getRegionOption(appcan.bigRegions));
        $("#clueState").html("<option value=''>选择线索状态</option>"+getJOption(appcan.clueState));            
        this.model.fetch({
            success : function(cols, resp, options) {               
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));             
                $("#clueType").html("<option value=''>选择线索类型</option>"+getJOption(appcan.clueType));
            },
            error : function(cols, resp, options) {

            },
            type : 1

        });      
        self.load();
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function(direction) {
       var param = {
        "clueType":$('#clueType').val(),
        "profession": $('#profession').val(),
        "region": $('#region').val(),
        "clueState":$('#clueState').val(),
        "companyName":$.trim($('#csmName').val()),
        "salesQuery":$.trim($("#people").val()),
        "dataType":1
        };
    new DataTable({
        id: '#datatable',
        paging: true,
        pageSize: 10,
        ajax: {
            url: '/clue/pageBySalesUserId',
            data: param
        },
        columns: [{
            "data": "contactName",
            "title": "联系人"
        },{
            "data": "mobile",
            "title": "手机"
        },{
            "data": "teleNo",
            "title": "电话"
        },{
            "data": "companyName",
            "title": "客户名称"
        },{
            "data": "professionName",
            "title": "行业类别"
        },{
            "data": "regionName",
            "title": "所属团队"
        },{
            "data": "salesUserName",
            "title": "线索负责人"
        },{
            "data": "clueState",
            "title": "线索状态"
        }],
        columnDefs: [
        {
            targets: 7,
            render: function(i, j, c) {
                if(c.clueState)
                    return appcan.clueState[parseInt(c.clueState)];
                else return '';
            }
        },{
            targets: 8,
            width: "120px",
            render: function(i, j, c) {
                var html="<a class='btn btn-default btn-xs' href='#dynamicEdit/"+c.id+"/02/2/"+encodeURIComponent(c.companyName)+"'>跟进动态</a> &nbsp;"
                        +'<a class="btn btn-default btn-xs" href="#myStaffCluesListDetail/' + c.id + '">查看</a> '
                return html;
            }
        }]
    
    });
       
    },
    exportFile : function() {       
        var data = {
                    "entityType" : "puisneClue",
                    "clueType":$('#clueType').val(),
                    "profession": $('#profession').val(),
                    "clueState":$('#clueState').val(),
                    "companyName":$.trim($('#csmName').val()),
                    "region":$('#region').val(),
                    "salesQuery":$.trim($("#people").val()),
                    "dataType": '1'
                };
        var url = "/clue/exportClue";
        myStaffCluesListViewService.exportFile(data, url)
    }
});
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
        myStaffCluesListViewInstance.load();
    }
}
var myStaffCluesListViewInstance = new myStaffCluesListView();
