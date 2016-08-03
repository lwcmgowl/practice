var remindDetailTemplate = loadTemplate("assets/templates/staff/remindDetail.html");
//列表容器VIEW
var remindDetailView = Backbone.View.extend({
    initialize : function() {

    },
    el : '#contentdiv',
    model : new remindModel(),
    template : remindDetailTemplate,
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    search : function() {
        var self = this;
         self.render();
        var param = {
            objEntityTypeId : "02",
            ifRead:"0",
            remindUserId:appcanUserInfo.userId,
         };
        new DataTable({
            id : '#datatable',
            paging : true,
            pageSize : 10,
            ajax : {
                url : '/remind/page',
                data : param
            },
           columns:[ {
                        "data" : null,
                        "title" : ""
                    }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                    var html = '<i class="fa fa-exclamation-circle" style="color:#dd4b39;margin-right:4px;"></i><a href="#clueDetail/' + c.objEntityId + '/' + c.id + '">您有一条待分配的线索，线索联系人：' + c.contactName + '&nbsp&nbsp客户名称：' + c.csmName + '</a>'
                    return html;
                }
            }]
        // var self = this;
        // self.render();
        // this.model.fetch({
            // success : function(cols, resp, options) {
                // var info = resp.msg.list;
                // $("#noticeBox").html("");
                // $tbody = $('<tbody></tbody>'), $.each(info, function(index, item) {
                    // $tr = $('<tr></tr>');
                    // $tr.append($('<td class="align" id="' + item.objEntityId + '"><a href="#clueDetail/' + item.objEntityId + '/' + item.id + '">您有一条待分配的线索，线索联系人：' + item.contactName + '&nbsp&nbsp客户名称：' + item.csmName + '</a></td>'))
                    // $tbody.append($tr)
                // });
                // $("#datatable").append($tbody);
                // self.page()
            // },
            // error : function(cols, resp, options) {
                // if (resp == "14504") {
                    // $.danger("当前用户登录超时，请重新登录！");
                    // window.location = 'login.html';
                // } else {
                    // $.danger(resp);
                // };
// 
            // },
            // type : "getremindDetail"
        // });
    });
   }
});
var remindDetailInstance = new remindDetailView();

