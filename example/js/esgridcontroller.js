'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);

smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'es.Services.Messaging', 'es.Services.WebApi', 'es.Services.Globals',
    function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

        $scope.odscinfo = null;
        $scope.press = function() {
            esWebApiService.fetchOdsTableInfo("ESFICustomer").success(function(x) {
                $scope.odscinfo = x;
            });
        };

        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            $scope.esnotify.error(s);
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

        $scope.pqs = [{
            groupId: "ESFICustomer",
            filterId: "ESFITradeAccountCustomer_def",
            gridOptions: null,
            pVals: null
        }, {
            groupId: "ESMMStockItem",
            filterId: "ESMMStockItem_def",
            gridOptions: null,
            pVals: null
        }];


        $scope.doRun = function(pq) {
            pq.gridOptions.dataSource.read();

        }
    }
]);
