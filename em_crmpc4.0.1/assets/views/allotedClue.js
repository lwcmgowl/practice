var allotedClueTemplate = loadTemplate('assets/templates/staff/allotedClueList.html');

var allotedClueView = Backbone.View.extend({
    initialize : function() {
    },
    el : '#alloted',
    model : new allotClueModel(),
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
         for (var i in appcan.clueState) {
            clueState += '<option value="' + i + '">' + appcan.clueState[i] + '</option>';
        }
        $("#clueState").append(clueState);
        handlerTop('btnWrapper1');
        this.getIndustryList();
        $("#bigRegions1").html("<option value=''>选择所属团队</option>" + getRegionOption());
        var clueState="";
        $("#clueState").html("<option value=''>选择线索状态</option>");
         for (var i in appcan.clueState) {
                clueState+='<option value="'+i+'">'+appcan.clueState[i]+'</option>';
            }
            $("#clueState").append(clueState);
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
                    allotedClueViewObj.search();
                }
            };
            
    },
    template : allotedClueTemplate,
    events : {
        'click #exportFile' : function() {
            this.exportFile();
        },
        'click #searchBtn1' : function() {
            this.search();
        }
    },
    search : function() {
        var dataObj = {
            "assigner" : appcanUserInfo.userId,
            "profession" : $('#industrycategory1').val(),
            "region" : $('#bigRegions1').val(),
            "csmName" : $.trim($('#csmName1').val()),
            "companyName" : $.trim($('#csmName1').val()),
            "clueState" : $('#clueState').val(),
            "dataType" : 1,
            "submitState" : 1
        };
                new DataTable({
                    id : '#datatableOffical1',
                    paging : true,
                    pageSize : 10,
                    ajax : {
                        url : '/clue/page',
                        data : dataObj
                    },
                    columns : [{
                        "data" : "contactName",
                        "width" : "114px",
                        "title" : "联系人"
                    }, {
                        "data" : "mobile",
                        "width" : "114px",
                        "title" : "手机"
                    }, {
                        "data" : "teleNo",
                        "width" : "114px",
                        "title" : "电话"
                    }, {
                        "data" : "companyName",
                        "title" : "客户名称"
                    }, {
                        "data" : "professionName",
                        "title" : "行业类别"
                    }, {
                        "data" : "regionName",
                        "title" : "所属团队"
                    }, {
                        "data" : "assignerName",
                        "title" : "线索分配人"
                    }, {
                        "data" : "salesUserName",
                        "title" : "线索负责人"
                    }, {
                        "data" : "clueState",
                        "title" : "线索状态"
                    }, {
                        "data" : null,
                        "title" : "操作"
                    }],
                    columnDefs : [
                       {
                            targets: 8,
                            render: function(i, j, c) {
                                if(c.clueState)
                                    return appcan.clueState[parseInt(c.clueState)];
                                else return '';
                            }
                        },
                      {
                        targets : 9,
                        render : function(i, j, c) {
                            var html = "<a class='btn btn-default btn-xs'href='#getAllotedDynamic/" + c.id + "/02/2/" + encodeURIComponent(c.companyName) + "'>跟进动态</a> <a class='btn btn-default btn-xs' href='#allotedClueDetail/" + c.id + "' >查看</a>";
                            return html;
                        }
                    }]
                });
    },
    getList : function() {
        this.render();
        this.search();
    },
    getIndustryList : function() {
        var self = this;
        this.model.fetch({
            param : {},
            URL : '/clue/trade/listTrade',
            success : function(cols, resp, options) {
                var str = '<option value="">选择行业类别</option>';
                $('#industrycategory1').html(str +profession(resp.msg.list));
            },
            error : function(cols, error, options) {
            }
        });
    },
    profession : function(arr) {
        var optionHTML = "";
        for (var i = 0; i < arr.length; i++) {
            for (var j = i; j < arr.length; j++) {
                if (arr[i].orderId < arr[j].orderId) {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    },
    exportFile : function() {//导出数据
        var dataObj = {
            "entityType" : "allocatedNotFenpei",
            "assigner" : appcanUserInfo.userId,
            "submitState" : "1",
            "profession" : $('#industrycategory1').val(),
            "region" : $('#bigRegions1').val(),
            "companyName" : $.trim($('#csmName1').val()),
            "dataType" : '1'
        };
        this.model.fetch({
            URL : '/clue/exportClue',
            param : dataObj,
            success : function(cols, resp, options) {
                var url = urlIp + '/excel/out?path=' + encodeURIComponent(resp.msg.message);
                window.location = url;
            },
            error : function(cols, error, options) {
            }
        });
    }
});
var allotedClueViewObj = new allotedClueView(); 