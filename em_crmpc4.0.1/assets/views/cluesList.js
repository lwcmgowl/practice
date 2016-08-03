//加载并初始化模板对象
var cluesListTemplate = loadTemplate("assets/templates/staff/cluesListList.html");

//列表容器VIEW
var cluesListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    bindings : {   
        "#profession" : {    //行业类别
            observe : 'profession'
        },
        "#region" : {    //所属团队
            observe : 'region'
        },
        "#clueState" : {   //线索状态
            observe : 'clueState'
        },
        "#csmName" : {
            observe : 'csmName'    //客户名称、联系人
        },
        "#people" : {
            observe : 'people'   //负责人
        }
    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
       'click #exportFile' : 'exportFile',
    },
    model : new cluesListModel(),
    template : cluesListTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {

        //$('#pending').empty();
        var self = this;
        self.render();
        handlerTop('btnWrapper'); 
        $("#clueState").html("<option value=''>选择线索状态</option>" + getJOption(appcan.clueState)); 
        $("#region").html("<option value=''>选择所属团队</option>"+getRegionOption(appcan.bigRegions));          
        this.model.fetch({
            success : function(cols, resp, options) {               
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));
                // $("#region").html("<option value=''>选择所属团队</option>" + profession(resp.msg.list));       
                },  
        error : function(cols, resp, options) {

            },
            type : 1

        });      
        self.load();
    },
    load : function() {
       var param = {
        "profession": $('#profession').val(),
        "region": $('#region').val(),
        "clueState":$('#clueState').val(),
        "companyName":$.trim($('#csmName').val()),
        "salesQuery":$.trim($('#people').val()),
        "dataType":"1",
        "submitState":"1"
        };
    new DataTable({
        id: '#datatable',
        paging: true,
        pageSize: 10,
        ajax: {
            url: '/clue/page',
            data: param
        },
        columns: [{
            "data": "contactName",
            "width":"80px",
            "title": "联系人"
        },{
            "data": "mobile",
            "width":"108px",
            "title": "手机"
        },{
            "data": "teleNo",
            "width":"114px",
            "title": "电话"
        },{
            "data": "companyName",
            "title": "客户名称"
        },{
            "data": "professionName",
            "title": "行业类别"
        },{
            "data": "regionName",
            "width":"80px",
            "title": "所属团队"
        },{
            "data": "salesUserName",
            "title": "线索负责人"
        },{
            "data": "clueState",
            "width":"80px",
            "title": "线索状态"
        },{
            "data": null,
            "title": "操作"
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
                         +'<a class="btn btn-default btn-xs" href="#clueListDetail/'+c.id+'">查看</a>';
                return html;
            }
        }]
    
    });
       
    },
    exportFile : function() {
        var data = {
            "entityType" : "exportClue",
            "dataType" : "1",
            "profession":$("#profession").val(),
            "region" : $("#region").val(),
            "clueState" : $("#clueState").val(),
            "companyName" : $.trim($("#csmName").val()),
            "salesQuery":$.trim($('#people').val()),
            "submitState":1
        };
        var url = "/clue/exportClue";
        cluesListViewService.exportFile(data, url)
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
        cluesListViewInstance.load();
    }
}
var cluesListViewInstance = new cluesListView();
