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

// utility function called by getCookie()
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

// primary function to retrieve cookie by name
function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break; 
    }
    return null;
}


function loadTemplate(sheet,sheetName){



     var activeSheet=sheet;
     var tmplFile=sheetName;
           tmplFile=tmplFile.split('-')[1];
           //tmplFile="2-"+tmplFile;
       
          templateLoader.loadRemoteTemplate(activeSheet._id+'-printable', "/views/spreadsheets_v31/dashboard/printable/"+sheetName+"-tmpl.html?", 
            function(data) {
              var compiled = _.template(data);
             
             
             var htmlDiv= compiled({textNote:activeSheet.textNote,activeSheetName:activeSheet.name,params:JSON.parse(activeSheet.params)});
              console.log(tmplFile);
              $(htmlDiv).appendTo('#printable-'+tmplFile); 
            });


}

$(function() {

var sid=getCookie('connect.sid');

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
loadTemplate(sheetsList[12],sheetsList[12]._id);
loadTemplate(sheetsList[13],sheetsList[13]._id);
loadTemplate(sheetsList[14],sheetsList[14]._id);
loadTemplate(sheetsList[15],sheetsList[15]._id);
loadTemplate(sheetsList[16],sheetsList[16]._id);
loadTemplate(sheetsList[17],sheetsList[17]._id);
loadTemplate(sheetsList[18],sheetsList[18]._id);
loadTemplate(sheetsList[19],sheetsList[19]._id);
});