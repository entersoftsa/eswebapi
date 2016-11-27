(function(angular) {
    'use strict';

    var esApp = angular.module('esWebPqApp', [
        /* angular modules */
        'ngStorage',
        'ui.router',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'kendo.directives',
        'underscore',
        'es.Web.UI',
        'ui.bootstrap',
        'uiGmapgoogle-maps'
    ]);


    esApp.config(['$logProvider', 'esWebApiProvider', 'uiGmapGoogleMapApiProvider', '$translateProvider',
        function($logProvider, esWebApiServiceProvider, GoogleMapApiProvider, $translateProvider) {

            var settings = window.esWebApiSettings;
            esWebApiServiceProvider.setSettings(settings);

            $translateProvider.useStaticFilesLoader({
                files: [{
                    prefix: 'languages/eswebapi-locale-',
                    suffix: '.json'
                }]
            });
            $translateProvider.preferredLanguage('el');
            $translateProvider.fallbackLanguage('en');
            $translateProvider.useSanitizeValueStrategy('escape');

            GoogleMapApiProvider.configure({
                key: "AIzaSyDCds_w5v7aruDExi6j-mAldpyBi3IwQFk",
                libraries: 'weather,geometry,visualization'
            });
        }
    ]);

    function doPrepareCtrl($scope, esMessaging, esGlobals) {
        $scope.isReady = false;


        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            alert(s.messageToShow)
        });

        esGlobals.getESUISettings().mobile = window.esDeviceMode;
        esGlobals.getESUISettings().defaultGridHeight = window.esGridHeight;
    }

    function doLogin($scope, esGlobals, esWebApiService, runOnSuccess) {
        if (window.esWebApiToken) {
            esGlobals.setWebApiToken(window.esWebApiToken);
            if (angular.isFunction(runOnSuccess)) {
                runOnSuccess();
            }
            $scope.isReady = true;

        }
    }

    esApp.controller('esComponentCtrl', ['$scope', '$log', '$window', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', 'uiGmapGoogleMapApi',
        function($scope, $log, $window, esMessaging, esWebApiService, esWebUIHelper, esGlobals, GoogleMapApi) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var brseLang = $window.navigator.language || $window.navigator.userLanguage;

            $scope.esCredentials = {};

            $scope.esCredentials.LangID = esGlobals.suggestESLanguageID(brseLang);

            $scope.authenticate = function() {
                esWebApiService.openSession($scope.esCredentials)
                    .then(function(rep) {
                            window.esWebApiToken = esGlobals.getWebApiToken();
                            runOnSuccess();
                            $scope.isReady = true;
                        },
                        function(err) {
                            $scope.isReady = false;
                            var s = esGlobals.getUserMessage(err);
                        });

            };

            var runOnSuccess = function() {
                var xDef;
                if (!angular.isArray(window.esDef)) {
                    xDef = new esGlobals.ESPublicQueryDef().initFromObj(window.esDef);
                } else {
                    xDef = _.map(esDashboardDefinitions, function(x) {
                        var pqDef = new esGlobals.ESPublicQueryDef().initFromObj(x.esDef);
                        qDef.ESUIType = x.ESUIType.toLowerCase();
                        pqDef.AA = x.AA;
                        return pqDef;
                    });
                }
                $scope.esPqDef = xDef;
            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);

})
(window.angular);