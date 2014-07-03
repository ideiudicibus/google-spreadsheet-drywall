var Spreadsheet = require('edit-google-spreadsheet'); 
var sys=require('sys'); 
var _=require('underscore');

'use strict';


function getProperty(obj, prop) {
    
    return obj[prop];
}

function setProperty(obj,prop,value){
obj[prop]=value;
return obj;
}

/**
copys the values from the column identified by the src_val_idx values into src_vect 
the mapping_col_idx does the join 
**/
function copyData(src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect){

  _.each(src_vect,function(i,k){
     var obj={};
  _.each(src_rows,function(a,b){
   if(_.keys(i)[0] == getProperty(a,mapping_col_idx)){
      obj=_.clone(_.values(i)[0]);
     
      var tmpVal=getProperty(a,src_val_idx);
      if(_.isString(tmpVal)){
         tmpVal=tmpVal.trim();
        obj.value=tmpVal.indexOf('%')<0?tmpVal.split(".").join(""):tmpVal;
      }
      obj.label=getProperty(a,src_label_idx);
    }

    });
    if(obj!=null){   
     i=setProperty(i,_.keys(i)[0] ,obj);}
});
  ;
return src_vect;

}

function copyPureData(src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect){

  _.each(src_vect,function(i,k){
     var obj={};
  _.each(src_rows,function(a,b){
   if(_.keys(i)[0] == getProperty(a,mapping_col_idx)){
      obj=_.clone(_.values(i)[0]);
     
      obj.value=getProperty(a,src_val_idx);
      obj.label=getProperty(a,src_label_idx);
    }

    });
    if(obj!=null){   
     i=setProperty(i,_.keys(i)[0] ,obj);}
});
return src_vect;

}



/**
merge functions for data from excel and dataParam from webApp
data wraps excel rows
dataParams wraps web app parameters
excel_param_name_idx column index of the excel sheet that stores the param name
label_idx column index of the excel sheet that stores the label parameter
col_id column index of the excel sheet that store the value
note:value_col_idx identifies current vertical parameter vector
@returns the synched dataParam 
*/

function synchDataParamsWithExcel(data,dataParam,excel_param_name_idx,label_idx,value_col_idx){

  _.each(dataParam,function(i,k){
     var obj={};
  _.each(data,function(a,b){
   if(_.keys(i)[0] == getProperty(a,excel_param_name_idx)){
      obj.row=b;
      obj.col=value_col_idx.toString();
      var tmpVal=getProperty(a,value_col_idx).trim();
      
      obj.value=tmpVal.indexOf('%')<0?tmpVal.split(".").join(""):tmpVal;
      obj.label=getProperty(a,label_idx);
    }
    });
    if(obj!=null){   
      i=setProperty(i,_.keys(i)[0] ,obj);}
});
return dataParam;
}



exports.read = function(req, res, next){
  
  req.app.db.models.Spreadsheet.findById(req.params.id).exec(function(err, spreadsheet) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(spreadsheet);
    }
    else {
      res.render('spreadsheets/dashboard/index-w-tmpl', { data: { record: spreadsheet } });
    }
  });
};

function prepareParamsForExcel(params){
  var row,col,value;
      var paramArray=[];
          for(var j=0;j<params.length;j++){
            var tmp=params[j];
              for(var key in tmp){
                 row=Number(tmp[key].row);
                 col=Number(tmp[key].col);
                 value=String(tmp[key].value);
                 var o1={},o2={};
                 o2[col]=value;
                 o1[row]=o2;
      
                paramArray.push(o1);
               }
            }
            return paramArray;  

}

exports.updateParams = function(req, res, next){
var workflow = req.app.utility.workflow(req, res);
var param= req.body;

workflow.on('updateGoogleSpreadsheet',function(p){
  
  var params=JSON.parse(p.paramData);
  var sheetName='VV_UT';
  var activeSheet=p.activeSheet;

if(activeSheet.indexOf('default')>0) sheetName='OPZ';
//console.log('params to send are: '+ sys.inspect(prepareParamsForExcel(params)));
  
updateSheet(p.googleId,prepareParamsForExcel(params),sheetName,workflow,req);

});


workflow.emit('updateGoogleSpreadsheet',param);

};


function  updateSheet(googleId,params,sheetName,workflow,req){


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
            //throw err;
            
        return workflow.emit('exception', err);
          }
          
          for(var jj= 0;jj<params.length;jj++){

            spreadsheet.add(params[jj]);

          }
          
          
          spreadsheet.send(function(err) {
            if(err) {
            return workflow.emit('exception', err);
            }
           workflow.outcome.infos.push('i dati sono stati aggiornati, attendere l\' aggiornamento della pagina');
           return workflow.emit('response');
            });
        });
 


}


