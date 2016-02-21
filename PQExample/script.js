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
        'ui.bootstrap'
    ]);

    esApp.config(['$logProvider', 'esWebApiProvider',
        function($logProvider, esWebApiServiceProvider) {

            var settings = window.esWebApiSettings;
            esWebApiServiceProvider.setSettings(settings);
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

    function doLogin($scope, esGlobals, esWebApiService) {
        if (window.esWebApiToken) {
            esGlobals.setWebApiToken(window.esWebApiToken);
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

    esApp.controller('esChartCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var gID = window.esGroupID;
            var fID = window.esFilterID;

            gID = "ESTMOpportunity";
            fID = "ESTMOpportunityManagement";

            var pqOptions = new esGlobals.ESPQOptions(-1, -1, true);
            var params = new esGlobals.ESParamValues([new esGlobals.ESParamVal("ClosingDate", 3)]);

            $scope.pqDef = new esGlobals.ESPublicQueryDef("", gID, fID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
            
            $scope.chartOptions = {
                autoBind: false,
                title: "Leads by Lead Source",
                series: [{
                    type: 'column',
                    field: 'OppRevenue',
                    categoryField: 'fLeadSourceCode',
                    aggregate: 'sum',
                    axis: "Revenue"
                }, {
                    type: 'line',
                    field: 'OppRevenue',
                    categoryField: 'fLeadSourceCode',
                    aggregate: 'count',
                    axis: "CountOf"
                }],

                valueAxes: [{
                    name: "Revenue",
                    title: {
                        text: "Turnover (euros)"
                    }
                }, {
                    name: "CountOf",
                    title: {
                        text: "Count Of"
                    }
                }],

                categoryAxis: {
                    labels: {
                        rotation: 90
                    },
                    axisCrossingValues: [0, 205]
                },


                tooltip: {
                    visible: true,
                    template: "#= category #: #= value #"
                },
                pannable: {
                    lock: "x"
                },
                zoomable: {
                    mousewheel: {
                        lock: "x"
                    },
                    selection: {
                        lock: "x"
                    }
                }
            };

            doLogin($scope, esGlobals, esWebApiService);
        }
    ]);

    esApp.controller('testCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            
            $scope.params = new esGlobals.ESParamValues([new esGlobals.ESParamVal("ClosingDate", 3)]);

            $scope.esParamDef = {
                required: true,
                id: "ClosingDate",
                enumList: [{text: 'Option 1', value: 0}, {text: 'Option 2', value: 1}, {text: 'Option 3', value: 2}, {text: 'Correct !!!', value: 3}]
            };

            $scope.cVal = 3;

            doLogin($scope, esGlobals, esWebApiService);
        }
    ]);

    esApp.controller('esGridCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            doPrepareCtrl($scope, esMessaging, esGlobals);

            var gID = window.esGroupID;
            var fID = window.esFilterID;

            $scope.esPQDef = new esGlobals.ESPublicQueryDef("", gID, fID, new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
            $scope.esPQDef.serverSidePaging = window.esServerSidePaging;

            doLogin($scope, esGlobals, esWebApiService);
        }
    ]);



})
(window.angular);
