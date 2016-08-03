var dynamicTemplate = loadTemplate('assets/templates/staff/unAllotDynamic.html');

var dynamicView = Backbone.View.extend({
	initialize:function(){},
	el:'#notAssign',
	render:function(){
		this.$el.empty();
		this.$el.append($(this.template()));
	},
	template:dynamicTemplate,
	model:new allotClueModel(),
	objEntityTypeId:'',
	init:function(objEntityId,objEntityTypeId,editType,companyName){
		this.render();
		this.objEntityTypeId = objEntityTypeId;
		var self = this;
		if (editType == '1') {
		    $('#edit').removeClass('hide');
		}
		var str = '',
			urlmap = '';
		for (var i = 0,l = appcan.dynamicType.length; i < l; i++) {
		    str += '<option value="' + (i) + '">' + appcan.dynamicType[i] + '</option>';
		}
		$("#dynamicType").append(str);
		$('#titlee').html(decodeURIComponent(companyName));
		switch(objEntityTypeId) {
		case 'operatelog':
		    //客户动态日志
		    urlmap = '/custom';
		    getOperatelog();
		    break;
		case '01':
		    //营销数据
		    urlmap = '/marketing';
		    self.getDynamic(urlmap,objEntityId,objEntityTypeId,editType);
		    break;
		case '02':
		    //线索
		    urlmap = '/clue';
		    self.getDynamic(urlmap,objEntityId,objEntityTypeId,editType);
		    break;
		case '03':
		    //机会
		    urlmap = '/opport';
		    self.getDynamic(urlmap,objEntityId,objEntityTypeId,editType);
		    break;
		case '04':
		    //联系人
		    urlmap = '/contact';
		    self.getDynamic(urlmap,objEntityId,objEntityTypeId,editType);
		    break;
		default:
		    break;
		}
	},
	getDynamic:function(urlMap,objId,objTyepId,editType){
		this.urlMap = urlMap;
		var dataObj = {
			"objEntityId" : objId,
			"objEntityTypeId" : objTyepId
		};
		new DataDynamic({
		    id : '#list',
		    paging : true,
		    pageSize : 5,
		    type : 'dynamiclist',
		    editType : editType,
		    ajax : {
		        url : urlMap + '/dynamic/page',
		        data : dataObj
		    }
		});
	}
});

var dynamicViewObj = new dynamicView();

//获取评论列表
function wordDynamic(dynamicId, uId, uName, aobj, cnt, f) {
    aCmtObj = aobj;
    cnt = parseInt(aobj.innerHTML.split('（')[1].split('）')[0])
    cmtCnt = cnt;
    var data = {
        "objEntityId" : dynamicId,
        "objEntityTypeId" : (dynamicViewObj.objEntityTypeId == 'operatelog' ? '07' : '06')

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
            url : dynamicViewObj.urlMap + '/word/page',
            data : data
        }

    });
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
        "objEntityTypeId" : (dynamicViewObj.objEntityTypeId == 'operatelog' ? '07' : '06'),
        "rcvUserId" : $.trim(uId),
        "content" : content
    };

    ajax({
        url : dynamicViewObj.urlMap + "/word/reply",
        data : data,
        success : function(data) {
            wordDynamic(dynamicId, $.trim(uId), (uName), aCmtObj, cmtCnt, 1);
            aCmtObj.innerHTML = '评论（' + (++cmtCnt) + '）';
            $.success("评论成功！");
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