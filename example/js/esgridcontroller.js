'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI', 'ui.bootstrap']);

smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals',
    function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

        /* boot strap configuration */
        $scope.configure = function(e) {
            $("#configurator-wrap").toggleClass("hidden-xs");
        }

        $scope.blob = "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";

        $scope.dimension = "common-bootstrap";
        $scope.dimensionOptions = {
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [{
                text: 'Default',
                value: 'common'
            }, {
                text: 'Bootstrap',
                value: 'common-bootstrap'
            }],
            change: function(e) {
                window.kendoThemeChooser.changeCommon(this.value(), true);
            }
        };

        $scope.theme = "bootstrap";
        $scope.themeOptions = {
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [{
                text: "Default",
                value: "default"
            }, {
                text: "Blue Opal",
                value: "blueopal"
            }, {
                text: "Bootstrap",
                value: "bootstrap"
            }, {
                text: "Silver",
                value: "silver"
            }, {
                text: "Uniform",
                value: "uniform"
            }, {
                text: "Metro",
                value: "metro"
            }, {
                text: "Black",
                value: "black"
            }, {
                text: "Metro Black",
                value: "metroblack"
            }, {
                text: "High Contrast",
                value: "highcontrast"
            }, {
                text: "Moonlight",
                value: "moonlight"
            }, {
                text: "Flat",
                value: "flat"
            }],
            change: function(e) {
                window.kendoThemeChooser.changeTheme($scope.theme, true);
            }
        };


        $scope.fontsizeOptions = {
            dataTextField: "text",
            dataValueField: "value",
            value: 14,
            height: 204,
            autoBind: true,
            dataSource: [{
                text: "10px",
                value: 10
            }, {
                text: "12px",
                value: 12
            }, {
                text: "14px",
                value: 14
            }, {
                text: "16px",
                value: 16
            }, {
                text: "18px",
                value: 18
            }, {
                text: "20px",
                value: 20
            }],
            change: changeFontSize
        };
        $scope.fontsize = 14;

        function changeFontSize(e) {
            $("body").css("font-size", $scope.fontsize + "px");
        }

        changeFontSize();


        /* rest logic */

        $scope.theGlobalUser = "";

        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            $scope.esnotify.error(s);
        });

        esMessaging.subscribe("AUTH_CHANGED", function(esSession, b) {
            if (!b) {
                $scope.theGlobalUser = "Nobody";
                alert("You are nobody");
                return;
            }

            $scope.theGlobalUser = esSession.connectionModel.Name;
        });
    }
]);

smeControllers.controller('loginCtrl', ['$location', '$rootScope', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($location, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
        $scope.credentials = {
            UserID: 'admin',
            Password: 'entersoft',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.doLogin = function() {
            esWebApiService.openSession($scope.credentials)
                .then(function(rep) {
                        $log.info(rep);
                        $location.path("/pq");
                    },
                    function(err) {
                        $log.error(err);
                    });
        }

        $scope.version = {};

        /* Date Range Sample Section */
        var x = function(p) {
            return "Hello World";
        };

        $scope.y = function() {
            return "Hi !!!";
        }


        $scope.onChange = function(kendoEvent) {
            if (!kendoEvent) {
                return;
            }
            //kendoEvent.sender.text(mapper(kendoEvent.sender.dataItem(), $scope.myDateVal));
        }

        $scope.myDateVal = new esWebUIHelper.ESDateParamVal("myP", {
            //dRange: 'ESDateRange(SpecificDate, #1753/01/01#, Day, 0)', ESDateRange(SpecificDate, #9999/01/01#, SpecificDate, #1753/01/01#)
            dRange: 'ESDateRange(SpecificDate, #9999/01/01#, SpecificDate, #1753/01/01#)',
            fromD: null,
            toD: null
        });


        /* End Section */

    }
]);

smeControllers.controller('propertiesCtrl', ['$location', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.getVersionInfo = function() {
            $scope.version = {};

            $scope.version.esAngularVersion = esGlobals.getVersion();

            esWebApiService.fetchServerCapabilities().then(function(data) {
                $scope.version.esWebAPIVersion = data.WebApiVersion;

                esWebApiService.fetchSessionInfo()
                    .success(function(data) {
                        $scope.version.esEBSVersion = data;
                    });
            });
        };

        $scope.getVersionInfo();
    }
]);

