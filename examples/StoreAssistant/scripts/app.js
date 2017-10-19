/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    // Create the Angular app.
    var storeApp = angular.module('esStoreAssistant', [
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'ngStorage',
        'angular-loading-bar',
        'pascalprecht.translate',
        'es.Services.Web',
        'kendo.directives',
        'underscore',
        'es.Web.UI',
        'ui.bootstrap'
    ]);

    var version = "1.0.5";
    storeApp.esVersion = version;

    // Configure the Angular app.
    storeApp.config(['$logProvider', 'esWebApiProvider', '$translateProvider',
        function($logProvider, esWebApiServiceProvider, $translateProvider) {
            $translateProvider.useStaticFilesLoader({
                files: [{
                    prefix: 'languages/eswebapi-locale-',
                    suffix: '.json'
                },  {
                    prefix: 'applanguages/',
                    suffix: '.json'
                }]
            });
            $translateProvider.preferredLanguage('el');
            $translateProvider.fallbackLanguage('en');
            $translateProvider.useSanitizeValueStrategy('escape');

            $logProvider.addDefaultAppenders();

            
            var settings = {
                host: "eswebapi.entersoft.gr",
                allowUnsecureConnection: false
            };
            esWebApiServiceProvider.setSettings(settings);
        }
    ]);

    

    storeApp.run(['$log', '$rootScope', '$state', 'esGlobals',
        function($log, $rootScope, $state, esGlobals) {
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {

                    var s = esGlobals.getUserMessage(error);
                    if (s.isLogin) {
                        $state.go('login');
                        return;
                    }
                    event.preventDefault();

                });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                var ts = toState || {};
                if (!ts.esUnauthenticated && toState != 'login') {
                    $rootScope.toState = toState;
                    $rootScope.toStateParams = toParams;

                    if (!esGlobals.isAuthenticated()) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });

            $state.go('login');
        }
    ]);



    storeApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.when('/', '/login');

        $stateProvider
            
            .state('appmenu', {
                abstract: true,
                url: '',
                templateUrl: 'views/appmenu.html'
            })
            .state('login', {
                url: '/login',
                
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login',
                esUnauthenticated: true
            })
            .state('customer_search', {
                url: '/customer_search',
                parent: "appmenu",
                templateUrl: 'views/customer_search.html',
                controller: 'customer_searchCtrl',
                controllerAs: 'vm',
                esUnauthenticated: false
            })
            .state('customer_new', {
                url: '/customer_new',
                parent: "appmenu",
                templateUrl: 'views/customer_new.html',
                controller: 'customer_newCtrl',
                controllerAs: 'vm',
                esUnauthenticated: false
            })
            .state('storeSales', {
                url: '/storeSales',
                parent: "appmenu",
                templateUrl: 'views/storesales.html',
                controller: 'storeSalesCtrl',
                controllerAs: 'vm',
                esUnauthenticated: false
            })
            .state('skuAvailability', {
                url: '/skuAvailability',
                parent: "appmenu",
                templateUrl: 'views/sku_availability.html',
                controller: 'sku_AvailabilityCtrl',
                controllerAs: 'vm',
                esUnauthenticated: false
            })
            .state('sales', {
                url: '/sales',
                parent: "appmenu",
                templateUrl: 'views/sales.html',
                esUnauthenticated: false
            });
    }]);

})();
