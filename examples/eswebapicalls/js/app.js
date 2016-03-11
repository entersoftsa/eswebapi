(function(angular) {
    var eskbApp = angular.module('smeApp', [

        /* angular modules */
        'ngRoute',
        'ngStorage',
        'ui.bootstrap',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'smeControllers'
    ]);

    eskbApp.config(['$logProvider',
        '$routeProvider',
        'esWebApiProvider',
        '$exceptionHandlerProvider',
        function($logProvider, $routeProvider, esWebApiServiceProvider, $exceptionHandlerProvider) {

            $routeProvider
                .when('/', {
                    templateUrl: 'login.html',
                    controller: 'loginCtrl'
                })
                .when('/login', {
                    templateUrl: 'login.html',
                    controller: 'loginCtrl'
                })
                .when('/properties', {
                    templateUrl: 'properties.html',
                    controller: 'propertiesCtrl'
                })
                .when('/pq', {
                    templateUrl: 'pq.html',
                    controller: 'pqCtrl'
                })
                .when('/webpq', {
                    templateUrl: 'webpq.html',
                    controller: 'webpqCtrl'
                })
                .when('/masdetpq', {
                    templateUrl: 'masdetpq.html',
                    controller: 'masdetpqCtrl'
                })
                .when('/opportunities', {
                    templateUrl: 'opportunities.html',
                    controller: 'opportunitiesCtrl'
                })
                .when('/examples', {
                    templateUrl: 'examples.html',
                    controller: 'examplesCtrl'
                })
                .when('/survey', {
                    templateUrl: 'survey.html',
                    controller: 'surveyCtrl'
                })
                .when('/maps', {
                    templateUrl: 'maps.html',
                    controller: 'mapsCtrl'
                })
                .when('/salesforce', {
                    templateUrl: 'sales.html'
                });

            $logProvider.addDefaultAppenders();
            $exceptionHandlerProvider.setPushToServer(true);
            $exceptionHandlerProvider.setLogServer("Azure");

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                //host: "localhost/eswebapijti",
                "host" : "192.168.1.190/Entersoft.Web.Api",
                //host: "10.211.55.7/esapi04032016",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });

            $logProvider.addESWebApiAppender(esWebApiServiceProvider.getServerUrl(), subscriptionId);

        }
    ]);

})(window.angular);
