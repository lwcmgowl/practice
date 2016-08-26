//jQuery.support.cors = true;
jQuery.extend({
    intiAlert : function(cnt, dom, cls, time, callback) {
        time = time || 3000;
        cls = cls || 'info';
        dom = dom || 'body';
        var $html = $('<div class="alert ' + cls + ' alert-fixed" role="alert">' + cnt + '</div>');
        var msie = navigator.userAgent.toLowerCase().indexOf("msie") > -1;
        if (msie) {
            $html = $('<div class="alert ' + cls + ' alert-fixed-ie" role="alert">' + cnt + '</div>');
        }
        $(dom).prepend($html);
        setTimeout(function() {
            $html.remove();
            if (callback && typeof callback == 'function') {
                callback();
            }
        }, time);
    },
    info : function(cnt, time, dom, callback) {
        jQuery.intiAlert(cnt, dom, 'alert-info', time, callback);
    },
    success : function(cnt, time, dom, callback) {
        jQuery.intiAlert(cnt, dom, 'alert-success', time, callback);
    },
    warning : function(cnt, time, dom, callback) {
        jQuery.intiAlert(cnt, dom, 'alert-warning', time, callback);
    },
    danger : function(cnt, time, dom, callback) {
        jQuery.intiAlert(cnt, dom, 'alert-danger', time, callback);
    }
});
var $loading = $('<div id="loading" class="loading"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>');
var ajax = function(jsonObj) {
    $('body').prepend($loading);
    $.ajax({
        url : urlIp + jsonObj.url,
        data : jsonObj.data,
        type : "POST",
        dataType : "json",
        timeout : "30000",
        success : function(data) {
            try {
                if (data.status == "000") {
                    jsonObj.success(data);
                } else if (data.status == "L001") {
                    window.location = 'login.html';
                } else {
                    $.danger(data.msg.message);
                }
            } catch(e) {
                $.warning('数据解析出错');
            }
            $loading.remove();
        },
        error : function(error) {
            $loading.remove();
            $.warning('网络错误');
            appcan.form.recover();
            if (jsonObj.error && typeof jsonObj.error == "function") {
                jsonObj.error(error);
            }
        }
    });
};

function Pagination(option) {

    var _this = this;

    //默认配置
    this.defalut = {
        header : 2,
        tail : 2,
        main : 5,
        prev : true,
        next : true,
        paging : false,
        wrapper : 'body',
        currNo : 1,
        total : 1,
        callback : null,
        dataTableCb : null,
    };

    //初始化配置
    var initDefalut = function() {

        //修改默认配置
        if (option && typeof option === 'object' && !option.length) {
            /*
             if(!option.currNo || !option.total) {
             alert('参数错误！');
             return;
             }*/
            for (var key in _this.defalut ) {
                if (option.hasOwnProperty(key)) {
                    _this.defalut[key] = option[key];
                }
            }
        } else {
            alert('参数错误！');
            return;
        }

        _this.defalut.header = _this.defalut.header > 3 ? 3 : _this.defalut.header;
        _this.defalut.tail = _this.defalut.tail > 3 ? 3 : _this.defalut.tail;
        _this.$wrapper = $(_this.defalut.wrapper);

    };

    function fill(begin, end) {
        var html = '';
        for (var i = begin; i <= end; i++) {
            if (_this.defalut.currNo == i) {
                html += '<li class="active"><a href="javascript:Pagination.go(' + i + ');">' + i + '</a></li>'
            } else {
                html += '<li><a href="javascript:Pagination.go(' + i + ');">' + i + '</a></li>'
            }

        }

        return html;
    }

    //页面渲染
    this.redner = function() {
        var html = '';
        if (_this.defalut.total == 0) {
            return html;
        }
        html += '<ul class="pagination">';

        //最前面上一页
        if (_this.defalut.prev) {
            if (_this.defalut.currNo == 1) {
                html += '<li class="disabled">' + '<a href="#" aria-label="Previous">' + '<span aria-hidden="true">&laquo;</span>' + '</a>' + '</li>';
            } else {
                html += '<li>' + '<a href="javascript:Pagination.go(' + (_this.defalut.currNo - 1) + ');" aria-label="Previous">' + '<span aria-hidden="true">&laquo;</span>' + '</a>' + '</li>';
            }

        };

        //当页数较少时，全部显示
        if (_this.defalut.header + _this.defalut.tail >= _this.defalut.total) {

            html += fill(1, _this.defalut.total);

        } else {

            html += fill(1, _this.defalut.header);

            var tmpBeginNo = _this.defalut.currNo + 1 > _this.defalut.header ? _this.defalut.currNo + 1 : _this.defalut.header + 1;
            var tmpEndNo = _this.defalut.currNo > _this.defalut.total - _this.defalut.tail ? _this.defalut.total - _this.defalut.tail : _this.defalut.currNo;

            if (_this.defalut.currNo <= _this.defalut.main + 1) {
                html += fill(_this.defalut.header + 1, tmpEndNo);
            } else {
                html += '<li class="disabled"><a href="#">...</a></li>';
                html += fill(_this.defalut.currNo - parseInt(_this.defalut.main / 2), tmpEndNo);
            }

            if (_this.defalut.currNo >= _this.defalut.total - _this.defalut.main) {
                html += fill(tmpBeginNo, _this.defalut.total - _this.defalut.tail);
            } else {
                html += fill(tmpBeginNo, _this.defalut.currNo + parseInt(_this.defalut.main / 2));
                html += '<li class="disabled"><a href="#">...</a></li>';
            }

            html += fill(_this.defalut.total - _this.defalut.tail + 1, _this.defalut.total);

        }

        //最后面下一页
        if (_this.defalut.next) {
            if (_this.defalut.currNo == _this.defalut.total) {
                html += '<li class="disabled">' + '<a href="#" aria-label="Next">' + '<span aria-hidden="true">&raquo;</span>' + '</a>' + '</li>';
            } else {
                html += '<li>' + '<a href="javascript:Pagination.go(' + (_this.defalut.currNo + 1) + ');" aria-label="Next">' + '<span aria-hidden="true">&raquo;</span>' + '</a>' + '</li>';
            }

        };

        html += '</ul>';

        _this.$ele = $(html);
        _this.$wrapper.append(_this.$ele);

    };

    //分页跳转
    this.go = function(pageNo) {
        pageNo = +(pageNo || 1) || 1;
        if (targetjudge == 11 || !targetjudge) {
            currentpageNumber = pageNo;
        } else {
            currentneipageNumber = 1;
        }

        this.defalut.currNo = pageNo;
        if (_this.$ele) {
            _this.$ele.remove();
        }

        if (_this.defalut.callback && ( typeof _this.defalut.callback === 'function')) {
            _this.defalut.callback(pageNo);
        }
    };

    Pagination.go = function(pageNo) {
        if (targetjudge == 11) {
            $.ajaxSetup({
                async : false
            });
            _this.go(pageNo);
            $('.myStatpp').circliful();
        } else {
            _this.go(pageNo);
        }

    };

    initDefalut();
}

