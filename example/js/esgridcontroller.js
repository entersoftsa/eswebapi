'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);




smeControllers.controller('esPQCtrl', ['$timeout', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($timeout, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.cMenu = getMenu();

        $scope.currentUser = {};
        $scope.version = {
            esAngularVersion: esGlobals.getVersion(),

        };

        esWebApiService.fetchServerCapabilities().then(function(data) {
            $scope.version.esWebAPIVersion = data.WebApiVersion;
        });


        $scope.gridOptions = null;
        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESFICustomer";
        $scope.FilterID = "hka_customerlist";
        //$scope.gridOptions = null;
        $scope.pVals = undefined;
        $scope.pqInfo = {};

        function getMenu() {
            var mn = {
                panels: [{
                    aa: 0,
                    title: "Retail",
                    items: [{
                        aa: 0,
                        caption: "Report 1",
                        command: "PQ",
                        params: {
                            GroupID: "ESFICustomer",
                            FilterID: "hka_customerlist",
                            autoExecute: false
                        }
                    }, {
                        aa: 1,
                        caption: "Report 2",
                        command: "PQ",
                        params: {
                            GroupID: "ESFICustomer",
                            FilterID: "hka_customerlist",
                            autoExecute: true
                        }
                    }]
                }],
                version: {
                    Major: 1,
                    Minor: 0,
                    Patch: 0
                },
                lastModified: new Date()
            };
            return mn;
        }

        function onChange(arg) {
            debugger;
            kendoConsole.log("Grid change");
        }

        function onDataBound(arg) {
            debugger;
            kendoConsole.log("Grid data bound");
        }

        function onDataBinding(arg) {
            debugger;
            kendoConsole.log("Grid data binding");
        }

        $scope.xChange = onChange;
        $scope.xDBound = onDataBound;
        $scope.xDBinding = onDataBinding;

        esMessaging.subscribe("AUTH_CHANGED", function(session, tok) {
            if (session && session.connectionModel) {
                $scope.currentUser.Name = session.connectionModel.Name;
                esWebApiService.fetchSessionInfo().success(function(data) {
                    $scope.version.esEBSVersion = data;
                });
            } else {
                $scope.currentUser.Name = 'NOT Approved';
                $scope.version.esEBSVersion = null;
            }
        });

        esWebApiService.openSession($scope.credentials)
            .success(function($user, status, headers, config) {
                // console.log("Logged in. Ready to proceed");
                // esWebApiService.fetchPublicQueryInfo($scope.GroupID, $scope.FilterID)
                //     .success(function(ret) {
                //         $timeout(function() {
                //             var v = esWebUIHelper.winGridInfoToESGridInfo($scope.GroupID, $scope.FilterID, ret);
                //             $scope.pVals = v.defaultValues;
                //             //angular.extend($scope.pVals, v.defaultValues);

                //             $scope.gridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, $scope.GroupID, $scope.FilterID, $scope.pVals, v);
                //             $scope.pqInfo = v;
                //         }, 300);

                //     });
            })
            .error(function(rejection) {
                var msg = rejection ? rejection.UserMessage : "Generic server error";
                noty({
                    text: msg,
                    type: 'error',
                    timeout: 100,
                    killer: true
                });
            });

        $scope.execute = function() {
            $scope.gridOptions.dataSource.read();
            $log.info("Requery");
        }
    }

]);
