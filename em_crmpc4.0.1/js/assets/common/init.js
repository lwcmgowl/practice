//jQuery.support.cors = true;
jQuery.extend({
  intiAlert: function(cnt,dom,cls,time,callback){
    time = time || 3000;
    cls = cls ||'info';
    dom = dom ||'body';
    var $html = $('<div class="alert '+cls+' alert-fixed" role="alert">'+cnt+'</div>');
    var msie = navigator.userAgent.toLowerCase().indexOf("msie") > -1;
    if(msie) {
      $html = $('<div class="alert '+cls+' alert-fixed-ie" role="alert">'+cnt+'</div>');
    }
    $(dom).prepend($html);
    setTimeout(function(){
      $html.remove();
      if(callback && typeof callback == 'function'){
        callback();
      }
    },time);
  },
  info: function(cnt,time,dom,callback) {
    jQuery.intiAlert(cnt,dom,'alert-info',time,callback);
  },
  success: function(cnt,time,dom,callback) {
    jQuery.intiAlert(cnt,dom,'alert-success',time,callback);
  },
  warning: function(cnt,time,dom,callback) {
    jQuery.intiAlert(cnt,dom,'alert-warning',time,callback);
  },
  danger: function(cnt,time,dom,callback) {
    jQuery.intiAlert(cnt,dom,'alert-danger',time,callback);
  }
});
var $loading = $('<div id="loading" class="loading"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>');
var ajax = function(jsonObj){
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
        } else if(data.status == "L001"){
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
      if(jsonObj.error && typeof jsonObj.error == "function"){
          jsonObj.error(error);
      }
    }
  });
};

