var BaseTableModel = Backbone.Model.extend({
  // idAttribute : 'clueId',
});
var BaseParamModel = Backbone.Model.extend({});
var BaseTableCollection = Backbone.Collection.extend({
  model: BaseTableModel
});