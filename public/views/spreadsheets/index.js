var data=initData();

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("active");
 });

function initSideNav(array){

var root=$('#spreadsheets');

var brandHtml='<a href="#">Seleziona un modello</a> ';
$(brandHtml).appendTo(root.children('li.sidebar-brand'));


if(array.length==0){
  var li='<li ><a><div><i class="fa fa-warning fa-fw"></i>nessun modello</div><span class="pull-right text-muted small"></span></a></li>'
  $(li).appendTo(root);
}

for(var i=0;i<array.length;i++){
	
	if(array[i].googleId.length>0){
		
	var li='<li ><a href="'+window.location.pathname+array[i].apiVersion+'/'+array[i]._id+'/" id="'+array[i]._id+'"><i class="fa fa-bar-chart-o fa-fw"></i>'+array[i].name+'</a></li>';
	$(li).appendTo(root);}
	else{
	var li='<li ><a href="#" id="'+array[i]._id+'" class="unactive"><i class="fa fa-bar-chart-o fa-fw"></i>'+array[i].name+'</a></li>';
	$(li).appendTo(root);
	}
}
}


$(function() {
initSideNav(data.records);	
});