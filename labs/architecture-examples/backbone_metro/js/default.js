// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

var ENTER_KEY = 13;

(function () {
    "use strict";

    jQuery.fn.extend({
        winControl: function () {
            var elem = this[0];
            if (elem) {
                return elem.winControl;
            }
        }
    });

    WinJS.Binding.optimizeBindingReferences = true;

    var application = WinJS.Application;
    var appModel = Windows.ApplicationModel;
    var activation = appModel.Activation;
    var notifications = Windows.UI.Notifications;
    var ui = WinJS.UI;

    application.onactivated = function (args) {
        var appView;
        var rendered = ui.processAll().then(function () {
            appView = new app.AppView();
            return appView.ready;
        });
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(rendered);
        } else if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(rendered.then(function () {
                new WinJS.promise(application.onready).then(function () {
                    app.TodoRouter.navigate('/search/' + args.detail.queryText, { trigger: true });
                });
            }));
        }
    };

    application.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) {
        app.TodoRouter.navigate('/search/' + args.queryText, { trigger: true });
    };

    app.Todos.on('add', function (item) {
        console.log('add: ' + item.toJSON());
        var template = notifications.TileTemplateType.tileSquareText03;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);
        console.log(tileXml);
    });

    application.start();
})();
