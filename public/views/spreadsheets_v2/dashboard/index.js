google.load("visualization", '1.1', {packages:['corechart','table']});


var data=initData();
var activeSheet;



function alertNotImplemented(){
     alertify.alert("Funzionalità non presente");

}

function resetHtmlTemplates(){

if( templateLoader.localStorageAvailable()){

                localStorage.removeItem("templates");
                localStorage.removeItem("templateVersion");
                if(localStorage.templates) {localStorage.templates=null;}
               
      }

}


function checkActiveSheetClass(id,activeId){

return (id==activeId)?"active":"";

}

function changeOptionValue($element, value) {

  $element.find("option").filter(function(){
      return ( ($(this).val() == value) || ($(this).text() == value) )
    }).prop('selected', true);
}


function setSelectedInputs(){

 var arr= $('#paramInputs').find('select');
 
for(var i=0;i<arr.length;i++){

changeOptionValue($('#paramInputs'), $(arr[i]).attr('value'));
}
}


function initSideNav(spreadsheet){


var array=spreadsheet.sheetsList;

var vroot=$('#v-sheets');
var hroot=$('#h-sheets');
var brandHtml='<li class="sidebar-brand"><a href="#">'+spreadsheet.name+'</a></li> ';
$(brandHtml).appendTo(vroot);

for(var i=0;i<array.length;i++){

 console.log(array[i]._id.indexOf('autori')<0);
if(array[i]._id.indexOf('autori')<0  && array[i]._id.indexOf('biblio')<0 ){
var li='<li ><a href="#" id="'+array[i]._id+'" class="sheetId '+checkActiveSheetClass(array[i]._id,spreadsheet.activeSheet)+'" >'+array[i].spreadsheetId+'</a></li>';
$(li).appendTo(vroot);
}
else {
  //console.log(array[i]._id);
  var li='<li ><a href="#" id="'+array[i]._id+'" class="sheetId '+checkActiveSheetClass(array[i]._id,spreadsheet.activeSheet)+'" >'+array[i].spreadsheetId+'</a></li>';
  $(li).appendTo(hroot);
}
}
console.log('8');
loadActiveSheet(data.record);

}

function loadActiveSheet(spreadsheet){


$('.active').toggleClass('active');
var elem=$('#sheets').find('#'+spreadsheet.activeSheet);
elem.toggleClass('active');

     $.ajax({        
        type: "POST",
        data: data,
        url: '/spreadsheets_v2/activesheet/g/'+spreadsheet.activeSheet,
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
              }
            break;
            
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
                }   
             activeSheet=response.sheet;


           //console.log(data.record.pivot);
           // console.log(activeSheet);
           var pivot=data.record.pivot;
           var tmplFile=activeSheet._id;
           tmplFile=tmplFile.split('-')[1];
           tmplFile="2-"+tmplFile;
           //console.log(tmplFile);
           //console.log(activeSheet._id);
           templateLoader.loadRemoteTemplate(activeSheet._id, "/views/spreadsheets_v2/dashboard/"+activeSheet._id+"-tmpl.html?", 
            function(data) {
              var compiled = _.template(data);
             
              $('#activeSheet').html(compiled({textNote:activeSheet.textNote,activeSheetName:activeSheet.name,params:JSON.parse(activeSheet.params)}));
                      var aname=activeSheet._id;
                      
                      resetHtmlTemplates();
                     
                      loadSavedSimulations();
                      loadSimulationLinkBehaviour();
                      //console.log(activeSheet.name);
                      if((activeSheet.name).indexOf('default')<0 ){
                           if((activeSheet.name).indexOf('P017')>=0 ){
                            loadUpdateParameterBtnBehaviourFullP017();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                           if((activeSheet.name).indexOf('P016')>=0 ){
                            loadUpdateParameterBtnBehaviourFullP016();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                          if((activeSheet.name).indexOf('P015')>=0 ){
                            loadUpdateParameterBtnBehaviourFullP015();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                           if((activeSheet.name).indexOf('P014')>=0 ){
                            loadUpdateParameterBtnBehaviourFullP014();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                            if((activeSheet.name).indexOf('P013')>=0 ){

                            loadUpdateParameterBtnBehaviourFullP013();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                           
                            }
                            if((activeSheet.name).indexOf('P012')>=0 ){
                            
                            loadUpdateParameterBtnBehaviourFullP012();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                             
                            if((activeSheet.name).indexOf('P011')>=0 ){
                            
                            loadUpdateParameterBtnBehaviourSingleP011();
                            resetParamsActiveSheetBtnBehaviour();
                            //saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                        }
                      else {
                              loadButtonsBehaviourDefaultOpz();
                              setSelectedInputs();
                              resetParamsActiveSheetBtnBehaviour();
                              //saveSimulationBtnBehaviour();

                      };
                    
            }
            )
          }

        }
    })
 }

function reloadParametersBtnBehaviour(){

  $('#force-reload-sheet').click(function(event){
      event.preventDefault();
    // confirm dialog
  
  alertify.confirm("Ricaricare i parametri?", function (e) {
    if (e) {
        //console.log('9');
        loadActiveSheet(data.record);
    } else {
        return false;
    }
});
})

}

function loadUpdateParameterBtnBehaviourFullP012() {


  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   //console.log(tmp.attr('id'));

   $(tmp).modal('toggle');

var paramData = [];
var params={};

    $(tmp).find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkPercentage')>0){

  var i=0;
 for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];

             if(v.value.indexOf('%')<0) { 
              alertify.alert('il parametro '+v.label+' non contiene %'); 
              return false;}
else{
   v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
   v.value=v.value.trim();
   var tmp=v.value.split("%").join("");
   i=i+parseFloat(tmp);
   }
    
        }

        }
 


  if(Math.ceil(i)!=100.00){ alertify.alert('Attenzione la somma dei parametri è diversa dal 100% ');
  return false;}
 
}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('1');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}



