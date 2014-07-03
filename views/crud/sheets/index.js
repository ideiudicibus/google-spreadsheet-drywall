'use strict';

exports.find = function(req, res, next){



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

  req.app.db.models.Sheet.pagedFind({
    filters: filters,
    keys: 'pivot name spreadsheetId params',
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
      res.render('crud/sheets/index', { data: { results: escape(JSON.stringify(results)) } });
    }
  });
};

exports.read = function(req, res, next){


  req.app.db.models.Sheet.findById(req.params.id).exec(function(err, sheet) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(sheet);
    }
    else {
      res.render('crud/sheets/details', { data: { record: escape(JSON.stringify(sheet)) } });
    }
  });
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not create sheets.');
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

    workflow.emit('duplicateSheetCheck');
  });

  workflow.on('duplicateSheetCheck', function() {
    req.app.db.models.Sheet.findById(req.app.utility.slugify(req.body.pivot +' '+ req.body.name)).exec(function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (sheet) {
        workflow.outcome.errors.push('That sheet+pivot is already taken.');
        return workflow.emit('response');
      }

      workflow.emit('createSheet');
    });
  });

  workflow.on('createSheet', function() {
    var fieldsToSet = {
      _id: req.app.utility.slugify(req.body.pivot +' '+ req.body.name),
      pivot: req.body.pivot,
      name: req.body.name
      ,spreadsheetId: req.body.spreadsheetId
      ,params: req.body.params
    };

    req.app.db.models.Sheet.create(fieldsToSet, function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = sheet;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not update sheets.');
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

    workflow.emit('patchSheet');
  });

  workflow.on('patchSheet', function() {
    var fieldsToSet = {
      pivot: req.body.pivot,
      name: req.body.name
      ,spreadsheetId: req.body.spreadsheetId
      ,params: req.body.params
      ,textNote:req.body.textNote
    };

    req.app.db.models.Sheet.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.outcome.sheet = sheet;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete sheets.');
      return workflow.emit('response');
    }

    workflow.emit('deleteSheet');
  });

  workflow.on('deleteSheet', function(err) {
    req.app.db.models.Sheet.findByIdAndRemove(req.params.id, function(err, sheet) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
