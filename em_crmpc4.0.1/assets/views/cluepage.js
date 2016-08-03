//加载并初始化模板对象
var clueTemplate = loadTemplate("assets/templates/staff/cluepageList.html");
//列表容器VIEW
var cluepageListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    bindings : {
        "#industrycategory" : {
            observe : 'industrycategory'
        },
        "#bigRegions" : {
            observe : 'bigRegions'
        },       
        "#csmName" : {
            observe : 'csmName'
        },
    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',             
    },
    
    model : new cluepageModel(),
    template : cluepageTemplate,
    // collection : new marketCollection(),

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');       
        $("#bigRegions").html("<option value=''>选择所属团队</option>" + getRegionOption());           
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#industrycategory").html("<option value=''>选择行业类别</option>" + profession(data.msg.list));
            },
            error : function(cols, resp, options) {

            },
            type : 1

        });      
        self.load();
    },
    load : function(direction) {   
        var loginId = appcanUserInfo.userId;
                var param = {
                     // "assigner":user.userId,
                    "marketUserId":loginId,
                    "submitState":0,
                    "profession":$('#industrycategory').val(),
                    "region":$('#bigRegions').val(),
                    "companyName":$.trim($('#csmName').val()),
                    "dataType":1
                    };
                 new DataTable({
        id: '#datatable',
        paging: true,
        pageSize: 10,
        ajax: {
            url: '/clue/pageNotAssign',
            data: param
        },
        columns: [{
            "data": "contactName",
            "width":"114px",
            "title": "联系人"
        },{
            "data": "mobile",
            "width":"114px",
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
            "width":"80px",
            "title": "行业类别"
        },{
            "data": "regionName",
            "title": "所属团队"
        },{
            "data": "assignerName",
            "title": "线索分配人"
        },{
            "data": null,
            "title": "操作"
        }],
        columnDefs: [
       {
            targets: 7,
            render: function(i, j, c) {
                var html="<a class='btn btn-default btn-xs' href='dynamic_edit.html?objEntityId="+c.id+"&objEntityTypeId=02&editType=2&companyName="+encodeURIComponent(c.companyName)+"'>跟进动态</a>&nbsp"
                //+'<a href="#" onclick="reSubmit(\''+encodeURIComponent(JSON.stringify(c))+'\');">重新提交</a>&nbsp;'        
                +'<a class="btn btn-default btn-xs" href="#cluepageDetail/'+c.id+'">查看</a>'; +'<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu">'
                html += handlerRow(encodeURIComponent(JSON.stringify(c)));
                  html+='</ul></div>';
                return html;
            }
        }]
    
    });
       
    },
    exportFile : function() {      
        var data = {
                  "entityType":"reportNotFenpei",
                  "marketUserId":appcanUserInfo.userId,
                  "submitState":"0",
                  "profession":$('#profession').val(),
                  "region":$('#bigRegions').val(),
                  "companyName":$('#csmName').val(),
                  "dataType":'1'
                };
         var url = "/clue/exportClue";
        clueViewService.exportFile(data, url)
    },
    pagecountchange : function(e) {
        console.log("select ", e);
    },
})   

var cluepageViewInstance = new cluepageListView();