function loadUpdateParameterBtnBehaviourFullP013() {


  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   //console.log(tmp.attr('id'));

   $(tmp).modal('toggle');

var paramData = [];
var params={};

    $(tmp).find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkPercentage')>0){

  var i=0;
 for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];

             if(v.value.indexOf('%')<0) { 
              alertify.alert('il parametro '+v.label+' non contiene %'); 
              return false;}
else{
   v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
   v.value=v.value.trim();
   var tmp=v.value.split("%").join("");
   i=i+parseFloat(tmp);
   }
    
        }

        }

 
  if(i>100.00){ alertify.alert('Attenzione parametri non validi: la somma dei parametri è maggiore del 100% ');
  return false;}
   if(Math.ceil(i)!=100.00){ alertify.alert('Attenzione parametri non validi: la somma dei parametri è diversa dal 100% ');
  return false;}
}


 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('2');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}

function loadUpdateParameterBtnBehaviourFullP015() {

  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   //console.log(tmp.attr('id'));

   $(tmp).modal('toggle');

var paramData = [];
var params={};

    $(tmp).find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkPercentage')>0){

  var i=0;
 for (k in paramData){
  
    var a=paramData[k];
        for(kk in a ){
          var reg = new RegExp(/Prezzo|scat/);
          var v=a[kk];
          if(v.label.indexOf('%')>=0){  

             if(v.value!=null && v.value.length>0 && v.value.indexOf('%')<0) { 
              alertify.alert('il parametro '+v.label+' non contiene %'); 
              return false;}
          else{
             v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
             v.value=v.value.trim();
             var tmp=v.value.split("%").join("");
             i=parseFloat(tmp);
            if(i>100.00){ alertify.alert('Attenzione parametri non validi: il valore '+i+'% inserito per '+v.label+' è maggiore del 100% ');
            return false;}
             }
 }
 else {
   var reg1 = new RegExp(/^(?:\d*,\d{1,2}|\d+)$/);
   v.value=v.value.trim();

          if(v.value!=null && v.value.length>0 && !reg1.test(v.value)){
             alertify.alert('il parametro '+v.value+' - '+v.label+' non è riconosciuto come numero decimale (es: 21,05)');
             return false;
            }

 }

    
        }

        }
 

}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('2');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}




function loadUpdateParameterBtnBehaviourFullP017() {

 $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   //console.log(tmp.attr('id'));

   $(tmp).modal('toggle');

var paramData = [];
var params={};

    $(tmp).find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkNumber')>0){

  var i=0;
 for (k in paramData){
  
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];
   var reg1 = new RegExp(/^(?:\d*,\d{1,2}|\d+)$/);
   v.value=v.value.trim();

          if(v.value!=null && v.value.length>0 && !reg1.test(v.value)){
             alertify.alert('il parametro '+v.value+' - '+v.label+' non è riconosciuto come numero decimale (es: 21,05)');
             return false;
            }
    
        }

        }
 

}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('2');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})


}







