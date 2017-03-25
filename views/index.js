var IndexView = BaseView.extend({
  template: `<h1>Sage Import</h1>
<ul>
<li><a href="#weekly-sheets">Weekly Sheets</a></li>
<li><a href="#bank-payments">Bank Payments</a></li>
</ul>`,

  handleFormSubmit: function (e) {
    e.preventDefault();

    var startDate = this.$('#start-date'),
        weekCount = this.$('#week-count');

    if (!startDate.val()) {
      startDate.parent().addClass('bg-danger');
    }

    if (!weekCount.val()) {
      weekCount.parent().addClass('bg-danger');
    }

    if (startDate.val() && weekCount.val()) {
      this.trigger('submit', {
        'start-date': startDate.val(),
        'week-count': weekCount.val()
      });
    }
  }


});