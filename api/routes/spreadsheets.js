var async=require('async');
var request = require('edit-google-spreadsheet/node_modules/request');
var _=require('underscore');





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


exports.getSheet =function(req,res,next){


Spreadsheet.load({
            debug: true,
            spreadsheetId: googleId,
            worksheetName: sheetName,
            oauth : {
                email: '36923579256-7pv511lb1odrijg1mtatnc0v5bsaeiiv@developer.gserviceaccount.com',
                keyFile: './views/spreadsheets/nodejs-gdata-key-file.pem'
            }

        }, function sheetReady(err, spreadsheet) {

             if (err) {
         return workflow.emit('exception', err);
    }

    spreadsheet.receive({getValues:true},function(err, rows, info) {
        if (err) {
            return workflow.emit('exception', err);
        }
          console.log(rows);
          res.send(rows);
          
       
    });



        });


}



  exports.getSheetByName = function(req,res,next){
 
 var activeSheetName=req.params.name;


googleId='1Bf6vLvA06_GOBQ2LXGbhhtajSORttxYBhvy18O26z48';
var arr=[];

range1={range:"I6:I8,L6:L8",queryParams:"&transpose=0&headers=-1&merge=COLS",options:{chart:"pie"}};
range2={range:"K3:N3,K8:N8",queryParams:"&transpose=1&headers=-1&merge=ROWS",options:{chart:"column",transpose:true,yAxis:"logarithmic"}}; 

arr.push(range1);
arr.push(range2);
/*range2="B12:B20,C12:C20";
arr.push(range2);
range3="B12:B20,D12:D20";
arr.push(range3);
range4="B12:B20,E12:E20";
arr.push(range4);
range5="B12:B20,F12:F20";
arr.push(range5);
range6="B11:F29";
arr.push(range6);*/

var lookup_list=[];
_.each(arr,function(item){

var url="https://docs.google.com/spreadsheets/d/"+googleId+"/gviz/tq?tqx=out:csv&sheet="+activeSheetName+"&range="+item.range+item.queryParams;
console.log(url);
item.url=url;
lookup_list.push(item);


})



async.map(lookup_list, function(item, callback) {
    // iterator function
    request(item.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //var body = JSON.parse(body);
            // do any further processing of the data here

            item.csvdata=body;
            callback(null, item);
        } else {
            callback(error || response.statusCode);
        }
    });
}, function(err, results) {
  
    // completion function
    if (!err) {
        // process all results in the array here
       console.log('returning results');
       console.log(results);
      
       res.send(results);

        /*for (var i = 0; i < results.length; i++) {
            resultsCSV.push(results[i]);
        }*/
    } else {
        // handle error here
    }
});


  
 }
