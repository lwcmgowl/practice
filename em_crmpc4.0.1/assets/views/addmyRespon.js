//加载并初始化模板对象
var addmyResponTemplate = loadTemplate("assets/templates/staff/addmyRespon.html");
var addtype='';
var tips='';
var objid='';
//列表容器VIEW
var addmyResponView = Backbone.View.extend({
    initialize : function() {
        
    },
    el : '#contentdiv',
    bindings : {
        "#companyName" : {
            observe : 'companyName'
        },
        "#contactName" : {
            observe : 'contactName'
        },
        "#mobile" : {
            observe : 'mobile'
        },
        "#teleNo" : {
            observe : 'teleNo'
        },
        "#region" : {
            observe : 'region'
        },
        "#profession" : {
            observe : 'profession'
        },
        "#s_province" : {
            observe : 's_province'
        }

    },
    events : {
        'click #submit' : function() {
            this.addmyRespon();
        }
    },
    render : function() {          
        this.$el.empty();
        var el =  $(this.template());       
        this.$el.append(el);
    },
    model : new addmyResponModel(),
    template : addmyResponTemplate,
    load : function(id) {    
        var self=this;
        self.render(); 
        addtype="";
        $("#_region").html("<option value=''>选择所属团队</option>"+getRegionOption());
        $("#myself").html(appcanUserInfo.userName);
        selectOpt("dataSource",appcan.clueSources);//数据来源
        selectOpt("productType",appcan.producttype);//产品类型
        selectOpt("level",appcan.customerlevel);//客户级别
        selectOpt("profession",appcan.industrycategory);//行业类别
        selectOpt("csmNature",appcan.customerproperty);//客户性质
        selectOpt("csmScale",appcan.customersize);//客户规模
        $("#s_province").html('<option value="00">选择所属省份</option>'+ getOption(appcan.province))//加载所属大区省市选项
         $('#dataSource').change(function () {
                    var meeting = $('#dataSource option:selected').text();
                    if(meeting==="行业会议"){
                       $("#conferenceName").css("display","block");
                      }else{
                          $("#conferenceName").css("display","none");
                      }
               }); 
          for(var k=0;k<appcan.clueState.length;k++){
                var str = '<option value="'+ k +'">'+ appcan.clueState[k] +'</option>';
                if(k == 2){
                    $("#closeReason1").hide(); 
                }else{
                   $("#_clueState").append(str); 
                }
            }
             $('#_clueState').change(function () {
                     var clueState = $('#_clueState').val();
                    if(Number(clueState) == 3){
                      $("#closeReason1").show(); 
                      selectOpt("closeReason",appcan.closeReason); 
                    }else{
                       $("#closeReason1").hide(); 
                    }
               });
        if (id && id != "null") {
            objid=id;
            var self = this;
            addtype="edit"
            tips= '编辑成功！';
            $("#title").html('编辑线索');
             $("#_clueState").attr('disabled',true);//编辑的时候线索状态不可点击
            self.model.set({
                id : id
            }); 
            self.model.fetch({
              success : function(cols, resp, options) {
                    var detail = resp.msg.item;
                    $("#companyName").val(detail.companyName);
                    $("#contactName").val(detail.contactName);
                    $("#mobile").val(detail.mobile);
                    $("#teleNo").val(detail.teleNo);
                    $("#QQ").val(detail.qq);
                    $("#fax").val(detail.fax);
                    $("#weChat").val(detail.weChat);
                    $("#email").val(detail.email);
                    $("#department").val(detail.department);
                    $("#post").val(detail.post);
                    $("#remark").val(detail.remark);
                    $("#meeting").val(detail.conferenceName);
                    if(detail.dataSource){
                        $("#dataSource").val(detail.dataSource);
                    }
                    if(detail.productType){
                        $("#productType").val(detail.productType);
                     }
                    if(detail.level){
                        $("#level").val(detail.level);
                    }
                    if(detail.csmNature){
                        $("#csmNature").val(detail.csmNature);
                    }
                    if(detail.csmScale){
                        $("#csmScale").val(detail.csmScale);
                    }
                    if(detail.region){
                        $("#_region").val(detail.region);
                    }                   
                    if(detail.province){
                        $("#s_province").val(detail.province);
                    }
                    getInd();
                    if(detail.profession)
                    $("#profession").val(detail.profession);
                    $("#address").val(detail.address);
                    $("#postcode").val(detail.postcode);
                    $("#website").val(detail.website);
                    $("#companyTeleNo").val(detail.companyTeleNo);
                    if(detail.clueState){
                        $("#_clueState").val(detail.clueState);
                    }
                    if(detail.closeReason){
                        $("#closeReason").val(detail.closeReason);
                    }
                    $('#dataSource').change(function () {
                    var meeting = $('#dataSource option:selected').text();
                    if(meeting==="行业会议"){
                       $("#conferenceName").css("display","block");
                      }else{
                          $("#conferenceName").css("display","none");
                      } 
                   })
              },
                   error : function(cols, resp, options) {
                    if (resp.status == "001") {
                        $.warning(resp.msg.message);
                    } else if (resp.status == "002") {
                        $.warning(resp.msg.message);
                    };
                },       
                 });
        }else {
                tips= '添加成功！';
               // self.model.clear("id");
        }
}, 
addmyRespon:function(){
    var loginId = appcanUserInfo.userId;
    var companyName = $("#companyName").val();
    if(!isDefine(companyName)){
        $.danger("请输入客户名称");
        $("#companyName").parent().addClass("has-error");
        $("#companyName").focus();
        return;
    }else if(!reg1.test(companyName)){
        $.danger("客户名称格式有误");
        $("#companyName").parent().addClass("has-error");
        $("#companyName").focus();
        return;
    }else{
            this.changeClass("companyName",true);
        }   
    var conferenceName="";
    if($("#dataSource").find("option:selected").text() == "行业会议"){
    conferenceName = $.trim($("#meeting").val());
     if(conferenceName ==''){
            $.danger("请填写会议名称");
            $("#meeting").parent().addClass("has-error");
            $("#meeting").focus();
            return;
        }else{
            this.changeClass("meeting",true);
        }
    }
    var contactName = $("#contactName").val();
     if (contactName === '') {
      $.danger("姓名不能为空");
      $("#contactName").parent().addClass("has-error");
        $("#contactName").focus();
      return;
    } else if(!patrn.exec(contactName)){
        $.danger("姓名格式有误");
        $("#contactName").parent().addClass("has-error");
        $("#contactName").focus();
      return;
    }else{
            this.changeClass("contactName",true);
        }  
    var mobile = $("#mobile").val();
    var teleNo = $("#teleNo").val();
     if (mobile === ''&&teleNo === '') {
      $.danger("请填写手机号或者座机号");
      $("#mobile").parent().addClass("has-error");
        $("#mobile").focus();
         $("#teleNo").parent().addClass("has-error");
        $("#teleNo").focus();
      return;
    }else if(!mob.test(mobile)&& !tele.test(teleNo)){
       $.danger("手机号或者座机号格式有误!");
        $("#mobile").parent().addClass("has-error");
        $("#mobile").focus();
         $("#teleNo").parent().addClass("has-error");
        $("#teleNo").focus();
      return; 
    }else{
        $("#teleNo").parent().removeClass("has-error"); 
         $("#mobile").parent().removeClass("has-error");
    }
    var QQ = $("#QQ").val();
    var weChat = $("#weChat").val();
    var email = $("#email").val();
    if(email===''){
        
    }else if(!pattern.test(email)){
        $.danger("电子邮件格式不正确!");
         $("#email").parent().addClass("has-error");
        $("#email").focus();
        return;
    }else{
        $("#email").parent().removeClass("has-error");
    }
    var department = $("#department").val();
    var post = $("#post").val();
    var dataSource = $("#dataSource").val()!="00" ? $("#dataSource").val() : "";
    var productType = $("#productType").val()!="00" ? $("#productType").val() : "";
    var closeReason = $("#closeReason").val()!="00" ? $("#closeReason").val() : "";
    var level = $("#level").val()!="00" ? $("#level").val() : "";
    var csmNature = $("#csmNature").val()!="00" ? $("#csmNature").val() : "";
    var csmScale = $("#csmScale").val()!="00" ? $("#csmScale").val() : "";
    var region = $("#_region").val();
    if(!isDefine(region) || region.indexOf("选择")>0){
        $.danger("请选择所属团队");
        return;
    }
     var profession = $("#profession").val();
    if(profession==00){
         $("#profession").parent().addClass("has-error");
        $("#profession").focus();
        $.danger("请选择行业类别");
        return;
    }else{
        $("#profession").parent().removeClass("has-error");
    }
    var sprovince=$("#s_province").val();
    if(sprovince=='00'){
       $.danger("请选择所属省份");
         $("#s_province").parent().addClass("has-error");
        $("#s_province").focus();
        return; 
    }else{
        $("#s_province").parent().removeClass("has-error");
    }
    var address = $("#address").val();
    var postcode = $("#postcode").val();
     if(postcode===''){
        
    }else if(!re2.test(postcode)){
        $.danger("邮编格式不正确!");
         $("#postcode").parent().addClass("has-error");
        $("#postcode").focus();
        return;
    }else{
       $("#postcode").parent().removeClass("has-error"); 
    }
    var website = $("#website").val();
    if(website===''){
        
    }else if(!Expression.test(website)){
        $.danger("官网格式不正确!");
         $("#website").parent().addClass("has-error");
        $("#website").focus();
        return;
    }else{
         $("#website").parent().removeClass("has-error");
    }
    var fax = $("#fax").val();
    if (fax === '') {
      
    }else if(!patternfax.test(fax)){
       $.danger("公司传真格式有误!例如:010-xxxxxxx");
       $("#fax").parent().addClass("has-error");
        $("#fax").focus();
      return; 
    }else{
      $("#fax").parent().removeClass("has-error");  
    }
    
    var remark = $("#remark").val();
    var clueState = $("#_clueState").val();
    if(clueState!=3){
      closeReason = "";
    }
   var data = {
        "companyName":companyName,
        "contactName":contactName,
        "mobile":mobile,
        "teleNo":teleNo,
        "qq":QQ,
        "weChat":weChat,
        "email":email,
        "department":department,
        "post":post,
        "dataSource":dataSource,
        "productType":productType,
        "level":level,
        "profession":profession,
        "csmNature":csmNature,
        "csmScale":csmScale,
        "region":region,
        "province":sprovince,
        "address":address,
        "postcode":postcode,
        "website":website,
        "fax":fax,
        "remark":remark,
        "clueState":clueState,
        "dataType":"1",
        "clueType":"0",
        "salesUserId":loginId,
        "closeReason":closeReason,
        "conferenceName":conferenceName,
        "submitState":"1"
    };
        if(addtype==="edit"){
            var param={
                "companyName":companyName,
                "contactName":contactName,
                "mobile":mobile,
                "teleNo":teleNo,
                "qq":QQ,
                "weChat":weChat,
                "email":email,
                "department":department,
                "post":post,
                "dataSource":dataSource,
                "productType":productType,
                "level":level,
                "profession":profession,
                "csmNature":csmNature,
                "csmScale":csmScale,
                "region":region,
                "province":sprovince,
                "address":address,
                "postcode":postcode,
                "website":website,
                "fax":fax,
                "remark":remark,
                "clueState":clueState,
                "dataType":"1",
                "clueType":"0",
                "salesUserId":loginId,
                "closeReason":closeReason,
                "conferenceName":conferenceName
            };
             this.model.set({
                 id :objid
             });
             this.model.save({data : param}, {
                success : function(cols, resp, options) {
                    $.success(tips, null, null, function() {
                        appRouter.navigate("offical", {
                            trigger : true
                            });
                        });
                },
               error : function(cols, resp, options) {
                    if (resp.status == "001") {
                        $.warning(resp.msg.message);
                    } else if (resp.status == "002") {
                        $.warning(resp.msg.message);
                    };
                },
            });            
        }else{
            this.model.clear("id");
            this.model.save({data : data}, {
                success : function(cols, resp, options) {
                    $.success(tips, null, null, function() {
                        appRouter.navigate("offical", {
                            trigger : true
                        });
                    });
                },
                error : function(cols, resp, options) {
                    if (resp.status == "001") {
                        $.warning(resp.msg.message);
                    } else if (resp.status == "002") {
                        $.warning(resp.msg.message);
                    };
                },
            });
        }              
    },
    changeClass:function(id,isOk){
       if (isOk) {
          $("#"+id).parent().removeClass("has-error");  
       } else{
          $("#"+id).parent().addClass("has-error");
          return; 
       }
    }
});

var addmyResponInstance = new addmyResponView();
