//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/listview.html");

//列表容器VIEW
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    bindings : {
        "#clueSource" : {
            observe : 'clueSource'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#region" : {
            observe : 'region'
        },
        "#province" : {
            observe : 'province'
        },
        "#companyName" : {
            observe : 'companyName'
        },
        "#principal" : {
            observe : 'principal'
        },

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile',
        'click #clear' : 'clear',
        "click #mask" : function() {
            this.hideDetail();
        },
        "click #marketDynamic" : function() {
            this.marketAllDynamic()
        },
        "click #marketInfo" : function() {
            this.marketAllInfoList(this.model.get("id"));
        },
    },
    model : new marketModel(),
    template : marketTemplate,

    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        $("#province").html("<option value=''>选择所属省份</option>" + getOption(appcan.province));
        for (var n = 0; n < appcan.clueSources.length; n++) {
            var str = '<option value="' + n + '">' + appcan.clueSources[n] + '</option>';
            $("#clueSource").append(str);
        };
        $("#region").html("<option value=''>选择所属团队</option>" + getRegionOption());
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
                    self.load();
                    $('.dropdown').removeClass('open');
                }
            }
    },
     //查询重置
    clear : function() {
        $('select,input').val('');
        this.load();
    },
    load : function() {
        var self = this;
        //行业类别
        var profession = $("#profession").val();
        var region = $("#region").val();
        var dataSource = $("#clueSource").val();
        var companyName = $("#companyName").val();
        var province = $.trim($("#province").val());
        var marketQuery = $.trim($("#people").val());
        if (marketQuery === '') {
        } else if (!reg1.test(marketQuery)) {
            $.danger("请输入正确负责人名称!");
            return;
        }
        if (companyName === '') {
        } else if (!reg1.test(companyName)) {
            $.danger("请输入正确的客户名称/联系人/会议名称!");
            return;
        }
        var param = {
            dataType : "0",
            ifAffirm : "0",
            profession : profession,
            region : region,
            dataSource : dataSource,
            companyName : companyName,
            marketQuery : marketQuery,
            province : province

        };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/marketing/page',
                data : param
            },
            columns : [
            {
                "data" : "companyName",
                "title" : "客户名称"
            },{
                "data" : "contactName",
                "tip" : true,
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "tip" : true,
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "tip" : true,
                "title" : "电话"
            },  {
                "data" : "dataSource",
                "tip" : true,
                "title" : "数据来源"
            }, {
                "data" : "professionName",
                "tip" : true,
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "tip" : true,
                "title" : "所属团队"
            }, {
                "data" : "province",
                "tip" : true,
                "title" : "所属省份"
            }, {
                "data" : "marketUserName",
                "tip" : true,
                "title" : "负责人"
            },{
                "data" : "createdAt",
                 "tip" : true,
                "title" : "创建时间"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = "<a href='javascript:;' onclick='marketListViewInstance.marketAllDetail(\"" + c.id + "\")' title=" + c.companyName + ">" + c.companyName + "</a>";
                    return html;

                }
            },{
                targets : 4,
                width : "80px",
                render : function(i, j, c) {
                    if (c.dataSource)
                        return appcan.clueSources[c.dataSource];
                    else
                        return '';
                }
            },{
                targets : 9,
                render : function(i, j, c) {
                     if (c.createdAt)
                        return toDateString(c.createdAt);
                    else
                        return '';
                }
            }]

        });
    },
    marketAllDetail:function(id){
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
        self.marketAllInfoList(id);
        
    },
    marketAllInfoList:function(id){
         var self = this;
        $("#marketInfo").addClass("active");
        $("#marketDynamic").removeClass("active");
        var flag=1;
        var listviewDetail = ["assets/services/listviewDetail.js", "assets/models/listviewDetail.js", "assets/views/listviewDetail.js"];
        loadSequence(listviewDetail, function() {
            var marketdetailInstance = new marketdetailView();
            marketdetailInstance.load(id,flag);
        });
    },
    marketAllDynamic:function(){
         $("#marketInfo").removeClass("active");
        $("#marketDynamic").addClass("active");
        var objEntityTypeId = "01";
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
        var profession = $("#profession").val();
        var region = $("#region").val();
        var dataSource = $("#clueSource").val();
        var companyName = $("#companyName").val();
        var province = $.trim($("#province").val());
        var marketQuery = $.trim($("#people").val());
        var data = {
            "entityType" : "marketingData",
            dataType : "0",
            ifAffirm : "0",
            profession : profession,
            region : region,
            dataSource : dataSource,
            companyName : companyName,
            marketQuery : marketQuery,
            province : province
        };
        var url = "/clue/exportClue";
        marketViewService.exportFile(data, url)
    },
});
var marketListViewInstance = new marketListView();
