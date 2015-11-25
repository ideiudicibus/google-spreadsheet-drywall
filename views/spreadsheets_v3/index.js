var Spreadsheet = require('edit-google-spreadsheet'); 
var sys=require('sys'); 
var _=require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');
var fs=require('fs');
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
row 1,4,3 params
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
      else{
           
           obj.value=tmpVal;
      }
      obj.label=getProperty(a,src_label_idx);
    }

    });
    if(obj!=null){   
     i=setProperty(i,_.keys(i)[0] ,obj);}

});
return src_vect;

}

function copyPureData(src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect){

  _.each(src_vect,function(i,k){
     var obj={};
  _.each(src_rows,function(a,b){
   if(_.keys(i)[0] == getProperty(a,mapping_col_idx)){
      obj=_.clone(_.values(i)[0]);
     
      obj.value=getProperty(a,src_val_idx);
      if(obj.value == null) {obj.value='';}
      obj.label=getProperty(a,src_label_idx);
    }

    });
    if(obj!=null){   
     i=setProperty(i,_.keys(i)[0] ,obj);}
});
  console.log(src_rows);
return src_vect;

}


 /**
given a set of rows from google spreadsheet
returns an array of objects in the following format {row {col:value}} 
which can be sent to the spreadsheet via the spreadsheet.add () method 
the array rapresents the copy of src_col value into the target_col

ex: getColumnFromRowsData(row,2,5,1) 
it can be used to copy the column 5 cells into the column 2 one
array contains the data to send to google-spreadsheet via the api
getColumnFromRowsData(row,2,2,1) 
@returns an array of object ready to be sent to the sheet
*/
function getColumnFromRowsData(rows,target_col_idx,src_col_idx,start_row){
var retArray=[];

_.each(rows,function(a,b){
  if(Number(b)>start_row) {
                 row= Number(b);
                 col= Number(target_col_idx);
                 value= String(getProperty(a,src_col_idx)!=null?getProperty(a,src_col_idx):'');
                 value= value.indexOf('.')>0?value.split(".").join(""):value;
                 value= value.indexOf('-')>0?value.split("-").join(""):value;
                 value= value.trim();
                 var o1={},o2={};
                 o2[col]=value;
                 o1[row]=o2;
                 retArray.push(o1);
  } 
})
return retArray;
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

     i=setProperty(i,_.keys(i)[0] ,obj);
    }
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
  //var sheetName='VV_UT';
  var sheetName='INPUT';
  var activeSheet=p.activeSheet;

if(activeSheet.indexOf('default')>0) sheetName='OPZ';
//console.log('params to tranform are: '+ sys.inspect(params));
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
               console.log(sys.inspect(err));
            return workflow.emit('exception', err);
            }
           workflow.outcome.infos.push('i dati sono stati aggiornati, attendere l\' aggiornamento della pagina');
           return workflow.emit('response');
            });
        });
 


}


exports.readPopulateActiveSheet = function(req, res, next){
  console.log('1 readPopulateActiveSheet');
  req.app.db.models.Spreadsheet.findOne({_id:req.params.id}).populate('sheetsList').exec(function(err, spreadsheet) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      console.log('2 readPopulateActiveSheet');
      res.send(spreadsheet);
    }
    else {
console.log('3 readPopulateActiveSheet');
      res.render('spreadsheets_v3/dashboard/index-dashboard', { data: { record: spreadsheet,title:spreadsheet.name} });
    }
  });
};

exports.readPopulateInitActiveSheet = function(req, res, next){
  console.log('1 readPopulateInitActiveSheet');
  req.app.db.models.Spreadsheet.findOne({_id:req.params.id}).populate('sheetsList').exec(function(err, spreadsheet) {
    
   
   spreadsheet.activeSheet=spreadsheet.sheetsList[0]._id;
    if (err) {
      return next(err);
    }

    if (req.xhr) {
     
      res.send(spreadsheet);
    }
    else {



      res.render('spreadsheets_v3/dashboard/index-dashboard', { data: { record: spreadsheet,title:spreadsheet.name} });
    }
  });
};


exports.getPrintablePage = function(req, res, next){
  
  req.app.db.models.Spreadsheet.findOne({_id:req.params.id}).populate('sheetsList').exec(function(err, spreadsheet) {
    if (err) {
      return next(err);
    }
      console.log('getPrintablePage invoked spreadsheets_v3');
      return res.render('spreadsheets_v3/dashboard/index-printable', { data: { record: spreadsheet,title:spreadsheet.name} });
  });
};

