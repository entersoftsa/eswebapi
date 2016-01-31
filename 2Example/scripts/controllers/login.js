'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')
    .controller('esMainCtrl', ['$location', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals', '$mdToast',
        function($location, $scope, $log, esMessaging, esWebApiService, esGlobals, $mdToast) {

            $scope.theGlobalUser = {};

            $scope.toastPosition = {
                bottom: false,
                right: true,
                top: true,
                left: false
            };



            $scope.logout = function() {
                esWebApiService.logout()
                    .then(function() {
                        $scope.theGlobalUser = {};
                        alert("You are logged out");
                    });
            }

            esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
                var s = esGlobals.getUserMessage(rejection, status);
                if (s.isLogin) {

                    $mdToast.show(
                        $mdToast.simple()
                        .content(s.messageToShow)
                        .position($scope.toastPosition)
                        .hideDelay(5000)
                    );
                    $location.path('/dashboard/login');
                }
            });

            esMessaging.subscribe("AUTH_CHANGED", function(esSession, b) {
                $scope.theGlobalUser = {};
                if (!b) {
                    return;
                }

                $scope.theGlobalUser.name = esSession.connectionModel.Name;
                esWebApiService.fetchUserLogo()
                    .then(function(ret) {
                            $scope.theGlobalUser.profilePic = ret.data;
                        },
                        function(err) {
                            $scope.theGlobalUser.profilePic = "";
                        });
            });
        }
    ])
    .controller('LoginCtrl', ['$scope', '$location', '$mdDialog', '$mdToast', 'esGlobals', 'esWebApi',
        function($scope, $location, $mdDialog, $mdToast, esGlobals, esWebApiService) {

            $scope.esCredentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };


            $scope.authenticate = function() {
                esWebApiService.openSession($scope.esCredentials)
                    .then(function(rep) {
                            $location.path('/dashboard/home');
                        },
                        function(err) {
                            var s = esGlobals.getUserMessage(err);
                            if (!s.isLogin) {
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content(s.messageToShow)
                                    .position($scope.toastPosition)
                                    .hideDelay(5000)
                                );
                            }
                        });
            };


        }
    ]);