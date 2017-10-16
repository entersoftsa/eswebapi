/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');


    appE.controller('MenuCtrl', ['$state', '$rootScope', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
        function($state, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
            init();

            $scope.signOut = function() {

                esWebApiService.logout()
                    .then(function() {
                        $state.go('login');
                    })
                    .catch(function(err) {
                        $state.go('login');
                    });
            }


            function init() {
                $scope.theSession = {
                    isAuth: false,
                    UserName: "",
                    UserLogoUrl: ""
                };
            }

            if (!angular.isFunction($rootScope.showMessage)) {
                $rootScope.showMessage = function(message) {
                    $scope.esnotify.error(message);
                }
            }

            esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
                var s = esGlobals.getUserMessage(rejection, status);
                $rootScope.showMessage(s.messageToShow);
            });

            esMessaging.subscribe("AUTH_CHANGED", function(esSession, b) {
                if (!b) {
                    init();
                    return;
                }
                $scope.theSession.isAuth = true;
                $scope.theSession.UserName = esSession.connectionModel.Name;
                $scope.theSession.UserLogoUrl = esWebApiService.downloadES00BlobURLByObject("ESGOUser", esSession.connectionModel.GID, 0);
            });
        }
    ]);
})();