function Pagination(option){

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
        callback : null
    };

    //初始化配置
    var initDefalut = function() {

        //修改默认配置
        if(option && typeof option === 'object' && !option.length) {
            /*
            if(!option.currNo || !option.total) {
                alert('参数错误！');
                return;
            }*/
            for(var key in _this.defalut ) {
                if(option.hasOwnProperty(key)) {
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

    function fill(begin, end){
        var html = '';
        for(var i = begin; i <= end; i++) {
            if(_this.defalut.currNo == i) {
                html += '<li class="active"><a href="javascript:Pagination.go(' + i + ');">'+i+'</a></li>'
            } else {
                html += '<li><a href="javascript:Pagination.go(' + i + ');">'+i+'</a></li>'
            }

        }

        return html;
    }

    //页面渲染
    this.redner = function() {
        var html = '';
        html += '<ul class="pagination">';

        //最前面上一页
        if(_this.defalut.prev){
            if(_this.defalut.currNo == 1) {
                html += '<li class="disabled">'
                +'<a href="javascript:;" aria-label="Previous">'
                +'<span aria-hidden="true">&laquo;</span>'
                +'</a>'
                +'</li>';
            } else {
                html += '<li>'
                +'<a href="javascript:Pagination.go(' + (_this.defalut.currNo - 1) + ');" aria-label="Previous">'
                +'<span aria-hidden="true">&laquo;</span>'
                +'</a>'
                +'</li>';
            }

        };

        //当页数较少时，全部显示
        if(_this.defalut.header + _this.defalut.tail >= _this.defalut.total){

            html += fill(1, _this.defalut.total);

        } else {

            html += fill(1, _this.defalut.header);

            var tmpBeginNo = _this.defalut.currNo + 1 > _this.defalut.header ? _this.defalut.currNo + 1 : _this.defalut.header + 1;
            var tmpEndNo = _this.defalut.currNo > _this.defalut.total - _this.defalut.tail ? _this.defalut.total - _this.defalut.tail : _this.defalut.currNo;

            if(_this.defalut.currNo <= _this.defalut.main + 1) {
                html += fill(_this.defalut.header + 1, tmpEndNo);
            } else {
                html += '<li class="disabled"><a href="javascript:;">...</a></li>';
                html += fill(_this.defalut.currNo - parseInt(_this.defalut.main/2), tmpEndNo);
            }

            if(_this.defalut.currNo >=  _this.defalut.total - _this.defalut.main) {
                html += fill(tmpBeginNo, _this.defalut.total - _this.defalut.tail);
            } else {
                html += fill(tmpBeginNo, _this.defalut.currNo + parseInt(_this.defalut.main/2));
                html += '<li class="disabled"><a href="javascript:;">...</a></li>';
            }

            html += fill(_this.defalut.total - _this.defalut.tail + 1, _this.defalut.total);

        }

        //最后面下一页
        if(_this.defalut.next){
            if(_this.defalut.currNo == _this.defalut.total) {
                html += '<li class="disabled">'
                +'<a href="javascript:;" aria-label="Next">'
                +'<span aria-hidden="true">&raquo;</span>'
                +'</a>'
                +'</li>';
            } else {
                html += '<li>'
                +'<a href="javascript:Pagination.go(' + (_this.defalut.currNo + 1) + ');" aria-label="Next">'
                +'<span aria-hidden="true">&raquo;</span>'
                +'</a>'
                +'</li>';
            }

        };

        html += '</ul>';

        _this.$ele = $(html);
        _this.$wrapper.append(_this.$ele);

    };

    //分页跳转
    this.go = function(pageNo) {
        pageNo = +(pageNo || 1) || 1;
        this.defalut.currNo = pageNo;
        if(_this.$ele) {
            _this.$ele.remove();
        }

        
        if(_this.defalut.callback && (typeof _this.defalut.callback === 'function')) {
            _this.defalut.callback(pageNo);
        }
    };

    Pagination.go = function(pageNo) {
        _this.go(pageNo);
    };

    initDefalut();
}

//表格操作对象
function DataTable(options) {

  //初始化表格数据
  var initDefault = function (options) {

    options.$table = $(options['id']);
    options.paging = !!options.paging;
    options['pageSize'] = parseInt(options['pageSize'], 10) || 10;

    //数据源必须存在一个
    if (!options.list && !options.ajax) {
      throw new Error('Data source does not exist');
    }

    //假分页
    if (!options.paging) {
      options.dataSrc = options.list;
      options.total = options.list.length;
    }

    var columns = options['columns'];
    var titles = [];
    var fields = [];
    var classs = [];
    var tips = [];
    var widths = [];
    var styles = [];
    for (var i = 0; i < columns.length; i++) {
      titles.push(columns[i].title);
      fields.push(columns[i].data);
      classs.push(columns[i]['class']);
      tips.push(columns[i].tip);
      widths.push(columns[i].width);
      styles.push(columns[i].style);
    }

    var columnDefs = options['columnDefs'];
    var fieldDefs = [];
    fieldDefs.length = columns.length;
    for (var i = 0; i < columnDefs.length; i++) {
      var target = columnDefs[i].target || columnDefs[i].targets;
      fieldDefs[parseInt(target,10)] = columnDefs[i].render;
    }

    options.titles = titles;
    options.fields = fields;
    options.classs = classs;
    options.fieldDefs = fieldDefs;
    options.tips = tips;
    options.widths = widths;
    options.styles = styles;

    return options;
  };
  
  var addAttrs = function(j,data){
    var attrs = '';
    var cls = this.classs[j];
    if(cls){
      attrs += ' class=' + cls;
    }
    if(data){
        var tip = !!this.tips[j];
        if(tip){
          attrs += ' title=' + data;
        }
    }
    var width = this.widths[j];
    if(width){
      attrs += ' width=' + width;
    }
    var style = this.styles[j];
    if(style){
      attrs += ' style=' + style;
    }
    return attrs;
  };

  //创建表头
  var createHead = (function(){
    var once = false;
    return function () {
      if(!once){
        once = true;
        var titles = this.titles;
        var ths = ['<thead><tr>'];
        for (var i = 0; i < titles.length; i++) {
          var attrs = addAttrs.call(this,i);  
          ths.push('<th '+attrs+'>' + titles[i] + '</th>');
        }
        ths.push('</thead></tr><tbody></tbody>');
        this.$table.html(ths.join(''));
        this.$table.parent().append('<div class="dataTables_info" role="status" aria-live="polite">共 ' + this.total + ' 条数据</div><nav class="pagination-pos"></nav>');
      }
      if(this.total==0){
          $('.pagination-pos').css('display','none');
      }
      return this;
    };
  })();

  //创建表内容
  var createBody = function (pageNo) {
    var fields = this.fields;
    var fieldDefs = this.fieldDefs;
    var begin = (pageNo-1) * this.pageSize;
    var end = pageNo * this.pageSize;
    var dataSrc = this.dataSrc;
    end = end > dataSrc.length ? dataSrc.length : end;
    var tds = [];
    for(var i = begin; i < end; i++){
      var obj = dataSrc[i];
      tds.push('<tr>');
      for(var j = 0, length = fields.length; j < length; j++) {
        var data = obj[fields[j]] || ' ';
        var fieldDef = fieldDefs[j];
        if(fieldDef) {
          data = fieldDef(i,j,obj);
        }
        var attrs = addAttrs.call(this,j,data);
        tds.push('<td '+attrs+'>'+data+'</td>');

      }
    }
    this.$table.find('tbody').html(tds.join(''));
    return this;
  }

  //请求数据
  var ajax = function(pageNo,callback) {
    var _this = this;
    if(this.paging) {
      $('body').prepend($loading);
      $.ajax({
        url : urlIp + options.ajax.url,
        data : options.ajax.data,
        beforeSend : function(xhr, obj){
          if(obj.data) {
            obj.data += "&pageNo="+pageNo+"&pageSize="+_this.pageSize;
          } else {
            obj.data += "pageNo="+pageNo+"&pageSize="+_this.pageSize;
          }

        },
        type : "POST",
        timeout : "30000",
        dataType : "json",
        success : function(data) {
          try {
            if (data.status == "000") {
                if(data.msg.dynamicCount){
               $("#dynamicCount").html(data.msg.dynamicCount);
               }else{
                   $("#dynamicCount").html(0);
               }
               if(data.msg.customCount){
                   $("#customCount").html(data.msg.customCount);
               }else{
                    $("#customCount").html(0);
               }
               $("#total").html(data.msg.total);
              callback.call(_this,data);
            }else if(data.status == "L001"){
              window.location = 'login.html';
            } else {
              $.danger(data.msg.message);
            }
          } catch(e) {
            $.danger('数据解析出错');
          }
          $loading.remove();
        },
        error : function(error) {
          $loading.remove();
          $.danger('网络出错');
        }
      });


    } else {
      callback.call(_this);
    }
  }

  //请求数据与分页交互
  var request = function (pageNo) {

    ajax.call(options,pageNo,function(data){

      if(data) {
        this.dataSrc = data.msg.list || [];
        //总记录数
        this.total = data.msg.total;
        //总页数
        page.defalut.total = data.msg.count;
        
        pageNo = 1;
      }
      //创建表格
      createBody.call(createHead.call(this),pageNo);
      //渲染分页
      page.$wrapper = $('.pagination-pos');
      page.redner();
        
      if(this.complete && typeof this.complete === 'function'){
          this.complete(this.dataSrc);
      }
        
    });

  };

  //第一次执行
  $('.dataTables_info,.pagination-pos').remove();  
  initDefault(options);
  //初始化分页
  var cnt = Math.ceil(options.total/options.pageSize);
  var page =  new Pagination({total:cnt,wrapper:'.pagination-pos', callback:request});
  page.go(1);
}

