'use strict';

exports.find = function(req, res, next){
var workflow = req.app.utility.workflow(req, res);


 workflow.on('validate', function() {

    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not read spreadsheets.');
      return workflow.emit('exception');
    }

    workflow.emit('readSpreadsheet');
  }); 

 workflow.on('readSpreadsheet',function(){

  req.query.pivot = req.query.pivot ? req.query.pivot : '';
  req.query.name = req.query.name ? req.query.name : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};
  if (req.query.pivot) {
    filters.pivot = new RegExp('^.*?'+ req.query.pivot +'.*$', 'i');
  }

  if (req.query.name) {
    filters.name = new RegExp('^.*?'+ req.query.name +'.*$', 'i');
  }

  req.app.db.models.Spreadsheet.pagedFind({
    filters: filters,
    keys: 'pivot name googleId activeSheet sheets',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('crud/spreadsheets/index', { data: { results: escape(JSON.stringify(results)) } });
    }
  });

});
  
   workflow.emit('validate');
};


exports.read = function(req, res, next){
  req.app.db.models.Spreadsheet.findById(req.params.id).exec(function(err, spreadsheet) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.send(spreadsheet);
    }
    else {

      res.render('crud/spreadsheets/details', { data: { record: escape(JSON.stringify(spreadsheet)) } });
    }
  });
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not create spreadsheets.');
      return workflow.emit('response');
    }

    if (!req.body.pivot) {
      workflow.outcome.errors.push('A pivot is required.');
      return workflow.emit('response');
    }

    if (!req.body.name) {
      workflow.outcome.errors.push('A name is required.');
      return workflow.emit('response');
    }

    workflow.emit('duplicateSpreadsheetCheck');
  });

  workflow.on('duplicateSpreadsheetCheck', function() {
    req.app.db.models.Spreadsheet.findById(req.app.utility.slugify(req.body.pivot +' '+ req.body.name)).exec(function(err, spreadsheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (spreadsheet) {
        workflow.outcome.errors.push('That spreadsheet+pivot is already taken.');
        return workflow.emit('response');
      }

      workflow.emit('createSpreadsheet');
    });
  });

  workflow.on('createSpreadsheet', function() {
    var fieldsToSet = {
      _id: req.app.utility.slugify(req.body.pivot +' '+ req.body.name),
      pivot: req.body.pivot,
      name: req.body.name
      ,googleId: req.body.googleId
      ,activeSheet: req.body.activeSheet
      ,sheets: req.body.sheets,
      isMaster:req.body.isMaster
    };

    req.app.db.models.Spreadsheet.create(fieldsToSet, function(err, spreadsheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = spreadsheet;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not update spreadsheets.');
      return workflow.emit('response');
    }

    if (!req.body.pivot) {
      workflow.outcome.errfor.pivot = 'pivot';
      return workflow.emit('response');
    }

    if (!req.body.name) {
      workflow.outcome.errfor.name = 'required';
      return workflow.emit('response');
    }

    workflow.emit('patchSpreadsheet');
  });

  workflow.on('patchSpreadsheet', function() {
    var fieldsToSet = {
      pivot: req.body.pivot,
      name: req.body.name
      ,googleId: req.body.googleId
      ,activeSheet: req.body.activeSheet
      ,sheetsList: req.body.sheetsList
      ,ownersList:req.body.ownersList,
      apiVersion:req.body.apiVersion,
      isMaster:req.body.isMaster
    };
   

    req.app.db.models.Spreadsheet.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, spreadsheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.spreadsheet = spreadsheet;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete spreadsheets.');
      return workflow.emit('response');
    }

    workflow.emit('deleteSpreadsheet');
  });

  workflow.on('deleteSpreadsheet', function(err) {
    req.app.db.models.Spreadsheet.findByIdAndRemove(req.params.id, function(err, spreadsheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