function loadUpdateParameterBtnBehaviourFullP014() {


  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   //console.log(tmp.attr('id'));

   $(tmp).modal('toggle');

var paramData = [];
var params={};

    $(tmp).find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkPercentage')>0){

  var i=0;
 for (k in paramData){
  
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];

             if(v.value.indexOf('%')<0) { 
              alertify.alert('il parametro '+v.label+' non contiene %'); 
              return false;}
else{
   v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
   v.value=v.value.trim();
   var tmp=v.value.split("%").join("");
   i=parseFloat(tmp);
  if(i>100.00){ alertify.alert('Attenzione parametri non validi: il valore '+i+'% inserito per '+v.label+' è maggiore del 100% ');
  return false;}
   }
    
        }

        }
 

}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('2');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}


function loadUpdateParameterBtnBehaviourFullP016() {


  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   //console.log(tmp.attr('id'));

   $(tmp).modal('toggle');

var paramData = [];
var params={};

    $(tmp).find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkPercentage')>0){
  for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];
               if(v.value.indexOf('%')<0) { 
                  alertify.alert('il parametro '+v.label+' non contiene %'); 
                  return false;}
                v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
                v.value=v.value.trim();
                var tmp=v.value.split("%").join("");
                tmp=parseFloat(tmp); 
                if (isNaN(tmp)) { 
                  alertify.alert('il parametro '+v.label+' non è riconosciuto come numero (es: 21.5 oppure 21,5) '); 
                  return false; 
                }
                if(tmp>100.00){
                   alertify.alert('il parametro '+v.label+' è superiore a 100.00'); 
                  return false; 
                }
        }
}
}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('2');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}



function loadButtonsBehaviourDefaultOpz(){

    

    $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();
var paramData = [];
var params={};

    $('#paramInputs').find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }    // console.log('4');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}


function loadUpdateParameterBtnBehaviourFull() {


  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   $('#paramInputs').modal('toggle');

var paramData = [];
var params={};

    $('#paramInputs').find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('5');
            loadActiveSheet(data.record);
           
          }
        }

    })
   
    return false;

})

}





 function saveSimulationBtnBehaviour(){
  $('.saveSimulationBtn').click(function(event){
  event.preventDefault();

  
    
    alertify.prompt("Inserire una breve descrizione (max 50 caratteri) della simulazione che si intende salvare", function (e, str) {
    if (e) {
      if (str.length==0 || str.length>50){alertify.error('la descrizione della simulazione è vuota oppure eccede i 50 caratteri previsti, riprovare'); return false; }

       var postData=_.clone(data);
       postData.simulationLabel=str;  
       postData.sheetsList={};
         $.ajax({
       data:postData,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/s/simulation',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }    //console.log('13');
           loadActiveSheet(data.record);
         
          }
        }

    })


    } else {
        return false;
    }
}, "");
        return false;
    });
    }

function resetParamsActiveSheetBtnBehaviour(){

  $('.resetParamsBtn').click(function(event){
  event.preventDefault();

   $.ajax({
       data:data,
        type: "POST",
        url: '/spreadsheets_v2/activesheet/r/'+data.record.activeSheet,
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }      //console.log('6');
            loadActiveSheet(data.record);
         
          }
        }

    })
return false;
  })

}

function resetParamsActiveSheetP017BtnBehaviour(){

$('.resetParamsBtn').click(function(event){
 alertNotImplemented();
 return false;
})


}





function loadUpdateParameterBtnBehaviourSingleP011(){


  $('.updateParameterBtn').click(function(event){
  event.preventDefault();
  $('#paramInputs').modal('toggle');
  var paramData = [];
  var params={};

  $(this).parent().parent().find('input').each(function(i,field){
        var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[$(field).attr('name')]=v;
            paramData.push(obj); 
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);


if($(this).attr('class').indexOf('checkNumber')>0){
  for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];
          var reg = new RegExp('^[0-9]+$');
          if(!reg.test(v.value)){
             alertify.alert('il parametro '+v.label+' non è riconosciuto come numero intero (es: 21)');
             return false;
            }
        }
}
}

if($(this).attr('class').indexOf('checkPercentage')>0){
  for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];
               if(v.value.indexOf('%')<0) { 
                  alertify.alert('il parametro '+v.label+' non contiene %'); 
                  return false;}
                v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
                v.value=v.value.trim();
                var tmp=v.value.split("%").join("");
                tmp=parseFloat(tmp); 
                if (isNaN(tmp)) { 
                  alertify.alert('il parametro '+v.label+' non è riconosciuto come numero (es: 21.5 oppure 21,5) '); 
                  return false; 
                }
                if(tmp>100.00){
                   alertify.alert('il parametro '+v.label+' è superiore a 100.00'); 
                  return false; 
                }
        }
}
}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }       //console.log('7')
            loadActiveSheet(data.record);
         
          }
        }

    })
   
    return false;

})


  
}


