




exports.getAllSpreadsheetsByUser = function(req,res,next){
var fieldsToQuery={};
 
    fieldsToQuery.ownersList=req.body._id;
    console.log(fieldsToQuery);

       req.app.db.models.Spreadsheet.find(fieldsToQuery).select('-ownersList').exec(function(err, spreadsheets) {
       	var result={};
       	result.result=spreadsheets;
       	res.send(result);
       });

  }



exports.getSheetsBySpreadsheet = function(req,res,next){
var fieldsToQuery={};
 
    fieldsToQuery.ownersList=req.body.u_id;
    fieldsToQuery._id=req.body.o_id

      req.app.db.models.Spreadsheet.findOne(fieldsToQuery).populate('sheetsList').exec(function(err, spreadsheet) {

      	 if (err) {

      res.status(500);
      res.json({
        "status": 500,
        "message": JSON.stringify(err)
      });
      return;
          
        }
		var result={};
       	result.result=spreadsheet;
       	res.send(result);
    

  });

 }
