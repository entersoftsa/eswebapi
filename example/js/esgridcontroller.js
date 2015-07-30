'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);

smeControllers.controller('mainCtrl', ['$location', '$scope', '$log', 'es.Services.Messaging', 'es.Services.WebApi', 'es.Services.Globals',
    function($location, $scope, $log, esMessaging, esWebApiService, esGlobals) {

        $scope.odscinfo = null;
        $scope.press = function() {
            esWebApiService.fetchOdsTableInfo("ESFICustomer").success(function(x) {
                $scope.odscinfo = x;
            });
        };

        esMessaging.subscribe("ES_HTTP_CORE_ERR", function(rejection, status) {
            var s = esGlobals.getUserMessage(rejection, status);
            $scope.esnotify.error(s);
        });
    }
]);

smeControllers.controller('loginCtrl', ['$location', '$rootScope', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $rootScope, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {
        $scope.credentials = {
            UserID: 'sme',
            Password: 'smekonren',
            BranchID: 'ΑΘ',
            LangID: 'el-GR'
        };

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
            kendoEvent.sender.text(mapper(kendoEvent.sender.dataItem(), $scope.myDateVal));
        }

        $scope.myDateVal = new esWebUIHelper.ESDateParamVal();

        var mapper = function(val, dateVal) {
            var d = new Date();

            switch (val.dType) {
                case 0:
                    {
                        if (!dateVal || !(angular.isDate(dateVal.fromD) && angular.isDate(dateVal.toD))) {
                            return val.title;
                        }

                        var s = "";
                        if (angular.isDate(dateVal.fromD)) {
                            s = dateVal.fromD.toLocaleDateString("el-GR");
                        }
                        s = s + " - ";

                        var toS = "";
                        if (angular.isDate(dateVal.toD)) {
                            toS = dateVal.toD.toLocaleDateString("el-GR");
                        }
                        s = s + toS;
                        return s;
                    }
                case 1:
                    {
                        if (!dateVal || !angular.isDate(dateVal.fromD)) {
                            return val.title;
                        }
                        return dateVal.fromD.toLocaleDateString("el-GR");
                    }
                case 2:
                    return val.title;
                case 3:
                    return d.toLocaleDateString();
                case 4:
                    return "-> " + d.toLocaleDateString();
                case 5:
                    return d.toLocaleDateString() + " ->";
                case 6:
                    {
                        d.setDate(d.getDate() - 1);
                        return d.toLocaleDateString();
                    }
                case 7:
                    {
                        d.setDate(d.getDate() - 1);
                        return d.toLocaleDateString() + " ->";
                    }
                case 8:
                    {
                        d.setDate(d.getDate() + 1);
                        return d.toLocaleDateString();
                    }
                case 9:
                {
                    d.setDate(d.getDate() + 1);
                    return d.toLocaleDateString() + " ->";
                }
                case 10:
                {
                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);
                    
                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString() + " - " + t.toLocaleDateString();
                }
                case 11:
                {
                    d.setDate(d.getDate() - 7);

                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);
                    
                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString() + " - " + t.toLocaleDateString();
                }
                case 12:
                {
                    d.setDate(d.getDate() + 7);
                    
                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);
                    
                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString() + " - " + t.toLocaleDateString();
                }
                case 13:
                {
                    d.setDate(1);
                    
                    var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    return d.toLocaleDateString() + " - " + f.toLocaleDateString();
                }
                case 14:
                {
                    d.setDate(1);
                    return d.toLocaleDateString() + " ->";
                }
                case 15:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    return "-> " + f.toLocaleDateString();
                }
                case 16:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    var t = new Date(d.getFullYear(), d.getMonth(), 0);
                    return f.toLocaleDateString() + " - " + t.toLocaleDateString();
                }
                case 17:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    return f.toLocaleDateString() + " ->";
                }
                case 18:
                {
                    var f = new Date(d.getFullYear(), d.getMonth(), 0);
                    return "-> " + f.toLocaleDateString();
                }
                case 19:
                {
                    var m = d.getMonth();
                    var r = m % 3;

                    var f = new Date(d.getFullYear(), m - r, 1);
                    var t = new Date(d.getFullYear(), m + (3 - r), 0);
                    return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                }
                case 20:
                {
                    var m = d.getMonth();
                    var r = m % 3;

                    var t = new Date(d.getFullYear(), m - r, 0);
                    var f = new Date(d.getFullYear(), t.getMonth() - 2, 1);
                    return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                }
                case 21:
                {
                    var f = new Date(d.getFullYear(), (m >= 6) ? 6 : 0, 1);
                    var t = new Date(d.getFullYear(), (m >= 6) ? 11 : 5, (m >= 6) ? 31 : 30);
                    return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                }
                case 22:
                {
                    var f;
                    var t;
                    var y = d.getFullYear();
                    if (m >= 6) {
                        f = new Date(y, 0, 1);
                        t = new Date(y, 5, 30);
                    } else {
                        f = new Date(y - 1, 6, 1);
                        t = new Date(y - 1, 11, 31);
                    }
                    
                    return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                }

                case 23:
                {
                    var y = d.getFullYear();
                    var f = new Date(y, 0, 1);
                    var t = new Date(y, 11, 31);
                    return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                }

                case 24:
                {
                    var y = d.getFullYear() - 1;
                    var f = new Date(y, 0, 1);
                    var t = new Date(y, 11, 31);
                    return f.toLocaleDateString() + " -> " + t.toLocaleDateString();
                }

                default:
                    return "ooops";
            }
        }

        $scope.dateRange = [{
            value: "0",
            dType: 0,
            title: "Specific Date Range"
        }, {
            dValue: "1",
            dType: 1,
            title: "Specific Date"
        }, {
            dValue: 'ESDateRange(SpecificDate, "9999/01/01", SpecificDate, "1753/01/01")',
            dType: 2,
            title: "Anything"
        }, {
            dValue: "ESDateRange(Day)",
            dType: 3,
            title: "Today"
        }, {
            dValue: 'ESDateRange(SpecificDate, "1753/01/01", Day, 0)',
            dType: 4,
            title: "Up Today"
        }, {
            dValue: 'ESDateRange(Day, 0, SpecificDate, "9999/01/01")',
            dType: 5,
            title: "Starting from Today"
        }, {
            dValue: "ESDateRange(Day, -1)",
            dType: 6,
            title: "Yesterday"
        }, {
            dValue: 'ESDateRange(SpecificDate, "1753/01/01", Day, -1)',
            dType: 7,
            title: "Up To Yesterday"
        }, {
            dValue: "ESDateRange(Day, 1)",
            dType: 8,
            title: "Tomorrow"
        }, {
            dValue: 'ESDateRange(Day, 1, SpecificDate, "9999/01/01")',
            dType: 9,
            title: "Starting from Tomorrow"
        }, {
            dValue: "ESDateRange(Week)",
            dType: 10,
            title: "This week"
        }, {
            dValue: "ESDateRange(Week, -1)",
            dType: 11,
            title: "Previous week"
        }, {
            dValue: "ESDateRange(Week, 1)",
            dType: 12,
            title: "Next week"
        }, {
            dValue: "ESDateRange(Month)",
            dType: 13,
            title: "This month"
        }, {
            dValue: 'ESDateRange(Month, 0, SpecificDate, "9999/01/01")',
            dType: 14,
            title: "Since 1st of month"
        }, {
            dValue: 'ESDateRange(SpecificDate, "1753/01/01", Month, 0)',
            dType: 15,
            title: "Up to end of month"
        }, {
            dValue: "ESDateRange(Month, -1)",
            dType: 16,
            title: "Last month"
        }, {
            dValue: 'ESDateRange(Month, -1, SpecificDate, "9999/01/01")',
            dType: 17,
            title: "Since 1st of last month"
        }, {
            dValue: 'ESDateRange(SpecificDate, "1753/01/01", Month, -1)',
            dType: 18,
            title: "Up to end of last month"
        }, {
            dValue: "ESDateRange(Quarter)",
            dType: 19,
            title: "This quarter"
        }, {
            dValue: "ESDateRange(Quarter, -1)",
            dType: 20,
            title: "Last quarter"
        }, {
            dValue: "ESDateRange(SixMonth)",
            dType: 21,
            title: "This HY"
        }, {
            dValue: "ESDateRange(SixMonth, -1)",
            dType: 22,
            title: "Last HY"
        }, {
            dValue: "ESDateRange(Year)",
            dType: 23,
            title: "This Year"
        }, {
            dValue: "ESDateRange(Year, -1)",
            dType: 24,
            title: "Last Year"
        }, ];

        /* End Section */

        $scope.doLogin = function() {
            esWebApiService.openSession($scope.credentials)
                .then(function(rep) {
                    $location.path("/pq");
                });
        }

    }
]);

smeControllers.controller('propertiesCtrl', ['$location', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.getVersionInfo = function() {
            $scope.version = {};

            $scope.esAngularVersion = esGlobals.getVersion();

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

smeControllers.controller('pqCtrl', ['$location', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($location, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.pqs = [{
            groupId: "ESFICustomer",
            filterId: "CS_CollectionPlanning",
            gridOptions: null,
            pVals: null
        }, {
            groupId: "ESFICustomer",
            filterId: "ESFITradeAccountCustomer_def",
            gridOptions: null,
            pVals: null
        }, {
            groupId: "ESMMStockItem",
            filterId: "ESMMStockItem_def",
            gridOptions: null,
            pVals: null
        }];


        $scope.doRun = function(pq) {
            pq.gridOptions.dataSource.read();

        }
    }
]);
