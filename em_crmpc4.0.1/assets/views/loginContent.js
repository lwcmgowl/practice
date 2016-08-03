var loginView = Backbone.View.extend({//options...
    initialize : function() {
        this.stickit();
    },
    el : '#login-form',
    bindings : {
        "#loginName" : "username",
        "#loginPass" : "password"
    },
    events : {
        'submit' : 'submitLogin',
        'click #submitbtn' : function() {
            this.$el.submit();
        }
    },
    model : new loginModel(),
    submitLogin : function() {
        this.model.set({
            "username" : $('#loginName').val()
        });
        this.model.set({
            "password" : $('#loginPass').val()
        });
        if (!this.model.isValid()) {
        $.warning(this.model.validationError);
        return false;
        }
        this.model.save({}, {
            success : function(cols, resp, options) {
                var saveTime = 24*60;
                //保存30分钟
                var rem = document.getElementById('remember-me').checked;
                if (rem) {
                    saveTime = 7 * 24 * 60 * 60 * 1000;
                    //保存7天
                    var logininfo = {};
                    logininfo.loginName = $('#loginName').val();
                    logininfo.loginPass = $('#loginPass').val();
                }
                var tmpData = $.extend({
                    "userId" : resp.msg.item.staff.staffId
                }, resp.msg.item);
                $.storage('crmpc', tmpData, saveTime);
                window.location = 'index.html';
            },
            error : function(cols, resp, options) {
                if (resp.status == "001") {
                    $.warning(resp.msg.message);
                } else if (resp.status == "001") {
                    $.warning(resp.msg.message);
                };
            },
        });
        return false;
    }
});
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
        loginViewInstance.submitLogin();
    }
}
var loginViewInstance = new loginView();