exports.resetSpreadsheet= function(req, res, next){
  
  var workflow = req.app.utility.workflow(req, res);


workflow.on('resetSpreadhsheet', function(req,p) {
  var googleId=req.body.googleId;
  var sheetName='INPUT';
    var fieldsToSet = {
      params: JSON.stringify(p)
    };


  
       req.app.db.models.Sheet.findById(req.params.sheetId, function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.outcome.sheet=sheet;
      updateSheet(googleId,prepareParamsForExcel(p),sheetName,workflow,req);

  
    });

  });


 workflow.on('synchActiveSheetWithGoogleSpreadsheet',function(req){
console.log(req.body);
var activeSheet=req.body.activeSheet;
var googleId=req.body.googleId;
var sheetName='INPUT';

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
       //updatedParams=copyData(rows,3,4,2,JSON.parse(sheet.params));
       
        if(sheetName=='INPUT') {
          var file = __dirname + '/mega-reset.json';
          var mockParams=JSON.parse(fs.readFileSync(file));
          // console.log(sys.inspect(mockParams));
          updatedParams=copyPureData(rows,3,13,2,mockParams);
          
          //console.log(sys.inspect(updatedParams));
         
        }
        
        return workflow.emit('resetSpreadhsheet',req,updatedParams);
       //return workflow.emit('response')
    });
});


 
});


  workflow.emit('synchActiveSheetWithGoogleSpreadsheet',req);



}



exports.resetActiveSheet= function(req, res, next){
  
  var workflow = req.app.utility.workflow(req, res);


workflow.on('patchSheet', function(req,p) {
  var googleId=req.body.record.googleId;
  var sheetName='INPUT';
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
var sheetName='INPUT';

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
       //updatedParams=copyData(rows,3,4,2,JSON.parse(sheet.params));
       console.log('-------sheet.params------'+sheet.params);
        if(sheetName=='INPUT') {
          updatedParams=copyPureData(rows,3,13,2,JSON.parse(sheet.params));
         
         
        }
        
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
 var skipSynch=req.body.skipSynch;


workflow.on('patchSheet', function(req,p) {
  console.log('patchSheet');
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


workflow.on('getActiveSheet',function(req){
  var activeSheet=req.body.record.activeSheet;
  req.app.db.models.Sheet.findById(req.params.sheetId).exec(function(err, sheet) {
    if (err) {
    return  workflow.emit('exception',err);
    }
    workflow.outcome.sheet=sheet;
    return workflow.emit('response');
  
 });
});

 workflow.on('synchActiveSheetWithGoogleSpreadsheet',function(req){

var activeSheet=req.body.record.activeSheet;

var googleId=req.body.record.googleId;
var sheetName='INPUT';
  
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
                keyFile: './views/spreadsheets_v3/nodejs-gdata-key-file.pem'
            }

}, function sheetReady(err, spreadsheet) {

    if (err) {
      console.log(err);
         return workflow.emit('exception', err);
    }

    spreadsheet.receive({getValues:true},function(err, rows, info) {
        if (err) {
          console.log(err)
            return workflow.emit('exception', err);
        }
        var updatedParams={};
        //if(sheetName=='VV_UT') updatedParams=copyData(rows,1,4,3,JSON.parse(sheet.params));
        //if(sheetName=='VV_UT') updatedParams=copyData(rows,1,4,3,JSON.parse(sheet.params));
        if(sheetName=='OPZ') {updatedParams=synchDataParamsWithExcel(rows,JSON.parse(sheet.params),3,2,4); 
        //  console.log(sys.inspect(sheet.params));
        }
        //copiare i valori dell'excel nei parametri definiti nel DB 
        if(sheetName=='INPUT') {
          
          //src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect
          updatedParams=copyData(rows,3,4,2,JSON.parse(sheet.params));
         
          
        }


        return workflow.emit('patchSheet',req,updatedParams);
       

       //return workflow.emit('response')
    });


});


  

  });

  
    
});

  /*if(skipSynch==0) {workflow.emit('synchActiveSheetWithGoogleSpreadsheet',req)}
    else */
      console.log('getActiveSheet');
      workflow.emit('getActiveSheet',req);
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



