/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esCRMAddin');


    appE.controller('TasksinfoCtrl', ['$log', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$uibModal', '$location', '$anchorScroll',
        function($log, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $uibModal, $location, $anchorScroll) {
            var vm = this;

            vm.Rows = [];
            vm.esPQInfo = {};
            vm.esTaskCodes = [];
            vm.esSender = "";
            vm.state = { isRunning: false };

            vm.specialFields = ["Representative", "PersonName", "ContactName"];

            var processResults = function(rows) {
                return _.forEach(rows, function(x) {

                    if (x.Longitude || x.Latitude) {
                        x.Geo = [x.Latitude, x.Longitude];
                    } else {
                        x.Geo = null;
                    }
                    delete x.Latitude;
                    delete x.Longitude;

                    esWebApiService.fetchES00DocumentsByEntityGID(x["fTaskGID"])
                        .then(function(ret) {
                            x.attachments = ret.data;
                        }, function(err) {
                            x.attachments = [];
                        });
                });
            }

            var openDetails = function(parentSelector, title, cRow) {
                var parentElem = parentSelector ?
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'views/es00documents.html',
                    controller: 'ES00DocumentsCtrl',
                    controllerAs: 'vm',
                    size: 'lg',
                    appendTo: parentElem,
                    resolve: {
                        title: function() {
                            return title;
                        },
                        cRow: function() {
                            return cRow;
                        }
                    }
                });
            };

            var openModal = function(parentSelector, title, pqToShow) {
                var parentElem = parentSelector ?
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'views/details.html',
                    controller: 'DetailsCtrl',
                    controllerAs: 'vm',
                    appendTo: parentElem,
                    resolve: {
                        title: function() {
                            return title;
                        },
                        detailPQ: function() {
                            return pqToShow;
                        }
                    }
                });
            };

            vm.showAttachments = function(cRow) {
                var title = cRow.RelTaskCode + " - " + cRow.Description;
                openDetails(null, title, cRow);
            };

            vm.goToAnchor = function(id) {
                if (!id) {
                    return;
                }
                var newHash = 'anchor' + id;
                if ($location.hash() !== newHash) {
                    // set the $location.hash to `newHash` and
                    // $anchorScroll will automatically scroll to it
                    $location.hash('anchor' + id);
                } else {
                    // call $anchorScroll() explicitly,
                    // since $location.hash hasn't changed
                    $anchorScroll();
                }
            };

            vm.fieldAction = function(col, row) {
                var pqOptions = new esGlobals.ESPQOptions(-1, -1, true, true);

                switch (col.field) {
                    case "Representative":
                        {
                            var xP = new esGlobals.ESParamValues([new esGlobals.ESParamVal("fAssignedToGID", row["fAssignedToGID"])]);
                            var pq = new esGlobals.ESPublicQueryDef("1", "ESOffice365", "TaskRepInfo", pqOptions, xP);
                            openModal(null, col.title + " : " + row[col.field], [pq]);
                        }
                        break;
                    case "PersonName":
                        {
                            var xP = new esGlobals.ESParamValues([new esGlobals.ESParamVal("fPersonGID", row["fPersonGID"])]);
                            var pq = new esGlobals.ESPublicQueryDef("1", "ESOffice365", "TaskPersonInfo", pqOptions, xP);

                            var pq2 = new esGlobals.ESPublicQueryDef("1", "ESOffice365", "PersonRecentActivityMetrics", pqOptions, xP);
                            openModal(null, col.title + " : " + row[col.field], [pq, pq2]);
                        }
                        break;
                    case "ContactName":
                        {
                            var xP = new esGlobals.ESParamValues([
                                new esGlobals.ESParamVal("fPersonGID", row["fPersonGID"]),
                                new esGlobals.ESParamVal("fContactPersonGID", row["fContactPersonGID"])
                            ]);
                            var pq = new esGlobals.ESPublicQueryDef("1", "ESOffice365", "TaskContactInfo", pqOptions, xP);
                            openModal(null, col.title + " : " + row[col.field], [pq]);
                        }
                        break;
                    default:
                        break;
                }
            };

            var subjCodes = Office.context.mailbox.item.getRegExMatches().ESTasksSubj;
            var bodyCodes = Office.context.mailbox.item.getRegExMatches().ESTasksBody;

            subjCodes = _.union(subjCodes, bodyCodes);
            var i = 0;
            for (i = 0; i < subjCodes.length; i++) {
                subjCodes[i] = subjCodes[i].replace('{', '').replace('}', '');
            }

            vm.esTaskCodes = subjCodes;
            if (!subjCodes || subjCodes.length == 0) {
                return;
            }

            var pqOptions = new esGlobals.ESPQOptions(-1, -1, true, true);
            var xP = new esGlobals.ESParamValues([new esGlobals.ESParamVal("RelTaskCode", subjCodes.join('\\,'))]);
            var pq = new esGlobals.ESPublicQueryDef("1", "ESOffice365", "TaskInfo", pqOptions, xP);

            vm.state.isRunning = true;
            esWebApiService.fetchPublicQueryInfo(pq.GroupID, pq.FilterID)
                .then(function(ret) {
                        var nColObj = esWebUIHelper.winGridInfoToESGridInfo(pq.GroupID, pq.FilterID, ret.data);
                        nColObj.columns = _.remove(nColObj.columns, function(y) { return !(y.hidden || y.field == "Longitude" || y.field == "Latitude"); });
                        vm.esPQInfo = nColObj;

                        esWebApiService.fetchPublicQuery(pq)
                            .then(function(dat) {
                                    vm.Rows = processResults(dat.data.Rows);
                                    vm.state.isRunning = false;
                                },
                                function(err) {
                                    var s = esGlobals.getUserMessage(err);
                                    vm.state.isRunning = false;
                                });
                    },
                    function(err) {
                        var s = esGlobals.getUserMessage(err);
                        vm.state.isRunning = false;
                    });
        }
    ]);
})();