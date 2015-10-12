/**
 * @ngdoc overview
 * @name es.Web.UI
 * @module es.Web.UI
 * @kind module
 * @description
 * This module encapsulates a set of directives, filters, services and methods for UI
 */

(function() {
    'use strict';
    var esWEBUI = angular.module('es.Web.UI', ['ui.bootstrap']);

    var dateRangeResolve = function(dateVal) {
        if (!dateVal || !dateVal.dRange) {
            return '';
        }

        var d = new Date();

        var dObj = _.findWhere(esDateRangeOptions, {
            dValue: dateVal.dRange
        });
        if (!dObj) {
            return '';
        }

        switch (dObj.dType) {
            case 0:
                {
                    if (!angular.isDate(dateVal.fromD) && !angular.isDate(dateVal.toD)) {
                        return "";
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
                    if (!angular.isDate(dateVal.fromD)) {
                        return "";
                    }
                    return dateVal.fromD.toLocaleDateString("el-GR");
                }
            case 2:
                return "";
            case 3:
                return d.toLocaleDateString("el-GR");
            case 4:
                return "-> " + d.toLocaleDateString("el-GR");
            case 5:
                return d.toLocaleDateString("el-GR") + " ->";
            case 6:
                {
                    d.setDate(d.getDate() - 1);
                    return d.toLocaleDateString("el-GR");
                }
            case 7:
                {
                    d.setDate(d.getDate() - 1);
                    return d.toLocaleDateString("el-GR") + " ->";
                }
            case 8:
                {
                    d.setDate(d.getDate() + 1);
                    return d.toLocaleDateString("el-GR");
                }
            case 9:
                {
                    d.setDate(d.getDate() + 1);
                    return d.toLocaleDateString("el-GR") + " ->";
                }
            case 10:
                {
                    var cDay = d.getDay();
                    var sDiff = (cDay == 0) ? 6 : (cDay - 1);

                    var f = new Date(d);
                    var t = new Date(d);
                    f.setDate(d.getDate() - sDiff);
                    t.setDate(f.getDate() + 6);

                    return f.toLocaleDateString("el-GR") + " - " + t.toLocaleDateString("el-GR");
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

                    return f.toLocaleDateString("el-GR") + " - " + t.toLocaleDateString("el-GR");
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

                    return f.toLocaleDateString("el-GR") + " - " + t.toLocaleDateString("el-GR");
                }
            case 13:
                {
                    d.setDate(1);

                    var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    return d.toLocaleDateString("el-GR") + " - " + f.toLocaleDateString("el-GR");
                }
            case 14:
                {
                    d.setDate(1);
                    return d.toLocaleDateString("el-GR") + " ->";
                }
            case 15:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    return "-> " + f.toLocaleDateString("el-GR");
                }
            case 16:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    var t = new Date(d.getFullYear(), d.getMonth(), 0);
                    return f.toLocaleDateString("el-GR") + " - " + t.toLocaleDateString("el-GR");
                }
            case 17:
                {
                    var f = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    return f.toLocaleDateString("el-GR") + " ->";
                }
            case 18:
                {
                    var f = new Date(d.getFullYear(), d.getMonth(), 0);
                    return "-> " + f.toLocaleDateString("el-GR");
                }
            case 19:
                {
                    var m = d.getMonth();
                    var r = m % 3;

                    var f = new Date(d.getFullYear(), m - r, 1);
                    var t = new Date(d.getFullYear(), m + (3 - r), 0);
                    return f.toLocaleDateString("el-GR") + " -> " + t.toLocaleDateString("el-GR");
                }
            case 20:
                {
                    var m = d.getMonth();
                    var r = m % 3;

                    var t = new Date(d.getFullYear(), m - r, 0);
                    var f = new Date(d.getFullYear(), t.getMonth() - 2, 1);
                    return f.toLocaleDateString("el-GR") + " -> " + t.toLocaleDateString("el-GR");
                }
            case 21:
                {
                    var f = new Date(d.getFullYear(), (m >= 6) ? 6 : 0, 1);
                    var t = new Date(d.getFullYear(), (m >= 6) ? 11 : 5, (m >= 6) ? 31 : 30);
                    return f.toLocaleDateString("el-GR") + " -> " + t.toLocaleDateString("el-GR");
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

                    return f.toLocaleDateString("el-GR") + " -> " + t.toLocaleDateString("el-GR");
                }

            case 23:
                {
                    var y = d.getFullYear();
                    var f = new Date(y, 0, 1);
                    var t = new Date(y, 11, 31);
                    return f.toLocaleDateString("el-GR") + " -> " + t.toLocaleDateString("el-GR");
                }

            case 24:
                {
                    var y = d.getFullYear() - 1;
                    var f = new Date(y, 0, 1);
                    var t = new Date(y, 11, 31);
                    return f.toLocaleDateString("el-GR") + " -> " + t.toLocaleDateString("el-GR");
                }
            default:
                return dObj.title;
        }
    }


    var esComplexParamFunctionOptions = [{
        caption: "Ίσο",
        value: "EQ"
    }, {
        caption: "Διαφορετικό",
        value: "NE"
    }, {
        caption: "Μικρότερο",
        value: "LT"
    }, {
        caption: "Μικρότερο ή Ίσο",
        value: "LE"
    }, {
        caption: "Μεγαλύτερο",
        value: "GT"
    }, {
        caption: "Μεγαλύτερο ή ίσο",
        value: "GE"
    }, {
        caption: "Από - Έως",
        value: "RANGE"
    }, {
        caption: "Κενό",
        value: "NULL"
    }, {
        caption: "Μη κενό",
        value: "NOTNULL"
    }];

    var dDateRangeClass = {
        6: [0, 1, 2, 3, 6, 8, 10, 11, 12, 13, 16, 19, 20, 21, 22, 23, 24],
        20: [0, 1, 25, 26, 27, 28, 29, 30],
    };

    var esDateRangeOptions = [{
        dValue: "0",
        dType: 0,
        title: "Specific Date Range"
    }, {
        dValue: "1",
        dType: 1,
        title: "Specific Date"
    }, {
        dValue: 'ESDateRange(SpecificDate, #9999/01/01#, SpecificDate, #1753/01/01#)',
        dType: 2,
        title: "Anything"
    }, {
        dValue: "ESDateRange(Day)",
        dType: 3,
        title: "Today"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Day, 0)',
        dType: 4,
        title: "Up Today"
    }, {
        dValue: 'ESDateRange(Day, 0, SpecificDate, #9999/01/01#)',
        dType: 5,
        title: "Starting from Today"
    }, {
        dValue: "ESDateRange(Day, -1)",
        dType: 6,
        title: "Yesterday"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Day, -1)',
        dType: 7,
        title: "Up To Yesterday"
    }, {
        dValue: "ESDateRange(Day, 1)",
        dType: 8,
        title: "Tomorrow"
    }, {
        dValue: 'ESDateRange(Day, 1, SpecificDate, #9999/01/01#)',
        dType: 9,
        title: "Starting from Tomorrow"
    }, {
        dValue: "ESDateRange(Week)",
        dType: 10,
        title: "Current week"
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
        title: "Current month"
    }, {
        dValue: 'ESDateRange(Month, 0, SpecificDate, #9999/01/01#)',
        dType: 14,
        title: "Since 1st of month"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Month, 0)',
        dType: 15,
        title: "Up to end of month"
    }, {
        dValue: "ESDateRange(Month, -1)",
        dType: 16,
        title: "Last month"
    }, {
        dValue: 'ESDateRange(Month, -1, SpecificDate, #9999/01/01#)',
        dType: 17,
        title: "Since 1st of last month"
    }, {
        dValue: 'ESDateRange(SpecificDate, #1753/01/01#, Month, -1)',
        dType: 18,
        title: "Up to end of last month"
    }, {
        dValue: "ESDateRange(Quarter)",
        dType: 19,
        title: "Current quarter"
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
        title: "Current Year"
    }, {
        dValue: "ESDateRange(Year, -1)",
        dType: 24,
        title: "Last Year"
    }, {
        dValue: "ESDateRange(FiscalPeriod, 0)",
        dType: 25,
        title: "Current Fiscal Period"
    }, {
        dValue: "ESDateRange(FiscalYear, 0, Day, 0)",
        dType: 26,
        title: "Since start of FY up today"
    }, {
        dValue: "ESDateRange(FiscalYear, 0, FiscalPeriod, 0)",
        dType: 27,
        title: "Since start of FY up to end of Fiscal Period"
    }, {
        dValue: "ESDateRange(FiscalPeriod, -1)",
        dType: 28,
        title: "Last Fiscal Period"
    }, {
        dValue: "ESDateRange(FiscalPeriod, -1, Day, 0)",
        dType: 29,
        title: "Since start of last Fiscal Period up today"
    }, {
        dValue: "ESDateRange(FiscalYear, 0, FiscalPeriod, -1)",
        dType: 30,
        title: "Since start of FY up to last Fiscal Period"
    }, ];

    function ESParamVal(paramId, paramVal) {
        this.paramCode = paramId;
        this.paramValue = paramVal;
    }

    ESParamVal.prototype.getExecuteVal = function() {
        return this.paramValue;
    };

    ESParamVal.prototype.strVal = function() {
        return this.paramValue ? this.paramValue.toString() : '';
    };

    function ESNumericParamVal(paramId, paramVal) {
        //call super constructor
        ESParamVal.call(this, paramId, paramVal);
    }

    //inherit from ESParamval SuperClass
    ESNumericParamVal.prototype = Object.create(ESParamVal.prototype);

    ESNumericParamVal.prototype.strVal = function() {
        var zero = 0;
        zero = zero.toString();
        var froms = this.paramValue.value ? this.paramValue.value.toString() : zero;
        var tos = this.paramValue.valueTo ? this.paramValue.valueTo.toString() : zero;
        switch (this.paramValue.oper) {
            case "RANGE":
                return "ΑΠΟ " + froms + " ΕΩΣ " + tos;

            case "NULL":
                return "KENO";

            case "NOTNULL":
                return "MH KENO";

            default:
                return this.paramValue.oper.toString() + " " + froms;
        }
    }

    ESNumericParamVal.prototype.getExecuteVal = function() {
        switch (this.paramValue.oper) {
            case "RANGE":
                return "ESNumeric(" + this.paramValue.oper + ", '" + this.paramValue.value + "', '" + this.paramValue.valueTo + "')";
            case "NULL":
            case "NOTNULL":
                return "ESNumeric(" + this.paramValue.oper + ", '0')";
            default:
                return "ESNumeric(" + this.paramValue.oper + ", '" + this.paramValue.value + "')";
        }
    }

    function ESStringParamVal(paramId, paramVal) {
        //call super constructor
        ESParamVal.call(this, paramId, paramVal);
    }

    //inherit from ESParamval SuperClass
    ESStringParamVal.prototype = Object.create(ESParamVal.prototype);

    ESStringParamVal.prototype.strVal = function() {
        var froms = this.paramValue.value ? this.paramValue.value.toString() : '';
        var tos = this.paramValue.valueTo ? this.paramValue.valueTo.toString() : '';
        switch (this.paramValue.oper) {
            case "RANGE":
                return "ΑΠΟ " + froms + " ΕΩΣ " + tos;

            case "NULL":
                return "KENO";

            case "NOTNULL":
                return "MH KENO";

            default:
                return this.paramValue.oper.toString() + " " + froms;
        }
    }

    ESStringParamVal.prototype.getExecuteVal = function() {
        switch (this.paramValue.oper) {
            case "EQ":
                return this.paramValue.value;
            case "RANGE":
                return "ESString(" + this.paramValue.oper + ", '" + this.paramValue.value + "', '" + this.paramValue.valueTo + "')";
            case "NULL":
            case "NOTNULL":
                return "ESString(" + this.paramValue.oper + ", '')";
            default:
                return "ESString(" + this.paramValue.oper + ", '" + this.paramValue.value + "')";
        }
    }

    function ESDateParamVal(paramId, paramVal) {
        //call super constructor
        //param id will be given at a later assignment
        if (!paramVal) {
            paramVal = {
                // empty date range is treated as ANYTHING
                dRange: 'ESDateRange(SpecificDate, #9999/01/01#, SpecificDate, #1753/01/01#)',
                fromD: null,
                toD: null
            };
        }
        ESParamVal.call(this, paramId, paramVal);
    }

    ESDateParamVal.prototype = Object.create(ESParamVal.prototype);

    ESDateParamVal.prototype.strVal = function() {
        return dateRangeResolve(this.paramValue);
    }

    ESDateParamVal.prototype.getExecuteVal = function() {
        var s = this.paramValue.dRange;
        if (s == "0" || s == "1") {
            var sFromD = "#1753/01/01#";
            var sToD = "#9999/01/01#";
            var isEmpty = true;

            // Fix the fromD
            var mFromD = moment(this.paramValue.fromD);
            if (mFromD.isValid()) {
                isEmpty = false;
                sFromD = mFromD.format('YYYY/MM/DD');
            }

            var mToD = moment(this.paramValue.toD);
            if (mToD.isValid()) {
                isEmpty = false;
                sToD = mToD.format('YYYY/MM/DD');
            }

            if (s == "0" || isEmpty) {
                return "ESDateRange(SpecificDate, " + "#" + sFromD + "#" + ", SpecificDate, " + "#" + sToD + "#" + ")";
            }

            return "ESDateRange(SpecificDate, " + "#" + sFromD + "#" + ")";
        }

        return this.paramValue.dRange;
    }

    function ESParamValues(vals) {
        this.setParamValues(vals);
    }

    ESParamValues.prototype.setParamValues = function(vals) {
        var x = this;

        //delete any previsously assigned properties
        for (var prop in x) {
            if (x.hasOwnProperty(prop)) {
                delete x[prop];
            }
        };

        //asign new properties
        if (!vals || !_.isArray(vals) || vals.length == 0) {
            return;
        }

        vals.forEach(function(element, index, array) {
            x[element.paramCode] = element;
        });
    }

    ESParamValues.prototype.getExecuteVals = function() {
        var x = this;
        var ret = {};
        for (var prop in x) {
            if (x.hasOwnProperty(prop)) {
                var p = x[prop];

                if (p.paramValue || (angular.isNumber(p.paramValue) && p.paramValue == 0)) {
                    ret[p.paramCode] = p.getExecuteVal();
                }
            }
        }
        return ret;
    }

    function prepareStdZoom($log, zoomID, esWebApiService, useCache) {
        var xParam = {
            transport: {
                read: function(options) {

                    $log.info("FETCHing ZOOM data for [", zoomID, "] with options ", JSON.stringify(options));

                    var pqOptions = {};
                    esWebApiService.fetchStdZoom(zoomID, pqOptions, useCache)
                        .then(function(ret) {
                            var pq = ret.data;

                            // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                            if (pq.Count == -1) {
                                pq.Count = pq.Rows ? pq.Rows.length : 0;
                            }
                            // END tackling

                            options.success(pq);
                            $log.info("FETCHed ZOOM data for [", zoomID, "] with options ", JSON.stringify(options));
                        }, function(err) {
                            options.error(err);
                        });
                }

            },
            schema: {
                data: "Rows",
                total: "Count"
            }
        }
        return new kendo.data.DataSource(xParam);
    }


    function prepareWebScroller(dsType, esWebApiService, $log, espqParams, esOptions) {
        var xParam = {
            transport: {
                read: function(options) {

                    var qParams = angular.isFunction(espqParams) ? espqParams() : espqParams;
                    $log.info("FETCHing PQ with PQParams ", JSON.stringify(qParams), " and gridoptions ", JSON.stringify(options));
                    var pqOptions = {};

                    if (options.data && options.data.page && options.data.pageSize) {
                        pqOptions.WithCount = true;
                        pqOptions.Page = options.data.page;
                        pqOptions.PageSize = options.data.pageSize
                    }

                    var executeParams = qParams.Params;
                    if (executeParams instanceof ESParamValues) {
                        executeParams = executeParams.getExecuteVals();
                    }


                    esWebApiService.fetchPublicQuery(qParams.GroupID, qParams.FilterID, pqOptions, executeParams)
                        .success(function(pq) {

                            if (!angular.isDefined(pq.Rows)) {
                                pq.Rows = [];
                                pq.Count = 0;
                            }

                            if (!angular.isDefined(pq.Count)) {
                                pq.Count = -1;
                            }

                            options.success(pq);
                            $log.info("FETCHed PQ with PQParams ", JSON.stringify(executeParams), " and gridoptions ", JSON.stringify(options));
                        })
                        .error(function(err) {
                            $log.error("Error in DataSource ", err);
                            options.error(err);
                        });
                },

            },
            requestStart: function(e) {
                $log.info("request started ", e);
            },

            schema: {
                data: "Rows",
                total: "Count"
            }
        }

        if (esOptions) {
            angular.extend(xParam, esOptions);
        }

        if (dsType && dsType === "pivot") {
            return new kendo.data.PivotDataSource(xParam);
        } else {
            return new kendo.data.DataSource(xParam);
        }
    }

    /**
     * @ngdoc filter
     * @name es.Web.UI.filter:esTrustHtml
     *
     * @description
     * Creates `esGrid` Directive
     * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
     * * If `source` is identical to 'destination' an exception will be thrown.
     *
     * @requires $sce
     */
    esWEBUI.filter('esTrustHtml', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }
    ]);

    esWEBUI
        .filter('esParamTypeMapper', function() {
            var f = function(pParam) {
                if (!pParam) {
                    return "";
                }

                var pt = pParam.parameterType.toLowerCase();

                //ESDateRange
                if (pt.indexOf("entersoft.framework.platform.esdaterange, queryprocess") == 0) {
                    return "esParamDateRange";
                }

                //ESNumeric
                if (pt.indexOf("entersoft.framework.platform.esnumeric") == 0) {
                    return "esParamAdvancedNumeric";
                }

                //ESString
                if (pt.indexOf("entersoft.framework.platform.esstring, queryprocess") == 0) {
                    return "esParamAdvancedString";
                }

                // Numeric (Integer or Decimal)
                if (pt.indexOf("system.string, mscorlib") == 0) {
                    switch (pParam.controlType) {
                        case 1:
                            {
                                return "esParamNumeric";
                            }
                            break;
                        case 2:
                            {
                                return "esParamNumeric";
                            }
                            break;
                    }
                }


                //case Enum 
                if (pParam.enumList && (pParam.enumList.length > 1)) {
                    if (pParam.enumOptionAll) {
                        return "esParamMultiEnum";
                    } else {
                        return "esParamEnum";
                    }
                }

                if (pParam.invSelectedMasterTable) {
                    if (pParam.invSelectedMasterTable[4] == "Z") {
                        if (pParam.multiValued) {
                            return "esParamMultiZoom";
                        } else {
                            return "esParamZoom";
                        }
                    } else {
                        return "esParamText";
                    }
                }

                return "esParamText";

            };


            return f;
        })
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esGrid
         * @requires es.Services.Web.esWebApi Entersoft AngularJS WEB API for Entersoft Application Server
         * @requires es.Web.UI.esUIHelper
         * @requires $log
         * @restrict AE
         * @param {template} esGroupId The Entersoft Public Query Group ID
         * @param {template} esFilterId The Entersoft Public Query Filter ID
         * @param {esGridInfoOptions=} esGridOptions should grid options are already available you can explicitly assign
         * @param {object=} esExecuteParams Params object that will be used when executing the public query
         *
         * @description
         *
         * **TBD**
         * This directive is responsible to render the html for the presentation of the results / data of an Entersoft Public Query.
         * The esGrid generates a Telerik kendo-grid web ui element {@link http://docs.telerik.com/KENDO-UI/api/javascript/ui/grid kendo-grid}.
         * 
         * In order to instantiate an esGrid with an Angular application, you have to provide the parameters esGroupId and esFilterId are required.
         * These two parameters along with esExecuteParams will be supplied to the {@link es.Web.UI.esUIHelper#methods_esGridInfoToKInfo esToKendoTransform function}
         */
        .directive('esGrid', ['esWebApi', 'esUIHelper', '$log', function(esWebApiService, esWebUIHelper, $log) {
            return {
                restrict: 'AE',
                scope: {
                    esGroupId: "=",
                    esFilterId: "=",
                    esExecuteParams: "=",
                    esGridOptions: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esGrid.html";
                },
                link: function(scope, iElement, iAttrs) {
                    if (!scope.esGroupId || !scope.esFilterId) {
                        throw "You must set GroupID and FilterID for esgrid to work";
                    }

                    if (!scope.esGridOptions && !iAttrs.esGridOptions) {
                        // Now esGridOption explicitly assigned so ask the server 
                        esWebApiService.fetchPublicQueryInfo(scope.esGroupId, scope.esFilterId)
                            .then(function(ret) {
                                var p1 = ret.data;
                                var p2 = esWebUIHelper.winGridInfoToESGridInfo(scope.esGroupId, scope.esFilterId, p1);
                                scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, scope.esGroupId, scope.esFilterId, scope.esExecuteParams, p2);
                            });
                    }
                }
            };
        }])
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esParam
         * @function
         *
         * @description
         * **TBD**
         *
         * 
         */
        .directive('esParam', ['$log', '$modal', 'esWebApi', 'esUIHelper', function($log, $modal, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esParamDef: "=",
                    esParamVal: "=",
                    esType: "="
                },
                template: '<div ng-include src="\'src/partials/\'+esType+\'.html\'"></div>',
                link: function(scope, iElement, iAttrs) {

                    if (!scope.esParamDef) {
                        throw "You must set a param";
                    }

                    scope.esWebUIHelper = esWebUIHelper;
                    scope.esWebApiService = esWebApiService;

                    if (scope.esParamDef.invSelectedMasterTable) {
                        scope.esParamLookupDS = prepareStdZoom($log, scope.esParamDef.invSelectedMasterTable, esWebApiService);
                    }

                    // Case Date Range
                    if (scope.esParamDef.controlType == 6 || scope.esParamDef.controlType == 20) {
                        scope.dateRangeOptions = esWebUIHelper.getesDateRangeOptions(scope.esParamDef.controlType);
                        scope.dateRangeResolution = function() {
                            return "Hello World, I am parameter " + scope.esParamDef.caption;
                        }
                    }
                }
            };
        }])
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esWebPq
         * @element div
         * @function
         *
         * @description
         * **TBD**
         *
         * 
         */
        .directive('esWebPq', ['$log', 'esWebApi', 'esUIHelper', function($log, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esGroupId: "=",
                    esFilterId: "=",
                    esGridOptions: "=",
                    esParamsValues: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esWebPQ.html";
                },
                link: function(scope, iElement, iAttrs) {
                    if (!scope.esGroupId || !scope.esFilterId) {
                        throw "You must set the pair es-group-id and es-filter-id attrs";
                    }

                    scope.executePQ = function() {
                        scope.esGridOptions.dataSource.read();
                    }

                    esWebApiService.fetchPublicQueryInfo(scope.esGroupId, scope.esFilterId)
                        .then(function(ret) {
                            var v = esWebUIHelper.winGridInfoToESGridInfo(scope.esGroupId, scope.esFilterId, ret.data);
                            scope.esParamsValues = v.defaultValues;
                            scope.esParamsDef = v.params;
                            scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, scope.esGroupId, scope.esFilterId, scope.esParamsValues, v);
                        });
                }
            };
        }])
        /**
         * @ngdoc directive
         * @name es.Web.UI.directive:esParamsPanel
         * @function
         *
         * @description
         * **TBD**
         *
         * 
         */
        .directive('esParamsPanel', ['$log', 'esWebApi', 'esUIHelper', function($log, esWebApiService, esWebUIHelper) {
            return {
                restrict: 'AE',
                scope: {
                    esParamsDef: '=',
                    esPqInfo: '=',
                    esParamsValues: '=',
                    esGroupId: "=",
                    esFilterId: "=",
                },
                templateUrl: function(element, attrs) {
                    $log.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "src/partials/esParams.html";
                },
                link: function(scope, iElement, iAttrs) {
                    if (!iAttrs.esParamsDef && !iAttrs.esPqInfo && (!scope.esGroupId || !scope.esFilterId)) {
                        throw "You must set either the es-params-def or ea-pq-info or the pair es-group-id and es-filter-id attrs";
                    }

                    if (!iAttrs.esParamsDef) {
                        if (!iAttrs.esPqInfo) {
                            // we are given groupid and filterid =>
                            // we must retrieve pqinfo on owr own
                            esWebApiService.fetchPublicQueryInfo(scope.esGroupId, scope.esFilterId)
                                .function(function(ret) {
                                    var v = esWebUIHelper.winGridInfoToESGridInfo(scope.esGroupId, scope.esFilterId, ret.data);
                                    scope.esParamsValues = v.defaultValues;
                                    scope.esParamsDef = v.params;
                                });
                        } else {
                            scope.esParamDef = esPqInfo.params;
                        }
                    }
                }
            };
        }]);

    /**
     * @ngdoc service
     * @name es.Web.UI.esUIHelper
     * @requires es.Services.Web.esWebApi Entersoft AngularJS WEB API for Entersoft Application Server
     * @requires $log
     * @description This service provides a set of javascript objects and functions to support UI oriented operations such as preparation
     * of schema model for a web grid to show the results of a PQ, Entersoft PQ Parameters meta-data manipulation , etc.
     * yh
     */
    esWEBUI.factory('esUIHelper', ['esWebApi', '$log',
        function(esWebApiService, $log) {

            function esColToKCol(esGridInfo, esCol) {
                var tCol = {
                    field: esCol.field,
                    title: esCol.title,
                    width: esCol.width,
                    attributes: esCol.attributes,
                    values: esCol.enumValues,

                }

                if (esCol.formatString && esCol.formatString != "") {
                    tCol.format = "{0:" + esCol.formatString + "}";
                }
                return tCol;
            }

            function esGridInfoToKInfo(esWebApiService, esGroupId, esFilterId, executeParams, esGridInfo) {
                var grdopt = {
                    pageable: {
                        refresh: true,
                        pageSizes: [20, 50, 100, "All"]
                    },
                    sortable: true,
                    filterable: true,
                    resizable: true,
                    toolbar: ["pdf", "excel"],
                    excel: {
                        allPages: true,
                        fileName: esGroupId + "-" + esFilterId + ".xlsx",
                        filterable: true
                    }
                };

                var kdsoptions = {
                    serverFiltering: true,
                    serverPaging: true,
                    pageSize: 20
                };

                grdopt.columns = esGridInfo.columns;

                grdopt.dataSource = prepareWebScroller(null, esWebApiService, $log, function() {
                    return {
                        GroupID: esGroupId,
                        FilterID: esFilterId,
                        Params: executeParams
                    }
                }, kdsoptions);

                return grdopt;
            }

            function winColToESCol(inGroupID, inFilterID, gridexInfo, jCol) {
                var esCol = {
                    AA: undefined,
                    field: undefined,
                    title: undefined,
                    width: undefined,
                    visible: undefined,
                    attributes: undefined,
                    enumValues: undefined,
                    formatString: undefined,
                };

                esCol.AA = parseInt(jCol.AA);
                esCol.field = jCol.ColName;
                esCol.title = jCol.Caption;
                esCol.formatString = jCol.FormatString;
                esCol.visible = (jCol.Visible == "true");

                if (jCol.TextAlignment == "3") {
                    esCol.attributes = {
                        style: "text-align: right;"
                    };
                }

                //Enum Column
                if (jCol.EditType == "5") {
                    var l1 = _.sortBy(_.filter(gridexInfo.ValueList, function(x) {
                        var v = x.ColName == jCol.ColName;
                        v = v && (typeof x.Value != 'undefined');
                        v = v && x.fFilterID == inFilterID;
                        return v;
                    }), function(x) {
                        return !isNaN(x.Value) ? parseInt(x.Value) : null;
                    });
                    var l2 = _.map(l1, function(x) {
                        return {
                            text: x.Caption,
                            value: !isNaN(x.Value) ? parseInt(x.Value) : null
                        };
                    });

                    if (l2 && l2.length) {
                        esCol.enumValues = l2;
                    }
                }
                return esCol;
            }

            //here 
            function dateEval(pInfo, expr) {
                var SpecificDate = "SpecificDate";
                var Month = "Month";
                var SixMonth = "SixMonth";
                var Week = "Week";
                var Year = "Year";
                var Quarter = "Quarter";
                var Day = "Day";

                function isActualDate(v) {
                    return v && v != "1753/01/01" && v != "9999/01/01";
                }

                var dVal = eval(expr.replace(/#/g, '"'));
                var esdate = new ESDateParamVal(pInfo.id);

                // Specific Date
                var mD = moment(dVal, "YYYY/MM/DD");
                if (!dVal.fromType && !dVal.toType && !dVal.fromD && !dVal.toD && mD.isValid()) {
                    esdate.paramValue.dRange = "1";
                    esdate.paramValue.fromD = mD.toDate();
                    return esdate;
                }

                //From Specific Date To Specific Date
                if (dVal.fromType == SpecificDate && isActualDate(dVal.fromD) && dVal.toType == SpecificDate && isActualDate(dVal.toD)) {
                    esdate.paramValue.dRange = "0";
                    esdate.paramValue.fromD = new Date(dVal.fromD);
                    esdate.paramValue.toD = new Date(dVal.toD);
                    return esdate;
                }

                //From Specific Date To Specific Date
                if (dVal.fromType == SpecificDate && isActualDate(dVal.fromD)) {
                    esdate.paramValue.dRange = "1";
                    esdate.paramValue.fromD = new Date(dVal.fromD);
                    return esdate;
                }

                // all toher cases of esdaterange
                esdate.paramValue.dRange = expr;
                return esdate;
            }

            function esEval(pInfo, expr) {
                var EQ = {
                    oper: "EQ",
                    paramID: pInfo.id
                };
                var GE = {
                    oper: "GE",
                    paramID: pInfo.id
                };
                var GT = {
                    oper: "GT",
                    paramID: pInfo.id
                };
                var LE = {
                    oper: "LE",
                    paramID: pInfo.id
                };
                var LT = {
                    oper: "LT",
                    paramID: pInfo.id
                };
                var NE = {
                    oper: "NE",
                    paramID: pInfo.id
                };
                var RANGE = {
                    oper: "RANGE",
                    paramID: pInfo.id
                };
                var NULL = {
                    oper: "NULL",
                    paramID: pInfo.id
                };
                var NOTNULL = {
                    oper: "NOTNULL",
                    paramID: pInfo.id
                };
                return eval(expr);
            }

            function ESNumeric(inArg, val, val2) {
                var k = {
                    value: !isNaN(val) ? parseInt(val) : null,
                    valueTo: !isNaN(val2) ? parseInt(val2) : null,
                    oper: inArg.oper || "EQ"
                };
                return new ESNumericParamVal(inArg.paramID, k);
            }

            function ESString(inArg, val, val2) {
                var k = {
                    value: val,
                    valueTo: val2,
                    oper: inArg.oper || "EQ"
                };
                return new ESStringParamVal(inArg.paramID, k);
            }

            function ESDateRange(fromType, fromD, toType, toD) {
                return {
                    "fromType": fromType,
                    "fromD": fromD,
                    "toType": toType,
                    "toD": toD
                }
            }

            function getEsParamVal(esParamInfo, dx) {
                var ps = esParamInfo.parameterType.toLowerCase();

                //ESNumeric
                if (ps.indexOf("entersoft.framework.platform.esnumeric") == 0) {
                    if (!dx || dx.length == 0) {
                        return new ESNumericParamVal(esParamInfo.id, {
                            oper: "EQ",
                            value: 0
                        });
                    }
                    return esEval(esParamInfo, dx[0].Value);
                }

                //ESDateRange
                if (ps.indexOf("entersoft.framework.platform.esdaterange, queryprocess") == 0) {
                    if (!dx || dx.length == 0) {
                        return new ESDateParamVal(esParamInfo.id, esParamInfo.controlType == 6 ? null : {
                            dRange: "ESDateRange(FiscalPeriod, 0)",
                            fromD: null,
                            toD: null
                        });
                    }
                    return dateEval(esParamInfo, dx[0].Value);
                }

                //ESString
                if (ps.indexOf("entersoft.framework.platform.esstring, queryprocess") == 0) {
                    if (!dx || dx.length == 0) {
                        return new ESStringParamVal(esParamInfo.id, {
                            oper: "EQ",
                            value: null
                        });
                    }

                    return esEval(esParamInfo, dx[0].Value);
                }

                //Not set
                if (!dx || dx.length == 0) {
                    return new ESParamVal(esParamInfo.id, null);
                }

                var processedVals = _.map(dx, function(k) {
                    return processStrToken(esParamInfo, k.Value);
                });

                if (processedVals.length == 1) {
                    processedVals = processedVals[0];
                }
                return new ESParamVal(esParamInfo.id, processedVals);
            }

            function processStrToken(esParamInfo, val) {
                if (!esParamInfo) {
                    return val;
                }

                var ps = esParamInfo.parameterType.toLowerCase();
                if (ps.indexOf("system.byte") != -1 || ps.indexOf("system.int") != -1) {
                    return parseInt(val);
                }

                if (esParamInfo.enumList && esParamInfo.enumList.length > 1) {
                    return parseInt(val);
                }

                return val;
            }

            function ESParamInfo() {
                this.id = undefined;
                this.aa = undefined;
                this.caption = undefined;
                this.toolTip = undefined;
                this.controlType = undefined;
                this.parameterType = undefined;
                this.precision = undefined;
                this.multiValued = undefined;
                this.visible = undefined;
                this.required = undefined;
                this.oDSTag = undefined;
                this.formatStrng = undefined;
                this.tags = undefined;
                this.visibility = undefined;
                this.invSelectedMasterTable = undefined;
                this.invSelectedMasterField = undefined;
                this.invTableMappings = undefined;
                this.defaultValues = undefined;
                this.enumOptionAll = undefined;
                this.enumList = undefined;
            }

            ESParamInfo.prototype.strVal = function() {
                return "Hello World esParaminfo";
            };

            function ESParamsDefinitions(title, params) {
                this.title = title;
                this.definitions = params;
            }

            ESParamsDefinitions.prototype.strVal = function(vals) {
                if (!vals || !this.definitions || this.definitions.length == 0) {
                    return '';
                }

                var s = _.reduce(_.sortBy(_.where(this.definitions, {
                    visible: true
                }), "aa"), function(memo, p) {
                    return memo + "<h3>" + p.caption + ": </h3>" + vals[p.id].strVal() + "<br/>";
                }, '');

                return s;
            }

            function winParamInfoToesParamInfo(winParamInfo, gridexInfo) {
                if (!winParamInfo) {
                    return null;
                }

                var espInfo = new ESParamInfo();

                espInfo.id = winParamInfo.ID;
                espInfo.aa = parseInt(winParamInfo.AA);
                espInfo.caption = winParamInfo.Caption;
                espInfo.toolTip = winParamInfo.Tooltip;
                espInfo.controlType = parseInt(winParamInfo.ControlType);
                espInfo.parameterType = winParamInfo.ParameterType;
                espInfo.precision = parseInt(winParamInfo.Precision);
                espInfo.multiValued = winParamInfo.MultiValued == "true";
                espInfo.visible = winParamInfo.Visible == "true";
                espInfo.required = winParamInfo.Required == "true";
                espInfo.required = true;
                espInfo.oDSTag = winParamInfo.ODSTag;
                espInfo.tags = winParamInfo.Tags;
                espInfo.visibility = parseInt(winParamInfo.Visibility);
                espInfo.invSelectedMasterTable = winParamInfo.InvSelectedMasterTable;
                espInfo.invSelectedMasterField = winParamInfo.InvSelectedMasterField;
                espInfo.invTableMappings = winParamInfo.InvTableMappings;

                espInfo.enumOptionAll = winParamInfo.EnumOptionAll;
                var enmList = _.sortBy(_.map(_.filter(gridexInfo.EnumItem, function(x) {
                    return x.fParamID == espInfo.id && (typeof x.ID != 'undefined');
                }), function(e) {
                    return {
                        text: espInfo.oDSTag ? e.Caption.substring(e.Caption.indexOf(".") + 1) : e.Caption,
                        value: !isNaN(e.ID) ? parseInt(e.ID) : null
                    };
                }), "value");

                espInfo.enumList = (enmList.length) ? enmList : undefined;


                var gxDef = gridexInfo.DefaultValue;
                if (gxDef && angular.isArray(gxDef)) {
                    var dx = _.where(gxDef, {
                        fParamID: espInfo.id
                    });

                    espInfo.defaultValues = getEsParamVal(espInfo, dx);
                }

                return espInfo;
            }

            function winGridInfoToESGridInfo(inGroupID, inFilterID, gridexInfo) {
                if (!gridexInfo || !gridexInfo.LayoutColumn) {
                    return null;
                }

                var fId = inFilterID.toLowerCase();
                var filterInfo = _.filter(gridexInfo.Filter, function(x) {
                    return x.ID.toLowerCase() == fId;
                });

                if (!filterInfo || filterInfo.length != 1) {
                    return null;
                }

                var esGridInfo = {
                    id: undefined,
                    caption: undefined,
                    rootTable: undefined,
                    selectedMasterTable: undefined,
                    selectedMasterField: undefined,
                    totalRow: undefined,
                    columnHeaders: undefined,
                    columnSetHeaders: undefined,
                    columnSetRowCount: undefined,
                    columnSetHeaderLines: undefined,
                    headerLines: undefined,
                    groupByBoxVisible: undefined,
                    filterLineVisible: false,
                    previewRow: undefined,
                    previewRowMember: undefined,
                    previewRowLines: undefined,
                    columns: undefined,
                    params: undefined,
                    defaultValues: undefined,
                };

                var z2 = _.map(_.filter(gridexInfo.LayoutColumn, function(y) {
                    return y.fFilterID.toLowerCase() == fId;
                }), function(x) {
                    return winColToESCol(inGroupID, inFilterID, gridexInfo, x);
                });

                var z1 = _.sortBy(_.where(z2, {
                    visible: true
                }), function(x) {
                    return parseInt(x.AA);
                });

                var z3 = _.map(z1, function(x) {
                    return esColToKCol(esGridInfo, x);
                });

                filterInfo = filterInfo[0];
                esGridInfo.id = filterInfo.ID;
                esGridInfo.caption = filterInfo.Caption;
                esGridInfo.rootTable = filterInfo.RootTable;
                esGridInfo.selectedMasterTable = filterInfo.SelectedMasterTable;
                esGridInfo.selectedMasterField = filterInfo.SelectedMasterField;
                esGridInfo.totalRow = filterInfo.TotalRow;
                esGridInfo.columnHeaders = filterInfo.ColumnHeaders;
                esGridInfo.columnSetHeaders = filterInfo.ColumnSetHeaders;
                esGridInfo.columnSetRowCount = filterInfo.ColumnSetRowCount;
                esGridInfo.columnSetHeaderLines = filterInfo.ColumnSetHeaderLines;
                esGridInfo.headerLines = filterInfo.HeaderLines;
                esGridInfo.groupByBoxVisible = filterInfo.GroupByBoxVisible;
                esGridInfo.filterLineVisible = filterInfo.FilterLineVisible;
                esGridInfo.previewRow = filterInfo.PreviewRow;
                esGridInfo.previewRowMember = filterInfo.PreviewRowMember;
                esGridInfo.previewRowLines = filterInfo.PreviewRowLines;

                esGridInfo.columns = z3;

                esGridInfo.params = new ESParamsDefinitions(esGridInfo.caption, _.map(gridexInfo.Param, function(p) {
                    return winParamInfoToesParamInfo(p, gridexInfo);
                }));


                var dfValues = _.map(esGridInfo.params.definitions, function(p) {
                    return p.defaultValues;
                });

                esGridInfo.defaultValues = new ESParamValues(dfValues);
                return esGridInfo;
            }

            return ({
                ESParamVal: ESParamVal,
                ESNumericParamVal: ESNumericParamVal,
                ESStringParamVal: ESStringParamVal,
                ESDateParamVal: ESDateParamVal,

                /**
                 * @ngdoc function
                 * @name es.Web.UI.esUIHelper#winGridInfoToESGridInfo
                 * @methodOf es.Web.UI.esUIHelper
                 * @module es.Web.UI
                 * @kind function
                 * @description  This function processes and transforms an Entersoft Windows - Janus specific definition of the UI layout of an
                 * Entersoft Public Query or Entersoft Scroller to an abstract web-oriented defintion of the layout to be used by WEB UI components
                 * such as telerik kendo-ui, jQuery grids, etc.
                 * @param {string} inGroupID The Entersoft PQ (or Scroller) GroupID the the gridexInfo object describes
                 * @param {string} inFilterID The Entersoft PQ (or Scroller) FilterID the the gridexInfo object describes
                 * @param {object} gridexInfo The definition object for an Entersoft Public Query (or Scroller) as provided by the result
                 * of the function {@link es.Services.Web.esWebApi#methods_fetchPublicQueryInfo fetchPublicQueryInfo}.
                 * @return {object} Returns an object that is the abstract (not Janus specific) representation of the gridexInfo.
                 * @example
```js
var inGroupID = "ESMMStockItem";
var inFilterID = "ESMMStockItem_Def";
var gridexInfo = {
    "Filter": [{
        "ID": "ESMMStockItem_Def",
        "Caption": "Είδη Αποθήκης",
        "QueryID": "ESMMStockItem\\ESMMStockItem_Def\\ESMMStockItem_Def_Q1.esq",
        "RootTable": "ESFIItem",
        "SelectedMasterTable": "ESFIItem",
        "SelectedMasterField": "ISUDGID",
        "TotalRow": "0",
        "ColumnHeaders": "0",
        "ColumnSetHeaders": "0",
        "ColumnSetRowCount": "2",
        "ColumnSetHeaderLines": "1",
        "HeaderLines": "1",
        "GroupByBoxVisible": "false",
        "FilterLineVisible": "false",
        "PreviewRow": "false",
        "PreviewRowMember": "",
        "PreviewRowLines": "3"
    }],
    "Param": [{
        "ID": "ESDCreated",
        "AA": "1",
        "Caption": "Ημ/νία δημιουργίας",
        "Tooltip": "Ημ/νία δημιουργίας",
        "ControlType": "6",
        "ParameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "Precision": "0",
        "MultiValued": "false",
        "Visible": "true",
        "Required": "false",
        "ODSTag": "AA049FD6-4EFF-499F-8F6B-0573BD14D183",
        "Tags": "",
        "Visibility": "0"
    }, {
        "ID": "ESUCreated",
        "AA": "2",
        "Caption": "Χρήστης δημιουργίας",
        "Tooltip": "Χρήστης δημιουργίας",
        "ControlType": "9",
        "ParameterType": "Entersoft.Framework.Platform.ESString, QueryProcess",
        "Precision": "0",
        "MultiValued": "false",
        "Visible": "true",
        "Required": "false",
        "ODSTag": "0ABDC77C-119B-4729-A99F-C226EBCE0C1B",
        "Tags": "",
        "Visibility": "0"
    }, {
        "ID": "ESDModified",
        "AA": "3",
        "Caption": "Ημ/νία τελ.μεταβολής",
        "Tooltip": "Ημ/νία τελ.μεταβολής",
        "ControlType": "20",
        "ParameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "Precision": "0",
        "MultiValued": "false",
        "Visible": "true",
        "Required": "false",
        "ODSTag": "4E4E17A4-ECA5-4CB0-9F11-02C943F6E6C8",
        "Tags": "",
        "Visibility": "0"
    }],
    "DefaultValue": [{
        "fParamID": "ESDCreated",
        "Value": "#2006/04/15#"
    }, {
        "fParamID": "ESUCreated",
        "Value": "ESString(RANGE, 'wλμ', 'χχω')"
    }, {
        "fParamID": "ESDModified",
        "Value": "#2011/03/14#"
    }],
    "LayoutColumn": [{
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Code",
        "AA": "0",
        "Caption": "Κωδικός",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "74C82778-6B49-4928-9F06-81B4384BF677",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Description",
        "AA": "4",
        "Caption": "Περιγραφή",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "2B666760-3FA7-478A-8112-CCC77FBC754E",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AlternativeDescription",
        "AA": "5",
        "Caption": "Εναλλακτική περιγραφή",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "A8E42370-78F3-4F38-BB65-F861B6DD1F84",
        "Visible": "false",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Price",
        "AA": "6",
        "Caption": "Τιμή χονδρικής",
        "FormatString": "#,0.00",
        "Width": "100",
        "ODSTag": "FC8D207E-FE62-4791-98C0-C5787C8940AD",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "3",
        "EditType": "1",
        "DataTypeName": "Decimal"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "RetailPrice",
        "AA": "7",
        "Caption": "Τιμή λιανικής",
        "FormatString": "#,0.00",
        "Width": "100",
        "ODSTag": "F1FE2820-573E-41A5-B0A8-5DE247EEC20A",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "3",
        "EditType": "1",
        "DataTypeName": "Decimal"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "AA": "8",
        "Caption": "Τύπος σύνθεσης",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "AEAA32D3-E015-4891-AEB9-8A60ABBCA9AF",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "5",
        "DataTypeName": "Byte"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "AA": "9",
        "Caption": "Κλάση",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "82538EA3-8EF0-4E8F-A395-9EF1466DCFB6",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "5",
        "DataTypeName": "Byte"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "AA": "10",
        "Caption": "Τύπος",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "0107AD25-0F2D-41F6-9D59-4C6B1CC0FE30",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "5",
        "DataTypeName": "Byte"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Name",
        "AA": "11",
        "Caption": "Επωνυμία/Ονοματεπώνυμο",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "7699C12E-3B5F-47E8-B509-7AF97F4560B1",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Description1",
        "AA": "12",
        "Caption": "Περιγραφή1",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "2BF1AC3B-BDB3-4239-A9D1-696793981822",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemFamilyCode",
        "AA": "13",
        "Caption": "Οικογένεια",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "7D4D3335-3D6D-45B5-A1D3-FF237A33867C",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemGroupCode",
        "AA": "14",
        "Caption": "Ομάδα",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "CE625D36-7744-4DF9-9AFA-2F0851F9B025",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemCategoryCode",
        "AA": "15",
        "Caption": "Κατηγορία",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "19AB9EB4-7791-4090-8AF6-F9434B031EF0",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "fItemSubcategoryCode",
        "AA": "16",
        "Caption": "Υποκατηγορία",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "22E443E1-9A08-4FAD-835A-6B7C15A844C2",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESDCreated",
        "AA": "1",
        "Caption": "Ημ/νία δημιουργίας",
        "FormatString": "d",
        "Width": "100",
        "ODSTag": "AA049FD6-4EFF-499F-8F6B-0573BD14D183",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "DateTime"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESDModified",
        "AA": "2",
        "Caption": "Ημ/νία τελ.μεταβολής",
        "FormatString": "d",
        "Width": "100",
        "ODSTag": "4E4E17A4-ECA5-4CB0-9F11-02C943F6E6C8",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "DateTime"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESUCreated",
        "AA": "3",
        "Caption": "Χρήστης δημιουργίας",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "0ABDC77C-119B-4729-A99F-C226EBCE0C1B",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ESUModified",
        "AA": "17",
        "Caption": "Χρήστης τελ.μεταβολής",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "FC41CA99-AC07-45B5-825F-3982037E148C",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "0",
        "DataTypeName": "String"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "Comment",
        "AA": "18",
        "Caption": "Σχόλιο",
        "FormatString": "",
        "Width": "100",
        "ODSTag": "BD9B18D3-BA45-4FA7-911A-C66ACA556AB9",
        "Visible": "true",
        "ColumnSetRow": "-1",
        "ColumnSetColumn": "-1",
        "RowSpan": "-1",
        "ColSpan": "-1",
        "AggregateFunction": "0",
        "TextAlignment": "1",
        "EditType": "1",
        "DataTypeName": "String"
    }],
    "ValueList": [{
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "Value": "0",
        "Caption": "Απλό"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "Value": "1",
        "Caption": "Σετ"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "AssemblyType",
        "Value": "2",
        "Caption": "Παραγόμενο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "Value": "0",
        "Caption": "Γενικό είδος-Υπηρεσία"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "Value": "1",
        "Caption": "Είδος Αποθήκης"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemClass",
        "Value": "2",
        "Caption": "Πάγιο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "0",
        "Caption": "Εμπόρευμα"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "1",
        "Caption": "Προϊόν"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "8",
        "Caption": "Ημιέτοιμο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "2",
        "Caption": "Ά ύλη"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "9",
        "Caption": "Β’ύλη"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "12",
        "Caption": "Υλικό συσκευασίας"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "3",
        "Caption": "Ανταλλακτικό"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "4",
        "Caption": "Αναλώσιμο"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "5",
        "Caption": "Είδος συσκευασίας"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "6",
        "Caption": "Eίδος εγγυοδοσίας"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "10",
        "Caption": "Προϋπ/να έσοδα"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "11",
        "Caption": "Προϋπ/να έξοδα"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "ColName": "ItemType",
        "Value": "7",
        "Caption": "Άλλο"
    }],
    "FormatingCondition": [{
        "fFilterID": "ESMMStockItem_Def",
        "Key": "PriceMarkNegativeValues",
        "AllowMerge": "true",
        "ColumnKey": "Price",
        "ConditionOperator": "3",
        "Value1": "0",
        "TargetColumnKey": "Price",
        "fFormatStyleKey": "1ecd5e8f-b3d0-4a02-b9ac-d70a36ee4d41"
    }, {
        "fFilterID": "ESMMStockItem_Def",
        "Key": "RetailPriceMarkNegativeValues",
        "AllowMerge": "true",
        "ColumnKey": "RetailPrice",
        "ConditionOperator": "3",
        "Value1": "0",
        "TargetColumnKey": "RetailPrice",
        "fFormatStyleKey": "3a9999f7-322b-437d-abbf-43ded2a4bec6"
    }],
    "FormatStyle": [{
        "Key": "1ecd5e8f-b3d0-4a02-b9ac-d70a36ee4d41",
        "BackColor": "0",
        "ForeColor": "-65536",
        "FontBold": "0",
        "FontItalic": "0",
        "FontStrikeout": "0"
    }, {
        "Key": "3a9999f7-322b-437d-abbf-43ded2a4bec6",
        "BackColor": "0",
        "ForeColor": "-65536",
        "FontBold": "0",
        "FontItalic": "0",
        "FontStrikeout": "0"
    }]
};

var esgridInfo = esUIHelper.winGridInfoToESGridInfo(inGroupID, inFilterID, gridexInfo);
```
* __The result will be:__
```js
{
    "id": "ESMMStockItem_Def",
    "caption": "Είδη Αποθήκης",
    "rootTable": "ESFIItem",
    "selectedMasterTable": "ESFIItem",
    "selectedMasterField": "ISUDGID",
    "totalRow": "0",
    "columnHeaders": "0",
    "columnSetHeaders": "0",
    "columnSetRowCount": "2",
    "columnSetHeaderLines": "1",
    "headerLines": "1",
    "groupByBoxVisible": "false",
    "filterLineVisible": "false",
    "previewRow": "false",
    "previewRowMember": "",
    "previewRowLines": "3",
    "columns": [{
        "field": "Code",
        "title": "Κωδικός"
    }, {
        "field": "ESDCreated",
        "title": "Ημ/νία δημιουργίας",
        "format": "{0:d}"
    }, {
        "field": "ESDModified",
        "title": "Ημ/νία τελ.μεταβολής",
        "format": "{0:d}"
    }, {
        "field": "ESUCreated",
        "title": "Χρήστης δημιουργίας"
    }, {
        "field": "Description",
        "title": "Περιγραφή"
    }, {
        "field": "Price",
        "title": "Τιμή χονδρικής",
        "attributes": {
            "style": "text-align: right;"
        },
        "format": "{0:#,0.00}"
    }, {
        "field": "RetailPrice",
        "title": "Τιμή λιανικής",
        "attributes": {
            "style": "text-align: right;"
        },
        "format": "{0:#,0.00}"
    }, {
        "field": "AssemblyType",
        "title": "Τύπος σύνθεσης"
    }, {
        "field": "ItemClass",
        "title": "Κλάση"
    }, {
        "field": "ItemType",
        "title": "Τύπος"
    }, {
        "field": "Name",
        "title": "Επωνυμία/Ονοματεπώνυμο"
    }, {
        "field": "Description1",
        "title": "Περιγραφή1"
    }, {
        "field": "fItemFamilyCode",
        "title": "Οικογένεια"
    }, {
        "field": "fItemGroupCode",
        "title": "Ομάδα"
    }, {
        "field": "fItemCategoryCode",
        "title": "Κατηγορία"
    }, {
        "field": "fItemSubcategoryCode",
        "title": "Υποκατηγορία"
    }, {
        "field": "ESUModified",
        "title": "Χρήστης τελ.μεταβολής"
    }, {
        "field": "Comment",
        "title": "Σχόλιο"
    }],
    "params": [{
        "id": "ESDCreated",
        "aa": 1,
        "caption": "Ημ/νία δημιουργίας",
        "toolTip": "Ημ/νία δημιουργίας",
        "controlType": 6,
        "parameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "precision": 0,
        "multiValued": false,
        "visible": true,
        "required": false,
        "oDSTag": "AA049FD6-4EFF-499F-8F6B-0573BD14D183",
        "tags": "",
        "visibility": 0,
        "defaultValues": {
            "paramCode": "ESDCreated",
            "paramValue": {
                "dRange": "1",
                "fromD": "2006-04-14T21:00:00.000Z",
                "toD": null
            }
        }
    }, {
        "id": "ESUCreated",
        "aa": 2,
        "caption": "Χρήστης δημιουργίας",
        "toolTip": "Χρήστης δημιουργίας",
        "controlType": 9,
        "parameterType": "Entersoft.Framework.Platform.ESString, QueryProcess",
        "precision": 0,
        "multiValued": false,
        "visible": true,
        "required": false,
        "oDSTag": "0ABDC77C-119B-4729-A99F-C226EBCE0C1B",
        "tags": "",
        "visibility": 0,
        "defaultValues": {
            "paramCode": "ESUCreated",
            "paramValue": {
                "value": "wλμ",
                "valueTo": "χχω",
                "oper": "RANGE"
            }
        }
    }, {
        "id": "ESDModified",
        "aa": 3,
        "caption": "Ημ/νία τελ.μεταβολής",
        "toolTip": "Ημ/νία τελ.μεταβολής",
        "controlType": 20,
        "parameterType": "Entersoft.Framework.Platform.ESDateRange, QueryProcess",
        "precision": 0,
        "multiValued": false,
        "visible": true,
        "required": false,
        "oDSTag": "4E4E17A4-ECA5-4CB0-9F11-02C943F6E6C8",
        "tags": "",
        "visibility": 0,
        "defaultValues": {
            "paramCode": "ESDModified",
            "paramValue": {
                "dRange": "1",
                "fromD": "2011-03-13T22:00:00.000Z",
                "toD": null
            }
        }
    }],
    "defaultValues": {
        "ESDCreated": {
            "paramCode": "ESDCreated",
            "paramValue": {
                "dRange": "1",
                "fromD": "2006-04-14T21:00:00.000Z",
                "toD": null
            }
        },
        "ESUCreated": {
            "paramCode": "ESUCreated",
            "paramValue": {
                "value": "wλμ",
                "valueTo": "χχω",
                "oper": "RANGE"
            }
        },
        "ESDModified": {
            "paramCode": "ESDModified",
            "paramValue": {
                "dRange": "1",
                "fromD": "2011-03-13T22:00:00.000Z",
                "toD": null
            }
        }
    }
}
```
                 **/
                winGridInfoToESGridInfo: winGridInfoToESGridInfo,

                winColToESCol: winColToESCol,
                esColToKCol: esColToKCol,

                /**
                 * @ngdoc function
                 * @name es.Web.UI.esUIHelper#esGridInfoToKInfo
                 * @methodOf es.Web.UI.esUIHelper
                 * @module es.Web.UI
                 * @kind function
                 * @description  This function processes and transforms an {@link es.Web.UI.esUIHelper#methods_winGridInfoToESGridInfo esgridInfo} object (abstract definition of gridexInfo)
                 * to a Telerik kendo-grid layout definition object.
                 * @param {service} esWebApiService The {@link es.Services.Web.esWebApi esWebApi Service}.
                 * @param {string} inGroupID The Entersoft PQ (or Scroller) GroupID the the gridexInfo object describes
                 * @param {string} inFilterID The Entersoft PQ (or Scroller) FilterID the the gridexInfo object describes
                 * @param {object} executeParams The object that will hold or alread holds the values of the Entersoft Public Query Paramters i.e. the object
                 * that holds the values of the params panel (EBS terminology). If the object is not an empty one i.e. {} BUT is has values for some of the named parameters
                 * these values will be used as default values for those parameters, overiding any default values coming from the grid layout definition object.
                 * @param {object} esGridInfo The Entersoft abstract definition object that is the result of {@link es.Web.UI.esUIHelper#methods_winGridInfoToESGridInfo winGridInfoToESGridInfo}.
                 * of the function {@link es.Services.Web.esWebApi#methods_fetchPublicQueryInfo fetchPublicQueryInfo}.
                 * @return {object} Returns an object that is the __Telerik kendo-grid specific__ schema definition object that can be used to initialize the
                 * UI of a kendo-grid or kendo-grid like widget.
                 *
                 * The returned object can be directly assigned to the _k-options_ attribute of a __kendo-grid__ Telerik widget
                 * @example
                 * This is a screenshot from Pulic Query Info results (geridexInfo, esgridInfo and Telerik kendo-grid options)
                 * ![Sample run for am ESMMStockItem PQInfo](images/api/es010fetchpqinfo.png)
                 * 
```js
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
```
                 * __HTML__
```html
 <span>
        <input type="text" ng-model="pGroup"  placeholder="PQ GroupID">
        <input type="text" ng-model="pFilter" placeholder="PQ FilterID">
        <button ng-click="fetchPQInfo()">fetchPublicQueryInfo</button>
        <div kendo-grid k-ng-delay="esGridOptions" k-auto-bind="false" k-options="esGridOptions" />
    </span>
```
                 **/
                esGridInfoToKInfo: esGridInfoToKInfo,

                getZoomDataSource: prepareStdZoom,
                getPQDataSource: prepareWebScroller,

                getesDateRangeOptions: function(dateRangeClass) {
                    if (!dateRangeClass || !dDateRangeClass[dateRangeClass]) {
                        return esDateRangeOptions;
                    }

                    var arr = dDateRangeClass[dateRangeClass];
                    if (!_.isArray(arr) || arr.length == 0) {
                        return esDateRangeOptions;
                    }

                    var x = [];
                    var i;
                    for (i = 0; i < arr.length; i++) {
                        x[i] = esDateRangeOptions[arr[i]];
                    }
                    return x;
                },

                getesComplexParamFunctionOptions: function() {
                    return esComplexParamFunctionOptions;
                },

            });
        }
    ]);

})();