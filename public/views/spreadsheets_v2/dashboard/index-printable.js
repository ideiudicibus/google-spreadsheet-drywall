google.load("visualization", '1.1', {packages:['corechart','table']});


var data=initData();

function resetHtmlTemplates(){


 if( templateLoader.localStorageAvailable()){

                localStorage.removeItem("templates");
                localStorage.removeItem("templateVersion");
      }

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


function loadTemplate(sheet,sheetName){



     var activeSheet=sheet;
     var tmplFile=sheetName;
           tmplFile=tmplFile.split('-')[1];
           //tmplFile="2-"+tmplFile;
       
          templateLoader.loadRemoteTemplate(activeSheet._id+'-printable', "/views/spreadsheets_v2/dashboard/"+sheetName+"-printable-tmpl.html?", 
            function(data) {
              var compiled = _.template(data);
             
             console.log(sheetName);
             var htmlDiv= compiled({textNote:activeSheet.textNote,activeSheetName:activeSheet.name,params:JSON.parse(activeSheet.params)});
              $(htmlDiv).appendTo('#printable-'+tmplFile); 
            });


}

$(function() {
var sheetsList=data.record.sheetsList;
loadTemplate(sheetsList[0],sheetsList[0]._id);
loadTemplate(sheetsList[1],sheetsList[1]._id);
loadTemplate(sheetsList[2],sheetsList[2]._id);
loadTemplate(sheetsList[3],sheetsList[3]._id);
loadTemplate(sheetsList[4],sheetsList[4]._id);
loadTemplate(sheetsList[5],sheetsList[5]._id);
loadTemplate(sheetsList[6],sheetsList[6]._id);
loadTemplate(sheetsList[7],sheetsList[7]._id);
loadTemplate(sheetsList[8],sheetsList[8]._id);
loadTemplate(sheetsList[9],sheetsList[9]._id);
loadTemplate(sheetsList[10],sheetsList[10]._id);
loadTemplate(sheetsList[11],sheetsList[11]._id);
});