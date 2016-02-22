(function(angular) {
    'use strict';

    var esApp = angular.module('esWebPqApp', [
        /* angular modules */
        'ngStorage',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'kendo.directives',
        'underscore',
        'es.Web.UI',
        'ui.bootstrap',
        'uiGmapgoogle-maps'
    ]);

    esApp.config(['$logProvider', 'esWebApiProvider', 'uiGmapGoogleMapApiProvider',
        function($logProvider, esWebApiServiceProvider, GoogleMapApiProvider) {

            var settings = window.esWebApiSettings;
            esWebApiServiceProvider.setSettings(settings);

            GoogleMapApiProvider.configure({
                //    key: 'your api key',
                // v: '3.20',
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

        } else {
            var credentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };
            esWebApiService.openSession(credentials)
                .then(function(rep) {
                        if (angular.isFunction(runOnSuccess)) {
                            runOnSuccess();
                        }
                        $scope.isReady = true;
                    },
                    function(err) {
                        var s = esGlobals.getUserMessage(err);
                        if (!s.isLogin) {
                            alert(s.messageToShow)
                        }
                    });
        }
    }

    /* Controllers */
    esApp.controller('testCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);


            $scope.params = new esGlobals.ESParamValues([new esGlobals.ESParamVal("ClosingDate", 3)]);

            $scope.esParamDef = {
                required: true,
                id: "ClosingDate",
                enumList: [{ text: 'Option 1', value: 0 }, { text: 'Option 2', value: 1 }, { text: 'Option 3', value: 2 }, { text: 'Correct !!!', value: 3 }]
            };

            $scope.cVal = 3;

            doLogin($scope, esGlobals, esWebApiService);
        }
    ]);

    esApp.controller('esChartCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var runOnSuccess = function() {
                var gID = window.esDef.GroupID;
                var fID = window.esDef.FilterID;
                $scope.esPqDef = new esGlobals.ESPublicQueryDef("", gID, fID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
                $scope.esPqDef.options = window.esDef.options;
            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);

    esApp.controller('esGridCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var runOnSuccess = function() {
                var gID = window.esDef.GroupID;
                var fID = window.esDef.FilterID;

                $scope.esPqDef = new esGlobals.ESPublicQueryDef("", gID, fID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
                $scope.esPqDef.serverSidePaging = window.esDef.ServerSidePaging;
            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);

    esApp.controller('esMapCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', 'uiGmapGoogleMapApi',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals, GoogleMapApi) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var runOnSuccess = function() {
                var gID = window.esDef.GroupID;
                var fID = window.esDef.FilterID;

                $scope.esPqDef = new esGlobals.ESPublicQueryDef("", gID, fID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
                $scope.esPqDef.options = window.esDef.options;
                $scope.esPqDef.mapType = window.esDef.mapType;
                $scope.esPqDef.typeOptions = window.esDef.typeOptions;
                $scope.esPqDef.mapCtrl = {};
            };

            GoogleMapApi.then(function(maps) {
                $log.info("Google maps ver = " + maps.version);
                maps.visualRefresh = true;
            });

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);

    esApp.controller('esComboCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var runOnSuccess = function() {
                var esDashboardDefinitions = window.esDef;

                $scope.esPqDef = _.map(esDashboardDefinitions, function(x) {

                    switch (x.ESUIType.toLowerCase()) {
                        case "esgrid":
                            {
                                var pqDef = new esGlobals.ESPublicQueryDef("", x.esDef.GroupID, x.esDef.FilterID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
                                pqDef.ESUIType = x.ESUIType.toLowerCase();
                                pqDef.AA = x.AA;
                                pqDef.serverSidePaging = x.esDef.ServerSidePaging;
                                return pqDef;
                            }

                        case "eschart":
                            {
                                var pqDef = new esGlobals.ESPublicQueryDef("", x.esDef.GroupID, x.esDef.FilterID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
                                pqDef.ESUIType = x.ESUIType.toLowerCase();
                                pqDef.AA = x.AA;
                                pqDef.options = x.esDef.options;
                                return pqDef;
                            }

                        case "esmap":
                            {
                                var pqDef = new esGlobals.ESPublicQueryDef("", x.esDef.GroupID, x.esDef.FilterID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
                                pqDef.ESUIType = x.ESUIType.toLowerCase();
                                pqDef.AA = x.AA;
                                pqDef.options = x.esDef.options;
                                pqDef.mapType = x.esDef.mapType;
                                pqDef.typeOptions = x.esDef.typeOptions;
                                pqDef.mapCtrl = {};
                                return pqDef;
                            }

                        default:
                            {
                                throw new Exception("Invalid ESUIType in Combo Component with ID");
                            }
                    }
                });
            };

            doLogin($scope, esGlobals, esWebApiService, runOnSuccess);
        }
    ]);


})
(window.angular);
