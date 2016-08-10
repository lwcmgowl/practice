//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/customerContact.html");
//列表容器VIEW
var peoples = [];
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#detailpartdiv',
    bindings : {

    },
    events : {
        'click #searchcon' : function() {
            this.load(this.model.get("opportId"));
        },
         'click #contactDynamic' : function() {
            this.contactDynamic(this.model.get("contactId"));
        },
         'click #customerContactInfo' : function() {
            this.contactDetail(this.model.get("contactId"));
        },
        'click #contactHrefBack' : 'hrefBack',
        "click #cusAddcontact" : function(){
            this.cusAddcontact();
        }
    },
    model : new marketModel(),
    template : marketTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(id,customId,flag,customerName) {
        var self = this;
        self.render();
        self.model.set("opportId",id);
        self.model.set("customId",customId);
        self.model.set("flag",flag)
        self.model.set("customerName",customerName);
        $("#exportFiles").click(function(){
             self.exportFileContact();
            });
        $("#exportContactCus").click(function(){
            self.exportContactCus();
        })
        self.load(id,flag);
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
                    marketListViewInstances.load(id);
                }
            }
    },
    load : function(id,flag) {
        var self = this;
        if (flag == 2) {
            $("#Radioroleof").hide();
        }
        if (flag == 3) {
            $("#Radioroleof").hide();
            $("#cusAddcontact").hide();
        }
        var param = {
            "customId" : id,
            "contactName" : $('#contacName').val()
        };
        new DataTable({
            id : '#contactTable',
            paging : true,
            pageSize : 6,
            ajax : {
                url : '/custom/contact/page',
                data : param
            },
            columns : [{
                "data" : "contactName",
                "title" : "联系人"
            }, {
                "data" : "department",
                "tip" : true,
                "title" : "部门"
            }, {
                "data" : "post",
                "tip" : true,
                "title" : "职务"
            }, {
                "data" : "mobile",
                "tip" : true,
                "title" : "手机"
            }, {
                "data" : "teleNo",
                "tip" : true,
                "title" : "电话"
            },  {
                "data" : "contactTypeId",
                "tip" : true,
                "title" : "角色关系"
            }, {
                "data" : null,
                "title" : "操作"
            }],
            columnDefs : [{
                targets : 0,
                render : function(i, j, c) {
                     var html = "<a href='javascript:;' onclick='marketListViewInstances.contactDetail(\"" + c.id + "\")' title=" + c.contactName + ">" + c.contactName+"</a>";
                        return html;
                }
            },{
                targets : 5,
                render : function(i, j, c) {
                    return appcan.contactType[c.contactTypeId];
                }
            }, {
                targets : 6,
                render : function(i, j, c) {
                    var html="";
                    if (flag == 1){
                        html += "<a href='javascript:;' onclick='marketListViewInstances.Cancelgl("+c.relationId+")'>移出</a>";
                      }
                    return html;
                }
            }]

        });
    },
    //导出联系人
    exportFileContact : function() {
            var data = {
                "entityType" : "exportOppContact",
                "customId" : this.model.get("opportId"),
                "contactName" : $('#contacName').val()
            };
            var url = "/custom/contact/exportContact";
            contactViewService.exportFile(data, url)
    },
    //导出EDM
    exportContactCus:function(){
        var data = {
                "entityType" : "exportCusContactEDM",
                "customId" : this.model.get("opportId"),
                "contactName" : $('#contacName').val()
            };
            var url = "/custom/contact/exportContact";
            contactViewService.exportFile(data, url)
    },
    contactDetail:function(id){
        var self=this;
        self.model.set("contactId",id);
        var contactSlider = document.getElementById( 'contactSlider' );
            classie.addClass( contactSlider, 'cbp-spmenu-open' );
            $("#customerContactInfo").addClass("active");
            $("#contactDynamic").removeClass("active");
            var flag=self.model.get("flag")
            var cusDetailContact=["assets/services/customerDetailContact.js", "assets/models/detailContact.js", "assets/views/customerDetailContact.js"];
             loadSequence(cusDetailContact,function(){
                  var contactsDetailView = new contactDetailView();;
                  contactsDetailView.load(id,flag);
            });
        
    },
    contactDynamic:function(id){
            $("#customerContactInfo").removeClass("active");
            $("#contactDynamic").addClass("active");
            var objEntityTypeId="04";
             if(this.model.get("flag")==3){
                 var editType = 2;
            }else{
                var editType = 1; 
            }
             var dynamicOffical=['assets/services/dynamicOfficalTest.js','assets/models/dynamicOfficalTest.js','assets/views/cusContactDynamic.js'];
              loadSequence(dynamicOffical,function(){
                var contactDynamicView= new contactDynamicEditModel();
                contactDynamicView.getDynamicData(id,objEntityTypeId,editType,"/custom");
            });
    },
     hrefBack : function() {
         var contactSlider = document.getElementById('contactSlider' );
            classie.removeClass( contactSlider, 'cbp-spmenu-open' );
    },
    //添加联系人
    cusAddcontact:function(){
         var self = this;
        bootbox.dialog({
            message : $("#contactAdd").html(),
            title : "添加联系人",
            className : "",
            buttons : {
                ok : {
                    label : "提交",
                    className : "btn-success",
                    callback : function() {
                        $('#productForm').bootstrapValidator('validate');
                                var contactName = $.trim($("#contactName").val());
                                if (contactName === '') {
                                    $.danger("联系人不能为空");
                                    $("#contactName").focus();
                                    return false;
                                } else if (!patrn.exec(contactName)) {
                                    $.danger("联系人为汉字或者字母,字数在40个以内!");
                                    $("#contactName").focus();
                                    return false;
                                }else{
                                }
                                var mobile = $.trim($("#mobile").val());
                                var teleNo = $.trim($("#teleNo").val());
                                if (mobile === '' && teleNo === '') {
                                    $.danger("手机和座机至少填写一个");
                                    $("#mobile").focus();
                                    $("#teleNo").focus();
                                   return false;
                                } else if (!mob.test(mobile) && !tele.test(teleNo)) {
                                    $.danger("手机号或者座机号格式有误!");
                                    $("#mobile").focus();
                                    $("#teleNo").focus();
                                    return false;
                                }else{
                                    $("#teleNo").parent().removeClass("has-error");
                                    $("#mobile").parent().removeClass("has-error");
                                }
                                var sexId = $.trim($("#sexId").val());
                                var birthDay = $.trim($("#birthDay").val());
                                var qq = $.trim($("#qq").val());
                                var weChat = $.trim($("#weChat").val());
                                var department = $.trim($("#department").val());
                                var post = $.trim($("#post").val());
                                var mail = $.trim($("#mail").val());
                                if (mail === '') {
                        
                                } else if (!pattern.test(mail)) {
                                    $.danger("电子邮件格式不正确!");
                                    $("#email").parent().addClass("has-error");
                                    $("#email").focus();
                                   return false;
                                }else{
                                   $("#email").parent().removeClass("has-error"); 
                                }
                                var sprovince = $("#s_province").find("option:selected").text();
                                if (sprovince == "选择所属省份") {
                                    sprovince = "00";
                                }
                                var address = $.trim($("#address").val());
                                var postcode = $.trim($("#postcode").val());
                                var contactTypeId = $.trim($("#contactTypeId").val());
                                if (contactTypeId === '00') {
                                    $.danger("请选择角色关系");
                                    $("#contactTypeId").parent().addClass("has-error");
                                    $("#contactTypeId").focus();
                                   return false;
                                }else{
                                   $("#contactTypeId").parent().removeClass("has-error"); 
                                }
                                var remark = $.trim($("#remark").val());
                             var data = {
                                "sex" : sexId,
                                "contactName" : contactName,
                                "mobile" : mobile,
                                "teleNo" : teleNo,
                                "birthDay" : birthDay,
                                "qq" : qq,
                                "weChat" : weChat,
                                "department" : department,
                                "post" : post,
                                "mail" : mail,
                                "province" : sprovince,
                                "address" : address,
                                "postcode" : postcode,
                                "contactTypeId" : contactTypeId,
                                "customId" : self.model.get("opportId"),
                                "remark" : remark
                            };
                            ajax({
                            url:"/custom/contact/add",
                            data:data,
                            success:function(data){
                                $.success("添加成功!");
                                self.load(self.model.get("opportId"),2);
                                }
                             });
                      }
                },
                "cancel" : {
                    label : "取消",
                    className : "btn-default",
                    callback : function() {
                       
                    }
                }
            },
            complete : function() {
                 $("#show").click(function() {
                    $(this).parent().hide();
                    $("#more").slideToggle("slow");
                });
                $("#companys").val(self.model.get("customerName"));
                $("#s_province").html('<option value="">选择所属省份</option>' + getOptions(appcan.province))
                for (var i in appcan.sex) {
                    var str = '<option value="' + (i) + '">' + appcan.sex[i] + '</option>'
                    $("#sexId").append(str);
                }
                for (var i in appcan.contactType) {
                    var str = '<option value="' + (i) + '">' + appcan.contactType[i] + '</option>'
                    $("#contactTypeId").append(str);
                }
                $('#birthDay').datepicker({
                    format : 'yyyy-mm-dd',
                    todayHighlight : true,
                    weekStart : 0,
                    autoclose : true
                });
                 $('#productForm').bootstrapValidator({
                    message : '无效的数值!',
                    feedbackIcons : {
                        valid : 'glyphicon glyphicon-ok',
                        invalid : 'glyphicon glyphicon-remove',
                        validating : 'glyphicon glyphicon-refresh'
                    },
                    fields : {
                        contactName : {
                            validators : {
                                notEmpty : {
                                    message : '联系人名称不能为空!'
                                },
                                stringLength: {
                                    max: 40,
                                    message: '联系人名称必须小于40个字'
                                }
                              }
                        }
                    }
                });
            }
        });
        
    }
});
var marketListViewInstances= new marketListView();
