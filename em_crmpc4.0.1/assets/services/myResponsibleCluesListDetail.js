
var myResponsibleCluesListDetailService = {
    lock : false,
    request : function(options) {
        var self = this;
        data = {
            "id" : options["id"]
        }, 
        ajax({
            url :"/clue/view",
            data : data,
            success : function(data) {
                if (data.status == "000")
                    options.success(data);
                else
                    options.error(data);
                self.lock = false;
            },
            error : function(err) {
                options.error(err);
            }
        });
    }
};
_.extend(myResponsibleCluesListDetailService, Backbone.Events);

