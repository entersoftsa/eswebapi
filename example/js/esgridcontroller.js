'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);

smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'es.Services.Messaging', 'es.Services.WebApi',
    function($location, $scope, $log, esMessaging, esWebApiService) {

        $scope.odscinfo = null;
        $scope.press = function() {
            esWebApiService.fetchOdsTableInfo("ESFICustomer").success(function(x) {
                $scope.odscinfo = x;
            });
        };

        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, b, c) {
            $scope.esnotify.error("WOOOOOOOOPS");
        });
    }
]);

smeControllers.controller('loginCtrl', ['$location', '$rootScope', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
        $scope.credentials = {
            UserID: 'sme',
            Password: 'smekonren',
            BranchID: 'ΑΘ',
            LangID: 'el-GR'
        };

        $scope.version = {};

        $scope.doLogin = function() {


            esWebApiService.openSession($scope.credentials)
                .then(function(rep) {
                    $location.path("/pq");
                }, function(rejection) {
                    var msg = rejection.data ? rejection.data.UserMessage : "Generic Server Error";
                    $scope.esnotify.error(msg);
                });
        }

    }
]);

smeControllers.controller('propertiesCtrl', ['$location', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.getVersionInfo = function() {
            $scope.version = {};

            $scope.esAngularVersion = esGlobals.getVersion();

            esWebApiService.fetchServerCapabilities().then(function(data) {
                $scope.version.esWebAPIVersion = data.WebApiVersion;

                esWebApiService.fetchSessionInfo()
                    .success(function(data) {
                        $scope.version.esEBSVersion = data;
                    });
            });
        };

        $scope.getVersionInfo();
    }
]);

smeControllers.controller('pqCtrl', ['$location', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.GroupID = "ESFICustomer";
        $scope.FilterID = "ESFITradeAccountCustomer_def";
        $scope.gridOptions = null;
        $scope.pVals = null;

        $scope.doRun = function() {

            alert("Running with " + JSON.stringify($scope.pVals.getExecuteVals()));
            $scope.gridOptions.dataSource.read();

        }
    }
]);
