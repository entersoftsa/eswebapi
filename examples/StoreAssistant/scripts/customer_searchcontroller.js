/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');

    appE.controller('customer_searchCtrl', ['$scope', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$timeout',
        function($scope, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $timeout) {
            var vm = this;

            vm.status = {
                searchisOpen: true,
                listisOpen: false,
                formisOpen: false
            };
            vm.searchDS = {};

            vm.esParamVal = new esGlobals.ESParamValues([new esGlobals.ESParamVal("Loyalty_Code", ''),
                new esGlobals.ESParamVal("Customer_Name", ''),
                new esGlobals.ESParamVal("Customer_eMail", ''),
                new esGlobals.ESParamVal("Customer_Phone", '')]);

            var pqOptions = new esGlobals.ESPQOptions(1, 10, true, true, false);
            vm.pqDef = new esGlobals.ESPublicQueryDef("1", "ESWebManager", "BusEntitiesCustomers", pqOptions, vm.esParamVal);

            vm.handleGridOptions = function(arg1) {
                if (!arg1) {
                    return arg1;
                }

                arg1.toolbar = null;
                arg1.sortable = false;
                arg1.filterable = false;
                arg1.groupable = false;
                arg1.change = function(e) {
                    var selectedRows = e.sender.select();
                    if (selectedRows && selectedRows.length == 1) {
                        $timeout(function() {
                            vm.CustomerCode = e.sender.dataItem(selectedRows[0])["Code"];
                            vm.status.formisOpen = true;
                            vm.status.searchisOpen = false;
                            vm.status.listisOpen = false;
                        });
                        
                    }
                }
                return arg1;
            }
                        
            vm.searchCustomer = function() {
                if (vm.searchDS) {
                    vm.searchDS.read();
                    vm.status.listisOpen = true;
                    vm.status.searchisOpen = false;
                    vm.status.formisOpen = false;
                }
            }
        }
    ]);
})();