/**
 * 定点锚点跳转，并可以携带参数返回指定链接描点
 */
var historyBackCommon = {

    /**
     * @method changePointParam
     *                 变更锚点属性值
     *
     * @param {Object} pointParamURL
     *                 锚点并携带参数
     */
    changePointParam : function(changedPoint) {
        if (!changedPoint) {
            console.log("historyBackCommon.changePointParam 无效的锚点参数");
            return;
        }
        //除去 # 号 参数替换为 , 逗号
        changedPoint = changedPoint.substring(1, changedPoint.length).replace(/\//g, ',');
        return changedPoint;
    },

    /**
     * @method callBackHistory
     *                 处理指定锚点并携带退回参数功能
     *
     * @param {Object} funType
     *                 调用url业务操作类型
     *                 该参数推荐和routers路由中配置一样
     *
     * @param {Object} pointParamURL
     *                 锚点并携带参数
     *                 锚点不携带 # 号字符
     *                 参数 使用 , 英文逗号分割
     */
    callBackHistory : function(funType, pointParamURL) {
        var pointURL = window.location.hash;
        if (!funType || !pointParamURL) {
            console.log("historyBackCommon.callBackHistory异常 无效的锚点参数");
            return;
        } else {
            pointParamURL = "#" + pointParamURL.replace(/\,/g, '/');
            location.hash = pointParamURL;
        }
    }
};
//绑定事件监听
_.extend(historyBackCommon, Backbone.Events);
