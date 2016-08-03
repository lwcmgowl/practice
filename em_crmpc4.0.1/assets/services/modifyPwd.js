var modifyPwdService = {
    lock : false,
    request : function(options) {
        var self = this;
        if (self.lock) {
             self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        self.lock = true;
        var oldPassword = options["loginPass"];
        var password = options["loginPass1"];
        var password1 = options["loginPass2"];
        var data = {
             "loginName" : appcanUserInfo.loginName,
             "loginPass" : oldPassword,
             "loginPass1" : password,
             "loginPass2" : password1
        };
        ajax({
            url:"/uc/edit",
            data : data,
            success : function(data) {
                if (data.status == "000") {
                    options.success(data);
                } else {
                    options.error(data.msg);
                }
                self.lock = false;
            },
            error : function(err) {
                options.error(err);
            }
        });

    }
};
_.extend(modifyPwdService, Backbone.Events);