exports.saveSimulation = function(req,res,next){
 var workflow = req.app.utility.workflow(req, res);
 

 workflow.on('saveSimulation', function(workflow,req,sprdsheet) {
 var user=req.user.email;
 var def=sprdsheet.sheetsList[0];
var  simulationLabel=req.body.simulationLabel;
 //console.log(sprdsheet);
 workflow.emit('saveSimulationOnParamObj',workflow,sprdsheet,simulationLabel,user);

});

 workflow.on('saveSimulationOnExcel',function(workflow,sprdsheet,simulationLabel,user){

  saveSimulationOnExcel(workflow,sprdsheet,simulationLabel,user,sprdsheet.sheetsList[0].params);

 })


workflow.on('saveSimulationOnParamObj',function(  workflow,sprdsheet,simulationLabel,user){


 var fieldsToSet = {
      _id: mongoose.Types.ObjectId(),
      pivot: sprdsheet.nextSaveCol,
      name: user,
      value: simulationLabel,
      sheetId: sprdsheet._id
    };

    req.app.db.models.Param.create(fieldsToSet, function(err, param) {
      if (err) {
        return workflow.emit('exception', err);
      }
      //console.log(param);
    
      return workflow.emit('saveSimulationOnExcel',workflow,sprdsheet,simulationLabel,user);
    });

})


workflow.on('patchSpreadsheet', function(req) {
 
    req.app.db.models.Spreadsheet.findByIdAndUpdate(req.body.record._id,{$inc: {nextSaveCol:1}}).populate('sheetsList').exec(function(err, spreadsheet) {
      if (err) {
        return workflow.emit('exception', err);
      }
     
     
      workflow.outcome.spreadsheet = spreadsheet;
     
      return workflow.emit('saveSimulation',workflow,req,spreadsheet);
      
    });
  });


 workflow.emit('patchSpreadsheet',req);

};



exports.saveSimulationOnDb = function(req,res,next){
 var workflow = req.app.utility.workflow(req, res);
 

 workflow.on('saveSimulation', function(workflow,req) {
 var user=req.user.email;
 var sprdsheet=req.body.record;
 //

 var  simulationLabel=req.body.simulationLabel;
 
 req.app.db.models.Spreadsheet.findOne({_id:sprdsheet._id}).populate('sheetsList').exec(function(err, spreadsheet) {

 var firstSheet=spreadsheet.sheetsList[1];

 console.log('first-sheet-params are: '+firstSheet);

  saveSimulationOnExcelAndDb(req,workflow,sprdsheet,simulationLabel,user,firstSheet.params);


 });




});

 workflow.emit('saveSimulation',workflow,req);

};


function saveSimulationOnExcelAndDb(req,workflow,sprdsheet,simulationLabel,user,vv_opzParams){

  Spreadsheet.load({
    debug: true,
    spreadsheetId:sprdsheet.googleId ,
    worksheetName: 'INPUT',

    oauth : {
        email: '36923579256-7pv511lb1odrijg1mtatnc0v5bsaeiiv@developer.gserviceaccount.com',
        keyFile: './views/spreadsheets/nodejs-gdata-key-file.pem'
    }

}, function sheetReady(err,spreadsheet) {

    if (err) {
        return workflow.emit('exception',err) ;
    }


    spreadsheet.receive({getValues:true},function(err, rows, info) {
        if (err) {
            throw err;
        }
       
        
        var colToBeSaved=getColumnFromRowsData(rows,11,11,1)
        colToBeSaved.pop();
        var o3={},o4={};
       o4[2]=vv_opzParams;
       o3[359]=o4;
       
       colToBeSaved.push(o3);
       
         console.log(colToBeSaved);

       //return workflow.emit('exception', err);

       var fieldsToSet = {
      _id: mongoose.Types.ObjectId(),
      pivot: user,
      name: JSON.stringify(colToBeSaved),
      value: simulationLabel,
      sheetId: sprdsheet._id
    };

    req.app.db.models.Param.create(fieldsToSet, function(err, param) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.infos.push('Simulazione salvata');
      return workflow.emit('response');
     
    });

       /*
        for(var ii=0;ii<colToBeSaved.length;ii++){
         spreadsheet.add(colToBeSaved[ii]);
          } 
                 
         
       spreadsheet.send(function(err) {
        if(err) {console.log(err);
                    return workflow.emit('exception',err) ;
                  }
           workflow.outcome.infos.push('Simulazione salvata');
           return workflow.emit('response');
        });*/
    });
    });

}




