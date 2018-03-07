/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');

    appE.controller('sales_messagesCtrl', ['$scope', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$timeout',
        function($scope, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $timeout) {
            var vm = this;

            var pqOptions = new esGlobals.ESPQOptions(1, 10, true, true, false);
            vm.pqDef = new esGlobals.ESPublicQueryDef("1", "ESWebManager", "BusEntitiesCustomers", pqOptions, new esGlobals.ESParamValues(), null, true);

            vm.groupMessages = [{
                title: "Corporate Messages",
                isOpen: true,
                class: "panel-primary",
                messages: [{
                    Code: "PR_00001",
                    Title: "New Products",
                    Owner: "Stavros Menegos",
                    personLogo: esWebApiService.downloadES00BlobURLByObject("ESGOPerson", "8750d6b1-8892-4b25-840c-77dea63c5f3c"),
                    ReleaseDate: new Date(),
                    Body: "This is the story of my life <h1>Hello</h1>"
                }]
            },
            {
                title: "Store Messages",
                isOpen: false,
                class: "panel-warning",
                messages: [{
                    Code: "PR_00002",
                    Title: "OLD Products",
                    Owner: "Stavros Menegos",
                    personLogo: esWebApiService.downloadES00BlobURLByObject("ESGOPerson", "8750d6b1-8892-4b25-840c-77dea63c5f3c"),
                    ReleaseDate: new Date(),
                    Body: "This is the story of my life <h1>Hello</h1>"
                }]
            },
            {
                title: "My Messages",
                isOpen: false,
                class: "panel-danger",
                messages: [{
                    Code: "PR_00004",
                    Title: "Take Care",
                    Owner: "Stavros Menegos",
                    personLogo: esWebApiService.downloadES00BlobURLByObject("ESGOPerson", "8750d6b1-8892-4b25-840c-77dea63c5f3c"),
                    ReleaseDate: new Date(),
                    Body: "This is the story of my life <h1>Hello</h1>"
                }]
            }];

        }
    ]);
})();