smeControllers.controller('examplesCtrl', ['$log', '$q', '$scope', 'esWebApi', 'esUIHelper', 'esGlobals', 'esCache',
    function($log, $q, $scope, esWebApi, esWebUIHelper, esGlobals, esCache) {

        $scope.pGroup = "ESMMStockItem";
        $scope.pFilter = "ESMMStockItem_def";
        $scope.esWebAPI = esWebApi;

        $scope.cacheInfo = function() {
            $scope.cacheSize = esCache.size();
            $scope.cacheStats = esCache.stats();
        };

        $scope.uploadPic = function(myFile) {
            var okf = function(retFile) {
                $log.information("file uploaded ....");
            };

            var errf = function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                else {
                    $scope.errorMsg = "Ooops something wnet wrong";
                }
                $log.error($scope.errorMsg);
            };

            var progressf = function(evt) {
                myFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            };

            esWebApi.addES00Document("abcd", "fff", $scope.username, myFile, okf, errf, progressf);
        }

        //fetchPublicQueryInfo sample
        $scope.fetchPQInfo = function() {
            esWebApi.fetchPublicQueryInfo($scope.pGroup, $scope.pFilter)
                .then(function(ret) {
                    // This is the gridlayout as defined in the EBS Public Query based on .NET Janus GridEx Layout
                    $scope.esJanusGridLayout = ret.data;

                    // This is the neutral-abstract representation of the Janus GridEx Layout according to the ES WEB UI simplification
                    $scope.esWebGridInfo = esWebUIHelper.winGridInfoToESGridInfo($scope.pGroup, $scope.pFilter, $scope.esJanusGridLayout);

                    // This is the kendo-grid based layout ready to be assigned to kendo-grid options attribute for rendering the results
                    // and for executing the corresponding Public Query
                    $scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApi, $scope.pGroup, $scope.pFilter, {}, $scope.esWebGridInfo);
                }, function(err, status) {
                    alert(a.UserMessage || a.MessageID || "Generic Error");
                });
        }

        // fetchPublicQuery sample
        $scope.dofetchPublicQuery = function() {
            var group = "ESGOPerson";
            var filter = "PersonList";
            $scope.pqResult = "";

            var pqOptions = {
                WithCount: false,
                Page: 2,
                PageSize: 5
            };

            var pqParams = {
                Name: "ao*"
            };

            esWebApi.fetchPublicQuery(group, filter, pqOptions, pqParams)
                .then(function(ret) {
                        $scope.pqResult = ret.data;
                        $log.info(ret);
                    },
                    function(err) {
                        $scope.pqResult = ret;
                        $log.error(err);
                    });
        }

        //fetchSessionInfo example
        $scope.fetchSessionInfo = function() {
            esWebApi.fetchSessionInfo()
                .then(function(ret) {
                    $scope.pSessionInfo = ret.data;
                }, function(err) {
                    $scope.pSessionInfo = err;
                });
        }

        //fetchODSTableInfo example
        $scope.fetchOdsTableInfo = function() {
            esWebApi.fetchOdsTableInfo($scope.odsID)
                .then(function(ret) {
                    $scope.pTableInfo = ret.data;
                }, function(err) {
                    $scope.pTableInfo = err;
                });
        }

        //fetchODSColumnInfo example
        $scope.fetchOdsColumnInfo = function() {
            esWebApi.fetchOdsColumnInfo($scope.odsID, $scope.odsColumnID)
                .then(function(ret) {
                    $scope.pColumnInfo = ret.data;
                }, function(err) {
                    $scope.pColumnInfo = err;
                });
        }

        //fetchOdsRelationInfo example
        $scope.fetchOdsRelationInfo = function() {
            esWebApi.fetchOdsRelationInfo($scope.odsID)
                .then(function(ret) {
                    $scope.pRelationInfo = ret.data;
                }, function(err) {
                    $scope.pRelationInfo = err;
                });
        }

        //fetchOdsMasterRelationsInfo example
        $scope.fetchOdsMasterRelationsInfo = function() {
            esWebApi.fetchOdsMasterRelationsInfo($scope.odsID, $scope.odsColumnID)
                .then(function(ret) {
                    $scope.pRelationInfo = ret.data;
                }, function(err) {
                    $scope.pRelationInfo = err;
                });
        }

        //fetchOdsDetailRelationsInfo example
        $scope.fetchOdsDetailRelationsInfo = function() {
            esWebApi.fetchOdsDetailRelationsInfo($scope.odsID, $scope.odsColumnID)
                .then(function(ret) {
                    $scope.pRelationInfo = ret.data;
                }, function(err) {
                    $scope.pRelationInfo = err;
                });
        }

        $scope.fetchServerCapabilities = function() {
            esWebApi.fetchServerCapabilities()
                .then(function(ret) {
                    $scope.pSrvCapabilities = ret;
                }, function(err) {
                    $scope.pSrvCapabilities = err;
                });
        }

        $scope.fetchUserSites = function() {
            esWebApi.fetchUserSites($scope.pUser)
                .then(function(ret) {
                    $scope.pUserSites = ret.data;
                }, function(err) {
                    $scope.pUserSites = err;
                });
        }

        $scope.fetchStdZoom = function() {
            var zoomOptions = {
                WithCount: false,
                Page: 300,
                PageSize: 5

            };
            esWebApi.fetchStdZoom($scope.pZoomID, null, true)
                .then(function(ret) {
                    $scope.pZoomResults = ret.data;
                }, function(err) {
                    $scope.pZoomResults = JSON.stringify(err);
                });
        }

        //logout sample
        $scope.doLogout = function() {
            esWebApi.logout();
        };

        // fetchCompanyParam
        $scope.fetchCompanyParam = function() {
            esWebApi.fetchCompanyParam($scope.pCompanyParam)
                .then(function(x) {
                        $scope.pCompanyParamValue = x.data;
                    },
                    function(err) {
                        $scope.pCompanyParamValue = JSON.stringify(err);
                    });
        }

        //fetchCompanyParams
        $scope.fetchCompanyParams = function() {
            if (!$scope.pCompanyParams) {
                $scope.pCompanyParams = null;
            }
            esWebApi.fetchCompanyParams($scope.pCompanyParams)
                .then(function(x) {
                        $scope.pCompanyParamsValue = x.data;
                    },

                    function(err) {
                        $scope.pCompanyParamsValue = JSON.stringify(err);
                    });
        };

        //generic function for executing esWebApi functions that take no params
        $scope.voidgeneric = function() {

            var f = esWebApi[$scope.pMethod];
            if (!f) {
                $scope.pMethodResults = "Method [" + $scope.pMethod + "] not found";
                return;
            }

            var retVal = f();
            if (retVal.then) {
                retVal.then(function(x) {
                        $scope.pMethodResults = x;
                    },

                    function(err) {
                        $scope.pMethodResults = JSON.stringify(err);
                    });
            } else {
                $scope.pMethodResults = retVal;
            }

        };

        // fetchScroller sample
        $scope.fetchScroller = function() {
            var scroller_params = {
                Name: "a*"
            };
            esWebApi.fetchScroller($scope.pGroup, $scope.pFilter, scroller_params)
                .then(function(ret) {
                        $scope.pScrollerResults = ret.data;
                        $log.info(ret);
                    },
                    function(err) {
                        $scope.pScrollerResults = err;
                        $log.error(err);
                    });
        }

        // fetchSimpleScrollerRootTable sample
        $scope.fetchSimpleScrollerRootTable = function() {
            var scroller_params = {
                Name: "a*"
            };
            esWebApi.fetchSimpleScrollerRootTable($scope.pGroup, $scope.pFilter, scroller_params)
                .then(function(ret) {
                        $scope.pScrollerResults = ret.data;
                        $log.info(ret);
                    },
                    function(err) {
                        $scope.pScrollerResults = err;
                        $log.error(err);
                    });
        }

        $scope.ImagefetchEASWebAsset = function(options) {
            esWebApi.fetchEASWebAsset($scope.pAsset, options)
                .then(function(ret) {
                        $scope.pImageResults = ret.data;
                    },
                    function(err) {
                        alert(err);
                    });
        }

        $scope.TextfetchEASWebAsset = function(options) {
            esWebApi.fetchEASWebAsset($scope.pAsset, options)
                .then(function(ret) {
                        $scope.pTextResults = ret.data;
                    },
                    function(err) {
                        alert(err);
                    });
        }

        $scope.fetchEASWebAsset = function(options) {
            esWebApi.fetchEASWebAsset($scope.pAsset, options)
                .then(function(ret) {
                        $scope.pAssetResults = ret.data;

                        var sType = esGlobals.getMimeTypeForExt($scope.pAsset);
                        $log.info("File " + $scope.pAsset + " ===> " + sType);
                        var file = new Blob([ret.data], {
                            type: sType
                        });
                        //saveAs(file, "test.pdf");
                        var fU = URL.createObjectURL(file);
                        window.open(fU);
                    },
                    function(err) {
                        $scope.pAssetResults = err;
                    });
        }

        $scope.fetchES00DocumentByGID = function() {
            esWebApi.fetchES00DocumentByGID($scope.pES00Doc)
                .then(function(ret) {
                        $scope.pES00DocResults = ret.data;
                    },
                    function(err) {
                        $scope.pES00DocResults = err;
                    });
        }

        $scope.fetchES00DocumentByCode = function() {
            esWebApi.fetchES00DocumentByCode($scope.pES00Doc)
                .then(function(ret) {
                        $scope.pES00DocResults = ret.data;
                    },
                    function(err) {
                        $scope.pES00DocResults = err;
                    });
        }

        $scope.fetchES00DocumentsByEntityGID = function() {
            esWebApi.fetchES00DocumentsByEntityGID($scope.pES00Doc)
                .then(function(ret) {
                        $scope.pES00DocResults = ret.data;
                    },
                    function(err) {
                        $scope.pES00DocResults = err;
                    });
        }

        $scope.fetchES00DocumentBlobDataByGID = function() {
            /*
            esWebApi.fetchES00DocumentByGID($scope.pES00Doc)
                .then(function(ret) {
                    return ret.data;
                })
                .then(function(esDoc) {
                    docType = esGlobals.getMimeTypeForExt(esDoc.FType);
                    return esWebApi.fetchES00DocumentBlobDataByGID(esDoc.GID);
                })
                .then(function(fData) {
                    $log.info("File " + $scope.pAsset + " ===> " + docType);
                    var file = new Blob([fData.data], {
                        type: docType
                    });
                    //saveAs(file, "test.pdf");
                    var fU = URL.createObjectURL(file);
                    window.open(fU);
                })
                .catch(function(err) {
                    $log.error("2nd error = " + JSON.stringify(err));
                });
            */

            $q.all([esWebApi.fetchES00DocumentByGID($scope.pES00Doc), esWebApi.fetchES00DocumentBlobDataByGID($scope.pES00Doc)])
                .then(function(results) {
                    var esDoc = results[0].data;
                    var fileData = results[1].data;

                    var docType = esGlobals.getMimeTypeForExt(esDoc.FType);
                    $log.info("File " + $scope.pAsset + " ===> " + docType);
                    var file = new Blob([fileData], {
                        type: docType
                    });
                    //saveAs(file, "test.pdf");
                    var fU = URL.createObjectURL(file);
                    window.open(fU);
                })
                .catch(function(err) {
                    $log.error("2nd error = " + JSON.stringify(err));
                });
        }
    }
]);

smeControllers.controller('pqCtrl', ['$location', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
       $scope.pqs = [
       
            {
                groupId: "ESTMSocialCRM",
                filterId: "ESTMSMPersonList",
                gridOptions: {},
                pVals: {}
            },
            {
                groupId: "ESMMStockItem",
                filterId: "StockItemPhotoList",
                gridOptions: {},
                pVals: {}
            },
            {
                groupId: "ESFICustomer",
                filterId: "CS_CollectionPlanning",
                gridOptions: {},
                pVals: {}
            },

            {
                groupId: "ESFICustomer",
                filterId: "ESFITradeAccountCustomer_def",
                gridOptions: {},
                pVals: {}
            },

            {
                groupId: "ESMMStockItem",
                filterId: "ESMMStockItem_def",
                gridOptions: {},
                pVals: {}
            }
        ];
    }
]);

smeControllers.controller('webpqCtrl', ['$location', '$scope', '$log', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.webPQOptions = {};
        $scope.webPQOptions.theGroupId = "ESFICustomer";
        $scope.webPQOptions.theFilterId = "ESFITradeAccountCustomer_def";
        $scope.webPQOptions.theVals = {};
        $scope.webPQOptions.theGridOptions = {};
    }
]);