exports.readPopulateActiveSheet = function(req, res, next){
  
  req.app.db.models.Spreadsheet.findOne({_id:req.params.id}).populate('sheetsList').exec(function(err, spreadsheet) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(spreadsheet);
    }
    else {
      res.render('spreadsheets/dashboard/index-dashboard', { data: { record: spreadsheet,title:spreadsheet.name} });
    }
  });
};

exports.resetActiveSheet= function(req, res, next){
  
  var workflow = req.app.utility.workflow(req, res);


workflow.on('patchSheet', function(req,p) {
  var googleId=req.body.record.googleId;
  var sheetName='VV_UT';
    var fieldsToSet = {
      params: JSON.stringify(p)
    };
    req.app.db.models.Sheet.findByIdAndUpdate(req.params.sheetId, fieldsToSet, function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.outcome.sheet=sheet;
      updateSheet(googleId,prepareParamsForExcel(p),sheetName,workflow,req);

  
    });
  });


 workflow.on('synchActiveSheetWithGoogleSpreadsheet',function(req){

var activeSheet=req.body.record.activeSheet;
var googleId=req.body.record.googleId;
var sheetName='VV_UT';

  req.app.db.models.Sheet.findById(req.params.sheetId).select('-textNote').exec(function(err, sheet) {
    if (err) {
    return  workflow.emit('exception',err);
    }
  
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
        var updatedParams={};
       
        if(sheetName=='VV_UT') updatedParams=copyPureData(rows,1,5,3,JSON.parse(sheet.params));
        
        return workflow.emit('patchSheet',req,updatedParams);
       //return workflow.emit('response')
    });
});
  });
});


  workflow.emit('synchActiveSheetWithGoogleSpreadsheet',req);



}


exports.getActiveSheet= function(req, res, next){
 
 var workflow = req.app.utility.workflow(req, res);


workflow.on('patchSheet', function(req,p) {
  
    var fieldsToSet = {
      params: JSON.stringify(p)
    };
    req.app.db.models.Sheet.findByIdAndUpdate(req.params.sheetId, fieldsToSet, function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.sheet=sheet;
      return workflow.emit('response');
    });
  });


 workflow.on('synchActiveSheetWithGoogleSpreadsheet',function(req){

var activeSheet=req.body.record.activeSheet;
var googleId=req.body.record.googleId;
var sheetName='VV_UT';

if(activeSheet.indexOf('default')>=0) sheetName='OPZ';

  req.app.db.models.Sheet.findById(req.params.sheetId).select('-textNote').exec(function(err, sheet) {
    if (err) {
    return  workflow.emit('exception',err);
    }
  
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
        var updatedParams={};
       
        if(sheetName=='VV_UT') updatedParams=copyData(rows,1,4,3,JSON.parse(sheet.params));
        if(sheetName=='OPZ')  updatedParams=synchDataParamsWithExcel(rows,JSON.parse(sheet.params),3,2,4);
        
        return workflow.emit('patchSheet',req,updatedParams);
       //return workflow.emit('response')
    });


});


  

  });

  
    
});


  workflow.emit('synchActiveSheetWithGoogleSpreadsheet',req);

};

exports.init = function(req,res,next){

  var fieldsToQuery = {
    ownersList:req.user._id
    };
  



   req.app.db.models.Spreadsheet.find(fieldsToQuery).select('-ownersList').exec(function(err, spreadsheets) {
    

    if(spreadsheets.length==0){
fieldsToQuery.ownersList='';
   req.app.db.models.Spreadsheet.find(fieldsToQuery).select('-ownersList').exec(function(err, sheets) {
 
    spreadsheets=sheets;

   })    
      

    }
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(spreadsheets);
    }
    else {

      res.render('spreadsheets/index', { data: { records: spreadsheets } });
    }
  });

}




exports.setActiveSheet = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

    workflow.on('patchSpreadsheet', function(req) {
    var fieldsToSet = {
     activeSheet:req.params.sheetId
    };
    req.app.db.models.Spreadsheet.findByIdAndUpdate(req.body._id, fieldsToSet, function(err, spreadsheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.spreadsheet = spreadsheet;
      return workflow.emit('response');
    });
  });
  workflow.emit('patchSpreadsheet',req);

};