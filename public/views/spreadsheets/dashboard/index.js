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

var root=$('#sheets');
var brandHtml='<a href="#">'+spreadsheet.name+'</a> ';
$(brandHtml).appendTo(root.children('li.sidebar-brand'));

array=_.sortBy(array, function(item) { return item.listOrder; })

for(var i=0;i<array.length;i++){
var li='<li ><a href="#" id="'+array[i]._id+'" class="sheetId '+checkActiveSheetClass(array[i]._id,spreadsheet.activeSheet)+'" >'+array[i].spreadsheetId+'</a></li>';
$(li).appendTo(root);
}

loadActiveSheet(data.record);

}

function loadActiveSheet(spreadsheet){

$('.active').toggleClass('active');
var elem=$('#sheets').find('#'+spreadsheet.activeSheet);
elem.toggleClass('active');

     $.ajax({        
        type: "POST",
        data: data,
        url: '/spreadsheets/activesheet/g/'+spreadsheet.activeSheet,
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


            
           var tmplFile=activeSheet._id;
           tmplFile=tmplFile.split('-')[1];
           tmplFile="2-"+tmplFile;
       
          templateLoader.loadRemoteTemplate(activeSheet._id, "/views/spreadsheets/dashboard/"+tmplFile+"-tmpl.html?", 
            function(data) {
              var compiled = _.template(data);
             
              $('#activeSheet').html(compiled({textNote:activeSheet.textNote,activeSheetName:activeSheet.name,params:JSON.parse(activeSheet.params)}));
                      var aname=activeSheet._id;
                      
                      resetHtmlTemplates();

                      if((activeSheet.name).indexOf('default')<0 ){
                           if((activeSheet.name).indexOf('P016')>=0 ){
                            loadUpdateParameterBtnBehaviourFull();
                            resetParamsActiveSheetBtnBehaviour();
                            saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                          if((activeSheet.name).indexOf('P015')>=0 ){
                            loadUpdateParameterBtnBehaviourFull();
                            resetParamsActiveSheetBtnBehaviour();
                            saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                           if((activeSheet.name).indexOf('P014')>=0 ){
                            loadUpdateParameterBtnBehaviourFull();
                            resetParamsActiveSheetBtnBehaviour();
                            saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                            if((activeSheet.name).indexOf('P013')>=0 ){

                            loadUpdateParameterBtnBehaviourFullP013();
                            resetParamsActiveSheetBtnBehaviour();
                            saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                           
                            }
                            if((activeSheet.name).indexOf('P012')>=0 ){

                            loadUpdateParameterBtnBehaviourFullP013();
                            resetParamsActiveSheetBtnBehaviour();
                            saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }

                            if((activeSheet.name).indexOf('P011')>=0 ){

                            loadUpdateParameterBtnBehaviourSingleP011();
                            resetParamsActiveSheetBtnBehaviour();
                            saveSimulationBtnBehaviour();
                            reloadParametersBtnBehaviour();
                            }
                        }
                      else {
                              loadButtonsBehaviourDefaultOpz();
                              setSelectedInputs();
                              resetParamsActiveSheetBtnBehaviour();
                              saveSimulationBtnBehaviour();

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
   alertify.set({ labels: {
    ok     : "Procedi",
    cancel : "Annulla"
    } });
        alertify.confirm("Ricaricare i parametri?", function (e) {
    if (e) {
        
        loadActiveSheet(data.record);
    } else {
        return false;
    }
});

  })

}

function loadUpdateParameterBtnBehaviourFullP013() {


  $('.updateParameterBtnFull').click(function(event){
  event.preventDefault();

   var tmp=$(this).parent().parent().parent().parent();
   console.log(tmp.attr('id'));

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
 
  if(i>100.00){ alertify.alert('Attenzione la somma dei parametri è maggiore del 100% ');
  return false;}
 
}

 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
        url: '/spreadsheets/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
        url: '/spreadsheets/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
      alertNotImplemented();
    });
    }

function resetParamsActiveSheetBtnBehaviour(){

  $('.resetParamsBtn').click(function(event){
  event.preventDefault();

   $.ajax({
       data:data,
        type: "POST",
        url: '/spreadsheets/activesheet/r/'+data.record.activeSheet,
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
            loadActiveSheet(data.record);
         
          }
        }

    })
return false;
  })

}


function loadUpdateParameterBtnBehaviourSingleP011(){
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


   

return false;
 $.ajax({
        
        data:params,
        type: "POST",
        url: '/spreadsheets/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
        url: '/spreadsheets/'+data.record._id+'/'+data.record.activeSheet+'/params',
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
            loadActiveSheet(data.record);
         
          }
        }

    })
   
    return false;

})

}



$(function() {

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
        url: '/spreadsheets/activesheet/'+activeSheetID,
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
             loadActiveSheet(data.record);
          }
        }
    })

  })

});
