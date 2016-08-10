var tplBaseUrl = "";
var serverIP = ""
var urlindex="";
if($.storage('crmurlindex')){
    urlindex=$.storage('crmurlindex').crmurlindex;
}
var urlIp = urlindex + "crm";
var appcanUserInfo;
// var tplBaseUrl = "";
// var serverIP = "http://127.0.0.1:8080"
 var serverIf = urlindex + "/crm/assert/importMarketingDataTemplate.xls";
// var urlIp = serverIP + "/crm";
// var appcanUserInfo;
var picviewPath = urlindex+"/attachment/file";
var appId="EPortal";
var appKey="0647513c-88f1-46c9-b764-b38e19f0e4e6";
//上传图片
//登录后返回的用户信息
var appcan = {
    //按钮操作
    buttons : {
        "view" : "查询",
        "add" : "添加",
        "edit" : "修改",
        "del" : "删除",
        "import" : "导入",
        "export" : "导出",
        "expedm" : "导出EDM",
        "batchreport" : "批量上报",
        "report" : "提交上报",
        "resubmit" : "重新提交",
        "rlsdynamic" : "发布动态",
        "reply" : "评论回复",
        "assign" : "分配",
        "toopp" : "转为机会",
        "change" : "改变状态",
        "adjust" : "调整阶段",
        "deliver" : "转交客户",
        "deldynamic" : "删除动态",
        "contact" : "联系人",
        "delRelationId" : "取消关联",
        "transfer" : "转移",
        "cancel" : "取消上报",
        "pageNotAssign" : "待分配",
        "pageIsAssign" : "已分配",
        // "exportCurrent" : "导出当前",
        "exportAll" : "导出全部",
        "convert":"转交伙伴",
        "againExamine":"再次送审商机",
        "listExamine":"审核信息",
        "examine":"商机审核"

    },
    //性别
    sex : {
        '01' : '男',
        '02' : '女'
    },
    //省
    province : ["北京", "天津", "山东", "山西", "黑龙江", "吉林", "辽宁", "河北", "河南", "内蒙古自治区", "上海", "江苏", "浙江", "安徽", "广东", "广西", "福建", "海南", "湖北", "湖南", "江西", "陕西", "甘肃", "青海", "宁夏", "新疆", "重庆", "四川", "贵州", "云南", "西藏", "香港", "澳门", "台湾"],
    //角色类型
    roletype : ["市场人员", "市场人员2(400电话)", "销售人员", "大区业务经理", "公司高层或全区角色"],
    //销数据来源
    source : ["百度推广", "电话营销", "个人开发", "公司资源", "客户维护", "朋友介绍", "网络营销", "展会营销", "AppCan官网", "行业会议", "其他"],
    //线索来源
    clueSources : ["400电话", "百度推广", "电话营销", "个人开发", "公司资源", "客户维护", "朋友介绍", "网络营销", "展会营销", "AppCan官网", "行业会议", "其他"],
    //线索状态
    //  clueStatus : ["未处理","已联系","转商机","不合格"],
    //不合格原因或线索关闭理由
    closeReason : ["客户预算少", "客户项目计划改变", "客户项目暂停", "不是真实需求"],
    //线索类型
    clueType : ["创建的", "分配的"],
    //产品类型
    producttype : ["企业版", "企业移动信息平台", "app外包项目", "其他", "平台+实施"],
    //客户级别
    customerlevel : ["A1", "A2", "A3", "A4", "B1", "B2", "C1", "C2", "D"],
    //客户性质
    customerproperty : ["央企", "民营企业", "地市国企", "股份公司", "事业单位", "上市公司", "中外合资", "外商独资", "港澳台投资"],
    //客户规模
    customersize : ["0-20人", "20-50人", "50-100人", "100-200人", "200-500人", "500-1000人", "1000人以上"],
    //联系人类型
    contactType : ["普通人", "决策人", "分项决策人", "商务决策人", "技术决策人", "财务决策人", "使用人", "意见影响人"],
    //销售阶段
    opptStat : ["初步接洽 (10%)", "需求确定 (30%)", "方案报价 (50%)", "谈判审核 (80%)", "赢单 (100%)", "输单"],
    //客户状态
    csmStat : ["目标客户", "意向客户", "成单客户", "长期客户"],
    //联系状态
    clueState : ["未处理", "已联系", "转商机", "不合格"],
    //动态类型
    dynamicType : ["记录", "打电话", "发邮件", "发短信", "拜访", "会晤", "活动", "商务宴请"],
    examineStatus:["待审核","通过","驳回"],
    //代理授权
    authorization:["独家","排他","普通"],
    //折扣
    discount:["两折","三折"],
    //日志客户操作类型
    csmOperateType : {
        "01" : "创建",
        "02" : "更新",
        "03" : "更改机会状态"
    },
    //对象实体类型
    objEntityType : {
        "03" : "机会",
        "04" : "联系人",
        "05" : "客户"
    },
    form : {
        _pass : true,
        submit : function(callback) {
            if (this._pass) {
                this._pass = false;
                this._pass = !callback();
            }
            return this;
        },
        recover : function() {
            this._pass = true;
            return this;
        }
    }
};

