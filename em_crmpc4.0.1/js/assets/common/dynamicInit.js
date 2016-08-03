var objEntityTypeId = '';
var objEntityId= '';
var editType = '2';
var urlmap = '';
var req = '';
var aCmtObj = null;
var cmtCnt = 0;
function toDynamicDate(timestamp, modle) {
    var d = new Date(+timestamp);
    var add0 = function(num) {
        return num < 10 ? '0' + num : num;
    };
    if (modle == 'h-m') {
        return add0(d.getHours()) + ':' + add0(d.getMinutes());
    }
    if (modle == 'm-d') {
        var now = new Date();
        var nowymd = now.getFullYear() + '-' + add0((now.getMonth() + 1)) + '-' + add0(now.getDate());
        var ymd = d.getFullYear() + '-' + add0((d.getMonth() + 1)) + '-' + add0(d.getDate());
        if (nowymd == ymd) {
            return '今天';
        } else {
            return add0((d.getMonth() + 1)) + '-' + add0(d.getDate());
        }
    }
    if (modle == 'm-d-h-m') {
        return add0((d.getMonth() + 1)) + '-' + add0(d.getDate()) + ' ' + add0(d.getHours()) + ':' + add0(d.getMinutes());
    }
    return d.getFullYear() + '-' + add0((d.getMonth() + 1)) + '-' + add0(d.getDate()) + ' ' + add0(d.getHours()) + ':' + add0(d.getMinutes()) + ':' + add0(d.getSeconds());
}

//添加评论
function addWord(dynamicId, uId, uName, f) {
    if (f) {
        var content = $.trim($("#word" + dynamicId).val());
        //描述
    } else
        var content = $.trim($("#wordContent" + dynamicId).val());
    //描述
    if (content === '') {
        $.danger("请添加信息");
        return;
    }
    var data = {
        "objEntityId" : dynamicId,
        "objEntityTypeId" : (objEntityTypeId == 'operatelog' ? '07' : '06'),
        "rcvUserId" : $.trim(uId),
        "content" : content
    };

    ajax({
        url : urlmap + "/word/reply",
        data : data,
        success : function(data) {
            wordDynamic(dynamicId, $.trim(uId), (uName), aCmtObj, cmtCnt, 1);
            aCmtObj.innerHTML = '评论（' + (++cmtCnt) + '）';
            $.success("评论成功！");
        }
    });

}

//删除动态
function deleteDynamic(deleteDynamicId) {
    bootbox.confirm("您确认删除此跟进动态吗？", function(result) {
        if (result) {
            var data = {
                "id" : deleteDynamicId
            };
            ajax({
                url : urlmap + "/dynamic/deldynamic",
                data : data,
                success : function(data) {
                    getDynamic();
                    $.success("删除成功！", null, null, function() {
                        //window.location.href="Datarights_list.html";
                    });
                }
            });
        } else {
        }
    });
}

//回复
function wordReply(dynamicId, uId, uName) {
    var str = '<li class="list-group-item bg-primary"><form class="form-horizontal"><div class="form-group"><div class="col-sm-12"><textarea class="form-control" placeholder="回复' + decodeURIComponent(uName) + '：" cols="30" rows="3" id="word' + dynamicId + '"></textarea></div></div><div class="row"><div class="col-sm-10"></div><div class="col-sm-2 "><button class="btn btn-info" type="button" id="submit" onclick="addWord(' + dynamicId + ',\'' + uId + '\',\'' + (uName) + '\',1)" style="float:right;">回复</button></div></div></form><div class="" ></li>'
    if ($('#word' + dynamicId) && $('#word'+dynamicId)[0]) {
        $('#word' + dynamicId).focus();
        return;
    }
    $('#dynamic' + dynamicId + ' ul').append(str);
    $('#word' + dynamicId).focus();
}

