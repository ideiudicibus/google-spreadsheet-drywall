var sys=require('sys'); 
var _=require('underscore');
var S = require('string');
function getProperty(obj, prop) {
    
    return obj[prop];
}

function setProperty(obj,prop,value){
obj[prop]=value;
return obj;
}



function copyDataNoLabel(src_rows,mapping_col_idx,src_val_idx,src_vect){

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
      
    }

    });
    if(obj!=null){   
     i=setProperty(i,_.keys(i)[0] ,obj);}

});
return src_vect;

}

function copyData(src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect){

  _.each(src_vect,function(i,k){
     var obj={};
  _.each(src_rows,function(a,b){
   if(_.keys(i)[0] == getProperty(a,mapping_col_idx)){
      obj=_.clone(_.values(i)[0]);
    console.log(obj);
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

var rows0= {  '2': 
   { '2': 'Sovaldi',
     '3': 'sofosbuvir',
     '4': '400 mg',
     '5': 168,
     '6': '  50.000,00 ',
     '7': '  37.000,00 ',
     '8': 'farm.Sovaldi.mol.sofosbuvir' },
  '3': 
   { '2': 'Harvoni ',
     '3': 'ledipasvir-sofosbuvir',
     '4': '90mg/400mg',
     '5': 1,
     '6': '  45.000,00 ',
     '7': '  37.000,00 ',
     '8': 'farm.Harvoni .mol.ledipasvir-sofosbuvir' },
  '4': 
   { '2': 'Daklinza',
     '3': 'daclatasvir',
     '4': '60 mg',
     '5': 1,
     '6': '  30.000,00 ',
     '7': '  17.000,00 ',
     '8': 'farm.Daklinza.mol.daclatasvir' },
  '5': 
   { '2': 'Olysio',
     '3': 'simeprevir',
     '4': '150 mg (capsule)',
     '5': 7,
     '6': '  30.000,00 ',
     '7': '  19.000,00 ',
     '8': 'farm.Olysio.mol.simeprevir' },
  '6': 
   { '2': 'Ribavirina Teva',
     '3': 'ribavirina',
     '4': '200 mg (capsule)',
     '5': 84,
     '6': '  221,41 ',
     '7': '  221,41 ',
     '8': 'farm.Ribavirina Teva.mol.ribavirina' },
  '7': 
   { '2': 'Pegasys',
     '3': 'interferone pegilato',
     '4': '180 mcg (flaconcino)',
     '5': 168,
     '6': '  205,00 ',
     '7': '  205,00 ',
     '8': 'farm.Pegasys.mol.interferone pegilato' },
  '8': 
   { '2': 'Victrelis',
     '3': 'boceprevir',
     '4': '200 mg (capsule)',
     '5': 84,
     '6': '  1.176,65 ',
     '7': '  1.176,65 ',
     '8': 'farm.Victrelis.mol.boceprevir' },
  '9': 
   { '2': 'Incivo',
     '3': 'telaprevir',
     '4': '375 mg (compresse)',
     '5': 42,
     '6': '  3.438,20 ',
     '7': '  3.438,20 ',
     '8': 'farm.Incivo.mol.telaprevir' }
 };
  
  
 var src_vect=[{"sofosbuvir":{"row":"2","col":"6","value":"","label":""}},{"ledipasvir-sofosbuvir":{"row":"3","col":"6","value":"","label":""}},{"daclatasvir":{"row":"4","col":"6","value":"","label":""}},{"simeprevir":{"row":"5","col":"6","value":"","label":""}},{"ribavirina":{"row":"6","col":"6","value":"","label":""}},{"interferone pegilato":{"row":"7","col":"6","value":"","label":""}},{"boceprevir":{"row":"8","col":"6","value":"","label":""}},{"telaprevir":{"row":"9","col":"6","value":"","label":""}}];

 
//function copyData(src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect){





var ret=copyData(rows0,3,6,2,src_vect);

//console.log(ret);

               /*var tmpRow0=_.filter(ret,function(a,b,c){
                var aa=(_.values(a));
                console.log(aa[0])
                return;//((aa[0].label).indexOf("1a1b")>=0); 
                })*/

console.log(ret);

