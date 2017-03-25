$(document).ready(function () {
  var App = Backbone.Router.extend({
    config: {
      windowCleaning: 8
    },

    routes: {
      '': 'index',
      'weekly-sheets': 'initWeeklySheets',
      'bank-payments': 'initBankPayments'
    },

    initialize: function () {
      this.appFrame = document.getElementById('app');
      Backbone.history.start();
    },

    index: function () {
      this.setView(new IndexView());
    },

    initWeeklySheets: function () {
      var startView = new StartView();
      startView.on('submit', this.collectWeeklySheets, this);
      this.setView(startView);
    },

    initBankPayments: function () {
      var bankView = new BankPaymentsView();
      //bankView.on('submit', this.collectWeeklySheets, this);
      this.setView(bankView);
    },

    collectWeeklySheets: function (data) {
      var view = new WeeklySheetView(data);
      this.setView(view);
    },
    
    setView: function (view) {
      $(this.appFrame).html(view.render().$el);
    }
  });

  /*$("a").click(function (ev) {
    the_app.navigate($(this).attr("href"), true);
    return false;
  });*/

  window.app = new App();
});