'use strict';

/**
 * @ngdoc overview
 * @name MaterialApp
 * @description
 * # MaterialApp
 *
 * Main module of the application.
 */
window.app_version = 2.0;

angular
    .module('MaterialApp', [
        'ui.router',
        'ngAnimate',
        'ngMaterial',
        'ngStorage',
        'chart.js',
        'gridshore.c3js.chart',
        'angular-growl',
        'growlNotifications',
        'angular-loading-bar',
        'easypiechart',
        'ui.sortable',
        angularDragula(angular),
        'bootstrapLightbox',
        'materialCalendar',
        'paperCollapse',
        'pascalprecht.translate',

        'kendo.directives',
        'underscore',
        'es.Web.UI',
        'ui.bootstrap',
        'uiGmapgoogle-maps',
        'ngFileUpload',
        'es.Services.Web',
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 5;
        cfpLoadingBarProvider.includeSpinner = false;
    }])

.config(['uiGmapGoogleMapApiProvider', function(GoogleMapApi) {
    GoogleMapApi.configure({
        //    key: 'your api key',
        // v: '3.20',
        libraries: 'weather,geometry,visualization'
    });
}])

.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
})

.config(['$logProvider', 'esWebApiProvider',
    function($logProvider, esWebApiServiceProvider) {


        $logProvider.addDefaultAppenders();

        var subscriptionId = "";
        esWebApiServiceProvider.setSettings({
            "host": "192.168.1.190/eswebapijti",
            subscriptionId: subscriptionId,
            subscriptionPassword: "passx",
            allowUnsecureConnection: true
        });
    }
])

.run(['$rootScope', '$location', '$state', 'esGlobals', function($rootScope, $location, $state, esGlobals) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (!esGlobals.isAuthenticated()) {

            var ts = toState || {};
            if (!ts.esUnauthenticated) {
                event.preventDefault();
                $state.go('login');
            }
        }
    });
}])

.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/home');
    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
        .state('base', {
            abstract: true,
            url: '',
            templateUrl: 'views/base.html?v=' + window.app_version,
            controller: 'DashboardCtrl'
        })
        .state('login', {
            url: '/login',
            parent: 'base',
            templateUrl: 'views/pages/login.html?v=' + window.app_version,
            controller: 'LoginCtrl',
            esUnauthenticated: true
        })
        .state('signup', {
            url: '/signup',
            parent: 'base',
            templateUrl: 'views/pages/signup.html?v=' + window.app_version,
            controller: 'LoginCtrl',
            esUnauthenticated: true
        })
        .state('404', {
            url: '/404-page',
            parent: 'base',
            templateUrl: 'views/pages/404-page.html?v=' + window.app_version,
            esUnauthenticated: true
        })
        .state('dashboard', {
            url: '/dashboard',
            parent: 'base',
            templateUrl: 'views/layouts/dashboard.html?v=' + window.app_version,
            controller: 'DashboardCtrl'
        })
        .state('home', {
            url: '/home',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/home.html?v=' + window.app_version,
            controller: 'HomeCtrl'
        })
        .state('blank', {
            url: '/blank',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/blank.html?v=' + window.app_version,
            controller: 'mapsCtrl'
        })
        .state('profile', {
            url: '/profile',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/profile.html?v=' + window.app_version,
            controller: 'profileCtrl'
        })
        .state('form', {
            url: '/form',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/form.html?v=' + window.app_version,
            controller: 'formCtrl'
        })

    .state('button', {
            url: '/ui-elements/button',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/ui-elements/button.html?v=' + window.app_version
        })
        .state('card', {
            url: '/ui-elements/card',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/ui-elements/card.html?v=' + window.app_version,
            controller: 'cardCtrl'
        })
        .state('components', {
            url: '/ui-elements/components',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/component.html?v=' + window.app_version,
            controller: 'componentCtrl'
        })
        .state('chartjs', {
            url: '/charts/chart.js',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/charts/chartjs.html?v=' + window.app_version,
            controller: 'ChartCtrl'
        })
        .state('c3chart', {
            url: '/charts/c3chart',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/charts/c3chart.html?v=' + window.app_version
        })
        .state('calendar', {
            url: '/calendar',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/calendar.html?v=' + window.app_version,
            controller: 'surveyCtrl'
        })
        .state('invoice', {
            url: '/invoice',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/invoice.html?v=' + window.app_version
        })
        .state('inbox', {
            url: '/mail/inbox',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/mail/inbox.html?v=' + window.app_version,
            controller: 'paperCtrl'
        })
        .state('docs', {
            url: '/docs',
            parent: 'dashboard',
            templateUrl: 'views/pages/dashboard/docs.html?v=' + window.app_version,
            controller: 'docsCtrl',
            esUnauthenticated: true
        });
});