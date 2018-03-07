/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function () {
    'use strict';

    var appE = angular.module('esCRMAddin');


    appE.controller('AboutCtrl', ['$state', '$rootScope', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
        function ($state, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

            function prepare() {
                $scope.versionInfo = [];
                $scope.state = { isRunning: true };         
                var elems = $scope.versionInfo;
                
                elems.push( {code: "01. ES CRM Addin", value: appE.esVersion || "-"});
                var aV = esGlobals.getVersion();
                elems.push( {code: "02. ES Client Library", value: aV.Major + "." + aV.Minor + "." + aV.Patch});
                var code = "03. ES Web Api Server";
                esWebApiService.fetchServerCapabilities()
                .then(function(ret) {
                    var wv = ret.WebApiVersion;
                    var v = wv.Major + "." + wv.Minor + "." + wv.Patch;
                    elems.push( {code: code, value: v});
                    $scope.state.isRunning = false;
                    
                }, function(err) {
                    elems.push( {code: code, value: "N/A"}); 
                    $scope.state.isRunning = false;                  
                });

                var code1 = "04. Entersoft App Server";
                esWebApiService.fetchSessionInfo()
                .then(function(ret) {
                    var wv = _.find(ret.data.ESProperty, function(x) { return x.ID == "103";});
                    var v ="N/A";
                    if (wv) {
                        v = wv.ValueS + " - ";
                        wv = _.find(ret.data.ESProperty, function(x) { return x.ID == "104";}) || { valueS: "" };
                        v = v + wv.ValueS;
                    }
                    elems.push( {code: code1, value: v});
                    $scope.state.isRunning = false;                  

                },
                function(err) {
                    elems.push( {code: code1, value: "N/A"});        
                    $scope.state.isRunning = false;                  

                });

                var diag = Office.context.mailbox.diagnostics;
                elems.push( {code: "05. Outlook host name", value: diag.hostName});
                elems.push( {code: "06. Outlook host version", value: diag.hostVersion});
                elems.push( {code: "07. Outlook View", value: diag.OWAView});
            }



            prepare();
        }
    ]);
})();
