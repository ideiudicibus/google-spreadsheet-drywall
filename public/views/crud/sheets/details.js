/* global app:true */
(function() {
  'use strict';

  app = app || {};

  app.Sheet = Backbone.Model.extend({
    idAttribute: '_id',
    url: function() {
      return '/crud/sheets/'+ this.id +'/';
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
      return '/crud/sheets/'+ app.mainView.model.id +'/';
    }
  });

  app.Details = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      pivot: '',
	  spreadsheetId: '',
	  params: '',
      name: '',
      textNote:''
    },
    url: function() {
      return '/crud/sheets/'+ app.mainView.model.id +'/';
    },
    parse: function(response) {
      if (response.sheet) {
        app.mainView.model.set(response.sheet);
        delete response.sheet;
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
        params: app.mainView.model.get('params'),
		spreadsheetId: app.mainView.model.get('spreadsheetId'),
		pivot: app.mainView.model.get('pivot'),
        name: app.mainView.model.get('name'),
        textNote:app.mainView.model.get('textNote')
      });
     
    },
    render: function() {

      this.$el.html(this.template( this.model.attributes ));

      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="'+ key +'"]').val(this.model.attributes[key]);
         
        }
      }
       this.$el.find('[id="textNote"]').summernote({height:200});
    },
    update: function() {
     
      this.model.save({
        params: this.$el.find('[name="params"]').val(),
	  spreadsheetId: this.$el.find('[name="spreadsheetId"]').val(),
	  pivot: this.$el.find('[name="pivot"]').val(),
        name: this.$el.find('[name="name"]').val(),
        textNote: this.$el.find('[name="textNote"]').code()
        //code() method is from summernote...
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
              location.href = '/crud/sheets/';
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
      this.model = new app.Sheet( JSON.parse( unescape($('#data-record').html()) ) );

      app.headerView = new app.HeaderView();
      app.detailsView = new app.DetailsView();
      app.deleteView = new app.DeleteView();
    }
  });

  $(document).ready(function() {
    
    app.mainView = new app.MainView();
    

  });
}());
