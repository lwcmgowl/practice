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
        }

    },
    events : {
        'submit' : 'load',
        'click #searchbtn' : function() {
            this.$el.submit();
        },
        'click #exportFile' : 'exportFile'
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
                }
            }
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
            columns : [{
                "data" : "contactName",
                "width" : "80px",
                "title" : "联系人"
            }, {
                "data" : "mobile",
                "width" : "150px",
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "width" : "114px",
                "title" : "电话"
            }, {
                "data" : "companyName",
                "width" : "150px",
                "title" : "客户名称"
            }, {
                "data" : "dataSource",
                "title" : "数据来源"
            }, {
                "data" : "conferenceName",
                "class" : "ut-s",
                "title" : "会议名称"
            }, {
                "data" : "professionName",
                "title" : "行业类别"
            }, {
                "data" : "regionName",
                "title" : "所属团队"
            }, {
                "data" : "province",
                "title" : "所属省份"
            }, {
                "data" : "marketUserName",
                "title" : "负责人"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 4,
                width : "80px",
                render : function(i, j, c) {
                    if (c.dataSource)
                        return appcan.clueSources[c.dataSource];
                    else
                        return '';
                }
            }, {
                targets : 10,
                render : function(i, j, c) {
                    //editType 1 可编辑 2 不可编辑
                    var editType = 2;
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/01/' + editType + '/' + encodeURIComponent(c.companyName) + '">跟进动态</a> ' + '<a class="btn btn-default btn-xs" href="#listviewDetail/' + c.id + '">查看</a> '
                    return html;
                }
            }]

        });
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
