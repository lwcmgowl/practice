//加载并初始化模板对象
var marketTemplate = loadTemplate("assets/templates/staff/contactAll.html");

//列表容器VIEW
var editType='2';
var marketListView = Backbone.View.extend({
    initialize : function() {
        this.stickit();
    },
    el : '#contentdiv',
    collection:new BaseTableCollection(),
    bindings : {

    },
    events : {
        'click #searchbtn' : function() {
            this.load();
        },
        'click #exportFile' : 'exportFile',
        'click #expedm' : 'expedm',
        'click #add':function(){
            this.addContact();
        },
         "click #mask":function(){
            this.hideDetail();
        },
         "click #dynamic":function(){
            this.dynamic()
        },
        "click #contact":function(){
            this.contactDetailList(this.model.get("id"));
        },
        
    },
    model : new marketModel(),
    template : marketTemplate,
    render : function() {
        this.$el.empty();
        this.$el.append($(this.template()));
    },
    initinfo : function(direction) {
        var self = this;
        self.render();
        handlerTop('btnWrapper');
        var flag=location.hash;
                if(flag==="#myresContact"){
                    $('h5').html('我负责的联系人')
                }
                if(flag==="#contactAll"){
                  $('h5').html('联系人查看') 
                }
                if(flag==="#mystaffContact"){
                    $('h5').html('我下属的联系人')
                }
                 self.load();
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
                        marketListViewInstance.load();
                    }
                }
    },
    load : function() {
        var self=this; 
             var flag=location.hash;
             var param = {
                    contactName : $.trim($('#name').val()),
                    salesUserId : '',
                    subordinateFlg : ''
                };
                switch(flag) {
                case '#myresContact':
                    //我负责的联系人
                    $('#add').removeClass('hide');
                    $('#EDM').removeClass('hide');
                    param.salesUserId = appcanUserInfo.userId;
                    editType = '1';
                    break;
                case '#contactAll':
                    editType = '2';
                    //全部联系人
                    break;
                case '#mystaffContact':
                    //我下属的联系人
                    param.subordinateFlg = '1';
                    $('#EDM').removeClass('hide');
                     editType = '2';
                    break;
                }
                var dataTable = new DataTable({
                    id : '#datatable',
                    paging : true,
                    pageSize : 10,
                    ajax : {
                        url : '/contact/page',
                        data : param
                    },
                    columns : [{
                        "data" : "contactName",
                        "title" : "联系人"
                    }, {
                        "data" : "csmName",
                        "tip" : true,
                        "title" : "客户名称"
                    },{
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
                    }],
                    columnDefs : [{
                            targets : 0,
                            render : function(i, j, c) {
                                         var html = "<a href='javascript:;' onclick='marketListViewInstance.contactDetail(\"" + c.id + "\")' title=" + c.contactName + ">" + c.contactName + "</a>";
                                         return html;
                                   
                            }
                        },{
                        targets : 6,
                        render : function(i, j, c) {
                            return appcan.contactType[c.contactTypeId];
                        }
                    }],
                    complete : function (list) {
                          self.collection.set(list);
                        }

                });
    },
    exportFile : function() {
        var flag=location.hash;
            var data;
                if (flag ==="#myresContact") {
                    data = {
                        "entityType" : "exportContact",
                        "salesUserId" : appcanUserInfo.userId,
                        "contactName" : $.trim($('#name').val())
                    };
                } else if ( flag==="#mystaffContact") {
                    data = {
                        "entityType" : "exportContact",
                        "contactName" : $.trim($('#name').val()),
                        "subordinateFlg" : '1'
                    };
                } else {
                    data = {
                        "entityType" : "exportContact",
                        "contactName" : $.trim($('#name').val())
                    };
                }
        var url = "/contact/exportContact";
        marketViewService.exportFile(data, url)
    },
    expedm:function() {
        var flag=location.hash;
            var data;
                if (flag ==="#myresContact") {
                    data = {
                        "entityType" : "exportContactEDM",
                        "salesUserId" : appcanUserInfo.userId,
                        "contactName" : $.trim($('#name').val())
                    };
                } else if ( flag==="#mystaffContact") {
                   data = {
                        "entityType" : "exportContactEDM",
                        "contactName" : $.trim($('#name').val()),
                        "subordinateFlg" : '1'
                    };
                } else {
                    data = {
                        "entityType" : "exportContact",
                        "contactName" : $.trim($('#name').val())
                    };
                }
        var url = "/contact/expedm";
        marketViewService.exportFile(data, url)
    },
    contactDetail:function(id){
         var self=this;
         var pushRight = document.getElementById( 'pushRight' );
            classie.addClass( pushRight, 'cbp-spmenu-open' );
                $("#mask").css("height",$(document).height());     
                $("#mask").css("width",$(document).width());     
                $("#mask").show();
            self.model.set("id",id); 
            self.contactDetailList(id);
        
    },
    hideDetail:function(){
        var self=this;
        var pushRight = document.getElementById( 'pushRight' );
            classie.removeClass( pushRight, 'cbp-spmenu-open' );
            $("#mask").hide();
    },
    contactDetailList:function(id){
        var self=this;
        $("#contact").addClass("active");
        $("#dynamic").removeClass("active");
         var detailContact=["assets/services/detailContact.js", "assets/models/detailContact.js", "assets/views/detailContact.js"];
          loadSequence(detailContact,function(){
                 var contactsDetailView = new contactDetailView();;
                 contactsDetailView.load(id);
            });
    },
    dynamic:function(){
        $("#contact").removeClass("active");
        $("#dynamic").addClass("active");
         var objEntityTypeId="04";
         var editType=1;
         var req = new Request();
         var flag = req.getParameter('flag');
         if(flag!=1){
             editType=2
         }
         var objId=this.model.get("id");
         var dynamicOffical=['assets/services/dynamicOfficalTest.js','assets/models/dynamicOfficalTest.js','assets/views/dynamicOfficalTest.js'];
         loadSequence(dynamicOffical,function(){
                dynamicViewObj.getDynamicData(objId,objEntityTypeId,editType);
            });
        
    },
    addContact:function(){
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
                                var customId = $.trim($("#customId").val());
                                if (customId =="") {
                                    $.danger("请选择客户名称");
                                    return false;
                                }
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
                                "customId" : customId,
                                "remark" : remark
                            };
                        self.model.unset("id");
                        self.model.save({
                            data : data
                           }, {
                            success : function(cols, resp, options) {
                                $.success("添加成功", null, null, function() {
                                  self.load();
                                });
                            },
                            error : function(cols, resp, options) {
                                if (resp == "001") {
                                    $.warning("当前用户登录超时，请重新登录！");
                                    window.location = 'login.html';
                                } else {
                                    $.warning(resp);
                                }
                            },
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
                $("#customId").attr("title", "请选择客户名称")
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
                self.getCsm();
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
    },
    getCsm:function(){
        var self = this;
        self.model.fetch({
            success : function(cols, resp, options) {
                var cstms = resp.msg.list;
                if (cstms != undefined) {
                    for (var i in cstms) {
                        if (customId && customId == cstms[i].id) {
                            var str = '<option selected value="' + cstms[i].id + '">' + cstms[i].csmName + '</option>'
                        } else {
                            var str = '<option value="' + cstms[i].id + '">' + cstms[i].csmName + '</option>'
                        }
                        $("#customId").append(str);
                    }
                    $('.selectpicker').selectpicker({
                        style : 'btn-default',
                        size : 4,
                    });
                }
            },
            error : function(cols, resp, options) {

            },
             type : 1
        });
    }
});
var marketListViewInstance = new marketListView();
