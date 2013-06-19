//    Metrobone.js 0.0.1
//
//    J.R. Tipton @jrtipton
//    Metrobone is a wimpy little utility library for
//    making Backbone.js integrate with WinJS controls
//    (for Windows 8 development) a little easier.
//
//    Two basic ways to use this overly verbose little
//    guy:
//
//    {
//      var proxy = new Metrobone.DataSource( myBackboneCollectionInstance );
//      var control = getMyListViewControl();
//
//      control.itemDataSource = proxy.datasource();
//    }
//
//    Or:
//
//    {
//      getMyListViewControl().itemDataSource = Metrobone.proxyCollection( myBackboneCollectionInstance );
//    }
//

(function () {

  // Initial setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `Metrobone` variable
  // in order to do `noConflict` properly.
  var previousMetrobone = root.Metrobone;

  // The top-level namespace. All public Metrobone classes
  // and modules will dangle from this.
  var Metrobone;
  if (typeof exports !== 'undefined') {
    Metrobone = exports;
  } else {
    Metrobone = root.Metrobone = {};
  }

  Metrobone.VERSION = '0.0.1';

  // Metrobone requires Backbone.
  var B = root.Backbone;

  Metrobone.setBackbone= function (lib) {
    B = lib;
  }

  Metrobone.noConflict = function () {
    root.Metrobone = previousMetrobone;
    return this;
  }

  // Metrobone.DataSource
  // --------------------

  // Acts as a proxy object for communicating the contents
  // and changes of a Backbone Collection to listeners of
  // WinJS data sources. A motivating example: if you have
  // a Backbone Collection that you want to render into a
  // WinJS.UI.ListView control, create a Metrobone.DataSource
  // against the Backbone.Collection and it will reflect the
  // contents (through its datasource() object).
  //
  // [ ListView ] <- [ Metrobone.DataSource ] <- [ Backbone.Collection ]
  var DataSource = Metrobone.DataSource = function (collection, options) {
    this.collection = collection;
    this.list = new WinJS.Binding.List([]);
    this.connected = false;
    this.initialize.apply(this, arguments);
  };

  _.extend(DataSource.prototype, {

    initialize: function () {
    },

    datasource: function () {
      return this.connect().dataSource;
    },

    connect: function () {
      // When something in the Backbone collection changes,
      // notify the WinJS object that knows how to signal
      // the changes to any listeners.
      this.collection.on('change', function (model) {
        this.list.setAt(this.list.indexOf(model), model);
      }, this);

      // When something is added to the Backbone collection,
      // add it to the WinJS object as well.
      this.collection.on('add', function (model) {
        this.list.push(model);
      }, this);
      this.collection.on('remove', function (model) {
        this.list.splice(this.list.indexOf(model), 1);
      }, this);

      this.collection.on('reset', function (col) {
        while (this.list.length) {
          this.list.pop();
        }
        this.collection.each(function (e) {
          this.list.push(e);
        }, this);
      }, this);

      // Add the contents of the Backbone collection to the
      // WinJS object now.
      this.collection.each(function (e) {
        this.list.push(e);
      }, this);

      this.connected = true;

      return this.list;
    },

    disconnect: function () {
      this.connected = false;
      this.collection.off(null, null, this);
    }
  });

  Metrobone.proxyCollection = function (coll) {
    var ds = new Metrobone.DataSource(coll);
    return ds.datasource();
  }

}).call(this);
