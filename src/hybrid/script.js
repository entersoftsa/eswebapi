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
    ]);

    esApp.run(['$anchorScroll', function($anchorScroll) {
        window.esGoTo = function(goinpage) {
            if (!goinpage) {
                return;
            }

            $anchorScroll(goinpage);
        }
    }]);


    esApp.config(['$logProvider', 'esWebApiProvider', '$translateProvider',
        function($logProvider, esWebApiServiceProvider, $translateProvider) {

            var settings = window.esWebApiSettings || {
                host: "eswebapi.entersoft.gr"
            };
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
        }
    ]);

    function doPrepareCtrl($scope, esMessaging, esGlobals) {
        $scope.isReady = false;


        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            alert(s.messageToShow);
        });

        esGlobals.getESUISettings().mobile = window.esDeviceMode;
        esGlobals.getESUISettings().defaultGridHeight = window.esGridHeight ? (window.esGridHeight.toString() + "px") : "";

        if (esGlobals.getESUISettings().mobile && window.esGridHeight && window.esGridHeight > 80) {
            esGlobals.getESUISettings().defaultGridHeight = (window.esGridHeight - 80).toString() + "px";
        }
    }

    function doLogin($scope, esGlobals, esWebApiService, runOnSuccess) {
        if (window.esWebApiToken) {
            $scope.ownLogin = false;
            esGlobals.setWebApiToken(window.esWebApiToken);
            if (angular.isFunction(runOnSuccess)) {
                runOnSuccess();
            }
            $scope.isReady = true;
            return;
        }

        if ($scope.esCredentials.subscriptionPassword && $scope.esCredentials.UserID && $scope.esCredentials.Password && $scope.esCredentials.BranchID) {
            $scope.authenticate();
            return;
        }

        $scope.showLogin = true;
    }


    esApp.controller('esComponentCtrl', ['$scope', '$log', '$window', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, $window, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {

            $scope.esCredentials = {};
            $scope.isReady = false;
            $scope.showLogin = false;
            $scope.ownLogin = true;

            if ($window.esWebApiSettings) {
                $scope.esCredentials.subscriptionId = $window.esWebApiSettings.subscriptionId || "";
                $scope.esCredentials.subscriptionPassword = $window.esWebApiSettings.subscriptionPassword || "";
                $scope.esCredentials.UserID = $window.esWebApiSettings.UserID || "";
                $scope.esCredentials.Password = $window.esWebApiSettings.Password || "";
                $scope.esCredentials.bridgeId = $window.esWebApiSettings.bridgeId || "";
                $scope.esCredentials.BranchID = $window.esWebApiSettings.BranchID || "";
                $scope.esCredentials.LangID = $window.esWebApiSettings.LangID || "";
            }
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var brseLang = $window.navigator.language || $window.navigator.userLanguage;

            $scope.esCredentials.LangID = !$scope.esCredentials.LangID ? esGlobals.suggestESLanguageID(brseLang) : $scope.esCredentials.LangID;

            $scope.authenticate = function() {
                var claims = {
                    "ESApplicationID" : "ESMobileReports"
                };

                esWebApiService.openSession($scope.esCredentials, claims)
                    .then(function(rep) {
                            $scope.showLogin = false;
                            window.esWebApiToken = esGlobals.getWebApiToken();
                            runOnSuccess();
                            $scope.isReady = true;

                        },
                        function(err) {
                            $scope.isReady = false;
                            $scope.showLogin = true;
                            var s = esGlobals.getUserMessage(err);
                        });

            };

            var runOnSuccess = function() {

                if (window.esDef.ESUIType.toLowerCase() == 'escombo') {
                    $scope.esPqDef = window.esDef;
                    return;
                } else {
                    $scope.esPqDef = {
                        "AA": 1,
                        "ID": "PQ_1",
                        "ESUIType": "esCombo",
                        "esDef": [window.esDef]
                    };
                }
            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);

})
(window.angular);
