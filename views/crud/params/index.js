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

  req.app.db.models.Param.pagedFind({
    filters: filters,
    keys: 'pivot name value sheetId',
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
      res.render('crud/params/index', { data: { results: escape(JSON.stringify(results)) } });
    }
  });
};

exports.read = function(req, res, next){
  req.app.db.models.Param.findById(req.params.id).exec(function(err, param) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(param);
    }
    else {
      res.render('crud/params/details', { data: { record: escape(JSON.stringify(param)) } });
    }
  });
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not create params.');
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

    workflow.emit('duplicateParamCheck');
  });

  workflow.on('duplicateParamCheck', function() {
    req.app.db.models.Param.findById(req.app.utility.slugify(req.body.pivot +' '+ req.body.name)).exec(function(err, param) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (param) {
        workflow.outcome.errors.push('That param+pivot is already taken.');
        return workflow.emit('response');
      }

      workflow.emit('createParam');
    });
  });

  workflow.on('createParam', function() {
    var fieldsToSet = {
      _id: req.app.utility.slugify(req.body.pivot +' '+ req.body.name),
      pivot: req.body.pivot,
      name: req.body.name
      ,value: req.body.value
      ,sheetId: req.body.sheetId
    };

    req.app.db.models.Param.create(fieldsToSet, function(err, param) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = param;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not update params.');
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

    workflow.emit('patchParam');
  });

  workflow.on('patchParam', function() {
    var fieldsToSet = {
      pivot: req.body.pivot,
      name: req.body.name
      ,value: req.body.value
      ,sheetId: req.body.sheetId
    };

    req.app.db.models.Param.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, param) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.param = param;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete params.');
      return workflow.emit('response');
    }

    workflow.emit('deleteParam');
  });

  workflow.on('deleteParam', function(err) {
    req.app.db.models.Param.findByIdAndRemove(req.params.id, function(err, param) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
