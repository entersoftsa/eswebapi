'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI', 'ui.bootstrap']);

smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals',
    function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

        /* boot strap configuration */
        $scope.configure = function(e) {
            $("#configurator-wrap").toggleClass("hidden-xs");
        }

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
       $scope.pqs = [{
                groupId: "ESFICustomer",
                filterId: "CS_CollectionPlanning",
                gridOptions: null,
                pVals: null
            },

            {
                groupId: "ESFICustomer",
                filterId: "ESFITradeAccountCustomer_def",
                gridOptions: {},
                pVals: null
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