//表格操作对象
function DataTable(options, mark) {
    targetjudge = mark;
    var _this = this;
    //分页对象
    var page = null;

    //缓存table对象
    var $table = _this.$table = $(options['id']);
    var pageSize = _this.pageSize = options['pageSize'] || 10;
    pageSize = +pageSize;
    //数据源
    var dataSrc = _this.dataSrc = options['list'];
    //总记录数
    _this.total = options['total'] || 0;
    //是否是真分页
    var pageCountnn = options['pageCount'];
    var paging = _this.paging = options['paging'];
    var ppcount = _this.total = options['total'];
    var showcount = options['showcount'];
    if (!paging) {
        if (ppcount) {
            _this.total = ppcount;
        } else {
            _this.total = dataSrc.length;
            if (dataSrc.length < 10) {
                pageCountnn = 1;
            } else if (dataSrc.length % 10 == 0) {
                pageCountnn = dataSrc.length / 10;
            } else {
                pageCountnn = dataSrc.length / 10 + 1;
            }
        }

    }
    //table的th
    var columns = _this.columns = options['columns'];
    //对指定列的操作
    var columnDefs = _this.columnDefs = options['columnDefs'];

    var initOption = function() {

        //创建表字符串
        var ths = ['<thead id="theadall"><tr>'];
        //创建表头
        for (var i = 0,
            len = columns.length; i < len; i++) {
            ths.push('<th>' + columns[i].title + '</th>');
        }
        ths.push('</thead></tr><tbody>');
        ths.push('</tbody>');
        $table.html(ths.join(''));

        if (mark == 11 || !mark) {
            $('.dataTables_info,.pagination-pos').remove();
            $table.parent().append('<div class="dataTables_info" id="datatable_info" role="status" aria-live="polite"  style="padding-top:1.75em;"                                                                                                                                                                                                                                                                                                                                                                                                              >共 ' + _this.total + ' 条数据</div>');
            $table.parent().append('<nav  style="float: right;padding-top:1.75em;" id="pagepart"> </nav>');
        } else {
            if (mark != 10) {
                $table.parent().append('<nav  style="float: right;padding-top:1.75em;" id="pagepartchoose"> </nav>');
            }

        }

    };

    //创建表格内容
    var loadContent = _this.loadContent = function(pageNo) {
        var ths = [];
        var begin = (pageNo - 1) * pageSize;
        var end = pageNo * pageSize;
        var dataSrc = _this.dataSrc;
        end = end > dataSrc.length ? dataSrc.length : end;
        //加载数据源
        for (var i = begin,
            len =
            end; i < len; i++) {
            ths.push(columnDefs[0].render(i, j, dataSrc[i]));

            for (var j = 0,
                len2 = columns.length; j < len2; j++) {
                var markCol = -1;
                for (var k = 1,
                    len3 = columnDefs.length; k < len3; k++) {
                    if (columnDefs[k].targets == j) {
                        if ( typeof columnDefs[k].render === 'function') {
                            var render = columnDefs[k].render(i, j, dataSrc[i]);
                            var padding = "";
                            if (columnDefs[k].padding) {
                                padding = columnDefs[k].padding
                            }
                            if (columnDefs[k].width) {
                                ths.push('<td style="width:' + columnDefs[k].width + ';padding-top:' + padding + ';padding-bottom:' + padding + ';">' + render + '</td>');
                            } else {
                                ths.push('<td style="padding-top:' + padding + ';padding-bottom:' + padding + '">' + render + '</td>');
                            }
                        } else {
                            ths.push('<td> </td>');
                        }
                        markCol = k;
                        break;
                    }
                }
                if (markCol == -1) {
                    if (columns[j].data && dataSrc[i].hasOwnProperty(columns[j].data) && (dataSrc[i][columns[j].data] || dataSrc[i][columns[j].data] == 0)) {
                        ths.push('<td title="' + dataSrc[i][columns[j].data] + '">' + dataSrc[i][columns[j].data] + '</td>');
                    } else {
                        ths.push('<td> </td>');
                    }
                }
            }
            ths.push('</tr>');
        }

        $table.find('tbody').html(ths.join(''));
        if (options.callback && typeof options.callback === 'function') {
            options.callback();
        }
    };

    var request = function(pageNo) {

        if (_this.paging) {
            var url = urlIp;
            if (options.ajax.url) {
                url = urlIp + options.ajax.url;
            }
            if (options.ajax) {
                $('body').prepend($loading);
                $.ajax({
                    url : url,
                    data : JSON.stringify(options.ajax.data),
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
                    contentType : "application/json",
                    success : function(data) {
                        try {
                            if (data.status == "000") {
                                if (data.msg.dynamicCount) {
                                    $("#dynamicCount").html(data.msg.dynamicCount);
                                } else {
                                    $("#dynamicCount").html(0);
                                }
                                if (data.msg.customCount) {
                                    $("#customCount").html(data.msg.customCount);
                                } else {
                                    $("#customCount").html(0);
                                }
                                _this.dataSrc = data.msg.list || [];
                                _this.total = data.msg.total || 0;
                                var count = 0;
                                if (data.msg.count) {
                                    count = data.msg.count;
                                }
                                page.defalut.total = count;
                                if (showcount) {
                                    $("#" + showcount).html("(" + data.msg.total + ")");
                                }
                                initOption();
                                //page.$wrapper = $('.pagination-pos');
                                pagepart1 = "首页";
                                pagepart1_1 = "<a >首页</a>";
                                currentPageCount = pageNo;
                                pageCount = count;
                                var show1 = "第 " + currentPageCount + " 页   ";
                                var showpre = "";
                                var showdown = "";
                                if (pageCount <= 1) {
                                    showpre = " 上一页 ";
                                    showdown = " 下一页 ";
                                } else if (currentPageCount <= 1) {
                                    showpre = " 上一页  ";
                                    showdown = " <a style='cursor: pointer;' onclick='javascript:Pagination.go(" + (pageNo + 1) + ");'>下一页</a> ";
                                } else if (currentPageCount >= pageCount) {
                                    showpre = " <a style='cursor: pointer;' onclick='javascript:Pagination.go(" + (pageNo - 1) + ");'>上一页</a> ";
                                    showdown = " 下一页 ";
                                } else {
                                    showpre = " <a style='cursor: pointer;' onclick='javascript:Pagination.go(" + (pageNo - 1) + ");'>上一页</a> ";
                                    showdown = " <a style='cursor: pointer;' onclick='javascript:Pagination.go(" + (pageNo + 1) + ");'>下一页</a> ";
                                }
                                var showprejump = "";
                                if (mark == 11 || !mark) {
                                    showprejump = "跳转到 <input type='text' style='width: 50px; height: 32px;border-radius: 4px' id='jumpcount' value='" + pageNo + "' onkeypress='javascript:gojump(event," + pageCount + ");'> 页";
                                } else {
                                    showprejump = "跳转到 <input type='text' style='width: 50px; height: 32px;border-radius: 4px' id='jumpcountping' value='" + pageNo + "' onkeypress='javascript:gojumpping(event," + pageCount + ");'> 页";
                                }
                                // var showprejump = "跳转到 <input type='text' style='width: 50px; height: 32px;border-radius: 4px' id='jumpcount' value='" + pageNo + "' onkeypress='javascript:gojump(event," + pageCount + ");'> 页";
                                var show2 = "共 " + pageCount + " 页    ";
                                var show = show1 + showpre + showdown + show2 + showprejump;

                                if (mark == 11 || !mark) {
                                    $("#pagepart").html(show);
                                } else {
                                    $("#pagepartchoose").html(show);
                                }
                                page.redner();
                                _this.loadContent(1);

                            } else if (data.status == "14504" || data.status == "L001") {
                                $.danger("当前用户登录超时，请重新登录！", "", "", function() {
                                    window.location = 'login.html';
                                });
                            } else if (data.status == "A001") {
                                $.danger("当前用户没有权限！");
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
                        console.log(error);
                        $loading.remove();
                        $.danger('网络出错');
                    }
                });

            }
        } else {
            initOption();
            page.$wrapper = $('.pagination-pos');
            var pagepart1 = "首页";
            var pagepart1_1 = "<a>首页</a>";
            currentPageCount = pageNo;
            pageCount = pageCountnn;
            var show1 = "第 " + currentPageCount + " 页   ";
            var showpre = "";
            var showdown = "";
            if (pageCount <= 1) {
                showpre = " 上一页 ";
                showdown = " 下一页 ";
            } else if (currentPageCount <= 1) {
                showpre = " 上一页  ";
                showdown = " <a onclick='javascript:Pagination.go(" + (pageNo + 1) + ");'>下一页</a> ";
            } else if (currentPageCount >= pageCount) {
                showpre = " <a onclick='javascript:Pagination.go(" + (pageNo - 1) + ");'>上一页</a> ";
                showdown = " 下一页 ";
            } else {
                showpre = " <a href='#' onclick='javascript:Pagination.go(" + (pageNo - 1) + ");'>上一页</a> ";
                showdown = " <a onclick='javascript:Pagination.go(" + (pageNo + 1) + ");'>下一页</a> ";
            }
            var showprejump = "";
            if (mark == 11 || !mark) {
                showprejump = "跳转到 <input type='text' style='width: 50px; height: 32px;border-radius: 4px' id='jumpcount' value='" + pageNo + "' onkeypress='javascript:gojump(event," + pageCount + ");'> 页";
            } else {
                showprejump = "跳转到 <input type='text' style='width: 50px; height: 32px;border-radius: 4px' id='jumpcountping' value='" + pageNo + "' onkeypress='javascript:gojumpping(event," + pageCount + ");'> 页";
            }
            var show2 = "共 " + pageCount + " 页    ";
            var show = show1 + showpre + showdown + show2 + showprejump;
            if (mark == 11 || !mark) {
                $("#pagepart").html(show);
            } else {
                $("#pagepartchoose").html(show);
            }
            page.redner();
            _this.loadContent(pageNo);
        }
    };

    var cnt = Math.ceil(_this.total / _this.pageSize);

    //初始化分页
    page = new Pagination({
        total : cnt,
        wrapper : '.pagination-pos',
        callback : request
    });

    if (currentpageNumber) {
        if (mark == 11 || !mark) {
            page.go(currentpageNumber);
        } else {
            page.go(currentneipageNumber);
        }
    } else {
        page.go(1);
    }

}

function gojump(event, pageCount) {
    event = event || window.event;
    if (event.keyCode == 13) {
        var jumpcount = $.trim($("#jumpcount").val());
        if (!(/^\d+$/.test(jumpcount))) {
            $.warning('跳转页数必须为正整数');
        } else if (parseInt(jumpcount) > pageCount) {
            $.warning("最多可跳转到" + pageCount + "页");
            Pagination.go(pageCount);
        } else {
            Pagination.go(parseInt(jumpcount));
        }

    }

}

function gojumpping(event, pageCount) {
    event = event || window.event;
    if (event.keyCode == 13) {
        var jumpcount = $.trim($("#jumpcountping").val());
        if (!(/^\d+$/.test(jumpcount))) {
            $.warning('跳转页数必须为正整数');
        } else if (parseInt(jumpcount) > pageCount) {
            $.warning("最多可跳转到" + pageCount + "页");
            Pagination.go(pageCount);
        } else {
            Pagination.go(parseInt(jumpcount));
        }

    }

}