/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');

    appE.controller('customer_newCtrl', ['$scope', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$timeout',
        function($scope, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $timeout) {
            var vm = this;

            var fields = new esWebUIHelper.ESParamsDefinitions();
            fields.createDefinitions("Welcome a new customer", [{
                    id: "First_Name",
                    aa: 1,
                    caption: "First Name",
                    visible: true,
                    required: true,
                },
                {
                    id: "eMail",
                    aa: 3,
                    caption: "eMail",
                    visible: true,
                    required: true,
                },
                {
                    id: "Last_Name",
                    aa: 2,
                    caption: "Last Name",
                    visible: true,
                    required: true,
                },

                {
                    id: "MobilePhone",
                    aa: 4,
                    caption: "Mobile Phone",
                    visible: true,
                    required: true,
                    inputType: "tel"
                }
            ]);

            vm.customerFields = fields;
            vm.customerValues = fields.getParamsValues();

            vm.addCustomer = function() {
                alert("Save");
            }

        }
    ]);
})();