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
        'click #searchbtn' : function() {
            this.load();
        },
       'click #exportFile' : 'exportFile',
       'click #clear':'clear',
        "click #mask" : function() {
            this.hideDetail();
        },
        "click #clueDynamic" : function() {
            this.allClueDynamic()
        },
        "click #clueInfo" : function() {
            this.allClueDetailList(this.model.get("id"));
        },
    },
    model : new cluesListModel(),
    template : cluesListTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper'); 
        $("#clueState").html("<option value=''>选择线索状态</option>" + getJOption(appcan.clueState)); 
        $("#bigRegions").html("<option value=''>选择所属团队</option>"+getRegionOption(appcan.bigRegions));          
        this.model.fetch({
            success : function(cols, resp, options) {               
                $("#profession").html("<option value=''>选择行业类别</option>" + profession(resp.msg.list));
                },  
        error : function(cols, resp, options) {

            },
            type : 1

        });      
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
                cluesListViewInstance.search();
                $('.dropdown').removeClass('open');
            }
        };
    },
    //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function() {
       var param = {
        "profession": $('#profession').val(),
        "region": $('#bigRegions').val(),
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
            "data": "companyName",
            "title": "客户名称"
        },{
            "data": "contactName",
             "tip" : true,
            "title": "联系人"
        },{
            "data": "mobile",
             "tip" : true,
            "title": "手机"
        },{
            "data": "teleNo",
             "tip" : true,
            "title": "电话"
        },{
            "data": "professionName",
             "tip" : true,
            "title": "行业类别"
        },{
            "data": "regionName",
             "tip" : true,
            "title": "所属团队"
        },{
            "data": "salesUserName",
             "tip" : true,
            "title": "线索负责人"
        },{
            "data": "clueState",
            "title": "线索状态"
        },{
                "data" : "createdAt",
                 "tip" : true,
                "title" : "创建时间"
         }],
        columnDefs: [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='cluesListViewInstance.allClueDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;

                }
            },{
            targets: 7,
            render: function(i, j, c) {
                if(c.clueState)
                    return appcan.clueState[parseInt(c.clueState)];
                else return '';
            }
        },{
                targets : 8,
                render : function(i, j, c) {
                     if (c.createdAt)
                        return toDateString(c.createdAt);
                    else
                        return '';
                }
        }]
    
    });
       
    },
    allClueDetail:function(id){
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
        self.allClueDetailList(id);
    },
    allClueDetailList:function(id){
            var self = this;
            $("#clueInfo").addClass("active");
            $("#clueDynamic").removeClass("active");
            var flag=3;
            myResponsibleCluesListDetail=["assets/services/myResponsibleCluesListDetail.js", "assets/models/myResponsibleCluesListDetail.js", "assets/views/myResponsibleCluesListDetail.js"];
            loadSequence(myResponsibleCluesListDetail, function() {
           var myResponsibleCluesListDetailInstance = new myResponsibleCluesListDetailView();
            myResponsibleCluesListDetailInstance.load(id,flag);
        });
        
    },
    allClueDynamic:function(){
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
    exportFile : function() {
        var data = {
            "entityType" : "exportClue",
            "dataType" : "1",
            "profession":$("#profession").val(),
            "region" : $("#bigRegions").val(),
            "clueState" : $("#clueState").val(),
            "companyName" : $.trim($("#csmName").val()),
            "salesQuery":$.trim($('#people').val()),
            "submitState":1
        };
        var url = "/clue/exportClue";
        cluesListViewService.exportFile(data, url)
    }
});
var cluesListViewInstance = new cluesListView();
