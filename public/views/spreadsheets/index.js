var data=initData();

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("active");
 });

function initSideNav(array){

var root=$('#spreadsheets');
for(var i=0;i<array.length;i++){
var li='<li ><a href="'+window.location.pathname+'/'+array[i]._id+'/" id="'+array[i]._id+'">'+array[i].name+'</a></li>';
	$(li).appendTo(root);
}
}


$(function() {
initSideNav(data.records);	
});