function zy_parse() {
    var params = {};
    var loc = String(document.location);
    if (loc.indexOf("?") > 0)
        loc = loc.substr(loc.indexOf('?') + 1);
    else {
        return [];
    }
    var pieces = loc.split('&');
    params.keys = [];
    for (var i = 0; i < pieces.length; i += 1) {
        var keyVal = pieces[i].split('=');
        params[keyVal[0]] = decodeURIComponent(keyVal[1]);
        params.keys.push(keyVal[0]);
    }
    return params;
}

//request参数对象
function Request() {
    this.search = location.search;
    var keys = [];
    var vals = [];
    var entrys = this.search.substr(1).split('&');
    for (var i = 0,
        len = entrys.length; i < len; i++) {
        var entry = entrys[i].split('=');
        keys.push(entry[0]);
        vals.push(entry[1]);
    }
    this.keys = keys;
    this.vals = vals;
    this.getParameter = function(key) {
        for (var i = 0,
            len = keys.length; i < len; i++) {
            if (key == keys[i]) {
                return vals[i];
            }
        }
        return
        void 0;
    };
}

//验证标题是否正确
function validateTitle(title) {
    var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
    return reg.test(title);
}

function toDateString(timestamp) {
    var d = new Date(+timestamp);
    var add0 = function(num) {
        return num < 10 ? '0' + num : num;
    };
    return d.getFullYear() + '-' + add0((d.getMonth() + 1)) + '-' + add0(d.getDate()) + ' ' + add0(d.getHours()) + ':' + add0(d.getMinutes()) + ':' + add0(d.getSeconds());
}

