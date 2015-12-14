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

var rows1 =
{ '2': 
   { '2': 'Opzione simulazione Regione',
     '3': '[regione]',
     '4': 'Puglia',
     '5': '12/13/15 13:58',
     '6': 'Vers. 150730' },
  '4': 
   { '2': '------------------------------  Strategia  ------------------------------',
     '6': '----- Legenda celle -----' },
  '5': 
   { '1': 'Genere',
     '2': 'F',
     '3': 'F',
     '4': 'X',
     '5': '[l_genere1]',
     '6': 'Input Utente' },
  '6': 
   { '2': 'M',
     '3': 'M',
     '4': 'X',
     '5': '[l_genere2]',
     '6': 'Input Utente con Formula' },
  '7': 
   { '1': 'Età',
     '2': 'Giovani (0-34)',
     '3': 'Giovani (0-34)',
     '4': 'X',
     '5': '[l_cleta1]',
     '6': 'Formula' },
  '8': 
   { '2': 'Adulti (35-69)',
     '3': 'Adulti (35-69)',
     '4': 'X',
     '5': '[l_cleta2]',
     '6': 'Simulazione' },
  '9': 
   { '2': 'Anziani (70+)',
     '3': 'Anziani (70+)',
     '4': 'X',
     '5': '[l_cleta3]',
     '6': 'Errore' },
  '10': 
   { '1': 'Genotipo',
     '2': '1a1b',
     '3': '1a1b',
     '4': 'X',
     '5': '[l_gtipo1]' },
  '11': 
   { '2': '2a2b',
     '3': '2a2b',
     '4': 'X',
     '5': '[l_gtipo2]',
     '6': '----- Legenda Fogli -----' },
  '12': { '2': 3, '3': 3, '4': 'X', '5': '[l_gtipo3]', '6': 'Controlli' },
  '13': { '2': 4, '3': 4, '4': 'X', '5': '[l_gtipo4]', '6': 'Input ' },
  '14': { '2': 'F0', '3': 'F0', '5': '[l_st2]', '6': 'Input regionale' },
  '15': { '2': 'F1', '3': 'F1', '5': '[l_st3]', '6': 'Simulazione' },
  '16': { '2': 'F2', '3': 'F2', '5': '[l_st4]', '6': 'Reporting' },
  '17': { '2': 'F3', '3': 'F3', '4': 'X', '5': '[l_st5]', '6': 'Supporto' },
  '18': { '2': 'F4', '3': 'F4', '4': 'X', '5': '[l_st6]' },
  '19': { '2': 'F4S', '3': 'F4S', '4': 'X', '5': '[l_st7]' },
  '21': 
   { '3': '[sim]',
     '4': '0-',
     '5': 'Descrizione simulazione univariata' },
  '22': { '1': 'Simulazioni', '2': '[sim]=', '3': '9-', '4': '9+' },
  '23': { '2': '[sim]=', '3': '8-', '4': '8+' },
  '24': { '2': '[sim]=', '3': '7-', '4': '7+' },
  '25': { '2': '[sim]=', '3': '6-', '4': '6+' },
  '26': { '2': '[sim]=', '3': '5-', '4': '5+' },
  '27': { '2': '[sim]=', '3': '4-', '4': '4+' },
  '28': { '2': '[sim]=', '3': '3-', '4': '3+' },
  '29': { '2': '[sim]=', '3': '2-', '4': '2+', '5': 'Tasso di emersione' },
  '30': { '2': '[sim]=', '3': '1-', '4': '1+', '5': 'Anno di infezione' },
  '31': 
   { '2': '[sim]=',
     '3': '0-',
     '4': '0+',
     '5': '0- = Deterministica // 0+ = Probabilistica' },
  '33': 
   { '2': '------- Terapie -------',
     '3': '------- Regioni -------',
     '6': '------- Altre Label -------' },
  '34': 
   { '2': 'sofosbuvir / Sovaldi',
     '3': 'Italia',
     '5': '[l_genere0]',
     '6': 'M+F' },
  '35': 
   { '2': 'ledipasvir-sofosbuvir / Harvoni ',
     '3': 'Piemonte',
     '6': 'Tutti i genotipi' },
  '36': 
   { '2': 'daclatasvir / Daklinza',
     '3': 'Valle d\'Aosta',
     '6': 'Altro' },
  '37': 
   { '2': 'simeprevir / Olysio',
     '3': 'Lombardia',
     '5': '[l_st0]',
     '6': 'HCV+' },
  '38': 
   { '2': 'ribavirina / Ribavirina Teva',
     '3': 'Trentino - Alto Adige',
     '5': '[l_st1]',
     '6': 'RNA+' },
  '39': { '2': 'interferone pegilato / Pegasys', '6': 'Morti gen.' },
  '40': 
   { '2': 'boceprevir / Victrelis',
     '3': 'Veneto',
     '6': 'Morti spec.' },
  '41': 
   { '2': 'telaprevir / Incivo',
     '3': 'Friuli Venezia Giulia',
     '6': 'Trapianti' },
  '42': { '3': 'Liguria', '6': 'Epatocarc.mi' },
  '43': { '3': 'Emilia Romagna', '6': 'Trattati' },
  '44': { '3': 'Toscana', '6': 'Costo' },
  '45': { '3': 'Umbria', '6': 'RNA+Em' },
  '46': { '3': 'Marche', '6': 'Remissioni' },
  '47': { '3': 'Lazio' },
  '48': { '3': 'Abruzzo' },
  '49': { '3': 'Molise' },
  '50': { '3': 'Campania' },
  '51': { '3': 'Puglia' },
  '52': { '3': 'Basilicata' },
  '53': { '3': 'Calabria' },
  '54': { '3': 'Sicilia' },
  '55': { '3': 'Sardegna' },
  '56': { '3': 'Nord' },
  '57': { '3': 'Centro' },
  '58': { '3': 'Sud' },
  '59': { '1': 'Parametri simulazioni e legende' } 

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
  
  
 //var src_vect=[{"sofosbuvir":{"row":"2","col":"6","value":"","label":""}},{"ledipasvir-sofosbuvir":{"row":"3","col":"6","value":"","label":""}},{"daclatasvir":{"row":"4","col":"6","value":"","label":""}},{"simeprevir":{"row":"5","col":"6","value":"","label":""}},{"ribavirina":{"row":"6","col":"6","value":"","label":""}},{"interferone pegilato":{"row":"7","col":"6","value":"","label":""}},{"boceprevir":{"row":"8","col":"6","value":"","label":""}},{"telaprevir":{"row":"9","col":"6","value":"","label":""}}];

 
//function copyData(src_rows,mapping_col_idx,src_val_idx,src_label_idx,src_vect){

var src_vect=[{"[regione]":{"row":"2","col":"4","value":"","label":""}}];



var ret=copyData(rows1,3,4,2,src_vect);

//console.log(ret);

               /*var tmpRow0=_.filter(ret,function(a,b,c){
                var aa=(_.values(a));
                console.log(aa[0])
                return;//((aa[0].label).indexOf("1a1b")>=0); 
                })*/

console.log(ret);

