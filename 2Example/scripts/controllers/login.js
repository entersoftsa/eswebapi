'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp')

.controller('surveyCtrl', ['$location', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.surveyDef = {};

        $scope.startFrom = -1;
        $scope.surveyCode = "usage_s1";
        $scope.surveyAns = {};

        var x = function() {
            esWebApiService.fetchPropertySet($scope.surveyCode, "2E035E80-BFED-4B45-91D2-1CEB64C2BB7B")
                .then(function(ret) {
                        $scope.surveyDef = ret.data;
                        $scope.startFrom = -1;
                        $scope.surveyCode = "usage_s1";
                        $scope.surveyAns = {};
                    },
                    function(err) {
                        $scope.surveyDef = {};
                        alert(err);
                    });
        };

        x();
    }
])
.controller('mapsCtrl', ['$log', '$q', '$scope', 'esWebApi', 'esUIHelper', 'esGlobals', 'esCache', 'esGeoLocationSrv', 'uiGmapGoogleMapApi',
    function($log, $q, $scope, esWebApi, esWebUIHelper, esGlobals, esCache, esGeoLocationSrv, GoogleMapApi) {

        GoogleMapApi.then(function(maps) {
            $log.info("Google maps ver = " + maps.version);
            maps.visualRefresh = true;
        });

        $scope.myMapOptions = {
            center: {
                longitude: 0,
                latitude: 0
            },
            zoom: 2,
        };
        $scope.myPQDef = new esGlobals.ESPublicQueryDef("", "ESCMS", "View_ES00GPSLog", new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
        $scope.MyShowWindow = false;
        $scope.myType = "standard";
        $scope.myTypeOptions = null;
        $scope.myCtrl = {};



        $scope.myMapMarkerClick = function(a, b, c) {
            $log.info("Click");
            alert("I am a label clicked !!!");
        }


    }
])

.controller('esMainCtrl', ['$state', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals', '$mdToast',
        function($state, $scope, $log, esMessaging, esWebApiService, esGlobals, $mdToast) {

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
                        $mdToast.show(
                            $mdToast.simple()
                            .content("You are logged-out.")
                            .position($scope.toastPosition)
                            .hideDelay(5000)
                        );
                        $state.go('login');
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
                    $state.go('login');
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
    .controller('LoginCtrl', ['$scope', '$state', '$mdDialog', '$mdToast', 'esGlobals', 'esWebApi',
        function($scope, $state, $mdDialog, $mdToast, esGlobals, esWebApiService) {

            $scope.esCredentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };


            $scope.authenticate = function() {
                esWebApiService.openSession($scope.esCredentials)
                    .then(function(rep) {
                            $state.go('home');
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
