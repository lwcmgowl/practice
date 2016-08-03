//加载并初始化模板对象
var pmarketingTemplate = loadTemplate("assets/templates/staff/teamcusList.html");
//列表容器VIEW
var pbusinessView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#tbusiness',
    events : {
        'click #show-chance' : function() {
            this.load();
            $('.dropdown').removeClass('open');
            $("#dropdownMenu1").attr("aria-expanded", "false")
        },
        'click #exportAll' : 'exportAll',
        'click #cancel' : "cancel",
        'click #clear' : "clear"
    },
    // dynamicList : '',
    // csmName : '',
    model : new statisticsModel(),
    template : pmarketingTemplate,
    collection:new BaseTableCollection(),
    render : function() {
        $("#tmarketing").empty();
        $("#tclue").empty();
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function() {
        var self = this;
        self.render();
        $("#region").html("<option value=''>全部团队</option>" + getRegionOption(appcan.bigRegions));
        this.model.fetch({
            success : function(cols, resp, options) {
                $("#profession").html("<option value=''>行业类别</option>" + profession(resp.msg.list));
            },
            error : function(cols, resp, options) {
            },
            type : 1
        });
        $("#csmNature").html("<option value=''>客户性质</option>" + this.getOption(appcan.customerproperty));
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
                     $("#dropdownMenu1").attr("aria-expanded", "false");
                }
            };
        self.load();
    },
    load : function() {
        var self = this;
        var param = {
            csmName : $.trim($("#customer").val()),
            // salesUserId : appcanUserInfo.userId,
            beforeDate : $('#startDate').val(),
            afterDate : $('#sttlDate').val(),
            opptTtl:$("#opportunity").val(),
            // profession : $('#profession').val(),
            // csmNature : $('#opportunity').val(),
            team : $("#region").val(),
            salesUserQuery:$("#marketUserName").val()
        };
        new DataTable({
            id : '#summarytable',
            paging : true,
            pageSize : 20,
            ajax : {
                url : '/statistics/pageOpptDynTeam',
                data : param,
            },
            columns : [{
                "data" : "salesUserName",
                 "tip" : true,
                "title" : "负责人"
            }, {
                "data" : "team",
                 "tip" : true,
                "title" : "所属团队"
            },{
                "data" : "opptTtl",
                 "tip" : true,
                "title" : "商机名称"
            },  {
                "data" : "csmName",
                 "tip" : true,
                "title" : "客户名称"
            },  {
                "data" : "dataSourceName",
                 "tip" : true,
                "title" : "数据来源"
            },  {
                "data" : "sttlDate",
                 "tip" : true,
                "title" : "预计签单日期"
            }, {
                "data" : "opptStatName",
                 "tip" : true,
                "title" : "商机阶段"
            },{
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 7,
                render : function(i, j, c) {
                    var html = '<a type="" class="dropdown-toggle" href="javascript:;" onclick="pbusinessView.dynamicshow('+c.opptId+')">动态</button>'
                    return html;
                }
            }],
             complete : function (list) {
              self.collection.set(list);
            }

        });
    },
    getOption : function(arry) {
        var optionHTML = "";
        for (var i = 0; i < arry.length; i++) {
            optionHTML += "<option value='" + i + "' >" + arry[i] + "</option>";
        };
        return optionHTML;
    },
    exportAll:function(){
        var salesUserId = appcanUserInfo.userId;
        var data = {
            "csmName" : $.trim($("#customer").val()),
            // "salesUserId":salesUserId,
            "beforeDate":$('#startDate').val(),
            "afterDate":$('#sttlDate').val(),
            "team":$('#region').val(),
            // "csmNature":$('#csmNature').val(),
            "opptTtl":$("#opportunity").val(),
            "salesUserQuery":$("#marketUserName").val()
        };
        var url = "/statistics/exportAllTeam";
        statisticsViewService.exportAll(data, url)
        
    },
    dynamicshow : function(id) {
        var self=this;
        var info = this.collection.get(id).toJSON();
        var list = info.dynamicList;
        var Name = info.csmName
        var title = "动态汇总" + '<span class="label label-primary">' + Name + '</span>';
        bootbox.dialog({
            message : $("#dynamic").html(),
            title : title,
            className : "",
            buttons : {
                ok : {
                },
                "cancel" : {
                }
            },
            complete : function() {
               var content = '';
                var $item;
                var tmp='';
                $.each(list, function(sub_index, sub_item) {
                    var type='';
                    var createdAt = toDateString(sub_item.createdAt).substring(0, 10);
                    var time = toDateString(sub_item.createdAt).substring(10, 19);
                    switch(parseInt(sub_item.dynamicType)) {
                    case 0:
                        type = '<i class="fa fa-pencil-square-o bg-blue"></i>'
                        break;
                    case 1:
                        type = '<i class="fa fa-phone-square bg-blue"></i>'
                        break;
                    case 2:
                        type = '<i class="fa fa-envelope bg-blue"></i>'
                        break;
                    case 3:
                        type = '<i class="fa fa-commenting bg-blue"></i>'
                        break;
                    case 4:
                        type = '<i class="fa fa-map-marker bg-blue"></i>'
                        break;
                    case 5:
                        type = '<i class="fa fa-sign-language bg-blue"></i>'
                        break;
                    case 6:
                        type = '<i class="fa fa-flag bg-blue"></i>'
                        break;
                    case 7:
                        type = '<i class="fa fa-suitcase bg-blue"></i>'
                        break;
                    }
                    var $li='';
                    if(tmp!=createdAt){
                        tmp=createdAt;
                        $li = '<li class="time-label"><span class="bg-red">' + createdAt + '</span></li>';
                    }
                    $item = '<li>' + type + '<div class="timeline-item">' + '<span class="time"><i class="fa fa-clock-o"></i>' + time + '</span>' + '<h3 class="timeline-header"><a href="#">' + sub_item.userName + '</a>' + appcan.dynamicType[sub_item.dynamicType] + '</h3>' + '<div class="timeline-body">' + sub_item.dynamicContent + '</div>' + '</div>' + '</li>'
                    content += $li + $item;
                });
                $(".timeline").append(content + '<li><i class="fa fa-clock-o bg-gray" style="color: #666;background: #d2d6de;"></i></li>');
            }
        });
         $(".bootbox").on("click", function(e) {
                var target = $(e.target);
                if (target.closest(".modal-content").length == 0) {
                    bootbox.hideAll();
                }
            });
    },
    cancel : function() {
        $('.dropdown').removeClass('open');
        $("#dropdownMenu1").attr("aria-expanded", "false")
    },
    clear : function() {
        $("#customer").val('');
        $("#region").val('');
        $("#profession").val('');
        $("#csmNature").val('');
        this.initdate();
    },
    getWeek : function(theDay) {
        var monday = new Date(theDay.getTime());
        var sunday = new Date(theDay.getTime());
        monday.setDate(monday.getDate() + 1 - monday.getDay());
        sunday.setDate(sunday.getDate() + 7 - sunday.getDay());
        return {
            monday : monday,
            sunday : sunday
        };
    },
    initdate : function() {
        this.config();
        this.setDatePicker();
    },
    config : function() {
        this.$startDate = $('#startDate');
        this.$sttlDate = $('#sttlDate');
    },
    setDatePicker : function() {
        var date = new Date();
        week = this.getWeek(date);
        this.$startDate.val(week.monday.format("{0}-{1}-{2}"));
        this.$sttlDate.val(week.sunday.format("{0}-{1}-{2}"));

        this.$startDate.datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });

        this.$sttlDate.datepicker({
            format : 'yyyy-mm-dd',
            weekStart : 0,
            todayHighlight : true,
            autoclose : true,
        });
    }
});

var pbusinessView = new pbusinessView();
