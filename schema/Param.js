'use strict';

exports = module.exports = function(app, mongoose) {
  var paramSchema = new mongoose.Schema({
    _id: { type: String },
    pivot: { type: String, default: '' },
    name: { type: String, default: '' }
	,value: { type: String, default: '[]' }
	,sheetId: { type: String,  ref: 'Spreadsheet' }
  });
  paramSchema.plugin(require('./plugins/pagedFind'));
  paramSchema.index({ pivot: 1 });
  paramSchema.index({ name: 1 });
  paramSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Param', paramSchema);
};