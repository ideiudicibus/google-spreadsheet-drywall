'use strict';

exports = module.exports = function(app, mongoose) {
  var spreadsheetSchema = new mongoose.Schema({
    _id: { type: String },
    pivot: { type: String, default: '' },
    name: { type: String, default: '' }
	,googleId: { type: String, default: '' }
	,activeSheet: { type: String, default: '' }
      ,ownersList: [{ type: String, ref:'User'}],
      sheetsList:[{ type: String, ref: 'Sheet' }],
      nextSaveCol:{type:Number,default:6},
      apiVersion:{type:String,default:''},
      parentId:{ type: String, ref: 'Spreadsheet' },
      isMaster:[Boolean]
  });
  spreadsheetSchema.plugin(require('./plugins/pagedFind'));
  spreadsheetSchema.index({ pivot: 1 });
  spreadsheetSchema.index({ name: 1 });
  spreadsheetSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Spreadsheet', spreadsheetSchema);
};
