var app = app || {};

(function () {
    'use strict';

    // Todo Router
    // ----------
    var Workspace = Backbone.Router.extend({
        routes: {
            'search/(:query)': 'search',
        },

        initialize: function (options) {
            this.route(/^(active|completed|)$/, 'filter', this.setFilter);
        },

        setFilter: function (param) {
            // Set the current filter to be used
            app.SearchRegex = null;
            app.TodoFilter = param || '';

            // Trigger a collection filter event, causing hiding/unhiding
            // of Todo view items
            app.Todos.trigger('filter');
        },

        search: function (query) {
            var regex = query === null ? null : new RegExp(query, 'i');

            app.SearchRegex = regex;
            app.Todos.trigger('filter');
            return;
            // regex.compile();
            var ret = app.Todos.filter(function (todo) {
                console.log('filter: ', todo.get('title'), ' - ', regex.test(todo.get('title')));
                return regex.test(todo.get('title'));
            });
        }
    });

    app.TodoRouter = new Workspace();
    Backbone.history.start();
})();
