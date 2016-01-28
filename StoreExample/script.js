(function(angular) {
    'use strict';

    var esApp = angular.module('esStoreAssistantApp', [
        /* angular modules */
        'ui.router',
        'ngStorage',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'esAppControllers'
    ]);

    esApp.config(['$logProvider', '$stateProvider', '$urlRouterProvider', 'esWebApiProvider',
        function($logProvider, $stateProvider, $urlRouterProvider, esWebApiServiceProvider) {

            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: 'login.html',
                    controller: 'loginCtrl'
                })
                .state('priceCheck', {
                    url: "/priceCheck",
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

    esControllers.controller('esMainCtrl', ['$state', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals',
        function($state, $scope, $log, esMessaging, esWebApiService, esGlobals) {

            $scope.theGlobalUser = "Account";

            $scope.logout = function() {
                esWebApiService.logout()
                .then(function() {
                    alert("You are logged out");    
                });
            }

            esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
                var s = esGlobals.getUserMessage(rejection, status);
                if (s.isLogin) {
                    alert(s.messageToShow)
                    $state.transitionTo("login");
                }
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

    esControllers.controller('loginCtrl', ['$state', '$rootScope', '$scope', '$log', 'esWebApi',
        function($state, $rootScope, $scope, $log, esWebApiService) {
            $scope.credentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };
            
            $scope.doLogin = function() {
                esWebApiService.openSession($scope.credentials)
                .then(function(rep) {
                        $state.transitionTo("priceCheck");
                    },
                    function(err) {
                        var s = esGlobals.getUserMessage(err);
                        if (!s.isLogin) {
                            alert(s.messageToShow)
                        }
                    });
            }
        }
    ]);

    esControllers.controller('priceCheckCtrl', ['$state', '$rootScope', '$scope', '$log', 'esGlobals', 'esWebApi',
        function($state, $rootScope, $scope, $log, esGlobals, esWebApi) {
            $scope.searchCode = "";
            $scope.isWorking = false;
            $scope.stockRecord = null;
            $scope.scannedValue = "";

            var pqOptions = new esGlobals.ESPQOptions(-1, -1, true);
            var codeParam = new esGlobals.ESParamVal("Code", $scope.searchCode);
            var params = new esGlobals.ESParamValues([codeParam]);
            var pqDef = new esGlobals.ESPublicQueryDef("", "ESMMStockItem", "PriceCheckMobile", pqOptions, params);

            $scope.processColumnName = function(x) {
                if (!x) {
                    return '';
                }
                return x.replace(/d\d+_/, '');
            };


            $scope.submit = function() {
                $scope.isWorking = true;
                $scope.stockRecord = {};
                $scope.scannedValue = $scope.searchCode;

                codeParam.pValue($scope.searchCode);

                esWebApi.fetchPublicQuery(pqDef, "", null, null, 'POST')
                    .then(function(ret) {
                            $scope.isWorking = false;
                            $scope.searchCode = "";

                            var pqResult = ret.data;
                            if (pqResult) {
                                switch (pqResult.Count) {
                                    case 0:
                                        {
                                            alert("Not Found");
                                        }
                                        break;
                                    case 1:
                                        {
                                            $scope.stockRecord = pqResult.Rows[0];
                                        }
                                        break;
                                    default:
                                        {
                                            alert("More than 1 found");
                                        }
                                        break;
                                }
                            }

                        },
                        function(err) {
                            $scope.isWorking = false;
                            $scope.searchCode = "";

                            var s = esGlobals.getUserMessage(err);
                            if (!s.isLogin) {
                                alert(s.messageToShow)
                            }

                        });
            }
        }
    ]);

})
(window.angular);
