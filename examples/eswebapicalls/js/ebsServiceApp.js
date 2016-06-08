(function(angular) {
    var eskbApp = angular.module('ebsServiceApp', [

        /* angular modules */
        'ngRoute',
        'ngStorage',
        'ui.bootstrap',
        'pascalprecht.translate',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',

        'kendo.directives',
        'underscore',
        'es.Web.UI',
        'ui.bootstrap',
        'uiGmapgoogle-maps',
        'ngFileUpload'
    ]);

    eskbApp.config(['$logProvider',
        'esWebApiProvider',
        '$exceptionHandlerProvider',
        '$translateProvider',
        function($logProvider, esWebApiServiceProvider, $exceptionHandlerProvider, $translateProvider) {

            $translateProvider.useStaticFilesLoader({
                files: [{
                    prefix: 'lib/eswebapi/dist/languages/eswebapi-locale-',
                    suffix: '.json'
                }]
            });
            $translateProvider.preferredLanguage('el');
            $translateProvider.fallbackLanguage('en');
            $translateProvider.useSanitizeValueStrategy('escape');

            $logProvider.addDefaultAppenders();
            $exceptionHandlerProvider.setPushToServer(true);
            $exceptionHandlerProvider.setLogServer("Azure");

            esWebApiServiceProvider.setSettings({
                host: "192.168.1.190/Entersoft.Web.Api",
                //"host": "esmasterapp.entersoft.gr",
                allowUnsecureConnection: true
                
                
            });
        }
    ]);

    eskbApp.controller('ebsServiceCtrl', ['$location', '$rootScope', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
        function($location, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

            $scope.theGlobalUser = "";

            esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
                var s = esGlobals.getUserMessage(rejection, status);
                $scope.esnotify.error(s.messageToShow);
            });

            esMessaging.subscribe("AUTH_CHANGED", function(esSession, b) {
                if (!b) {
                    $scope.theGlobalUser = "Nobody";
                    return;
                }
                $scope.theGlobalUser = esSession.connectionModel.Name;
                $scope.esnotify.success("Welcome " + $scope.theGlobalUser);
            });
            $scope.credentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };

            var claims = {
                ESDeviceID: 'kar device',
                ESApplicationID: "Sme App",
                ESChannelID: "es web",
                MyStrVar: "MyStrVar-Value",
                MyIntVar: 234,
                ESMyStrVar: "ESMyStrVar-Value",
                ESMyIntVar: 456,
                ESDecVar: 332.6987,
                ESDateVar: new Date()
            };

            $scope.doLogin = function() {
                esWebApiService.openSession($scope.credentials, claims)
                    .then(function(rep) {},
                        function(err) {
                            $log.error(err);
                        });
            }

            $scope.serviceObj = {
                netAssembly: "eswebapiadmin",
                netNamespace: "Entersoft/WebApps/ESWebApiAdmin",
                netClass: "ESApiAdmin",
                netIsBinaryResult: false,
                netMethod: ""
            };
            $scope.netParam = "";

            $scope.execEbsService = function() {
                esWebApiService.ebsService($scope.serviceObj, $scope.netParam)
                    .then(function(ret) {
                        $scope.ebsret = ret.data;
                    }, function(err) {
                        $scope.ebsret = JSON.stringify(err);
                    });
            }

        }
    ]);

})(window.angular);