//添加动态
function addDynamic() {
    var dynamicContent = $.trim($("#dynamicContent").val());
    //描述
    if (dynamicContent === '') {
        $.danger("请添加动态信息");
        return;
    }
    var dynamicType = $.trim($("#dynamicType").val());
    if (dynamicType === '00') {
        $.danger("请选择类型");
        return;
    }
    var data = {
        "objEntityId" : objEntityId,
        "objEntityTypeId" : objEntityTypeId,
        "dynamicContent" : dynamicContent,
        "dynamicType" : dynamicType,
        "attachment" : []
    };
    ajax({
        url : urlmap + "/dynamic/rlsdynamic",
        data : data,
        success : function(data) {
            $.success("创建成功！", null, null, function() {
                $('#dynamicContent').val('');
                $('#dynamicType option[value=00]').attr('selected', true);
                getDynamic()
                //window.location.href="Datarights_list.html";
            });
        }
    });
}

function getDynamic() {
    var data = {
        "objEntityId" : objEntityId,
        "objEntityTypeId" : objEntityTypeId

    };
    new DataDynamic({
        id : '#list',
        paging : true,
        pageSize : 5,
        type : 'dynamiclist',
        editType : editType,
        ajax : {
            url : urlmap + '/dynamic/page',
            data : data
        }

    });
};

//获取评论列表
function wordDynamic(dynamicId, uId, uName, aobj, cnt, f) {
    aCmtObj = aobj;
    cnt = parseInt(aobj.innerHTML.split('（')[1].split('）')[0])
    cmtCnt = cnt;
    var data = {
        "objEntityId" : dynamicId,
        "objEntityTypeId" : (objEntityTypeId == 'operatelog' ? '07' : '06')
    };
    if (!f && $('#dynamic' + dynamicId).html()) {
        $('#dynamic' + dynamicId).parent().addClass('hide');
        $('#dynamic' + dynamicId).html('')
        $('#dynamic' + dynamicId).next().remove();
        return;
    }
    new DataDynamic({
        id : '#dynamic' + dynamicId,
        paging : true,
        pageSize : 5,
        type : 'wordlist',
        wordUser : {
            userId : $.trim(uId),
            userName : decodeURIComponent(uName)
        },
        ajax : {
            url : urlmap + '/word/page',
            data : data
        }

    });
}

