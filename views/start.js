var StartView = BaseView.extend({
  template: `<h1>Sage Import</h1>
<form>
  <div class="form-group">
    <label for="start-date">Start Date</label>
    <input type="date" class="form-control" id="start-date" value="2010-10-10"/>
  </div>
  <div class="form-group">
    <label for="week-count">No. of weeks</label>
    <input type="number" class="form-control" id="week-count" value="7"/>
  </div>
    <button type="submit" class="btn btn-default">Engage!</button>
  </form>`,

  events: {
    'submit form': 'handleFormSubmit'
  },

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