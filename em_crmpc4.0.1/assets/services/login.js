var loginService = {
    // lock : false,
    request : function(data,options) {
        var self = this;
        // if (self.lock) {
            // self.trigger("error", "Request alreay running. Please wait");
            // return;
        // }
        // self.lock = true;
        // var time = new Date().getTime();
        var loginName = $.trim(data["username"]);
        var loginPass = $.trim(data["password"]);
        var loginnameall = loginName;
        // if (loginnameall.indexOf("@") < 0) {
            // loginnameall += "@zymobi.com";
        // }
        if ($("input[type='checkbox']").is(':checked') == true) {
            // var userName = loginName;
            // var passWord = loginPass;
            $.cookie("rmbUser", "true", {
                expires : 7
            });
            // 存储一个带7天期限的 cookie
            $.cookie("userName", loginName, {
                expires : 7
            });
            // 存储一个带7天期限的 cookie
            $.cookie("passWord", loginPass, {
                expires : 7
            });
            // 存储一个带7天期限的 cookie
        } else {
            $.cookie("userName", loginName, {
                expires : 7
            });
            $.cookie("rmbUser", "false", {
                expires : -1
            });
            // $.cookie("userName", '', {
            // expires : -1
            // });
            $.cookie("passWord", '', {
                expires : -1
            });
        }

        ajax({
            url : "/uc/login",
            data : {
                name : loginnameall,
                password : loginPass
            },
            success : function(data) {
                if (data.status == "000"){
                    options.success(data)
                  }else {
                    options.error(data);
                };
           }
        });

    }
};
_.extend(loginService, Backbone.Events);

