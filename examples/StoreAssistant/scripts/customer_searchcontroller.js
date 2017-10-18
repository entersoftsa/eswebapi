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

            var fields = new esWebUIHelper.ESParamsDefinitions();
            fields.createDefinitions("Search for a customer", [{
                    id: "Loyalty",
                    aa: 1,
                    caption: "Loyalty Number",
                    visible: true,
                },
                {
                    id: "eMail",
                    aa: 3,
                    caption: "eMail",
                    visible: true,
                },
                {
                    id: "Name",
                    aa: 2,
                    caption: "Name",
                    visible: true,
                },

                {
                    id: "Phone",
                    aa: 4,
                    caption: "Phone",
                    visible: true,
                    inputType: "tel"
                }
            ]);

            vm.customerFields = fields;
            vm.customerValues = fields.getParamsValues();

            var pqOptions = new esGlobals.ESPQOptions(1, 10, true, true, false);
            vm.pqDef = new esGlobals.ESPublicQueryDef("1", "ESWebManager", "BusEntitiesCustomers", pqOptions, vm.customerValues);

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
                if (vm.searchDS && angular.isFunction(vm.searchDS.read)) {
                    vm.searchDS.read();
                    vm.status.listisOpen = true;
                    vm.status.searchisOpen = false;
                    vm.status.formisOpen = false;
                }
            }
        }
    ]);
})();