//大区初始化
//获得所属下拉框
function getRegionOption() {
    var optionHTML = "";
    if (appcanUserInfo.regionTrade && appcanUserInfo.regionTrade.length > 0) {
        for (var i = 0; i < appcanUserInfo.regionTrade.length; i++) {
            for (var j = i; j < appcanUserInfo.regionTrade.length; j++) {
                if (appcanUserInfo.regionTrade[i].orderId < appcanUserInfo.regionTrade[j].orderId) {
                    var temp = appcanUserInfo.regionTrade[i];
                    appcanUserInfo.regionTrade[i] = appcanUserInfo.regionTrade[j];
                    appcanUserInfo.regionTrade[j] = temp;
                }
            }
        }

        for (var a = 0; a < appcanUserInfo.regionTrade.length; a++) {
            var reg = appcanUserInfo.regionTrade[a];
            optionHTML += "<option value='" + reg.regionId + "' >" + reg.regionName + "</option>";
        }

    }
    return optionHTML;
}
function getMyRegion() {
    var optionHTML = "";
    var regions=[];
    if (appcanUserInfo.regionTrade && appcanUserInfo.regionTrade.length > 0) {
        for (var i = 0; i < appcanUserInfo.regionTrade.length; i++) {
            for (var j = i; j < appcanUserInfo.regionTrade.length; j++) {
                if (appcanUserInfo.regionTrade[i].orderId < appcanUserInfo.regionTrade[j].orderId) {
                    var temp = appcanUserInfo.regionTrade[i];
                    appcanUserInfo.regionTrade[i] = appcanUserInfo.regionTrade[j];
                    appcanUserInfo.regionTrade[j] = temp;
                }
            }
        }

        for (var a = 0; a < appcanUserInfo.regionTrade.length; a++) {
            var reg = appcanUserInfo.regionTrade[a];
            var str = {
                            text : reg.regionName,
                            value : reg.regionId
                        };
            regions.push(str);
            optionHTML += "<option value='" + reg.regionId + "' >" + reg.regionName + "</option>";
        }

    }
    return {optionHTML:optionHTML,regions:regions};
}

//得到大区所对应的行业

function getInd() {
    var reg = $("#_region").val();
    var proTHML = '';
    if (appcanUserInfo.regionTrade && appcanUserInfo.regionTrade.length > 0) {
        for (var i = 0; i < appcanUserInfo.regionTrade.length; i++) {
            var reg1 = appcanUserInfo.regionTrade[i];
            if (reg == reg1.regionId) {
                for (var a = 0; a < reg1.tradeList.length; a++) {
                    for (var b = a; b < reg1.tradeList.length; b++) {
                        if (reg1.tradeList[a].orderId < reg1.tradeList[b].orderId) {
                            var temp = reg1.tradeList[a];
                            reg1.tradeList[a] = reg1.tradeList[b];
                            reg1.tradeList[b] = temp;
                        }
                    }
                }

                for (var j = 0; j < reg1.tradeList.length; j++) {
                    proTHML += "<option value='" + reg1.tradeList[j].id + "'>" + reg1.tradeList[j].name + "</option>";
                }
            }
        }
    }
    $("#profession").html("<option value=''>选择行业类别</option>" + proTHML);
    $("#_profession").html("<option value=''>选择行业类别</option>" + proTHML);
}
function getPro(reg) {
    var reg =reg;
    var proTHML =[];
    if (appcanUserInfo.regionTrade && appcanUserInfo.regionTrade.length > 0) {
        for (var i = 0; i < appcanUserInfo.regionTrade.length; i++) {
            var reg1 = appcanUserInfo.regionTrade[i];
            if (reg == reg1.regionId) {
                for (var a = 0; a < reg1.tradeList.length; a++) {
                    for (var b = a; b < reg1.tradeList.length; b++) {
                        if (reg1.tradeList[a].orderId < reg1.tradeList[b].orderId) {
                            var temp = reg1.tradeList[a];
                            reg1.tradeList[a] = reg1.tradeList[b];
                            reg1.tradeList[b] = temp;
                        }
                    }
                }

                for (var j = 0; j < reg1.tradeList.length; j++) {
                    var str = {
                            text : reg1.tradeList[j].name,
                            value : reg1.tradeList[j].id
                        };
                    proTHML.push(str);
                   // proTHML += "<option value='" + reg1.tradeList[j].id + "'>" + reg1.tradeList[j].name + "</option>";
                }
            }
        }
    }
   return proTHML;
}

