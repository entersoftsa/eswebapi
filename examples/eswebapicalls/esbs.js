'use strict';

/* Controllers */

angular.module('esWorld', ['kendo.directives', 'underscore', 'es.Services.Web', 'es.Web.UI', 'uiGmapgoogle-maps'])
    .config(['$logProvider',
        'esWebApiProvider',
        'uiGmapGoogleMapApiProvider',
        function($logProvider, esWebApiServiceProvider, GoogleMapApi) {

            $logProvider.addDefaultAppenders();

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                //host: "eswebapialp.azurewebsites.net",
                //host: "eswebapi.entersoft.gr",
                host: "localhost/eswebapi",
                //"host" : "192.168.1.190/eswebapi",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });

            GoogleMapApi.configure({
                key: "AIzaSyAsi8zLy4NrO5SLSWNS4XTsu_ATCaOStBg",
                libraries: ''
            });
        }
    ])
    .run(['esWebApi', function(esWebApiService) {
        var cre = {
            UserID: 'admin',
            Password: 'entersoft',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        esWebApiService.openSession(cre);
    }])
    .controller('esWorldCtrl', ['$location', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals', 'uiGmapGoogleMapApi',

        function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals, GoogleMapApi) {

            GoogleMapApi.then(function(maps) {
                maps.visualRefresh = true;
            });

            $scope.map = {
                zoom: 11,
                center: {
                    latitude: 47.6201,
                    longitude: -122.1653
                },
            };

            $scope.connected = false;

            esMessaging.subscribe("AUTH_CHANGED", function(sess, apitoken) {
                $scope.webPQOptions = {};
                $scope.webPQOptions.theGroupId = "ESFICustomer";
                $scope.webPQOptions.theFilterId = "ESFITradeAccountCustomer_def";
                $scope.webPQOptions.theVals = {};
                $scope.webPQOptions.theGridOptions = {};

                $scope.staticPage = {
                    serverGrouping: false,
                    serverSorting: false,
                    serverFiltering: false,
                    serverPaging: false,
                    pageSize: 12
                };

                $scope.connected = true;
            });
        }
    ]);