//表格操作对象
function DataDynamic(options) {

    var _this = this;
    //分页对象
    var page = null;

    //缓存table对象
    var $table = _this.$table = $(options['id']);
    var pageId = _this.pageId = options['id'].replace('#', '');
    var type = _this.type = options['type'];
    var wordUser = _this.wordUser = options.wordUser;
    var editType = _this.editType = options["editType"];
    var pageSize = _this.pageSize = options['pageSize'] || 10;
    pageSize = +pageSize;
    //数据源
    var dataSrc = _this.dataSrc = options['list'];
    //总记录数
    _this.total = options['total'] || 0;
    //是否是真分页
    var paging = _this.paging = options['paging'];
    if (!paging) {
        _this.total = dataSrc.length;
    }

    var initOption = function() {

        $('#page' + pageId).remove();
        $table.parent().append('<div id="page' + pageId + '">' + '<div class="dataTables_info" id="datatable_info" role="status" aria-live="polite">共 ' + _this.total + ' 条数据</div>' + '<nav class="pagination-pos page' + pageId + '"></nav>' + '</div>');
        if (_this.total == 0) {
            $('.pagination-pos').css('display', 'none');
        }
    };

    //创建表格内容
    var loadContent = _this.loadContent = function(pageNo) {
        var ths = [];
        var begin = (pageNo - 1) * pageSize;
        var end = pageNo * pageSize;
        var dataSrc = _this.dataSrc;

        //用于判断是否是自己的评论，自己的评论不可回复
        var myRes = '';

        end = end > dataSrc.length ? dataSrc.length : end;
        if (_this.type == 'wordlist') {
            //评论
            var list = '<form class="form-horizontal"><div class="form-group"><div class="col-sm-12"><textarea class="form-control" placeholder="请填写评论" cols="30" rows="3" id="wordContent' + pageId.split('dynamic')[1] + '"></textarea></div></div><div class="row"><div class="col-sm-11"></div><div class="col-sm-1"><button class="btn btn-info" type="button" id="submit" style="float:right;" onclick="addWord(' + pageId.split('dynamic')[1] + ',\'\',\'\')">评论</button></div></div></form><div class="" ><div class="panel-heading"></div><div class="panel-heading"></div>'
            ths.push(list);
        }

        //加载数据源
        for (var i = begin,
            len =
            end; i < len; i++) {
            if (_this.type == 'wordlist') {//留言列表
                var str = '';
                //    [{"id":8,"userId":"ZY0623","operateUserId":"ZY0623","createdAt":1442634299000,"updatedAt":1442634299000,"content":"这是评论","rcvUserId":"ZY0623","rcvUserName":"佟鑫","userName":"佟鑫","objEntityId":"9","objEntityTypeId":"06","wordCnt":null}]}}
                var day = toDynamicDate(dataSrc[i].updatedAt, 'm-d');
                if (i == begin)
                    str = '<ul class="list-group" >'

                str += '<li class="list-group-item bg-primary"><div class="col-sm-2">' + toDynamicDate(dataSrc[i].updatedAt, 'm-d-h-m') + '</div>' + '<div class="col-sm-2">' + dataSrc[i].userName + '</div>' + '<div class=" text-right">';

                if (dataSrc[i].userId != appcanUserInfo.userId)
                    str += '<a href="javascript:;" name="' + i + '" onclick="wordReply(' + pageId.split('dynamic')[1] + ',\'' + dataSrc[i].userId + '\',\'' + encodeURIComponent(dataSrc[i].userName) + '\')">回复</a>　';

                str += '</div></br></h3><h3 class="panel-title"><div class="yh" style="margin-top:10px">' + (dataSrc[i].rcvUserName ? '<span class="text-primary">回复 ' + dataSrc[i].rcvUserName + ':</span> ' : "") + dataSrc[i].content + '</div></h3>'

                if (i == (len - 1))
                    str += '</ul>';
                ths.push(str);
            } else if (_this.type == 'operateloglist') {//日志列表
                var day = toDynamicDate(dataSrc[i].updatedAt, 'm-d');
                var list = '<div class="panel panel-default"><div class="panel-heading">' + '<h3 class="panel-title"><div class="panel-title"><span class="' + (day == '今天' ? 'day-color' : 'day-color-other') + '">　' + day + '　</span></div></br><div class="row"><div class="col-sm-1">' + toDynamicDate(dataSrc[i].updatedAt, 'h-m') + '</div>' + '<div class="col-sm-2">' + dataSrc[i].userName + '</div>' + '<div class=" text-right">' + '<a href="javascript:;" onclick="wordDynamic(' + dataSrc[i].id + ',\'' + dataSrc[i].userId + '\',\'' + encodeURIComponent(dataSrc[i].userName) + '\',this,' + (dataSrc[i].wordCnt ? dataSrc[i].wordCnt : 0) + ')">评论（' + (dataSrc[i].wordCnt ? dataSrc[i].wordCnt : 0) + '）</a>　' + '</div></br></h3><h3 class="panel-title"><div class="yh">'; +
                dataSrc[i].dynamicContent
                if (dataSrc[i].csmOperateType == '03') {
                    list += '<span class="text-primary"> ' + dataSrc[i].objName + '</span>' + appcan.csmOperateType[dataSrc[i].csmOperateType] + '为' + '<span class="text-primary"> ' + appcan.opptStat[dataSrc[i].newOpptStat] + '</span> ';
                } else {
                    list += appcan.csmOperateType[dataSrc[i].csmOperateType] + '了' + appcan.objEntityType[dataSrc[i].objEntityTypeId] + '<span class="text-primary"> ' + dataSrc[i].objName + '</span> '
                }
                list += '</div></h3></div><div class="panel-body hide"><div class="panel-body comment" id="dynamic' + dataSrc[i].id + '"></div></div></div>'
                ths.push(list);
            } else {//动态列表
                var day = toDynamicDate(dataSrc[i].updatedAt, 'm-d');
                var list = '<div class="panel panel-default"><div class="panel-heading">' + '<h3 class="panel-title"><div class="panel-title"><span class="' + (day == '今天' ? 'day-color' : 'day-color-other') + '">　' + day + '　</span></div></br><div class="row"><div class="col-sm-1">' + toDynamicDate(dataSrc[i].updatedAt, 'h-m') + '</div>' + '<div class="col-sm-2">' + dataSrc[i].userName + '</div>' + '<div class="col-sm-2">' + appcan.dynamicType[dataSrc[i].dynamicType] + '</div>' + '<div class=" text-right">';
                if (dataSrc[i].userId == appcanUserInfo.userId) {
                    list += (_this.editType == '2' ? '' : '<a href="javascript:;" class="text-danger" onclick="deleteDynamic(' + dataSrc[i].id + ')">删除</a>　');
                }
                list += '<a href="javascript:;" onclick="wordDynamic(' + dataSrc[i].id + ',\'' + dataSrc[i].userId + '\',\'' + encodeURIComponent(dataSrc[i].userName) + '\',this,' + (dataSrc[i].wordCnt ? dataSrc[i].wordCnt : 0) + ')">评论（' + (dataSrc[i].wordCnt ? dataSrc[i].wordCnt : 0) + '）</a>　' + '</div></br></h3><h3 class="panel-title"><div class="yh">' + dataSrc[i].dynamicContent + '</div></h3></div><div class="panel-body hide"><div class="panel-body comment" id="dynamic' + dataSrc[i].id + '"></div></div></div>'
                ths.push(list);
            }

        }

        $table.html(ths.join(''));
        if (options.callback && typeof options.callback === 'function') {
            options.callback();
        }
    };

    var request = function(pageNo) {
        if (_this.paging) {
            if (options.ajax) {
                $('body').prepend($loading);
                // data = '{"status":"000","msg":{"total":1,"count":1,"list":[{"id":6,"userId":"ZY0623","operateUserId":"ZY0623","createdAt":1442562682000,"updatedAt":1442562682000,"objEntityId":"6","objEntityTypeId":"03","dynamicContent":"这是什么","dynamicType":"0","attachment":null,"address":null,"psty":null,"pstx":null,"userName":"佟鑫","userIcon":"55ee76d67cfdc8a11fa91e0e","wordCnt":null}]}}'
                // data = JSON.parse(data);
                // _this.dataSrc = data.msg.list;
                // _this.total = data.msg.total;
                // page.defalut.total = data.msg.count;
                // initOption();
                // page.$wrapper = $('.page'+_this.pageId);
                // page.redner();
                // _this.loadContent(1);
                // $loading.remove();
                // if(_this.type=='wordlist'){
                // _this.$table.parent().removeClass('hide');
                // }
                // return;
                $.ajax({
                    url : urlIp + options.ajax.url,
                    data : options.ajax.data,
                    beforeSend : function(xhr, obj) {
                        if (obj.data) {
                            obj.data += "&pageNo=" + pageNo + "&pageSize=" + _this.pageSize;
                        } else {
                            obj.data += "pageNo=" + pageNo + "&pageSize=" + _this.pageSize;
                        }

                    },
                    type : "POST",
                    timeout : "30000",
                    dataType : "json",
                    success : function(data) {
                        try {
                            if (data.status == "000") {
                                _this.dataSrc = data.msg.list;
                                _this.total = data.msg.total;
                                page.defalut.total = data.msg.count;
                                initOption();
                                page.$wrapper = $('.page' + _this.pageId);
                                page.redner();
                                _this.loadContent(1);
                                if (_this.type == 'wordlist') {
                                    _this.$table.parent().removeClass('hide');
                                }
                            } else if (data.status == "L001") {
                                window.location = 'login.html';
                            } else {
                                $.danger(data.msg.message);
                            }
                        } catch(e) {
                            console.log(e);
                            $.danger('数据解析出错');
                        }
                        $loading.remove();
                    },
                    error : function(error) {
                        $loading.remove();
                        $.danger('网络出错');
                    }
                });

            }
        } else {
            initOption();
            page.$wrapper = $('.page' + _this.pageId);
            page.redner();
            _this.loadContent(pageNo);
        }
    };

    var cnt = Math.ceil(_this.total / _this.pageSize);
    //初始化分页
    page = new Pagination({
        total : cnt,
        wrapper : '.page' + _this.pageId,
        callback : request
    });
    page.go(1);
}