//所属省份跟随大区变而变    "东北地区":["辽宁","吉林","黑龙江"]不要了
// function provinceBelong() {
// var index = $("#region").find("option:selected").val();
// var dsyObj = {
// 0:["北京", "天津", "山东","山西", "黑龙江", "吉林", "辽宁", "河北", "河南", "内蒙古自治区"],
// 1:["上海", "江苏", "浙江", "安徽"],
// 2:["广东", "广西", "福建", "海南"],
// 3:["湖北", "湖南", "江西"],
// 4:["陕西", "甘肃", "青海", "宁夏","新疆" ],
// 5:["重庆","四川", "贵州","云南","西藏"],
// 6:["香港", "澳门", "台湾"]
// };
// var str = '<option value="">选择省</option>';
// if (index && index != "") {
// var prov = dsyObj[index];
// for (var i = 0; i < prov.length; i++) {
// str += '<option value="' + prov[i] + '">' + prov[i] + '</option>';
// }
// }
// $("#s_province").html(str);
// }

function isDefine(para) {
    if ( typeof para == 'undefined' || $.trim(para) == "" || para == "[]" || para == null || para == undefined || para == 'undefined' || para == '[]')
        return false;
    else
        return true;
}

function selectOpt(id, arr) {
    for (var k = 0; k < arr.length; k++) {
        var str = '<option value="' + k + '">' + arr[k] + '</option>';
        $("#" + id).append(str);
    }
}

function selectOptIndustry(id, arr) {
    for (var k = 0; k < getLength(arr); k++) {
        var n = 0;
        if (k < 10) {
            n = '0' + k;
        } else {
            n = k;
        }
        var str = '<option value="' + n + '">' + arr[n] + '</option>';
        $("#" + id).append(str);
    }
}

function selectOpt1(arr) {
    var str = '';
    for (var k = 0; k < getLength(arr); k++) {
        var n = 0;
        if (k < 10) {
            n = '0' + k;
        } else {
            n = k;
        }
        str += '<option value="' + n + '">' + arr[n] + '</option>';

    }
    return str;
}

function getLength(obj) {
    var n = 0;
    for (var i in obj) {
        n++;
    }
    return n;
}

//获取用户信息
function getLocVal() {
    var userInfo = $.storage('crmpc');
    if (!userInfo)
        window.location.href = "login.html";
    var userId = userInfo.staff.staffId;
    //id
    var userName = userInfo.staff.fullName;
    //姓名
    var menus = userInfo.userRoleVO.menus;
    //菜单
    var regionTrade = userInfo.userRoleVO.regionTrade;
    //大区与行业
    var userRole = userInfo.userRoleVO.userRole;
    //用户权限
    var loginName = userInfo.staff.loginName;
    //登录名
    //登录头像
    var userIcon=userInfo.staff.userIcon;
    appcanUserInfo = {
        userId : userId,
        userName : userName,
        menus : menus,
        regionTrade : regionTrade,
        loginName : loginName,
        userRole : userRole,
        userIcon:userIcon
    }
    ajax({
        url : "/remind/remindTotal",
        data : {
            remindUserId : appcanUserInfo.userId,
            ifRead:"0"
        },
        success : function(data) {
            if(data.msg.total==0){
               $("#tips").html(); 
            }else{
               $("#tips").html(data.msg.total); 
            }
        }
    });

}

if (!appcanUserInfo) {
    appcanUserInfo = top.appcanUserInfo;
}

