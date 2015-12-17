google.load("visualization", '1.1', {packages:['corechart','table']});


var data=initData();
var activeSheet;
var opzGen;
var opzReg;



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
  console.log(array[i]._id);
  var li='<li ><a href="#" id="'+array[i]._id+'" class="sheetId '+checkActiveSheetClass(array[i]._id,spreadsheet.activeSheet)+'" >'+array[i].spreadsheetId+'</a></li>';
  $(li).appendTo(hroot);
}
}
console.log('8');
loadActiveSheet(data.record);

}

function loadActiveSheet(spreadsheet){
data.record.synch='n';
if((data.record.activeSheet).indexOf('default')>0 ){

  data.record.synch='y';
  data.record.synchSheetName='OPZ';

}
if((data.record.activeSheet).indexOf('input')>0){
    data.record.synch='y';
    data.record.synchSheetName='INPUT';

}

if((data.record.activeSheet).indexOf('ter')>0){
    data.record.synch='y';
    data.record.synchSheetName='TER';

}

if((data.record.activeSheet).indexOf('costof')>0){
    data.record.synch='y';
    data.record.synchSheetName='COSTOF';

}

if((data.record.activeSheet).indexOf('opz2')>0 ){

  data.record.synch='y';
  data.record.synchSheetName='OPZ';

}


$('.active').toggleClass('active');
var elem=$('#sheets').find('#'+spreadsheet.activeSheet);
elem.toggleClass('active');

     $.ajax({        
        type: "POST",
        data: data,
        url: '/spreadsheets_v3/activesheet/g/'+spreadsheet.activeSheet,
        dataType:"json",
        success:  function (response) {
          
          switch(response.success)
          {
            case  false:
              var errs=response.errors;
              for(var j=0;j<errs.length;j++){
                console.log(errors[j]);
                alertify.error(errs[j]);
              }
            break;
            
            case  true:
              var infos=response.infos;
              for(var j=0;j<infos.length;j++){
                alertify.log(infos[j]);
                }   
             activeSheet=response.sheet;
             opzGen=response.opzGen;
             opzReg=response.opzReg;


          
           var pivot=data.record.pivot;
           var tmplFile=activeSheet._id;
          
          
           templateLoader.loadRemoteTemplate(activeSheet._id, "/views/spreadsheets_v3/dashboard/"+activeSheet._id+"-tmpl.html?", 
            function(data) {
              var compiled = _.template(data);
             console.log(activeSheet._id);
              $('#activeSheet').html(compiled({opzRegParams:JSON.parse(opzReg.params),opzGenParams:JSON.parse(opzGen.params),textNote:activeSheet.textNote,activeSheetName:activeSheet.name,params:JSON.parse(activeSheet.params)}));
                      var aname=activeSheet._id;
                      
                      resetHtmlTemplates();
                     
                      loadSavedSimulations();
                      loadSimulationLinkBehaviour();
                      //console.log(activeSheet.name);
                      if((activeSheet.name).indexOf('input')==0 ){
                            loadButtonsBehaviourInput();
                        }
                      if((activeSheet.name).indexOf('ter')==0 ){
                           loadUpdateParameterBtnBehaviourFullTer();
                        }
                      if((activeSheet.name).indexOf('costof')==0 ){
                           loadUpdateParameterBtnBehaviourFullCostof();
                        }

                      if((activeSheet.name).indexOf('default')==0 ) {
                              loadButtonsBehaviourDefaultOpz();
                              //setSelectedInputs();
                              //resetParamsActiveSheetBtnBehaviour();
                             //saveSimulationBtnBehaviour();

                      };
                      if((activeSheet.name).indexOf('opz2')==0 ) {
                              loadButtonsBehaviourDefaultOpz();


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

function loadUpdateParameterBtnBehaviourFullCostof() {

console.log('loadUpdateParameterBtnBehaviourFullCostof');
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

 params.sheetName='COSTOF';
 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/params',
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

});
}

function loadUpdateParameterBtnBehaviourFullTer() {

console.log('loadUpdateParameterBtnBehaviourFullTer');
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

 params.sheetName='TER';
 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/params',
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

function loadButtonsBehaviourInput(){

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


if($(this).attr('class').indexOf('checkPercentage')>0){

  var i=0;
 for (k in paramData){
    var a=paramData[k];
        for(kk in a ){
          var v=a[kk];

             if(v.value.indexOf('%')<0) { 
              alertify.alert('il parametro '+v.label+' non contiene %'); 
              return false;}

    
        }

        }
 
}


console.log('now calling loadButtonsBehaviourInput');
 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/params',
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

function loadButtonsBehaviourDefaultOpz(){



    
   $('.resetAllParameters').click(function(event){
  event.preventDefault();

var params={};


  
params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.sheetName='OPZ';

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/reset',
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


    $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();
var paramData = [];
var params={};

    $('#paramInputs').find('input, textarea, select').each(function(i, field) {
    var obj={};
            var v={};
            v.row=$(field).attr('row');
            v.col=$(field).attr('col');
            v.value=(field.value=='on'?'X':'');
            v.label=$(field).attr('label');
            obj[field.name]=v
            paramData.push(obj);

  });

params.googleId=data.record.googleId;
params.activeSheet=data.record.activeSheet;
params.paramData=JSON.stringify(paramData);
params.sheetName='OPZ';

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
console.log('now calling loadUpdateParameterBtnBehaviourFull');
 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
        url: '/spreadsheets_v3/'+data.record._id+'/s/simulation',
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

    alertify.confirm("Eseguire il reset a valori di default?", function (e) {
    if (e) {

       $.ajax({
       data:data,
        type: "POST",
        url: '/spreadsheets_v3/activesheet/r/'+data.record.activeSheet,
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

    } else {
        return false;
    }
});


  
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
console.log('now calling loadUpdateParameterBtnBehaviour')
 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets_v3/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
        url: '/spreadsheets_v3/'+data.record._id+'/l/simulation/'+simId,
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
        
        url: '/spreadsheets_v3/'+data.record._id+'/g/simulations',
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


 $('#simList').hide();

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
        url: '/spreadsheets_v3/activesheet/'+activeSheetID,
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
