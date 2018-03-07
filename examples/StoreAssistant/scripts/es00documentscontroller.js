/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esCRMAddin');


    appE.controller('ES00DocumentsCtrl', ['$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$uibModalInstance', 'title', 'cRow',
        function($log, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $uibModalInstance, title, cRow) {
            var vm = this;

            vm.cRow = cRow;
            vm.title = title;

            vm.ok = function() {
                $uibModalInstance.close();
            };
        }
    ]);
})();