//按钮操作控制
var btnHandlerFn = function(debarBtns) {

    var req = new Request();
    var btns = req.getParameter('btns');
    var _btns = btns;
    var top = '';
    var row = '';
    if (btns) {
        btns = btns.split(',');
        for (var i = 0,
            len = btns.length; i < len; i++) {
            var btn = btns[i];
            var isExist = false;
            if (debarBtns) {
                for (var j = debarBtns.length; j >= 0; j--) {
                    if (debarBtns[j] == btn) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist) {
                    continue;
                }
            }
            switch (btn) {
            case 'add':
                top += '<button class="btn  btn-primary purple" id="add"><i class="fa fa-plus"></i> 添加</button>';
                break;
            case 'import':
                top += '<button class="btn  btn-primary purple" id="import"><i class="fa fa-upload"></i> 导入</button>';
                break;
            case 'export':
                top += '<button class="btn  btn-primary purple" id="exportFile"><i class="fa fa-download"></i> 导出</button>';
                break;
            case 'expedm':
                top += '<button class="btn  btn-primary purple"  id="expedm"><i class="fa fa-download"></i> 导出EDM</button>';
                break;
            case 'batchreport':
                top += '<button class="btn  btn-primary purple" onclick="batchreport();">批量上报</button>';
                break;
            case 'report':
                row += '<a href="#report/@" class="rowstyle"> 提交上报 </a>';
                break;
            case 'resubmit':
                row += '<a href="#resubmit/@" class="rowstyle"> 重新提交 </a>';
                break;
            case 'assign':
                row += '<a href="#assign/@" class="rowstyle"> 分配 </a>';
                break;
            case 'toopp':
                row += '<a href="#toopp/@" class="rowstyle"> 转为机会 </a>';
                break;
            case 'change':
                row += '<a href="#change/@" class="rowstyle"> 改变状态 </a>';
                break;
            case 'adjust':
                row += '<a href="javascript:;" class="rowstyle" id="adjust"> <i class="fa fa-refresh" aria-hidden="true"></i>调整阶段 </a>';
                break;
            case 'deliver':
                row += '<a href="javascript:;" class="rowstyle" id="deliver"><i class="fa fa-share-square" aria-hidden="true"></i> 转交客户 </a>';
                break;
            case 'edit':
                row += '<a href="#edit/@" class="rowstyle"> 编辑 </a>';
                break;
            case 'del':
                row += '<a href="#del/@" class="rowstyle">删除 </a>';
                break;
            case 'contact':
                row += '<a href="#contact/@" class="rowstyle"> 联系人 </a>';
                break;
            case 'transfer':
               row += '<a href="#transfer/@" class="rowstyle">转移 </a>';
                break;
            case 'convert':
                row += '<a href="#convert/@" class="rowstyle"> 转交伙伴 </a>';
                break;
            case 'cancel':
                row += '<a href="javascript:;" onclick="cancel(@);" id="cancelReport" class="rowstyle"> 取消上报 </a>';
                break;
            case 'pageNotAssign':
                top += '<div class="col-xs-1" id="NotAssign"><a class="btn btn-default  btn-primary"  id="pageNotAssign" href="clue_page.html?btns="><i class="fa fa-exchange"></i> 待分配</button></a></div>';
                break;
            case 'pageIsAssign':
                top += '<div class="col-xs-1" id="IsAssign"><a class="btn btn-default  btn-primary"  id="pageIsAssign" href="clue_page1.html?btns="><i class="fa fa-tasks"></i> 已分配</button></a></div>';
                break;
            // case 'exportCurrent':
                // top += '<div class="col-xs-1" ><button class="btn btn-default" id="exportCurrent"><i class="fa fa-download"></i> 导出当前</button></div>';
                // break;
            case 'exportAll':
                top += '<div class="col-xs-1"><button class="btn btn-default" id="exportAll"><i class="fa fa-cloud-download"></i> 导出全部</button></div>';
                break;
            case 'againExamine':
                row += '<a href="javascript:;" id="againExamine" class="rowstyle"> <i class="fa fa-history" aria-hidden="true"></i>再次送审商机</a>';
                break;
            case 'listExamine':
                row += '<a href="javascript:;" id="listExamine" class="rowstyle"><i class="fa fa-info-circle" aria-hidden="true"></i> 审核信息</a>';
                break;
            case 'examine':
                row += '<a href="javascript:;" id="examine" class="rowstyle"></i><i class="fa fa-file-text-o" aria-hidden="true"></i> 商机审核</a>';
                break;

            }

        }

        return {
            top : top,
            row : row,
            btns : _btns
        };
    }

    return null;

};
var btnHandler = btnHandlerFn();
//页面最上面的按钮
function handlerTop(id) {
    var btnHandler = btnHandlerFn(Array.prototype.slice.call(arguments, 1));
    if (btnHandler && btnHandler.top) {
        if (id && typeof id === 'string') {
            var wrapper = document.getElementById(id);
            if (wrapper) {
                wrapper.innerHTML = wrapper.innerHTML + btnHandler.top;
            }
        } else {
            return btnHandler.top;
        }
    } else {
        return '';
    }
}

