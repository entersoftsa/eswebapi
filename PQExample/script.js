(function(angular) {
    'use strict';

    var esApp = angular.module('esWebPqApp', [
        /* angular modules */
        'ngStorage',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',
        'kendo.directives', 
        'underscore', 
        'es.Web.UI',
        'ui.bootstrap'
    ]);

    esApp.config(['$logProvider', 'esWebApiProvider',
        function($logProvider, esWebApiServiceProvider) {

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                "host": "192.168.1.190/eswebapijti",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });
        }
    ]);



    /* Controllers */

    esApp.controller('esPQCtrl', ['$scope', '$log', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($scope, $log, esWebApiService, esWebUIHelper, esGlobals) {
            $scope.credentials = {
                UserID: 'admin',
                Password: 'entersoft',
                BranchID: 'ΑΘΗ',
                LangID: 'el-GR'
            };

            $scope.esPQDef = new esGlobals.ESPublicQueryDef("", "ESMMStockItem", "ESMMStockItem_def", new esGlobals.ESPQOptions(), new esGlobals.ESParamValues());
            
            $scope.doLogin = function() {
                esWebApiService.openSession($scope.credentials)
                .then(function(rep) {
                        alert("OK");
                    },
                    function(err) {
                        var s = esGlobals.getUserMessage(err);
                        if (!s.isLogin) {
                            alert(s.messageToShow)
                        }
                    });
            }

            $scope.doLogin();
        }
    ]);

    

})
(window.angular);
