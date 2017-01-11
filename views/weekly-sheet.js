var WeeklySheetView = BaseView.extend({

  weekTemplate: `
    <div class="week" data-week-num="<%= week_num %>">
      <div class="form-group">
        <label for="date">Date</label>
        <input type="date" class="form-control date" value="<%= date %>" />
      </div>
      
      <div class="form-group">
        <label for="date">Purchases</label>
        <input type="number" class="form-control purchases vatable" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">Windows</label>
        <input type="number" class="form-control windows vatable" step="0.01" value="<%= windowCleaning %>" />
      </div>
      
      <div class="form-group">
        <label for="date">Wages</label>
        <input type="number" class="form-control wages vatable" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">VAT Bank</label>
        <input type="number" class="form-control vat-bank vatable" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">No VAT Bank</label>
        <input type="number" class="form-control no-vat-bank" step="0.01" />
      </div>
      
      <div class="form-group">
        <label for="date">Tot VAT</label>
        <input type="number" class="form-control tot-vat" step="0.01" readonly />
      </div>
    </div>
  `,

  template: `<h1>Weekly Sheets</h1>
  <form>
    <%= weekTemplates %>
    <button type="submit" class="btn btn-default">Submit</button>
  </form>`,

  events: {
    'submit form': 'handleFormSubmit',
    'keyup input.vatable': 'handleInputEntry'
  },

  /**
   * @type Date
   */
  startDate: null,

  /**
   * @type number
   */
  weekCount: 0,

  initialize: function (opts) {
    this.startDate = new Date(opts['start-date']);
    this.weekCount = parseInt(opts['week-count']);
  },

  getTemplateVars: function () {
    var html = '';
    for (var i = 0; i < this.weekCount; i++) {
      html += _.template(this.weekTemplate)({
        week_num: i + 1,
        date: this.getDateForWeekNum(this.startDate, i).toISOString().substring(0, 10),
        windowCleaning: app.config.windowCleaning
      });
    }

    return {
      weekTemplates: html
    };
  },

  /**
   *
   * @param {Date} startDate
   * @param {number} weekNum
   * @returns {Date}
   */
  getDateForWeekNum: function (startDate, weekNum) {
    var date = new Date(startDate);
    date.setDate(date.getDate() + (weekNum * 7));
    return date;
  },

  handleFormSubmit: function (e) {
    e.preventDefault();

    var weeklySheets = document.querySelectorAll('.week'),
        fields = ['date', 'purchases', 'windows', 'wages', 'vat-bank', 'no-vat-bank', 'tot-vat'],
        data = [],
        ws, initOptions;

    for (var i = 0, len = weeklySheets.length; i < len; i++) {
      ws = weeklySheets[i];
      initOptions = {};

      fields.forEach(function (field) {
        initOptions[field] = ws.querySelector('.' + field).value;
      });

      data.push(new WeeklySheetModel(initOptions));
    }

    WeeklySheetModel.generateCSV(data);
  },

  handleInputEntry: function (e) {
    var weeklySheet = e.target.closest('.week'),
        inputs = weeklySheet.querySelectorAll('input.vatable'),
        tot = 0;

    for (var i = 0, len = inputs.length; i < len; i++) {
      if (inputs[i].value !== '') {
        tot += parseFloat(inputs[i].value);
      }
    }

    weeklySheet.querySelector('.tot-vat').value = tot.toFixed(2);
  }


});