//表格中的按钮
function handlerRow(args,regionName,professionName) {
    var btnHandler = btnHandlerFn(Array.prototype.slice.call(arguments, 1));
    if (btnHandler && btnHandler.row) {
         args = args || '';
         var tijiao = '<a href="#report/@"> 提交上报 </a>';
         // var para = decodeURIComponent(para);
        var btnRow = btnHandler.row;
         // var contact = JSON.parse(para);
         if (regionName == '待确认' || professionName == '待确认') {
         btnRow = btnHandler.row.replace(tijiao, '');
         }
        return btnRow.replace(/@/g, args);
    } else {
        return '';
    }
}

//条件判断
//客户名称校验
var reg1 = /^[0-9a-zA-Z\u4E00-\u9FA5\（）\()\.\@\《》\s-&]+$/;
//姓名校验
var patrn = /^[a-zA-Z\u4E00-\u9FA50-9]{1}[0-9a-zA-Z\u4E00-\u9FA5]{0,40}$/;
//手机和座机校验
var mob = /^1\d{10}$/;
var tele = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
//邮箱校验
var pattern = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
//邮编验证
var re2 = /^[1-9]\d{5}$/;
//网址验证
var Expression = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//验证传真
var patternfax = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if ( arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function loadTemplate(tpl) {
    var template = null;
    $.ajax({
        url : tplBaseUrl + tpl,
        type : 'GET',
        data : {}, //默认从参数获取
        timeout : 10000,
        async : false,
        success : function(data) {
            template = _.template(data);
        },
        error : function(e) {
        }
    });
    return template;
}

function loadSequence(urls, callback) {
    // var loader = null;
    // for (var i in urls) {
    // var url = urls[i];
    // loader = $LAB.script(url);
    // }
    // loader ? loader.wait(callback) : callback();
    $LAB.script(urls).wait(callback);

}

function logout() {
    ajax({
        url : "/uc/logout",
        success : function(data) {
            window.location = 'login.html';
        }
    });
};
function getOption(arry) {
    var optionHTML = "";
    for (var i = 0; i < arry.length; i++) {
        optionHTML += "<option value='" + arry[i] + "'>" + arry[i] + "</option>";
    };
    return optionHTML;
} ;
function profession(arry) {
    var optionHTML = "";
    for (var i = 0; i < arry.length; i++) {
        for (var j = i; j < arry.length; j++) {
            if (arry[i].orderId < arry[j].orderId) {
                var temp = arry[i];
                arry[i] = arry[j];
                arry[j] = temp;

            }
        }
    }

    for (var a = 0; a < arry.length; a++) {
        optionHTML += "<option value='" + arry[a].id + "'>" + arry[a].name + "</option>";
    }
    return optionHTML;
};
function industryHuiyi() {
    if ($("#dataSource").find("option:selected").text() == "行业会议") {
        $("#meeting").css("display", "block");
    } else {
        $("#meeting").css("display", "none");
    }
};
function getOptions(arry) {
    var optionHTML = "";
    for (var i = 0; i < arry.length; i++) {
        optionHTML += "<option value='" + arry[i] + "'>" + arry[i] + "</option>";
    };
    return optionHTML;
}

function getJOption(json) {//行业类别
    var optionHTML = "";
    for (var i in json) {
        optionHTML += "<option value='" + i + "' >" + json[i] + "</option>";
    };
    return optionHTML;
}
