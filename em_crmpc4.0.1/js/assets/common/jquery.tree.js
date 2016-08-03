
;(function(){

  var _this = this;

  function Node(id, pid, name, obj) {
    this.id = id;
    this.pid = pid;
    this.name = name;
    this.self = obj;
    this._is = false;
    this._ls = false; //父节点下最后一个节点
    this._hc = false; //是否有孩子节点
    this._cc = 0; //孩子个数
    this._ch = [];//孩子节点
    this._i = 0; //该节点在集合的下标
    this._p = null; //父节点
    this._l = null; //做节点
    this._r = null; //右节点
  };

  function Tree(name, root) {
    this.name = name;
    this.nodes = [];
    this.indents = [];
    root = root || -1;
    this.root = new Node(root);

    this.icon = {
      root: 'img/base.gif',
      folder: 'img/folder.gif',
      folderOpen: 'img/folderopen.gif',
      node: 'img/page.gif',
      empty: 'img/empty.gif',
      line: 'img/line.gif',
      join: 'img/join.gif',
      joinBottom: 'img/joinbottom.gif',
      plus: 'img/plus.gif',
      plusBottom: 'img/plusbottom.gif',
      minus: 'img/minus.gif',
      minusBottom: 'img/minusbottom.gif',
      nlPlus: 'img/nolines_plus.gif',
      nlMinus: 'img/nolines_minus.gif'
    };
  };

  Tree.prototype.add = function (id, pid, name, obj) {
    var node = new Node(id, pid, name, obj);
    node._i = this.nodes.length;
    this.nodes.push(node);
  }

  Tree.prototype.toString = function () {
    return this.creatTree(this.root);
  }

  Tree.prototype.creatTree = function (pnode) {
    var nodes = this.nodes,
      length = nodes.length,
      i = 0,
      html = '';
    for (; i < length; i++) {
      var node = nodes[i];
      if (node.pid == pnode.id) {
        node._p = pnode;
        this.setCS(node);
        //print(node);
        html += this.render(node);
        /*if (node._hc) {
          this.creatTree(node);
        }*/
        //this.indents.pop();
      }
    }

    return html;
  }

  Tree.prototype.setCS = function (cnode) {

    var nodes = this.nodes,
      length = nodes.length,
      i = 0,
      j = 0,
      flag = true;
    for (; i < length; i++) {
      var node = nodes[i];
      if (node.pid == cnode.id) cnode._hc = true;
      if (node.pid == cnode.pid) {
        if (i < cnode._i) {
          cnode._l = node;
        } else if (i > cnode._i && flag) {
          flag = false;
          cnode._r = node;
        } else {
          j = i;
        }
        cnode._p._ch.push(node);
      }
    }
    cnode._p._cc = cnode._p._ch.length;
    if (j == cnode._i) cnode._ls = true;

  }
// var i=0;
  Tree.prototype.render = function (node){
  	var str = '';
  	// var nodetypeid=node.id;
  
  	if(node._hc) {
  	    // i++;
  		str += '<li class="sub-menu" >'
  		+'<a href="javascript:;">'
      +'<span>'+node.name+'</span>'
      +'<span class="dcjq-icon"></span>'
      +'</a>'
      +'<ul class="sub">';
      str += this.creatTree(node);
      str +='</ul>'
      +'</li>';
  	} else {
  		var link = node.self.link || '';
  		if(link.indexOf('?') > -1) {
  			link += '&';
  		} else {
  			link += '?';
  		}
  		link += 'btns='+node.self.btnGroup;
  		// link += '&nodetypeid='+i;
  		str += '<li class="leaf" data-href="'+link+'"><a href="javascript:;">'+node.name+'</a></li>';
  	}
    return str;
  }

  Tree.prototype.indent = function (node){
    var str = '';
    for(var i = 0; i < this.indents.length; i++) {
      str += '<img src="' + ( this.indents[i] ? this.icon.empty : this.icon.line ) + '" alt="" />';
    }
    this.indents.push(node._ls);

    return str;
  }

  function print(node){
    var str = '节点： ' + node.name;
    if(node._p) {
      str += ' 父节点： ' + (node._p.name || '*');
    }
    if(node._l) {
      str += ' 左节点： ' + node._l.name;
    } else {
      str += ' 左节点： *'
    }
    if(node._r) {
      str += ' 右节点： ' + node._r.name;
    } else {
      str += ' 右节点： *'
    }
  }

  if(typeof($) === 'undefined') {
    _this.$ = {};
    _this.$.tree = function(name, root){
      return new Tree(name, root);
    };
  } else {
    $.extend({tree:function(name, root){
      return new Tree(name, root);
    }});
  }
})();


