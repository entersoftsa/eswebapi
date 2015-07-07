'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);

// smeControllers.controller('mainCtrl', ['$location', '$rootScope', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
//     function($location, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
        
//         $scope.press = function() {
//             $scope.esnotify.show("Hello", "info");
//         }
//     }
// ]);

smeControllers.controller('loginCtrl', ['$location', '$rootScope', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
        $scope.credentials = {
            UserID: 'sme',
            Password: 'smekonren',
            BranchID: 'ΑΘ',
            LangID: 'el-GR'
        };

        $scope.doLogin = function() {

            esWebApiService.openSession($scope.credentials)
                .success(function($user, status, headers, config) {
                    $location.path("/pq");

                })
                .error(function(rejection) {
                    var msg = rejection ? rejection.UserMessage : "Generic server error";
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

                esWebApiService.fetchSessionInfo().success(function(data) {
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

        $scope.doRun = function() {
            alert("Run");
            $scope.gridOptions.dataSource.read();
        }
    }
]);
