'use strict';

exports = module.exports = function(app, mongoose) {
  var sheetSchema = new mongoose.Schema({
    _id: { type: String },
    pivot: { type: String, default: '' },
    name: { type: String, default: '' }
	,spreadsheetId: { type: String }
	,params: { type: String, default: '[{"[]":{"row":"","col":"","value":"","label":""}}]' },
      textNote:{ type: String, default:'<div ><h1>Titolo</h1><p>paragrafo</p></div><hr>'},
      listOrder:{type: Number}
  });
  sheetSchema.plugin(require('./plugins/pagedFind'));
  sheetSchema.index({ pivot: 1 });
  sheetSchema.index({ name: 1 });
  sheetSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Sheet', sheetSchema);
};
