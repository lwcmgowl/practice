var modifyPwdModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : modifyPwdService,
    parse : function(resp) {
       return resp;
    },
    validate : function(attrs, options) {
        //alert(attrs.oldPassword);
        if (!attrs.oldPassword) {
            return "原密码不能为空!";
        }
        if (!attrs.password) {
            return "新密码不能为空!";
        }
        if (attrs.password!=attrs.password1) {
            return "两次新密码输入不一致！";
        } 
                
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            this.service.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
});