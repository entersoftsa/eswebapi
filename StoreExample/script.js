(function(angular) {
    'use strict';

    var esApp = angular.module('esStoreAssistantApp', [
        /* angular modules */
        'ngRoute',
        'ngStorage',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'esAppControllers'
    ]);

    esApp.config(['$logProvider', '$routeProvider', 'esWebApiProvider',
        function($logProvider, $routeProvider, esWebApiServiceProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'login.html',
                    controller: 'loginCtrl'
                })
                .when('/login', {
                    templateUrl: 'login.html',
                    controller: 'loginCtrl'
                })
                .when('/priceCheck', {
                    templateUrl: 'pricecheck.html',
                    controller: 'priceCheckCtrl'
                });

            $logProvider.addDefaultAppenders();

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                "host": "192.168.1.190/eswebapijti",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });
        }
    ]);



    /* Controllers */

    var esControllers = angular.module('esAppControllers', ['underscore']);

    esControllers.controller('esMainCtrl', ['$location', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals',
        function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

            $scope.theGlobalUser = "Account";

            esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
                var s = esGlobals.getUserMessage(rejection, status);
                $scope.esnotify.error(s);
            });

            esMessaging.subscribe("AUTH_CHANGED", function(esSession, b) {
                if (!b) {
                    $scope.theGlobalUser = "Account";
                    return;
                }

                $scope.theGlobalUser = esSession.connectionModel.Name;
            });
        }
    ]);

    esControllers.controller('loginCtrl', ['$location', '$rootScope', '$scope', '$log', 'esWebApi',
        function($location, $rootScope, $scope, $log, esWebApiService) {
            $scope.credentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };

            $scope.doLogin = function() {
                ($scope.stickyMode ? esWebApiService.stickySession($scope.credentials) : esWebApiService.openSession($scope.credentials))
                .then(function(rep) {
                        $location.path("/priceCheck");
                    },
                    function(err) {
                        alert(err.data.UserMessage);
                    });
            }
        }
    ]);

    esControllers.controller('priceCheckCtrl', ['$location', '$rootScope', '$scope', '$log', 'esGlobals', 'esWebApi',
        function($location, $rootScope, $scope, $log, esGlobals, esWebApi) {
            $scope.searchCode = "";
            $scope.isWorking = false;
            $scope.stockRecord = {};

            var pqOptions = new esGlobals.ESPQOptions(-1, -1, true);
            var codeParam = new esGlobals.ESParamVal("Code", $scope.searchCode);
            var params = new esGlobals.ESParamValues([codeParam]);
            var pqDef = new esGlobals.ESPublicQueryDef("", "ESMMStockItem", "PriceCheckMobile", pqOptions, params);
            

            $scope.submit = function() {
                $scope.isWorking = true;
                $scope.stockRecord = {};

                codeParam.pValue($scope.searchCode);

                esWebApi.fetchPublicQuery(pqDef, "", null, null, 'POST')
                    .then(function(ret) {
                        $scope.isWorking = false;
                        $scope.searchCode = "";

                        var pqResult = ret.data;
                        if (pqResult) {
                            switch(pqResult.Count) {
                                case 0: {
                                    alert("Not Found");
                                }
                                break;
                                case 1: {
                                    $scope.stockRecord = pqResult.Rows[0];
                                }
                                break;
                                default: {
                                    alert("More than 1 found");
                                }
                                break;
                            }
                        }
                        
                    },
                    function(err) {
                        $scope.isWorking = false;
                        $scope.searchCode = "";

                        alert(err.data.UserMessage);

                        if (err.data.MessageID == "IDX10223") {
                            $location.path("/login", false);
                        }
                    });
            }
        }
    ]);

})
(window.angular);
