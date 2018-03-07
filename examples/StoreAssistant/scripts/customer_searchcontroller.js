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
                listisOpen: true,
                formisOpen: false
            };
            

            var pqOptions = new esGlobals.ESPQOptions(1, 10, true, true, false);
            vm.pqDef = new esGlobals.ESPublicQueryDef("1", "ESWebManager", "BusEntitiesCustomers", pqOptions, new esGlobals.ESParamValues(), null, true);

            vm.handleGridOptions = function(arg1) {
                if (!arg1) {
                    return arg1;
                }

                arg1.toolbar = null;
                arg1.sortable = false;
                arg1.filterable = false;
                arg1.groupable = false;
                arg1.change = function(e) {
                    vm.status.xxx = false;
                    var selectedRows = e.sender.select();
                    if (selectedRows && selectedRows.length == 1) {
                        $timeout(function() {
                            vm.pqDef.esPanelOpen.status = true;
                            vm.CustomerCode = e.sender.dataItem(selectedRows[0])["Code"];
                            vm.status.formisOpen = true;
                            vm.status.listisOpen = false;
                            
                        });
                        
                    }
                }
                return arg1;
            }
                       
        }
    ]);
})();