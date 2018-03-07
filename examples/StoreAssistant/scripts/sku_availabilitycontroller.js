/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');

    appE.controller('sku_AvailabilityCtrl', ['$scope', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$timeout',
        function($scope, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $timeout) {
            var vm = this;

            vm.otherDS = {};

            vm.status = {
                searchisOpen: true,
                storeisOpen: false,
                otherisOpen: false,
                isrunning: false,
            };

            vm.searchValue = new esGlobals.ESParamVal("SeachCode");
            vm.params = new esGlobals.ESParamValues([vm.searchValue]);

            
            vm.pqDef = new esGlobals.ESPublicQueryDef("1", "ESWebManager", "BusEntitiesItems", null, vm.params);

            var pqOptions = new esGlobals.ESPQOptions(1, 10, true, true, false);
            vm.otherDef = new esGlobals.ESPublicQueryDef("1", "ESWebManager", "BusEntitiesItems", pqOptions, vm.params);

            vm.searchSKU = function() {
                vm.status.isrunning = true;

                esWebApiService.fetchPublicQuery(vm.pqDef)
                    .then(function(setRet) {

                        if (!setRet.data.Rows || !setRet.data.Rows.length) {
                            $scope.showMessage("SKU " + vm.searchValue.strVal() + " NOT FOUND");
                            return;
                        }

                        if (setRet.data.Rows.length > 1) {
                            $scope.showMessage("MULTIPLE SKU " + vm.searchValue.strVal() + " FOUND");
                            //return;
                        }

                        if (vm.otherDS && angular.isFunction(vm.otherDS.read)) {
                            vm.otherDS.read();
                        }

                        esWebApiService.fetchPublicQueryInfo(vm.pqDef.GroupID, vm.pqDef.FilterID)
                            .then(function(ret) {
                                

                                var nColObj = esWebUIHelper.winGridInfoToESGridInfo(vm.pqDef.GroupID, vm.pqDef.FilterID, ret.data);
                                nColObj.columns = _.remove(nColObj.columns, function(y) { return !(y.hidden || y.field == "Longitude" || y.field == "Latitude"); });
                                $timeout(function() {
                                    vm.status.isrunning = false;
                                    vm.myStoreInfo = nColObj;
                                    vm.myStoreRow = setRet.data.Rows[0];
                                    vm.status.searchisOpen = false;
                                    vm.status.storeisOpen = true;
                                    vm.status.otherisOpen = false;
                                });
                            })
                            .catch(function(err) {
                                vm.status.isrunning = false;
                            });

                    })
                    .catch(function(err) {
                        vm.status.searchisOpen = true;
                        vm.status.storeisOpen = false;
                        vm.status.otherisOpen = false;
                        vm.status.isrunning = false;
                    });
            }
        }
    ]);
})();