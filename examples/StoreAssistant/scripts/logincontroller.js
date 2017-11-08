/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');


    appE.controller('LoginCtrl', ['$state', '$rootScope', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals', '$translate', '$localStorage',
        function($state, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals, $translate, $localStorage) {

            $scope.esCredentials = $localStorage.esStoreAssistantCredentials || { LangID: "en-US" };
            $scope.showLogin = false;

            $scope.authenticate = function() {
                var claims = {
                    ESApplicationID: "esStoreAssistant",
                    ESChannelID: "Web"
                };

                esWebApiService.openSession($scope.esCredentials, claims)
                    .then(function(rep) {
                            var settings = angular.merge({}, esWebApiService.getServerSettings(), $scope.esCredentials)
                            //delete settings.UserID;
                            //delete settings.Password;
                            $localStorage.esStoreAssistantCredentials = settings;

                            onSuccessAuth();
                        },
                        function(err) {
                            $scope.showLogin = true;
                        });
            }

            //Check if there is an already stored token and if is valid
            var webapitoken;
            if (webapitoken) {
                esWebApiService.validateToken(webapitoken)
                    .then(function(ret) {
                            onSuccessAuth();
                        },
                        function(err) {
                            handlelogin();
                        });

            } else {
                handlelogin();
            }


            function onSuccessAuth() {
                var gotoState = 'sales_messages';

                var gotoParams;
                if ($rootScope.toState) {
                    gotoState = $rootScope.toState.name;
                    gotoParams = $rootScope.toStateParams;
                    $rootScope.toState = null;
                    $rootScope.toStateParams = {};
                }
                $state.go(gotoState, gotoParams);
            }

            function handlelogin() {
                if ($scope.esCredentials.subscriptionPassword && $scope.esCredentials.UserID && $scope.esCredentials.Password && $scope.esCredentials.BranchID) {
                    $scope.showLogin = false;
                    $scope.authenticate();
                } else {
                    $scope.showLogin = true;
                }
            }
        }
    ]);
})();