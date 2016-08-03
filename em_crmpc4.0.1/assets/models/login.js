var loginModel = Backbone.Model.extend({
    initialize : function() {
        this.set({})
    },
    service : loginService,
    validate : function(attrs, options) {
        if (!attrs.username) {
            return "名字不能为空";
        }
        if (!attrs.password) {
            return "密码不能为空";
        }
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
            this.service.request(this.toJSON(),options);
        case "update":
        case "patch":
            break;
        case "read":
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})