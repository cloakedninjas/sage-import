var WeeklySheetModel = Backbone.Model.extend({

  initialize: function (opts) {
    var vatFields = ['purchases', 'windows', 'wages', 'vat-bank'];

    this.date = new Date(opts.date);

    vatFields.forEach(function (field) {
      var value = opts[field];

      if (value === '') {
        this.set(field, 0);
      } else {
        this.set(field, parseFloat(value));
      }
    }, this);
  }
}, {
  generateCSV: function (models) {
    var csv = '', day, month, date, vat;

    models.forEach(function (model) {
      day = model.date.getDate();
      day = day < 10 ? '0' + day : day;

      month = model.date.getMonth();
      month = month < 10 ? '0' + month : month;

      date = day + '/' + month + '/' + model.date.getFullYear();

      csv += '"CP",' + BANK.CASH_AC + ',' + NC.PURCHASES + ',0,"' + date + '",,,' + model.get('purchases') + ',"T0",0' + '\n';
      csv += '"CP",' + BANK.CASH_AC + ',' + NC.WINDOWS + ',0,"' + date + '",,,' + model.get('windows') + ',"T0",0' + '\n';
      csv += '"CP",' + BANK.CASH_AC + ',' + NC.WAGES + ',0,"' + date + '",,,' + model.get('wages') + ',"T9",0' + '\n';

      vat = WeeklySheetModel.calcVat(model.get('vat-bank'));

      csv += '"CP",' + BANK.CASH_AC + ',' + NC.VATABLE_TAKINGS + ',0,"' + date + '",,,' + model.get('vat-bank') + ',"T1",' + vat + '\n';
      csv += '"CP",' + BANK.CASH_AC + ',' + NC.NON_VATABLE_TAKINGS + ',0,"' + date + '",,,' + model.get('no-vat-bank') + ',"T0",0\n';

      // transfers

      csv += '"JC",,' + BANK.CASH_AC + ',0,"' + date + '","TRANS","Bank Transfer",' + model.get('vat-bank') + ',"T9",0\n';
      csv += '"JD",,' + BANK.BANK_AC + ',0,"' + date + '","TRANS","Bank Transfer",' + model.get('vat-bank') + ',"T9",0\n';

      csv += '"JC",,' + BANK.CASH_AC + ',0,"' + date + '","TRANS","Bank Transfer",' + model.get('no-vat-bank') + ',"T9",0\n';
      csv += '"JD",,' + BANK.BANK_AC + ',0,"' + date + '","TRANS","Bank Transfer",' + model.get('no-vat-bank') + ',"T9",0\n';
    }, this);

    var link = document.createElement('a');
    link.download = 'sage-import.csv';
    link.href = 'data:application/csv;base64,' + btoa(csv);
    link.click();
  },

  calcVat: function (x) {
    //return ($x / 47) * 7; // 17.5%
    return (x / 6); // 20%
  }
});