function saveSimulationOnExcel(workflow,sprdsheet,simulationLabel,user,vv_opzParams){
 var nextCol= sprdsheet.nextSaveCol;
  Spreadsheet.load({
    debug: true,
    spreadsheetId:sprdsheet.googleId ,
    worksheetName: 'INPUT',

    oauth : {
        email: '36923579256-7pv511lb1odrijg1mtatnc0v5bsaeiiv@developer.gserviceaccount.com',
        keyFile: './views/spreadsheets/nodejs-gdata-key-file.pem'
    }

}, function sheetReady(err,spreadsheet) {

    if (err) {
        return workflow.emit('exception',err) ;
    }


    spreadsheet.receive({getValues:true},function(err, rows, info) {
        if (err) {
            throw err;
        }
       
        nextCol=parseInt(nextCol);
        var colToBeSaved=getColumnFromRowsData(rows,nextCol,2,1)
        var now = moment();

         var o1={},o2={},o3={},o4={};;
                 o2[nextCol]='Simulazione salvata da: '+user+  ' data: '+now.format()+' descrizione: '+simulationLabel;
                 o1[1]=o2;
       

       colToBeSaved.push(o1);


       o4[nextCol]=vv_opzParams;
       o3[197]=o4;

       colToBeSaved.push(o3);
       
        for(var ii=0;ii<colToBeSaved.length;ii++){
         spreadsheet.add(colToBeSaved[ii]);
          } 
                 
         
       spreadsheet.send(function(err) {
        if(err) {console.log(err);
                    return workflow.emit('exception',err) ;
                  }
           workflow.outcome.infos.push('Simulazione salvata');
           return workflow.emit('response');
        });
    });
    });

}


function fetchSimulationFromDbAndCopyIntoExcel(workflow,sprdsheet,simulation){




}




exports.getSimulations = function(req,res,next){
 var workflow = req.app.utility.workflow(req, res);
 
req.app.db.models.Param.find({sheetId:req.params.id}).exec(function(err, savedSimulations) {
    if (err) {
      workflow.emit("exception",err);
    }
      workflow.outcome.savedSimulations=savedSimulations;
      workflow.emit("response");
     
  });


};

/*
used by getSimulation
*/

function  updateParametersSheets(googleId,simulationObj,varOpz,workflow,req){


Spreadsheet.load({
            debug: true,
            spreadsheetId: googleId,
            worksheetName: 'INPUT',
            oauth : {
                email: '36923579256-7pv511lb1odrijg1mtatnc0v5bsaeiiv@developer.gserviceaccount.com',
                keyFile: './views/spreadsheets/nodejs-gdata-key-file.pem'
            }

        }, function sheetReady(err, spreadsheet) {
          
          if (err) {
            //throw err;
            
        return workflow.emit('exception', err);
          }
          
          for(var jj= 0;jj<simulationObj.length;jj++){

            spreadsheet.add(simulationObj[jj]);

          }
          
          
          spreadsheet.send(function(err) {
            if(err) {
            return workflow.emit('exception', err);
            }
       workflow.outcome.infos.push('aggiornamento dati in fase di completamento');

           
            });
        });

try{
varOpz=_.values(varOpz);
varOpz=varOpz[0];
varOpz=JSON.parse(varOpz);
varOpz=prepareParamsForExcel(varOpz);
}
catch(err){
  console.log(err);
   return workflow.emit('exception', 'Non è stato possibile caricare i dati Regione e Tipologia simulazione (P o R)');
  }
 Spreadsheet.load({
            debug: true,
            spreadsheetId: googleId,
            worksheetName: 'OPZ',
            oauth : {
                email: '36923579256-7pv511lb1odrijg1mtatnc0v5bsaeiiv@developer.gserviceaccount.com',
                keyFile: './views/spreadsheets/nodejs-gdata-key-file.pem'
            }

        }, function sheetReady(err, spreadsheet) {
          
          if (err) {
            //throw err;
            
        return workflow.emit('exception', err);
          }
          
          for(var jj= 0;jj<varOpz.length;jj++){

            spreadsheet.add(varOpz[jj]);

          }
          
          
          spreadsheet.send(function(err) {
            if(err) {
            return workflow.emit('exception', err);
            }
            workflow.outcome.infos.push('i dati di simulazione sono stati aggiornati, attendere l\' aggiornamento della pagina');
           return workflow.emit('response');
           
            });
        });
 



}


exports.getSimulation = function(req,res,next){
 var workflow = req.app.utility.workflow(req, res);
 //copy the specified column into column 2 
//pull out row 197
//patch OPZ 
//patch VV_UTZ
 // patch the spreadsheet as to restart from default 
 //

workflow.on('copyColumn',function(req,workflow,simulation){
  var sprdsheet=req.body.record;  
  var simulationObj=JSON.parse(simulation.name);
  var varOpz=simulationObj.pop();
  varOpz=_.values(varOpz)[0];

  updateParametersSheets(sprdsheet.googleId,simulationObj,varOpz,workflow,req);
  //updateSheet(sprdsheet.googleId,simulationObj,'VV_UT',workflow,req);

})

workflow.on('fetchSimulation',function(req,workflow){
  req.app.db.models.Param.findOne({_id:req.params.simulationId}).exec(function(err, simulation) {
    if (err) {
      workflow.emit("exception",err);
    }
      workflow.emit('copyColumn',req,workflow,simulation);  
      
  })
});

workflow.emit('fetchSimulation',req,workflow);
};






