//加载并初始化模板对象
var siderbarTemplate = loadTemplate("assets/templates/sidebar.html");
//列表容器VIEW
var siderbarView = Backbone.View.extend({
    initialize : function() {
    },
    el : '#sidebardiv',
    load : function(direction) {
        var $nav = $('#nav-accordion');
        $nav.html(localStorage.getItem('crmpc_menu'));
        var anyLeaf = $('#nav-accordion .leaf');
        anyLeaf.click(function(){
            anyLeaf.removeClass('active');
            $(this).addClass('active');
            localStorage.setItem('crmpc_menu',$nav.html());
            window.location = $(this).data('href');
        });
        
            $nav.dcAccordion({
                    eventType: 'click',
                    autoClose: true,
                    saveState: true,
                    disableLink: true,
                    speed: 'slow',
                    showCount: false,
                    autoExpand: true,
                    classExpand: 'dcjq-current-parent'
                });      
    }
});
//实例化一个view
var siderbarInstance = new siderbarView();
//调用view里面的load方法
siderbarInstance.load();
