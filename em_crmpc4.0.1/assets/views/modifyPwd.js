var modifyPwdTemplate = loadTemplate("assets/templates/staff/modifyPwd.html");
var modifyPwdView = Backbone.View.extend({
    initialize : function() {
        // this.stickit();
    },
    events : {
        'submit' : 'edit',
        'click #submit' : function() {
            this.$el.submit();
        }
    },
    el : "#contentdiv",
    bindings : {
        "#oldPassword" : {
            observe : 'oldPassword'
        },
        "#password" : {
            observe : 'password',
            updateModel : 'validmodifyPwdPass'
        },
        "#password1" : {
            observe : 'password1',
            updateModel : 'validpassword1'
        }
    },
    model : new modifyPwdModel(),
    template : modifyPwdTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    edit : function() {
        this.render();
        var self=this;
         bootbox.dialog({
                message: $("#organizationTemplate").html(),
                title: '修改密码',
                className: "",
                buttons: {
                    ok: {
                        label: "提交",
                        className: "btn-success",
                        callback: function () {
                            var oldPassword = $("#oldPassword").val();
                            var password = $("#password").val();
                            var password1 = $("#password1").val();
                            if(oldPassword==''){
                                $.danger("原密码不能为空!");
                                return false;
                            }else if( password=='' || password1==''){
                                $.danger("新密码不能为空!")
                                return false;
                            }
                            if(password != password1){
                                $.danger("两次新密码输入不一致！", null, null, function() {
                                });
                                return false;
                            }
                          self.model.fetch({
                            success : function(cols, resp, options) {
                                $.success("密码修改成功", null, null, function() {
                                    window.location.href = "login.html";
                                });
                            },
                            error : function(cols, resp, options) {

                            },
                                type : 1,
                                "loginName":appcanUserInfo.loginName,
                                "loginPass" : oldPassword,
                                "loginPass1" : password,
                                "loginPass2":password1

                            });
                        }
                    },
                    "cancel": {
                        label: "取消",
                        className: "btn-default",
                        callback: function () {
                              history.back();
                        }
                    }
                },
                complete: function(){
                    
                }
            }); 
    }
});


var modifyPwdViewInstance = new modifyPwdView();
