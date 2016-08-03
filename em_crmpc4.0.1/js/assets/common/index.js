 // window.onload = function() {
            // getLocVal();
            // if (getCookie("readpath") && getCookie("readpath") != "" && getCookie("readpath") != null) {
                // $('#contentFrame').attr('src', getCookie("readpath"));
            // } else {
                // $('#contentFrame').attr('src', "portalIndex.html");
            // }
            // $("#user_").html(appcanUserInfo.userName);
            // var positionTypeName = appcanUserInfo.positionTypeName;
            // var userIcon = appcanUserInfo.userIcon;
            // if (userIcon && userIcon != "" && userIcon != null) {
                // $("#usericon_").html('<img src="' + picviewPath + "/" + appcanUserInfo.userIcon + '" width="30px" height="30px" />');
            // } else {
                // $("#usericon_").html('<img src="images/person.png" width="30px" height="30px" />');
            // }
            // if (positionTypeName.indexOf("部门负责人") == 0) {
                // $("#planupload").show();
                // $("#planexa").hide();
            // } else if (positionTypeName.indexOf("分管副总经理") == 0 || positionTypeName.indexOf("协同副总经理") == 0) {
                // $("#planupload").hide();
                // $("#planexa").show();
            // }
// 
            // if (positionTypeName.indexOf("协同副总经理") == 0 || positionTypeName.indexOf("总经理") == 0) {
                // $("#alltgl").show();
            // }
// 
            // // if(positionTypeName.indexOf("员工")<0&&positionTypeName&&positionTypeName!=""&&positionTypeName!=null&&positionTypeName!="undefined"){
            // // $("#departmentli").show();
            // // }
            // if (appcanUserInfo.yearlyreport && appcanUserInfo.yearlyreport != null) {
                // $("#yearlyreportli").show();
            // }
            // if (appcanUserInfo.attendance && appcanUserInfo.attendance != null) {
                // $("#attendancevieli").show();
            // }
            // if (appcanUserInfo.dptjob && appcanUserInfo.dptjob != null) {
                // $("#departmentli").show();
            // }
            // if (appcanUserInfo.attendance_order && appcanUserInfo.attendance_order != null) {
                // $("#attendance_orderli").show();
            // }
// 
            // getremindcount();
        // }
        // $(".toogle").click(function() {
            // $("#left").toggle("normal");
            // $("#main").toggleClass('g-frm-cnt');
            // $("#main").css('height', $("#pv").height() + "px");
        // });
        // function appdivshow() {
            // var top = document.getElementById('pt').offsetTop + document.body.scrollTop;
            // var left = document.getElementById('pt').offsetLeft;
            // var right = parseInt(screen.availWidth) - parseInt(left) - $("#pt").width() / 2 - 125;
            // $("#operu2").show();
            // $("#operu2").css("width", "250px");
            // $("#operu2").css("margin-right", right);
            // $("#operu2").css("margin-top", top);
            // $("#imgapp").attr("src", "images/appdown2.png");
// 
        // }
// 
        // function appdivhide() {
            // $("#operu2").hide();
            // $("#imgapp").attr("src", "images/appdown.png");
        // }
// 
        // function exitshow() {
            // $("#imgexit").attr("src", "images/exit2.png");
            // $("#exitcolor").css({
                // color : "#38dcff"
            // });
// 
        // }
// 
        // function exithide() {
            // $("#imgexit").attr("src", "images/exit.png");
            // $("#exitcolor").css({
                // color : "#FFFFFF"
            // });
        // }
// 
        // function remindshow() {
            // $("#imgremind").attr("src", "images/remind2.png");
        // }
// 
        // function remindhide() {
            // $("#imgremind").attr("src", "images/remind.png");
        // }
// 
        // function operchange() {
            // if ($("#operul").is(":hidden")) {
                // $("#operul").show();
            // } else {
                // $("#operul").hide();
            // }
// 
        // }
// 
        // function getremindcount() {
            // var param = {
                // "ifno" : "zywx-remind-0003",
                // "condition" : {
                // },
                // "content" : {
                    // "entityTypeId" : "27"
                // }
            // };
            // ajax({
                // data : param,
                // success : function(data) {
                    // var info = data.msg.count;
                    // if (info == 0) {
                        // $(".red-circle").hide();
                    // } else {
// 
                        // $(".red-circle").show();
// 
                        // if (info > 99) {
                            // info = "99+";
                        // }
                        // var lengthshow = info.toString().length;
                        // var width = 20;
                        // if (lengthshow > 2) {
                            // width = 20 + (lengthshow - 2) * 10;
                        // }
                        // $(".red-circle").width(width + "px");
                        // $(".red-circle").css("font-size", "10px");
                        // $("#remindcount").html(info);
                    // }
                // }
            // });
// 
        // }
// 
        // function exit() {
            // delCookie("readpath");
            // var time = new Date().getTime();
            // $.ajax({
                // url : serverIP + "/emoa/sso/logout",
                // type : "get",
                // beforeSend : function(r) {
                    // r.setRequestHeader("appVerify", "md5=" + $.md5(appId + ":" + appKey + ":" + time) + ";ts=" + time);
                    // r.setRequestHeader("x-mas-app-id", "EPortal");
                // },
                // success : function(data) {
                    // window.location = "login.html";
                // },
                // error : function(error) {
                    // window.location = "login.html";
                // }
            // });
        // }