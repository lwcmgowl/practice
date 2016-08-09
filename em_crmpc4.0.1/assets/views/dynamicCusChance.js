var dynamicTemplate = loadTemplate('assets/templates/staff/dynamicEditTest.html');

var dynamicEditModelMainView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#chanceDetail',
    model : new dynamicEditModel(),
    template : dynamicTemplate,
    render : function() {
        this.$el.empty();
        var el = $(this.template());
        this.$el.append(el);
    },
    events : {
    },
    getDynamicData : function(objEntityIds,objEntityTypeIds,editType,custom) {
        var self = this;
        self.render();
        objEntityTypeId = objEntityTypeIds;
        objEntityId = objEntityIds;
        var str = "";
        for (var i = 0,
            l = appcan.dynamicType.length; i < l; i++) {
            str += '<option value="' + (i) + '">' + appcan.dynamicType[i] + '</option>'
        }
        $("#dynamicType").append(str);
        if (editType == '1') {
            $('#edit').removeClass('hide');
        }
        switch(objEntityTypeId) {
        case 'operatelog':
            //客户动态日志
            urlmap = '/custom';
            this.getOperatelog(objEntityId, editType, urlmap);
            break;
        case '01':
            //营销数据
            urlmap = '/marketing';
            this.getDynamic(objEntityId,objEntityTypeId,editType);
            break;
        case '02':
            //线索
            urlmap = '/clue';
            this.getDynamic(objEntityId,objEntityTypeId,editType);
            break;
        case '03':
            //机会
            
            urlmap = custom+'/opport';
            this.getDynamic(objEntityId,objEntityTypeId,editType);
            break;
        case '04':
            //联系人
            urlmap = '/contact';
            self.getDynamic(objEntityId,objEntityTypeId,editType);
            break;
        default:
            break;
        }
    },
    getDynamic : function(objEntityId,objEntityTypeId,editType) {
        var data = {
            "objEntityId" : objEntityId,
            "objEntityTypeId" : objEntityTypeId
        };
        new DataDynamic({
            id : '#list',
            paging : true,
            pageSize : 5,
            type : 'dynamiclist',
            editType : editType,
            ajax : {
                url : urlmap + '/dynamic/page',
                data : data
            }
        });
    }
});
