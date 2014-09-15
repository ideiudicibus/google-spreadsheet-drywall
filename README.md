Google spreadsheets viewer
=================
more on the [project wiki](https://github.com/ideiudicibus/google-spreadsheet-drywall/wiki)

copy spreadsheet with mongo
var s= db.spreadsheets.findOne({_id:"someIdHere"});
delete s['_id'];
s._id='';
s.googleId='';
s.name='';
db.spreadsheets.insert(s);
