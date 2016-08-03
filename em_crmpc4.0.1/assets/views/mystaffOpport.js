//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/mystaffOpport.html");

//列表容器VIEW
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
            $('.dropdown').removeClass('open');
            $("#dropdownMenu1").attr("aria-expanded", "false")
        },
         'click #cancel' : "cancel",
        'click #clear' : "clear",
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
        $('h1').html('我下属的机会');
        for (var i in appcan.opptStat) {
            var str = '<option value="' + (i) + '">' + appcan.opptStat[i] + '</option>'
            $("#opptStatId").append(str);
        }
        $("#sandbox-container .input-daterange").datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });
        $("#update .input-daterange").datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });
        ajax({
            url : "/opport/trade/listTrade",
            data : {
            superId:'0'
          },
            success : function(data) {
                var perArr = data.msg.list;
                $("#bigRegion").html(' <option value="">选择所属团队</option>'+profession(perArr));
            }
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
                     $("#dropdownMenu1").attr("aria-expanded", "false")
                }
            };
    },
    cancel : function() {
        $('.dropdown').removeClass('open');
        $("#dropdownMenu1").attr("aria-expanded", "false")
    },
    //查询重置
    clear : function() {
        $("#customer").val('');
        $("#business").val('');
        $("#findDate").val('');
        $("#findEndDate").val('');
        $("#signingDate").val('');
        $("#signingEndDate").val('');
        $("#updateDate").val('');
        $("#updateEndDate").val('');
        $("#opptStatId").val('');
        $("#salesUserName").val('');
        $("#bigRegion").val(''),
        this.load();
    },
    load : function() {
        var self=this;
         var param = {
            opptTtl : $.trim($('#business').val()),
            csmName:$.trim($("#customer").val()),
            salesUserName:$.trim($("#salesUserName").val()),
            beforeStartDate:$("#findDate").val(),
            afterStartDate:$("#findEndDate").val(),
            beforeSttlDate:$("#signingDate").val(),
            afterSttlDate:$("#signingEndDate").val(),
            beforeCreatedAt:$("#updateDate").val(),
            afterCreatedAt:$("#updateEndDate").val(),
            //salesUserId : appcanUserInfo.userId,
            opptStatId : $('#opptStatId').val(),
            region:$("#bigRegion").val(),
            subordinateFlg:'1'
         };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/opport/page',
                data : param
            },
           columns:[{
                        "data" : "opptTtl",
                        "title" : "商机名称"
                    }, {
                        "data" : "opptStatId",
                        "title" : "商机阶段"
                    }, {
                        "data" : "vndtAmt",
                        "title" : "预计金额"
                    }, {
                        "data" : "startDate",
                        "title" : "发现日期"
                    }, {
                        "data" : "sttlDate",
                        "title" : "预计签单日期"
                    },{
                        "data" : "csmName",
                        "title" : "客户名称"
                    },{
                        "data" : "region",
                        "title" : "所属团队"
                    },{
                        "data" : "salesUserName",
                        "title" : "商机负责人"
                    },{
                        "data" : "createdAt",
                        "title" : "创建时间"
                    }, {
                        "data" : null,
                        "title" : "操作"
                    }],
            columnDefs : [{
                targets : 1,
                render : function(i, j, c) {
                    return appcan.opptStat[parseInt(c.opptStatId)];
                }
            }, {
                targets : 2,
                render : function(i, j, c) {
                    if (c.vndtAmt)
                        return self.milliFormat(c.vndtAmt);
                    else
                        return '';
                }
            },{
                targets : 3,
                render : function(i, j, c) {
                    if (c.startDate)
                        return c.startDate.substring(0, 4) + '-' + c.startDate.substring(4, 6) + '-' + c.startDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 4,
                render : function(i, j, c) {
                    if (c.sttlDate)
                        return c.sttlDate.substring(0, 4) + '-' + c.sttlDate.substring(4, 6) + '-' + c.sttlDate.substring(6, 8);
                    else
                        return '';
                }
            }, {
                targets : 8,
                render : function(i, j, c) {
                    if (c.createdAt)
                        return toDateString(c.createdAt);
                    else
                        return '';
                }
            },{
                targets : 9,
                render : function(i, j, c) {
                    var html = '<a class="btn btn-default btn-xs" href="#dynamicEdit/' + c.id + '/03/2/' + encodeURIComponent(c.csmName) + '">跟进动态</a> '+ '<a class="btn btn-default btn-xs" href="#detailOpport/' + c.id + '">查看</a> ' + '<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">更多<span class="caret"></span></button><ul class="dropdown-menu center">'
                        html += handlerRow(c.id);
                    return html;
                }
            }],
             complete : function (list) {
              self.collection.set(list);
            }

        });
    },
    exportFile : function() {
            var data = {
                "entityType" : "exportOpport",
                opptTtl : $.trim($('#business').val()),
                csmName:$.trim($("#customer").val()),
                salesUserName:$.trim($("#salesUserName").val()),
                beforeStartDate:$("#findDate").val(),
                afterStartDate:$("#findEndDate").val(),
                beforeSttlDate:$("#signingDate").val(),
                afterSttlDate:$("#signingEndDate").val(),
                beforeCreatedAt:$("#updateDate").val(),
                afterCreatedAt:$("#updateEndDate").val(),
                //salesUserId : appcanUserInfo.userId,
                opptStatId : $('#opptStatId').val(),
                region:$("#bigRegion").val(),
                subordinateFlg:'1'
            }
        var url = "/opport/exportOpport";
        marketViewService.exportFile(data, url)
    },
     milliFormat:function(s){//添加千位符  
        if(/[^0-9\.]/.test(s)) return "invalid value";  
        s=s.replace(/^(\d*)$/,"$1.");  
        s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");  
        s=s.replace(".",",");  
        var re=/(\d)(\d{3},)/;  
        while(re.test(s)){  
            s=s.replace(re,"$1,$2");  
        }  
        s=s.replace(/,(\d\d)$/,".$1");  
        return s.replace(/^\./,"0.")  
    }  
});
var marketListViewInstance = new marketListView();
