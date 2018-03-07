/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esCRMAddin');


    appE.controller('RecipientsCtrl', ['$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals',
        function($log, esMessaging, esWebApiService, esWebUIHelper, esGlobals) {
            var vm = this;

            vm.Rows = [];
            vm.esPQInfo = {};
            vm.state = { isRunning: false };

            vm.esSender = Office.context.mailbox.item.from.emailAddress;
            var prox = [Office.context.mailbox.item.from].concat(Office.context.mailbox.item.to || []).concat(Office.context.mailbox.item.cc || []).concat(Office.context.mailbox.item.bcc || []);
            var allEmails = [];
            _.forEach(prox, function(x) {
                allEmails.push(x.emailAddress);
            });

            var pqOptions = new esGlobals.ESPQOptions(-1, -1, true, true);
            var xP = new esGlobals.ESParamValues([new esGlobals.ESParamVal("email", allEmails[0])]);
            var pq = new esGlobals.ESPublicQueryDef("1", "ESOffice365", "EmailRecipientInfo", pqOptions, xP);

            vm.state.isRunning = true;
            esWebApiService.fetchPublicQueryInfo(pq.GroupID, pq.FilterID)
                .then(function(ret) {
                        var nColObj = esWebUIHelper.winGridInfoToESGridInfo(pq.GroupID, pq.FilterID, ret.data);
                        nColObj.columns = _.remove(nColObj.columns, function(y) { return !y.hidden; });
                        vm.esPQInfo = nColObj;

                        allEmails.forEach(function(xemail, index) {
                            xP.email.pValue(xemail);
                            vm.state.isRunning = true;
                            esWebApiService.fetchPublicQuery(pq)
                                .then(function(dat) {
                                        _.forEach(dat.data.Rows, function(c) {
                                            if (c.BlobGID) {
                                                c.contactPhoto = esWebApiService.downloadES00BlobURLByGID(c.BlobGID);
                                            } else {
                                                c.contactPhoto = "";
                                            }
                                        });
                                        vm.state.isRunning = false;
                                        vm.Rows = vm.Rows.concat(dat.data.Rows);
                                    },
                                    function(err) {
                                        var s = esGlobals.getUserMessage(err);
                                        vm.state.isRunning = false;
                                    });
                        });
                    },
                    function(err) {
                        var s = esGlobals.getUserMessage(err);
                        vm.state.isRunning = false;

                    });
        }
    ]);
})();