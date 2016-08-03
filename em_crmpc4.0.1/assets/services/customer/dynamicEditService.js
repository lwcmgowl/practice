/**
 *初始化服务对象
 */
var dynamicEditService = {
    lock : false,
    getDynamicData : function(param, options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        //处理参数
        initDynamicParamType(param);
    },
    initDynamicParamType : function(param) {
        var objEntityId = param.objEntityId;
        var companyName = param.companyName;
        var objEntityTypeId = param.objEntityTypeId;
        var cusotm = param.cusotm;
        var editType = param.editType;
        var str = '';
        var urlmap = '';
        for (var i = 0,
            l = appcan.dynamicType.length; i < l; i++) {
            str += '<option value="' + (i) + '">' + appcan.dynamicType[i] + '</option>'
        }
        $("#dynamicType").append(str);
        editType = param.editType;
        if (editType == '1') {
            $('#edit').removeClass('hide');
        }
    }
};
//绑定事件监听
_.extend(dynamicEditService, Backbone.Events);

