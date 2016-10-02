var BaseView = Backbone.View.extend({
  template: '',

  render: function () {
    var template = _.template(this.template)(this.getTemplateVars());

    this.$el.html(template);

    return this;
  },

  getTemplateVars: function () {
    return {};
  }
});