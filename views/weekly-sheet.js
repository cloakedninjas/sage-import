var WeeklySheetView = BaseView.extend({

  weekTemplate: `
    <div class="week col-md-4 col-xs-2">
      <div class="form-group">
        <label for="date">Date</label>
        <input type="date" class="form-control" id="date" />
      </div>
      
      <div class="form-group">
        <label for="date">Purchases</label>
        <input type="number" class="form-control" id="purchases" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">Windows</label>
        <input type="number" class="form-control" id="windows" step="0.01" value="<%= windowCleaning %>" />
      </div>
      
      <div class="form-group">
        <label for="date">Wages</label>
        <input type="number" class="form-control" id="wages" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">VAT Bank</label>
        <input type="number" class="form-control" id="vat-bank" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">No VAT Bank</label>
        <input type="number" class="form-control" id="no-vat-bank" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">Tot VAT</label>
        <input type="number" class="form-control" id="tot-vat" step="0.01" />
      </div>
    </div>
  `,

  template: `<h1>Weekly Sheets</h1>
  <form>
    <%= weekTemplates %>
    <button type="submit" class="btn btn-default">Submit</button>
  </form>`,

  events: {
    'submit form': 'handleFormSubmit'
  },

  startDate: null,
  weekCount: null,

  initialize: function (opts) {
    this.startDate = opts['start-date'];
    this.weekCount = parseInt(opts['week-count']);
  },

  getTemplateVars: function () {
    var html = '';
    for (var i = 0; i < this.weekCount; i++) {
      html += _.template(this.weekTemplate)({
        windowCleaning: app.config.windowCleaning
      });
    }

    return {
      weekTemplates: html
    };
  },

  handleFormSubmit: function (e) {
    e.preventDefault();
    console.log(1);
  }


});