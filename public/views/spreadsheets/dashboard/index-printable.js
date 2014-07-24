google.load("visualization", '1.1', {packages:['corechart','table']});


var data=initData();

function resetHtmlTemplates(){

if( templateLoader.localStorageAvailable()){

                localStorage.removeItem("templates");
                localStorage.removeItem("templateVersion");
      }

}

function loadTemplates(spreadsheet){

     var activeSheet=spreadsheet.sheetsList[0];
     var tmplFile=spreadsheet.sheetsList[0]._id;
           tmplFile=tmplFile.split('-')[1];
           tmplFile="2-"+tmplFile;
       
          templateLoader.loadRemoteTemplate(activeSheet._id+'-printable', "/views/spreadsheets/dashboard/"+tmplFile+"-printable-tmpl.html?", 
            function(data) {
              var compiled = _.template(data);
              $('#printable').html(compiled({textNote:activeSheet.textNote,activeSheetName:activeSheet.name,params:JSON.parse(activeSheet.params)}));
            });

}

$(function() {

resetHtmlTemplates();

loadTemplates(data.record);




});