function loadUpdateParameterBtnBehaviour() {

  $('.updateParameterBtn').click(function(event){
  event.preventDefault();



var paramData = [];
var params={};


  $(this).parent().parent().find('input').each(function(i,field){
        var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=field.value;
            v.label=$(field).attr('label');
            obj[$(field).attr('name')]=v;
            paramData.push(obj); 
  });
  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);

if($(this).attr('class').indexOf('checkPercentage')>0){

  var i=0;
 for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];

             if(v.value.indexOf('%')<0) { 
              alertify.alert('il parametro '+v.label+' non contiene %'); 
              return false;}
else{
   v.value=v.value.indexOf(',')>0?v.value.replace(/,/g, '.'):v.value;
   v.value=v.value.trim();
   var tmp=v.value.split("%").join("");
   i=i+parseFloat(tmp);
   }
    
        }

        }
  
  if(i>100.00){ alertify.alert('Attenzione la somma dei parametri è maggiore del 100% ');
  return false;}
 
}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/'+data.record.activeSheet+'/params',
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
      }
              break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
      }     //console.log('10');
            loadActiveSheet(data.record);
         
          }
        }

    })
   
    return false;

})

}

function buildSavedSimulationsList(simulations,callback){

var root=$('#savedSimulations');
root.empty();

if(simulations.length==0){
  var li='<li ><a><div><i class="fa fa-gears fa-fw"></i>nessuna simulazione</div><span class="pull-right text-muted small"></span></a></li>'
  $(li).appendTo(root);
}
for(var i=0;i<simulations.length;i++){
//var li='<li ><a href="#" id="'+simulations[i]._id+'" class="loadSimulation" ><div><i class="fa fa-table fa-fw"></i>'+simulations[i].value+'</div><span class="pull-right text-muted small"></span></a></li>';
var li='<li><a href="#"  id="'+simulations[i]._id+'" class="loadSimulation"><div><i class="fa fa-gears fa-fw"></i><p> '+simulations[i].value+'</p><span class="pull-right text-muted small"><p>salvata il'+simulations[i].creationTime+'</p></span></div></a></li>';
$(li).appendTo(root);
}
callback()
}


function loadSimulation(simId){


  $.ajax({
        data:data,
        type: "POST",
        url: '/spreadsheets_v2/'+data.record._id+'/l/simulation/'+simId,
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
              }
            break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
              }

             loadActiveSheet(data.record);
         
          }
        }

    })

  

}

function loadSavedSimulations(){

$.ajax({
        type: "POST",
        
        url: '/spreadsheets_v2/'+data.record._id+'/g/simulations',
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
              }
            break;
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
              }
              var savedSimulations=response.savedSimulations;            
              buildSavedSimulationsList(savedSimulations,loadSimulationLinkBehaviour);
  
         
          }
        }

    })

}


function loadSimulationLinkBehaviour(){


   $('.loadSimulation').click(function(event){
      event.preventDefault();
    var simId=$(this).attr('id');     
        alertify.confirm("Ricaricare la simulazione?", function (e) {
    if (e) {
      loadSimulation(simId);
    } else {
        return false;
    }
})
});

}





$(function() {


 alertify.set({ labels: {
    ok     : "Procedi",
    cancel : "Annulla"
    } , 
     delay: 10000 
    });
 
     $('#printablePage').attr('href',window.location.pathname+'printable');
     


    $('.notImplemented').click(function(e){
      alertNotImplemented();
    });  

      $(window).bind("load resize", function() {
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.sidebar-collapse').addClass('collapse')
        } else {
            $('div.sidebar-collapse').removeClass('collapse')
        }
    })

initSideNav(data.record);


$('.sheetId').click(function(event){

var activeSheetID=$(this).attr('id');


 $.ajax({
        data:data.record,
        type: "POST",
        url: '/spreadsheets_v2/activesheet/'+activeSheetID,
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                alertify.error(errs[j]);
              }
              break;
            
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
                }
             data.record=response.spreadsheet; 
             console.log('12');       
             loadActiveSheet(data.record);
          }
        }
    })

  })

});
