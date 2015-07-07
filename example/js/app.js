(function(angular) {
    var eskbApp = angular.module('smeApp', [

        /* angular modules */
        'ngRoute',
        'ngStorage',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'smeControllers'
    ]);

    eskbApp.config(['$logProvider',
        '$routeProvider',
        '$httpProvider',
        'es.Services.WebApiProvider',
        '$exceptionHandlerProvider',
        function($logProvider, $routeProvider, $httpProvider, esWebApiServiceProvider, $exceptionHandlerProvider) {

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
                });


            var interceptor = ['$q', '$sessionStorage', '$timeout', '$location', function($q, $sessionStorage, $timeout, $location) {
                function handleRelogin(rejection) {
                    alert("Your session has expired or is invalid. Please relogin");

                    delete $sessionStorage.__esrequest_sesssion;
                    $location.path("/");

                }
                var httpHandlers = {
                    401: handleRelogin,
                    403: handleRelogin
                };

                return {
                    request: function(config) {
                        return config;
                    },

                    response: function(response) {
                        return response;
                    },

                    responseError: function(rejection) {

                        if (httpHandlers.hasOwnProperty(rejection.status)) {
                            httpHandlers[rejection.status].call(rejection);
                        }

                        return $q.reject(rejection);
                    }
                };
            }];
            $httpProvider.interceptors.push(interceptor);


            $logProvider.addDefaultAppenders();
            $exceptionHandlerProvider.setPushToServer(true);
            $exceptionHandlerProvider.setLogServer("Azure");

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                //host: "eswebapialp.azurewebsites.net",
                //host: "eswebapi.entersoft.gr",
                host: "localhost/eswebapi",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });

            // $logProvider.addESWebApiAppender(esWebApiServiceProvider.getServerUrl(), subscriptionId);

        }
    ]);

})(window.angular);
