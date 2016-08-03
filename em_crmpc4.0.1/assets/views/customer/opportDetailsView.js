//加载并初始化模板对象
var opportDetailsMainTemplate = loadTemplate("assets/templates/customer/opportDetails.html");
//列表容器VIEW
var opportDetailsMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#main_content',
    model : new opportDetailsModel(),
    template : opportDetailsMainTemplate,
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    events : {
        'click #backHref' : 'backHref'
    },
    backHref : function() {
        var self = this;
        //location.hash = self.model.chanceURL;
        chanceURL = historyBackCommon.callBackHistory("chance",self.model.chanceURL);
    },
    getDetailData : function(detailId,chanceURL) {
        var self = this;
        self.render();
        this.model.fetch({
            success : function(cols, data, options) {
                var info = data.msg.item;
                for (var i in info) {
                    var ele = $('#' + i);
                    if (ele[0]) {
                        ele.html(info[i]);
                    }
                }
                if (info.startDate)
                    $("#startDate").html(info.startDate.substring(0, 4) + '-' + info.startDate.substring(4, 6) + '-' + info.startDate.substring(6, 8))
                if (info.sttlDate)
                    $("#sttlDate").html(info.sttlDate.substring(0, 4) + '-' + info.sttlDate.substring(4, 6) + '-' + info.sttlDate.substring(6, 8))
                $("#opptStat").html(appcan.opptStat[parseInt(info.opptStatId)]);
                $("#ProductType").html(appcan.producttype[parseInt(info.productType)]);
                $("#Source").html(appcan.clueSources[parseInt(info.dataSource)]);
                if ($("#Source").html() === '行业会议') {
                    $("#meeting").removeClass('hide');
                }
                self.model.chanceURL = chanceURL;
            },
            error : function(cols, resp, options) {
                //alert(resp);
            },
            id : detailId
        });
    }
});
var opportDetailsMainViewInstance = new opportDetailsMainView();
