




exports.getAllSpreadsheetsByUser = function(req,res,next){

  var fieldsToQuery = {
    ownersList:req.user._id
    };


       req.app.db.models.Spreadsheet.find(fieldsToQuery).select('-ownersList').exec(function(err, spreadsheets) {
       	return {};
       });

  }