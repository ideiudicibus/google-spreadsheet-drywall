Google spreadsheets viewer
=================
more on the [project wiki](https://github.com/ideiudicibus/google-spreadsheet-drywall/wiki)

copy spreadsheet with mongo
var s= db.spreadsheets.findOne({_id:"5-testmodelloar"});
delete s['_id'];
s._id='';
s.googleId='';
s.name='';
s.apiVersion:'_v2'
db.spreadsheets.insert(s);



var s= db.spreadsheets.findOne({_id:"5-testmodelloar"});
delete s['_id'];
s._id='utenteAR15';
s.googleId='';
s.name='Modello AR';
s.apiVersion='_v2';
s.ownersList.push('5533e0cbb80a2ea95e395dcc');
db.spreadsheets.insert(s);

