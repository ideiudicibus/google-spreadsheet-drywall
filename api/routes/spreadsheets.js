




exports.getAllSpreadsheetsByUser = function(req,res,next){
var fieldsToQuery={};
    
    fieldsToQuery.ownersList=req.params.ownerId;
   

       req.app.db.models.Spreadsheet.find(fieldsToQuery).select('-ownersList').exec(function(err, spreadsheets) {
       	var result={};
       	result=spreadsheets;

       	res.send(result);
       });

  }

 


exports.getSpreadsheetById = function(req, res, next){
  
  req.app.db.models.Spreadsheet.findOne({_id:req.params.id}).populate('sheetsList').exec(function(err, spreadsheet) {
    if (err) {
      res.status(500);
      res.json({
        "status": 500,
        "message": JSON.stringify(err)
      });
      return; 
    }
    res.send(spreadsheet);

  });
};



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
