/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.Spreadsheet = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/crud/spreadsheets/'+ this.id +'/';
    },
    publicUrl: function() {
      return '/spreadsheets/'+ this.id +'/';
    }
  });

  app.Delete = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {}
    },
    url: function() {
      return '/crud/spreadsheets/'+ app.mainView.model.id +'/';
    }
  });

  app.Details = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      pivot: '',
	  googleId: '',
	  activeSheet: '',
	  sheetsList: '',
        ownersList:'',
        name: '',
        apiVersion:'',
        parentId:'',
        isMAster:''
    },
    url: function() {
      return '/crud/spreadsheets/'+ app.mainView.model.id +'/';
    },
    parse: function(response) {
      if (response.spreadsheet) {
        app.mainView.model.set(response.spreadsheet);
        delete response.spreadsheet;
      }

      return response;
    }
  });

  app.HeaderView = Backbone.View.extend({
    el: '#header',
    template: _.template( $('#tmpl-header').html() ),
    initialize: function() {
      this.model = app.mainView.model;
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    render: function() {
      
      this.$el.html(this.template( this.model.attributes ));
    }
  });

  app.DetailsView = Backbone.View.extend({
    el: '#details',
    template: _.template( $('#tmpl-details').html() ),
    events: {
      'click .btn-update': 'update'
    },
    initialize: function() {
      this.model = new app.Details();
      this.syncUp();
      this.listenTo(app.mainView.model, 'change', this.syncUp);
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    syncUp: function() {
      this.model.set({
        _id: app.mainView.model.id,
        sheets: app.mainView.model.get('sheetsList'),
        ownersList:app.mainView.model.get('ownersList'),
        apiVersion:app.mainView.model.get('apiVersion'),
		    activeSheet: app.mainView.model.get('activeSheet'),
		    googleId: app.mainView.model.get('googleId'),
		    pivot: app.mainView.model.get('pivot'),
        name: app.mainView.model.get('name'),
        parentId:app.mainView.model.get('parentId'),
        isMaster:app.mainView.model.get('isMaster')
      });
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
           this.$el.find('[name="'+ key +'"]').val(this.model.attributes[key]);
        }
      }
    },
    update: function() {
     
      var sheetsList=this.$el.find('[name="sheets"]').val();
      sheetsList=sheetsList.split(',');
      sheetsList=_.uniq(sheetsList);

      var ownersList=this.$el.find('[name="owners"]').val();
      ownersList=ownersList.split(',');
      ownersList=_.uniq(ownersList);
      this.model.save({
        sheetsList: sheetsList,
        ownersList:ownersList,
		activeSheet: this.$el.find('[name="activeSheet"]').val(),
		googleId: this.$el.find('[name="googleId"]').val(),
		pivot: this.$el.find('[name="pivot"]').val(),
    name: this.$el.find('[name="name"]').val(),
    apiVersion:this.$el.find('[name="apiVersion"]').val(),
    parentId:this.$el.find('[name="parentId"]').val(),
    isMaster:this.$el.find('[name="isMaster"]').val()
      });
    }
  });

  app.DeleteView = Backbone.View.extend({
    el: '#delete',
    template: _.template( $('#tmpl-delete').html() ),
    events: {
      'click .btn-delete': 'delete',
    },
    initialize: function() {
      this.model = new app.Delete({ _id: app.mainView.model.id });
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
    },
    delete: function() {
      if (confirm('Are you sure?')) {
        this.model.destroy({
          success: function(model, response) {
            if (response.success) {
              location.href = '/crud/spreadsheets/';
            }
            else {
              app.deleteView.model.set(response);
            }
          }
        });
      }
    }
  });

  app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.model = new app.Spreadsheet( JSON.parse( unescape($('#data-record').html()) ) );

      app.headerView = new app.HeaderView();
      app.detailsView = new app.DetailsView();
      app.deleteView = new app.DeleteView();
    }
  });

  $(document).ready(function() {
    app.mainView = new app.MainView();
  });
}());
