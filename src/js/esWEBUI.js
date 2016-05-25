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
    var esWEBUI = angular.module('es.Web.UI', ['ngAnimate', 'ui.bootstrap', 'ngSanitize', 'pascalprecht.translate']);

    esWEBUI.run(['$translate', 'esMessaging', function($translate, esMessaging) {

        esMessaging.subscribe("AUTH_CHANGED", function(sess, apitoken) {
            var lang = (sess && sess.connectionModel && sess.connectionModel.LangID) ? sess.connectionModel.LangID : "el-GR";
            doChangeLanguage($translate, lang);
        });
    }]);

    function doChangeLanguage($translate, lang) {
        lang = lang || 'el-GR';

        $translate.use(lang.split("-")[0]);
        if (kendo) {
            kendo.culture(lang);
            var kendoMessagesUrl = window.ESDBG ? "bower_components/kendo-ui/js/messages/kendo.messages." : "http://cdn.kendostatic.com/" + kendo.version + "/js/messages/kendo.messages.";
            if (lang == "el-GR") {
                lang = "en-US";
            }
            $.getScript(kendoMessagesUrl + lang + ".min.js",
                function() {

                });
        }
    }

    function ESMasterDetailGridRelation(relationID, detailDataSource, detailParams, detailGridParamCode) {
        this.relationID = relationID;
        this.detailDataSource = detailDataSource;
        this.detailParams = detailParams;
        this.detailParamCode = detailGridParamCode || "ISUDGID";
    }

    function ESRequeryDetailGrids() {
        this.registeredRelations = [];
    }

    ESRequeryDetailGrids.prototype.addDetailRelation = function(relInfo) {
        if (!relInfo || !(relInfo instanceof ESMasterDetailGridRelation)) {
            throw "relInfo parameter is null or is not of type ESMasterDetailGridRelation";
        }

        if (!relInfo.relationID) {
            throw "The parameter does not contain relationID or is null/emptystring/undefined";
        }

        var newRelId = relInfo.relationID.toLowerCase();
        var ix = _.findIndex(this.registeredRelations, function(x) {
            return x.relationID.toLowerCase() == newRelId;
        });
        if (ix < 0) {
            this.registeredRelations.push(relInfo);
        } else {
            this.registeredRelations[ix] = relInfo;
        }
        return this;
    }

    ESRequeryDetailGrids.prototype.getDetailRelation = function(relationId) {
        if (!relationID) {
            throw "relationID is null/emptystring/undefined";
        }

        var newRelId = relationID.toLowerCase();
        var ix = _.findIndex(this.registeredRelations, function(x) {
            return x.toLowerCase() == newRelId;
        });
        if (ix < 0) {
            return null;
        } else {
            return this.registeredRelations[ix];
        }
    }

    ESRequeryDetailGrids.prototype.removeDetailRelation = function(relationId) {
        if (!relationID) {
            throw "relationID is null/emptystring/undefined";
        }

        var newRelId = relationID.toLowerCase();
        var ix = _.findIndex(this.registeredRelations, function(x) {
            return x.toLowerCase() == newRelId;
        });
        if (ix < 0) {
            return false;
        } else {
            this.registeredRelations = this.registeredRelations.splice(ix, 1);
            return true;
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
                    if (pParam.multiValued || pParam.enumOptionAll) {
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


    .directive('esPositiveInteger', ['$parse', function($parse) {
        var INTEGER_REGEXP = /^\+?\d+$/;
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, iElement, iAttrs, ctrl) {

                var AllowZero = false;


                if (angular.isDefined(iAttrs.esPositiveInteger)) {
                    try {
                        AllowZero = $parse(iAttrs.esPositiveInteger)(scope);
                    } catch (ex) {

                    }
                }

                ctrl.$validators.esPositiveInteger = function(modelValue, viewValue) {

                    if (ctrl.$isEmpty(modelValue) || AllowZero ? (modelValue < 0) : (modelValue <= 0)) {
                        // consider empty models to be valid
                        return false;
                    }


                    if (INTEGER_REGEXP.test(viewValue)) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };

            }
        };
    }])

    .directive('esLogin', ['$translate', '$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals', '$sanitize',
        function($translate, $log, $uibModal, esWebApiService, esWebUIHelper, esGlobals, $sanitize) {
            return {
                restrict: 'AE',
                scope: {
                    esShowSubscription: "=",
                    esShowBridge: "=",
                    esCredentials: "=",
                    esShowStickySession: "=",
                    esOnSuccess: "&"
                },
                template: '<div ng-include src="\'src/partials/esLogin.html\'"></div>',
                link: function($scope, iElement, iAttrs) {
                    var onLangChanged = function() {
                        if ($scope.esCredentials.LangID) {
                            var lang = $scope.esCredentials.LangID;
                            doChangeLanguage($translate, lang);
                        }
                    };

                    $scope.esGlobals = esGlobals;
                    $scope.esLangOptions = {
                        dataSource: esGlobals.esSupportedLanguages,
                        dataTextField: "title",
                        dataValueField: "id",
                        change: onLangChanged,
                        valuePrimitive: true,
                        autoBind: true,
                        valueTemplate: "<img ng-src={{dataItem.icon}}></img><span>{{dataItem.title}}</span>",
                        template: "<img ng-src={{dataItem.icon}}></img><span>{{dataItem.title}}</span>"
                    };
                }
            }
        }
    ])

    .directive('esPropertyQuestion', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals', '$sanitize',
        function($log, $uibModal, esWebApiService, esWebUIHelper, esGlobals, $sanitize) {
            return {
                restrict: 'AE',
                scope: {
                    esQuestion: "=",
                    esPsDef: "=",
                    esPsVal: "="
                },
                template: '<div ng-include src="\'src/partials/esSurvey/esPropertyQuestion_\'+esQuestion.PType+\'.html\'"></div>',
                link: function($scope, iElement, iAttrs) {
                    $scope.esGlobals = esGlobals;

                    //Check for ZoomDS
                    var qs = $scope.esQuestion;
                    if (qs && qs.PArg && qs.PType == 7) {
                        $scope[qs.PArg + "_DS"] = esWebUIHelper.getZoomDataSource(qs.PArg);
                    }

                    $scope.openCalendar = function($event) {
                        $scope.calendarStatus.opened = true;
                    };

                    $scope.calendarStatus = {
                        opened: false
                    };

                    $scope.calendarFormat = 'dd-MMMM-yyyy';

                    $scope.getScale = function(upTo) {
                        if (!upTo || isNaN(upTo)) {
                            return [];
                        }

                        return _.range(1, Math.abs(parseInt(upTo)) + 1);
                    }


                    $scope.getChoicesOfQuestion = function() {
                        if (!$scope.esQuestion || !$scope.esQuestion.PArg || !$scope.esPsDef || !$scope.esPsDef.Choices) {
                            return [];
                        }

                        return _.sortBy(_.filter($scope.esPsDef.Choices, {
                            ChoiceCode: $scope.esQuestion.PArg
                        }), "OrderPriority");
                    }
                }
            };
        }
    ]);

    function convertPQRowsToMapRows(rows, click) {
        if (!rows) {
            return rows;
        }

        if (angular.isArray(rows) && rows.length == 0) {
            return rows;
        }

        var ts = _.map(rows, function(r) {
            var s = {
                id: r.GID,
                longitude: r.Longitude || r.longitude,
                latitude: r.Latitude || r.latitude,
                esTempl: r.esTempl,
                esOptions: {
                    title: r.esTitle,
                    label: r.esLabel,
                    icon: r.esIcon
                },
                esObj: r
            };
            return s;
        });

        return _.filter(ts, function(x) {
            return x.longitude != 0 && x.latitude != 0;
        });
    };

    esWEBUI
        .filter('esPQDSToesMapDS', function() {

            return convertPQRowsToMapRows;
        })

    .directive('esMapPq', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals', '$sanitize', '$timeout', 'uiGmapGoogleMapApi',
        function($log, $uibModal, esWebApiService, esWebUIHelper, esGlobals, $sanitize, $timeout, GoogleMapApi) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    esMapOptions: "=",
                    esPqDef: "=",
                    esShowWindow: "=",
                    esTypeOptions: "=",
                    esType: "=",
                    esMapControl: "=",
                    esHighLight: "=",
                    esClick: "&?",
                },
                template: '<div ng-include src="\'src/partials/esMapPQ.html\'"></div>',
                link: function($scope, iElement, iAttrs) {
                    $scope.mapDS = new kendo.data.ObservableArray([]);

                    if (!$scope.esMapControl) {
                        $scope.esMapControl = {};
                    }

                    if (!angular.isFunction($scope.esClick)) {
                        $scope.esClick = esWebUIHelper.onMapClick;
                    }

                    GoogleMapApi.then(function(maps) {
                        $log.info("Google maps ver = " + maps.version);
                    });

                    if (!$scope.esType) {
                        $scope.esType = 'standard';
                    }

                    $scope.esToggleData = 'Map';

                    $scope.executePQ = function() {
                        $scope.esPqDef.esGridOptions.autoBind = true;

                        if (!$scope.esPqDef.esGridOptions.change) {
                            $scope.esPqDef.esGridOptions.change = function(e) {
                                var selectedRows = this.select();
                                if (selectedRows && selectedRows.length == 1) {
                                    var gid = this.dataItem(selectedRows[0])["GID"];
                                    if (gid) {
                                        $timeout(function() {
                                            $scope.esHighLight = gid;
                                        });
                                    }
                                }

                            }
                            $scope.esPqDef.esGridOptions.reBind += 1;
                        }

                        esWebApiService.fetchPublicQuery($scope.esPqDef)
                            .then(function(ret) {
                                $scope.mapDS = new kendo.data.ObservableArray(ret.data.Rows);
                            });
                    }
                }
            };
        }
    ])

    .directive('esMapMarkers', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals', '$sanitize', '$timeout',
        function($log, $uibModal, esWebApiService, esWebUIHelper, esGlobals, $sanitize, $timeout) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    esMarkers: "=?",
                    esRows: "=?",
                    esPqInfo: "=",
                    esShowWindow: "=?",
                    esTypeOptions: "=?",
                    esType: "=?",
                    esHighLight: "=?",
                    esClick: "&?",
                },
                template: '<div ng-include src="\'src/partials/esMapMarkers.html\'"></div>',
                link: function($scope, iElement, iAttrs) {

                    $scope.$watch("esHighLight", function(newData) {
                        var ms = $scope.esMarkers;
                        if (!ms) {
                            return;
                        }

                        _.map(ms, function(m) {
                            m.esOptions.animation = 0;
                        });
                        if (!newData) {
                            return;
                        }

                        var it = _.find(ms, function(m) {
                            return m.id == newData;
                        });
                        if (it) {
                            it.esOptions.animation = 1;
                        }
                    });

                    if (iAttrs.esMarkers && iAttrs.esRows) {
                        throw new Error("Only one of the esMarkers or esRows must be specified, not both");
                    }

                    if (!$scope.esType) {
                        $scope.esType = 'standard';
                    }

                    if (!$scope.esTypeOptions) {
                        $scope.esTypeOptions = {
                            title: "cluster",
                            gridSize: 60,
                            ignoreHidden: true,
                            minimumClusterSize: 2
                        }
                    }

                    $scope.esInfoWindowOptions = {
                        disableAutoPan: true
                    };

                    if (iAttrs.esRows) {
                        $scope.$watch("esRows", function(newData) {
                            $scope.esMarkers = convertPQRowsToMapRows(newData, $scope.esClick);
                        });
                    }
                }
            };
        }
    ])

    .directive('esSurvey', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals', '$sanitize',
        function($log, $uibModal, esWebApiService, esWebUIHelper, esGlobals, $sanitize) {
            return {
                restrict: 'AE',
                scope: {
                    esSectionIdx: "=",
                    esPsDef: "=",
                    esPsVal: "="
                },
                template: '<div ng-include src="\'src/partials/esSurvey/esSurvey.html\'"></div>',
                link: function($scope, iElement, iAttrs) {
                    $scope.esGlobals = esGlobals;

                    $scope.isIntroduction = function() {
                        return ($scope.esSectionIdx < 0);
                    }

                    $scope.isLast = function() {
                        if (!$scope.esPsDef || !$scope.esPsDef.Sections) {
                            return true;
                        }
                        return ($scope.esSectionIdx == $scope.esPsDef.Sections.length - 1);
                    }

                    $scope.saveAndComplete = function() {

                    }

                    $scope.getQuestionsofSection = function() {
                        if (!$scope.esPsDef || !$scope.esPsDef.Sections || $scope.esSectionIdx < 0 || $scope.esSectionId >= $scope.esPsDef.Sections.length) {
                            return [];
                        }

                        var sect = $scope.esPsDef.Sections[$scope.esSectionIdx].Code;
                        if (!sect) {
                            return [];
                        }

                        return _.sortBy(_.filter($scope.esPsDef.Lines, {
                            Category_Code: sect
                        }), "SeqNum");
                    }

                    $scope.progress = function() {
                        if ($scope.esSectionIdx < 0 || !$scope.esPsDef || !$scope.esPsDef.Sections || !$scope.esPsDef.Sections.length) {
                            return 0;
                        }

                        return Math.round((($scope.esSectionIdx + 1) / $scope.esPsDef.Sections.length) * 100);
                    }

                    $scope.advanceStep = function() {
                        if ($scope.isLast()) {
                            alert("You are done !!!");
                            return;
                        }
                        $scope.esSectionIdx += 1;
                    }

                    $scope.backStep = function() {
                        if ($scope.isIntroduction()) {
                            return;
                        }
                        $scope.esSectionIdx -= 1;
                    }
                }
            };
        }
    ])

    .directive('esChecklistModel', ['$parse', '$compile', function($parse, $compile) {
        // contains
        function contains(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item, comparator) {
            arr = angular.isArray(arr) ? arr : [];
            if (!contains(arr, item, comparator)) {
                arr.push(item);
            }
            return arr;
        }

        // remove
        function remove(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // exclude recursion, but still keep the model
            var esChecklistModel = attrs.esChecklistModel;
            attrs.$set("esChecklistModel", null);
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);
            attrs.$set("esChecklistModel", esChecklistModel);

            // getter for original model
            var esChecklistModelGetter = $parse(esChecklistModel);
            var checklistChange = $parse(attrs.checklistChange);
            var checklistBeforeChange = $parse(attrs.checklistBeforeChange);
            var ngModelGetter = $parse(attrs.ngModel);

            /*
                        ctrl.$validators.esCount = function(modelValue, viewValue) {
                            return true;
                        };
            */
            var comparator = angular.equals;

            if (attrs.hasOwnProperty('checklistComparator')) {
                if (attrs.checklistComparator[0] == '.') {
                    var comparatorExpression = attrs.checklistComparator.substring(1);
                    comparator = function(a, b) {
                        return a[comparatorExpression] === b[comparatorExpression];
                    };

                } else {
                    comparator = $parse(attrs.checklistComparator)(scope.$parent);
                }
            }

            // watch UI checked change
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    ngModelGetter.assign(scope, contains(esChecklistModelGetter(scope.$parent), getChecklistValue(), comparator));
                    return;
                }

                setValueInesChecklistModel(getChecklistValue(), newValue);

                if (checklistChange) {
                    checklistChange(scope);
                }
            });

            // watches for value change of esChecklistValue (Credit to @blingerson)
            scope.$watch(getChecklistValue, function(newValue, oldValue) {
                if (newValue != oldValue && angular.isDefined(oldValue) && scope[attrs.ngModel] === true) {
                    var current = esChecklistModelGetter(scope.$parent);
                    esChecklistModelGetter.assign(scope.$parent, remove(current, oldValue, comparator));
                    esChecklistModelGetter.assign(scope.$parent, add(current, newValue, comparator));
                }
            });

            function getChecklistValue() {
                return attrs.esChecklistValue ? $parse(attrs.esChecklistValue)(scope.$parent) : attrs.value;
            }

            function setValueInesChecklistModel(value, checked) {
                var current = esChecklistModelGetter(scope.$parent);
                if (angular.isFunction(esChecklistModelGetter.assign)) {
                    if (checked === true) {
                        esChecklistModelGetter.assign(scope.$parent, add(current, value, comparator));
                    } else {
                        esChecklistModelGetter.assign(scope.$parent, remove(current, value, comparator));
                    }
                }

            }

            // declare one function to be used for both $watch functions
            function setChecked(newArr, oldArr) {
                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    setValueInesChecklistModel(getChecklistValue(), ngModelGetter(scope));
                    return;
                }
                ngModelGetter.assign(scope, contains(newArr, getChecklistValue(), comparator));
            }

            // watch original model change
            // use the faster $watchCollection method if it's available
            if (angular.isFunction(scope.$parent.$watchCollection)) {
                scope.$parent.$watchCollection(esChecklistModel, setChecked);
            } else {
                scope.$parent.$watch(esChecklistModel, setChecked, true);
            }
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function(tElement, tAttrs) {

                if (!tAttrs.esChecklistValue && !tAttrs.value) {
                    throw 'You should provide `value` or `checklist-value`.';
                }

                // by default ngModel is 'checked', so we set it if not specified
                if (!tAttrs.ngModel) {
                    // local scope var storing individual checkbox model
                    tAttrs.$set("ngModel", "checked");
                }

                return postLinkFn;
            }
        };
    }])

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
    .directive('esGrid', ['$log', 'esWebApi', 'esMessaging', 'esUIHelper', 'esGlobals',
        function($log, esWebApiService, esMessaging, esWebUIHelper, esGlobals) {
            return {
                restrict: 'AE',
                scope: {
                    esGroupId: "=",
                    esFilterId: "=",
                    esExecuteParams: "=",
                    esGridOptions: "=",
                    esSrvPaging: "=",
                    esDataSource: "=",
                },
                templateUrl: function(element, attrs) {
                    return "src/partials/esGrid.html";
                },
                link: function($scope, iElement, iAttrs) {
                    $scope.esGridRun = function() {
                        if ($scope.esGridCtrl) {
                            $scope.esGridCtrl.dataSource.read();
                        }
                    }

                    $scope.downloadBlob = function(gid) {
                        esWebApiService.fetchES00DocumentBlobDataByGID(gid)
                            .then(function(result) {
                                var fileData = result.data;

                                var docType = result.headers()["content-type"];

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
                    };

                    $scope.esGridPrint = function() {
                        if (!$scope.esGridCtrl) {
                            return;
                        }

                        var gridElement = $scope.esGridCtrl.element,
                            printableContent = '',
                            win = window.open('', '', 'width=800, height=500'),
                            doc = win.document.open();

                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html>' +
                            '<head>' +
                            '<meta charset="utf-8" />' +
                            '<title>Kendo UI Grid</title>' +
                            '<link href="http://kendo.cdn.telerik.com/' + kendo.version + '/styles/kendo.common.min.css" rel="stylesheet" /> ' +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: 1px solid; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</head>' +
                            '<body>';

                        var htmlEnd =
                            '</body>' +
                            '</html>';

                        var gridHeader = gridElement.children('.k-grid-header');
                        if (gridHeader[0]) {
                            var thead = gridHeader.find('thead').clone().addClass('k-grid-header');
                            printableContent = gridElement
                                .clone()
                                .children('.k-grid-header').remove()
                                .end()
                                .children('.k-grid-content')
                                .find('table')
                                .first()
                                .children('tbody').before(thead)
                                .end()
                                .end()
                                .end()
                                .end()[0].outerHTML;
                        } else {
                            printableContent = gridElement.clone()[0].outerHTML;
                        }

                        doc.write(htmlStart + printableContent + htmlEnd);
                        doc.close();
                        win.print();
                    }

                    if (!$scope.esGridOptions && !iAttrs.esGridOptions) {
                        if (!$scope.esGroupId || !$scope.esFilterId) {
                            throw "esGridOptions NOT defined. In order to dynamically get the options you must set GroupID and FilterID for esgrid to work";
                        }
                        // Now esGridOption explicitly assigned so ask the server 
                        esWebApiService.fetchPublicQueryInfo($scope.esGroupId, $scope.esFilterId)
                            .then(function(ret) {
                                var p1 = ret.data;
                                var p2 = esWebUIHelper.winGridInfoToESGridInfo($scope.esGroupId, $scope.esFilterId, p1);
                                $scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo($scope.esGroupId, $scope.esFilterId, $scope.esExecuteParams, p2, $scope.esSrvPaging);
                            });
                    }
                }
            };
        }
    ])

    .directive('esGaugePq', ['$log', '$window', 'esWebApi', 'esMessaging', 'esUIHelper', 'esGlobals',
        function($log, $window, esWebApiService, esMessaging, esWebUIHelper, esGlobals) {
            return {
                restrict: 'AE',
                scope: {
                    esPqDef: "="
                },
                templateUrl: function(element, attrs) {
                    return "src/partials/esGaugePQ.html";
                },
                link: function($scope, iElement, iAttrs) {
                    esWebApiService.fetchPublicQuery($scope.esPqDef)
                        .then(function(ret) {
                            if (ret.data.Rows && ret.data.Rows.length) {
                                $scope.esRow = ret.data.Rows[0];
                            }
                        }, function(err) {

                        });
                }
            };
        }
    ])

    .directive('esGauge', ['$log', '$window', 'esWebApi', 'esMessaging', 'esUIHelper', 'esGlobals',
        function($log, $window, esWebApiService, esMessaging, esWebUIHelper, esGlobals) {
            function prepareGauge($scope, scaleObject) {
                var minScale = 0,
                    maxScale = 100,
                    ranges = [];

                if (scaleObject && scaleObject.Ranges && scaleObject.Ranges.length) {
                    minScale = _.min(scaleObject.Ranges, function(r) {
                        return r.MinValue;
                    }).MinValue;
                    maxScale = _.max(scaleObject.Ranges, function(r) {
                        return r.MaxValue;
                    }).MaxValue;

                    ranges = _.map(scaleObject.Ranges, function(r) {
                        var x = {
                            from: r.MinValue,
                            to: r.MaxValue
                        };

                        if (r.ColorARGB) {
                            x.color = esGlobals.rgbToHex(r.ColorARGB)
                        }
                        return x;
                    });
                }

                $scope.esScaleOptions = { min: minScale, max: maxScale, ranges: ranges, vertical: false };
            };
            return {
                restrict: 'AE',
                scope: {
                    esRow: "=",
                    esGaugeOptions: "=?",
                },
                templateUrl: function(element, attrs) {
                    return "src/partials/esGauge.html";
                },
                link: function($scope, iElement, iAttrs) {
                    var scaleObject = undefined;
                    if ($scope.esRow) {
                        $scope.esGaugeType = ($scope.esRow.GType || 'radial').toLowerCase();

                        if ($scope.esRow.GScale) {
                            esWebApiService.fetchESScale($scope.esRow.GScale)
                                .then(function(ret) {
                                        scaleObject = ret;
                                        prepareGauge($scope, scaleObject, $scope.esRow);
                                    },
                                    function(err) {

                                    });
                        } else {
                            prepareGauge($scope, undefined);
                        }
                    }
                }
            };
        }
    ])

    .directive('esChart', ['$log', '$window', 'esWebApi', 'esMessaging', 'esUIHelper', 'esGlobals',
        function($log, $window, esWebApiService, esMessaging, esWebUIHelper, esGlobals) {
            return {
                restrict: 'AE',
                scope: {
                    esPqDef: "=",
                    esChartOptions: "=",
                },
                templateUrl: function(element, attrs) {
                    return "src/partials/esChartPQ.html";
                },
                link: function($scope, iElement, iAttrs) {
                    $scope.esChartDataSource = esWebUIHelper.getPQDataSource($scope.esPqDef);
                    $scope.esChartOptions.dataSource = $scope.esChartDataSource;

                    if ($scope.esChartOptions && !$scope.esChartOptions.dataBound) {
                        $scope.esChartOptions.dataBound = function(e) {
                            if (e && e.sender) {
                                kendo.ui.progress(e.sender.element.parent(), false);
                            }
                        };
                    }

                    $scope.executePQ = function() {
                        $scope.isOpen = false;
                        if ($scope.esChartDataSource) {
                            if ($scope.esChartCtrl) {
                                kendo.ui.progress($scope.esChartCtrl.element.parent(), true);
                            }
                            $scope.esChartDataSource.read();
                        }
                    }

                    angular.element($window).bind('resize', function() {
                        kendo.resize(angular.element(".eschart-wrapper"));
                    });
                }
            };
        }
    ])

    .directive('esLocalGrid', ['$log', 'esWebApi', 'esMessaging', 'esUIHelper', 'esGlobals',
        function($log, esWebApiService, esMessaging, esWebUIHelper, esGlobals) {
            return {
                restrict: 'AE',
                scope: {
                    esGridOptions: "=",
                    esDataSource: "=",
                },
                templateUrl: function(element, attrs) {
                    return "src/partials/esLocalGrid.html";
                },
                link: function($scope, iElement, iAttrs) {
                    $scope.esGridRun = function() {
                        if ($scope.esGridCtrl) {
                            $scope.esGridCtrl.dataSource.read();
                        }
                    }

                    $scope.downloadBlob = function(gid) {
                        esWebApiService.fetchES00DocumentBlobDataByGID(gid)
                            .then(function(result) {
                                var fileData = result.data;

                                var docType = result.headers()["content-type"];

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
                    };
                }
            };
        }
    ])

    /**
     * @ngdoc directive
     * @name es.Web.UI.directive:es00DocumentsDetail
     * @requires es.Services.Web.esWebApi Entersoft AngularJS WEB API for Entersoft Application Server
     * @requires es.Web.UI.esUIHelper
     * @requires $log
     * @restrict AE
     * @param {object=} esDocumentGridOptions A subset or full set of esGridOptions for the kendo-grid that will show the ES00Documents. 
     * The ES00Documents kendo-grid will be initialized by the merge of the PublicQueryInfo gridoptions as retrieved for the GroupID = "ESGOCompany" and
     * FilterID = "ES00DocumentsDetails" public query. 
     * @param {string=} esMasterRowField The field of the master grid row that the ES00DocumentGrid will be a detail of. The value of this field in the master row will form
     * the parameter for fetchES00DocumentsByGID service to retrieve the ES00DocumentRows.
     *
     * @description
     *
     * **TBD**
     * This directive is responsible to render the html for the presentation of the ES00Documents as a detail of a kendo-grid
     */
    .directive('es00DocumentsDetail', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals',
            function($log, $uibModal, esWebApiService, esWebUIHelper, esGlobals) {

                return {
                    restrict: 'AE',
                    scope: {
                        esDocumentGridOptions: "=?",
                        esMasterRowField: "="
                    },
                    template: '<div ng-include src="\'src/partials/es00DocumentsDetail.html\'"></div>',
                    link: function($scope, iElement, iAttrs) {

                        $scope.downloadBlob = function(gid) {
                            alert(gid);
                        };

                        if (!$scope.esMasterRowField && !iAttrs.esMasterRowField) {
                            $scope.esMasterRowField = "GID";
                            $log.warn("esMasterRowField for es00DocumentsDetail directive NOT specified. Assuming GID");
                        }

                        var getOptions = function() {
                            var g = "ESGOCompany";
                            var f = "ES00DocumentsDetails";
                            var xParam = {
                                serverGrouping: false,
                                serverSorting: false,
                                serverFiltering: false,
                                serverPaging: false,
                                pageSize: 20,
                                transport: {
                                    read: function(options) {

                                        esWebApiService.fetchES00DocumentsByEntityGID($scope.$parent.dataItem[$scope.esMasterRowField])
                                            .then(function(ret) {
                                                options.success(ret);
                                            }, function(err) {
                                                options.error(err);
                                            });
                                    }

                                },
                                schema: {
                                    data: "data",
                                    total: "data.length"
                                }
                            };

                            var xDS = new kendo.data.DataSource(xParam);

                            esWebApiService.fetchPublicQueryInfo(g, f, true)
                                .then(function(ret) {
                                    var p1 = ret.data;
                                    var p2 = esWebUIHelper.winGridInfoToESGridInfo(g, f, p1);
                                    ret = esWebUIHelper.esGridInfoToKInfo(g, f, {}, p2, false);
                                    ret.autoBind = true;
                                    ret.toolbar = null;
                                    ret.groupable = false;
                                    ret.dataSource = xDS;
                                    // Add the download column
                                    ret.columns.push({
                                        template: "<button class=\"btn btn-primary\" ng-click=\"downloadBlob(dataItem.GID)\">{{'ESUI.PQ.DOWNLOAD' | translate }}</button>"
                                    });

                                    $scope.esDocumentGridOptions = angular.extend(ret, $scope.esDocumentGridOptions);
                                });
                        };

                        getOptions();
                    }
                };
            }
        ])
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
        .directive('esParam', ['$log', '$uibModal', 'esWebApi', 'esUIHelper', 'esGlobals',
            function($log, $uibModal, esWebApiService, esWebUIHelper, esGlobals) {
                return {
                    restrict: 'AE',
                    scope: {
                        esParamDef: "=",
                        esParamVal: "=",
                        esType: "="
                    },
                    template: '<div ng-include src="\'src/partials/\'+esType+\'.html\'"></div>',
                    link: function($scope, iElement, iAttrs) {

                        if (!$scope.esParamDef) {
                            throw "You must set a param";
                        }

                        $scope.esGlobals = esGlobals;
                        $scope.esWebUIHelper = esWebUIHelper;
                        $scope.esWebApiService = esWebApiService;

                        if ($scope.esParamDef.invSelectedMasterTable) {
                            $scope.esParamLookupDS = esWebUIHelper.getZoomDataSource($scope.esParamDef.invSelectedMasterTable);
                        }

                        // Case Date Range
                        if ($scope.esParamDef.controlType == 6 || $scope.esParamDef.controlType == 20) {
                            $scope.dateRangeOptions = esGlobals.getesDateRangeOptions($scope.esParamDef.controlType);
                        }
                    }
                };
            }
        ])
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
        .directive('esWebPq', ['$log', 'esWebApi', 'esUIHelper', 'esMessaging', 'esGlobals',
            function($log, esWebApiService, esWebUIHelper, esMessaging, esGlobals) {
                return {
                    restrict: 'AE',
                    scope: {
                        esGroupId: "=",
                        esFilterId: "=",
                        esGridOptions: "=?",
                        esParamsValues: "=",
                        esSrvPaging: "=",
                        esShowTopPagination: "=",
                    },
                    templateUrl: function(element, attrs) {
                        return "src/partials/esWebPQ.html";
                    },
                    link: function($scope, iElement, iAttrs) {
                        if (!$scope.esGroupId || !$scope.esFilterId) {
                            throw "You must set the pair es-group-id and es-filter-id attrs";
                        }

                        $scope.executePQ = function() {
                            $scope.esGridOptions.dataSource.read();
                        }

                        esWebApiService.fetchPublicQueryInfo($scope.esGroupId, $scope.esFilterId)
                            .then(function(ret) {
                                var v = esWebUIHelper.winGridInfoToESGridInfo($scope.esGroupId, $scope.esFilterId, ret.data);
                                if ($scope.esParamsValues && ($scope.esParamsValues instanceof esGlobals.ESParamValues)) {
                                    $scope.esParamsValues.merge(v.defaultValues);
                                } else {
                                    $scope.esParamsValues = v.defaultValues;
                                }
                                $scope.esParamsDef = v.params;

                                var p = esWebUIHelper.esGridInfoToKInfo($scope.esGroupId, $scope.esFilterId, $scope.esParamsValues, v, $scope.esSrvPaging);
                                $scope.esGridOptions = angular.extend(p, $scope.esGridOptions);
                            });
                    }
                };
            }
        ])
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
        .directive('esParamsPanel', ['$translate', '$log', 'esWebApi', 'esUIHelper', 'esGlobals',
            function($translate, $log, esWebApiService, esWebUIHelper, esGlobals) {
                return {
                    restrict: 'AE',
                    scope: {
                        esParamsDef: '=?',
                        esPqInfo: '=?',
                        esParamsValues: '=?',
                        esGroupId: "=?",
                        esFilterId: "=?",
                        esRunClick: "&",
                        esRunTitle: "@?",
                        esShowRun: "=?",
                        esLocalDataSource: "=?",
                        esDataSource: "=?"
                    },
                    templateUrl: function(element, attrs) {
                        return "src/partials/esParams.html";
                    },
                    link: function($scope, iElement, iAttrs) {
                        if (!iAttrs.esParamsDef && !iAttrs.esPqInfo) {
                            if (!($scope.esGroupId instanceof esGlobals.ESPublicQueryDef)) {
                                if (!$scope.esGroupId || !$scope.esFilterId) {
                                    throw new Error("You must set either the es-params-def or es-pq-info or the pair es-group-id and es-filter-id attrs");
                                }
                            }
                        }

                        if ($scope.esShowRun && !$scope.esRunTitle) {
                            $translate('ESUI.PQ.PARAMS_PANEL_RUN')
                                .then(function(trans) {
                                    $scope.esRunTitle = trans;
                                });
                        }

                        if ($scope.esGroupId instanceof esGlobals.ESPublicQueryDef && !iAttrs.esParamsValues) {
                            $scope.esParamsValues = $scope.esGroupId.Params;
                        }

                        if (!iAttrs.esParamsDef) {
                            if (!iAttrs.esPqInfo) {
                                // we are given groupid and filterid =>
                                // we must retrieve pqinfo on owr own
                                esWebApiService.fetchPublicQueryInfo($scope.esGroupId, $scope.esFilterId)
                                    .then(function(ret) {
                                        var v = esWebUIHelper.winGridInfoToESGridInfo($scope.esGroupId, $scope.esFilterId, ret.data);

                                        if ($scope.esGroupId instanceof esGlobals.ESPublicQueryDef) {
                                            if ($scope.esLocalDataSource) {
                                                $scope.esGroupId.esGridOptions = esWebUIHelper.esGridInfoToLocalKInfo($scope.esGroupId.GroupID, $scope.esGroupId.FilterID, $scope.esGroupId.Params, v, $scope.esDataSource);
                                            } else {
                                                $scope.esGroupId.esGridOptions = esWebUIHelper.esGridInfoToKInfo($scope.esGroupId.GroupID, $scope.esGroupId.FilterID, $scope.esGroupId.Params, v, false);
                                            }
                                        }

                                        if ($scope.esParamsValues && ($scope.esParamsValues instanceof esGlobals.ESParamValues)) {
                                            $scope.esParamsValues.merge(v.defaultValues);
                                        } else {
                                            $scope.esParamsValues = v.defaultValues;
                                        }
                                        $scope.esParamsDef = v.params;
                                    });
                            } else {
                                $scope.esParamDef = esPqInfo.params;
                            }
                        }
                    }
                };
            }
        ]);

    /**
     * @ngdoc service
     * @name es.Web.UI.esUIHelper
     * @requires es.Services.Web.esWebApi Entersoft AngularJS WEB API for Entersoft Application Server
     * @requires $log
     * @description This service provides a set of javascript objects and functions to support UI oriented operations such as preparation
     * of schema model for a web grid to show the results of a PQ, Entersoft PQ Parameters meta-data manipulation , etc.
     * yh
     */
    esWEBUI.factory('esUIHelper', ['$translate', '$log', '$timeout', 'esMessaging', 'esWebApi', 'esGlobals',
        function($translate, $log, $timeout, esMessaging, esWebApiService, esGlobals) {

            function esColToKCol(esCol) {
                var tCol = {
                    field: esCol.field,
                    title: esCol.title,
                    width: esCol.width,
                    attributes: esCol.attributes,
                    columnSet: esCol.columnSet,
                    values: esCol.enumValues,
                    dataType: esCol.dataType,
                    hidden: !esCol.visible,
                    headerAttributes: {
                        "class": "es-table-header-cell",
                    },
                    template: undefined,
                    footerTemplate: undefined,
                    aggregate: undefined,
                    groupFooterTemplate: undefined,
                }

                tCol.aggregate = esCol.aggregate;

                switch (esCol.dataType) {
                    case "int32":
                    case "byte":
                        {
                            if (esCol.editType == "8") {
                                tCol.template = kendo.format('<div align="center"><input type="checkbox" #={0} ? "checked=checked" : "" # disabled="disabled" ></input></div>', esCol.field);
                            }
                            break;
                        }
                    case "byte[]":
                        {
                            if (esCol.editType == "0") {
                                tCol.template = "<img src='" + "#:kendo.format('data:image/jpg;base64,{0}', " + esCol.field + ")#" + "'/>";
                            }
                            break;
                        }

                    case "string":
                        {
                            var ul = "";
                            if (esCol.field.toLowerCase().indexOf("email") != -1) {
                                ul = "mailto:";
                            } else if (esCol.field.toLowerCase().indexOf("tele") != -1 || esCol.field.toLowerCase().indexOf("mobile") != -1) {
                                ul = "tel:";
                            }

                            if (ul) {
                                tCol.template = kendo.format("<a href='{1}#={0}||''#'>#={0}||''#</a>", esCol.field, ul);
                            }
                            break;
                        }
                    case "datetime":
                        {
                            var fStr = esCol.formatString || "d";
                            tCol.format = "{0:" + fStr + "}";
                            break;
                        }
                    default:
                        {
                            if (esCol.formatString && esCol.formatString != "") {
                                tCol.format = "{0:" + esCol.formatString + "}";
                            }
                            break;
                        }
                }

                if (tCol.aggregate) {
                    tCol.aggregates = [tCol.aggregate];
                    var fmtStr = esCol.formatString ? "kendo.toString(" + tCol.aggregate + ",'" + esCol.formatString.replace("#", "\\\\#") + "')" : tCol.aggregate;
                    tCol.footerTemplate = "<div style='text-align: right'>#:" + fmtStr + "#</div>";
                    tCol.groupFooterTemplate = tCol.footerTemplate;
                }
                return tCol;
            }

            function handleChangeGridRow(e) {
                var selectedRows = this.select();
                var isSelected = false;
                var gid = undefined;
                if (selectedRows && selectedRows.length == 1) {
                    //sme mas-det
                    gid = this.dataItem(selectedRows[0])["GID"];
                    isSelected = true;
                }

                if (this.options.masterDetailRelations) {
                    if (!(this.options.masterDetailRelations instanceof ESRequeryDetailGrids)) {
                        throw "masterDetailRelations should be of type ESRequeryDetailGrids";
                    }

                    _.each(this.options.masterDetailRelations.registeredRelations, function(elem) {
                        if (elem instanceof ESMasterDetailGridRelation) {
                            $timeout(function() {
                                var params = elem.detailParams();
                                var ds = elem.detailDataSource();
                                if (ds && params && params[elem.detailParamCode]) {
                                    if (params[elem.detailParamCode].pValue(gid)) {
                                        ds.read();
                                    }
                                }
                            });
                        }
                    });
                }
                esMessaging.publish("GRID_ROW_CHANGE", e, isSelected ? selectedRows[0] : null, gid);
            }

            function prepareStdZoom(zoomID, useCache) {
                var xParam = {
                    transport: {
                        read: function(options) {

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


            function prepareWebScroller(espqParams, esOptions, aggregates, groups) {
                var qParams = angular.isFunction(espqParams) ? espqParams() : espqParams;


                if (groups && aggregates) {
                    _.map(groups, function(g) {
                        g.aggregates = aggregates;
                    });
                } else {
                    groups = undefined;
                }

                var xParam = {
                    aggregate: aggregates,
                    group: groups,

                    transport: {
                        requestEnd: function(e) {
                            var response = e.response;
                            var type = e.type;
                            console.log(type); // displays "read"
                            console.log(response.length); // displays "77"
                        },

                        read: function(options) {

                            var pqOptions = {};
                            if (options.data && options.data.page && options.data.pageSize) {
                                pqOptions.WithCount = true;
                                pqOptions.Page = options.data.page;
                                pqOptions.PageSize = options.data.pageSize
                            }

                            var executeParams = qParams.Params;
                            if (executeParams instanceof esGlobals.ESParamValues) {
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

                                })
                                .error(function(err) {
                                    $log.error("Error in DataSource ", err);
                                    options.error(err);
                                });
                        },

                    },
                    requestStart: function(e) {

                    },

                    schema: {
                        data: "Rows",
                        total: "Count",
                    }
                };

                if (qParams && qParams.SchemaColumns && qParams.SchemaColumns.length) {
                    xParam.schema.parse = function(response) {
                        _.each(response.Rows, function(elem) {
                            _.each(qParams.SchemaColumns, function(col) {
                                var fld = col.field;
                                if (elem[fld] && typeof elem[fld] === "string") {
                                    elem[fld] = kendo.parseDate(elem[fld]);
                                }
                            })
                        });
                        return response;
                    }
                }

                if (esOptions) {
                    angular.extend(xParam, esOptions);
                }

                return new kendo.data.DataSource(xParam);
            }

            function preparePivotDS(espqParams, esOptions) {
                var qParams = angular.isFunction(espqParams) ? espqParams() : espqParams;

                var xParam = {
                    transport: {
                        requestEnd: function(e) {
                            var response = e.response;
                            var type = e.type;
                            console.log(type); // displays "read"
                            console.log(response.length); // displays "77"
                        },

                        read: function(options) {

                            var pqOptions = {};

                            var executeParams = qParams.Params;
                            if (executeParams instanceof esGlobals.ESParamValues) {
                                executeParams = executeParams.getExecuteVals();
                            }

                            esWebApiService.fetchPublicQuery(qParams.GroupID, qParams.FilterID, pqOptions, executeParams)
                                .success(function(pq) {
                                    options.success(pq.Rows || []);
                                })
                                .error(function(err) {
                                    $log.error("Error in DataSource ", err);
                                    options.error(err);
                                });
                        },

                    }
                };

                if (esOptions) {
                    angular.extend(xParam, esOptions);
                }

                return new kendo.data.PivotDataSource(xParam);
            }

            function esGridInfoToLocalKInfo(esGroupId, esFilterId, executeParams, esGridInfo, esDataSource) {
                var grdopt = {
                    pageable: {
                        refresh: true,
                        pageSizes: [20, 50, 100, kendo.ui.Pager.prototype.options.messages.allPages]
                    },
                    autoBind: false,
                    sortable: true,
                    scrollable: true,
                    selectable: "row",
                    allowCopy: true,
                    resizable: true,
                    reorderable: true,
                    navigatable: true,
                    noRecords: {
                        template: "<h3><span class='label label-info'>" + kendo.ui.Pager.prototype.options.messages.empty + "</span></h3>"
                    },


                    filterable: true,
                    groupable: true,
                    toolbar: [
                        "pdf",
                        "excel"
                    ],
                    pdf: {
                        allPages: true,
                        fileName: esGroupId + "-" + esFilterId + ".pdf",
                    },
                    excel: {
                        allPages: true,
                        fileName: esGroupId + "-" + esFilterId + ".xlsx",
                        filterable: true
                    }
                };

                if (esGlobals.getESUISettings().mobile) {
                    grdopt.mobile = esGlobals.getESUISettings().mobile;
                }

                if (esGlobals.getESUISettings().defaultGridHeight) {
                    grdopt.height = esGlobals.getESUISettings().defaultGridHeight;
                }

                grdopt.columns = esGridInfo.columns;

                _.map(grdopt.columns, function(c) {
                    if (c.columns) {
                        _.map(c.columns, function(k) {
                            k.footerTemplate = undefined;
                            k.groupFooterTemplate = undefined;
                        });
                    } else {
                        c.footerTemplate = undefined;
                        c.groupFooterTemplate = undefined;
                    }
                });

                grdopt.selectedMasterField = esGridInfo.selectedMasterField;
                grdopt.selectedMasterTable = esGridInfo.selectedMasterTable;
                grdopt.columnMenu = true;

                if (esDataSource) {
                    grdopt.dataSource = esDataSource;
                }

                grdopt.reBind = 0;

                return grdopt;
            }

            function esGridInfoToKInfo(esGroupId, esFilterId, executeParams, esGridInfo, esSrvPaging) {
                var dsOptions = {
                    serverGrouping: false,
                    serverSorting: false,
                    serverFiltering: false,
                    serverAggregates: false,
                    serverPaging: (angular.isUndefined(esSrvPaging) || esSrvPaging == null) ? true : !!esSrvPaging,
                    pageSize: 20
                };

                var grdopt = {
                    pageable: {
                        refresh: true,
                        pageSizes: [20, 50, 100, kendo.ui.Pager.prototype.options.messages.allPages]
                    },
                    autoBind: false,
                    sortable: !dsOptions.serverPaging,
                    scrollable: true,
                    selectable: "row",
                    allowCopy: true,
                    resizable: true,
                    reorderable: true,
                    navigatable: true,
                    noRecords: {
                        template: "<h3><span class='label label-info'>" + kendo.ui.Pager.prototype.options.messages.empty + "</span></h3>"
                    },


                    filterable: !dsOptions.serverPaging,
                    groupable: !dsOptions.serverPaging,
                    toolbar: [{
                            name: "run",
                            text: "Run",
                            template: "<a class='k-button' ng-click=\"esGridRun()\">{{'ESUI.PQ.TOOLBAR_RUN' | translate}}</a>"
                        },
                        /*
                        {
                            name: "print",
                            text: "Print",
                            template: "<a class='k-button' ng-click=\"esGridPrint()\">Print</a>"
                        },
                        */
                        "pdf",

                        "excel"
                    ],
                    pdf: {
                        allPages: true,
                        fileName: esGroupId + "-" + esFilterId + ".pdf",
                    },
                    excel: {
                        allPages: true,
                        fileName: esGroupId + "-" + esFilterId + ".xlsx",
                        filterable: true
                    }
                };

                if (esGlobals.getESUISettings().mobile) {
                    grdopt.mobile = esGlobals.getESUISettings().mobile;
                }

                if (esGlobals.getESUISettings().defaultGridHeight) {
                    grdopt.height = esGlobals.getESUISettings().defaultGridHeight;
                }

                grdopt.groups = esGridInfo.groups;
                grdopt.columns = esGridInfo.columns;
                grdopt.selectedMasterField = esGridInfo.selectedMasterField;
                grdopt.selectedMasterTable = esGridInfo.selectedMasterTable;
                grdopt.columnMenu = true;

                var aggs = _.flatMap(grdopt.columns, function(c) {
                    return c.columns ? _.filter(c.columns, function(k) {
                        return !!k.aggregate;
                    }) : (!!c.aggregate ? [c] : []);
                });

                grdopt.dataSource = prepareWebScroller(function() {
                    return {
                        GroupID: esGroupId,
                        FilterID: esFilterId,
                        Params: executeParams,
                        SchemaColumns: _.filter(grdopt.columns, {
                            dataType: "datetime"
                        }),
                    }
                }, dsOptions, aggs, grdopt.groups);

                grdopt.change = handleChangeGridRow;
                grdopt.dataBound = handleChangeGridRow;

                grdopt.reBind = 0;

                return grdopt;
            }

            function winColToESCol(xGroupID, xFilterID, gridexInfo, jCol) {
                var inFilterID;
                var inGroupID;

                if (angular.isObject(xGroupID)) {
                    inGroupID = xGroupID.GroupID;
                    inFilterID = xGroupID.FilterID;
                } else {
                    inGroupID = xGroupID;
                    inFilterID = xFilterID;
                }
                var esCol = {
                    AA: undefined,
                    field: undefined,
                    title: undefined,
                    width: undefined,
                    visible: undefined,
                    attributes: undefined,
                    enumValues: undefined,
                    formatString: undefined,
                    odsTag: undefined,
                    dataType: undefined,
                    editType: undefined,
                    columnSet: undefined,
                    aggregate: undefined,
                };

                esCol.AA = parseInt(jCol.AA);
                esCol.field = jCol.ColName;
                esCol.title = jCol.Caption;
                esCol.odsTag = jCol.ODSTag;
                esCol.columnSet = parseInt(jCol.ColumnSet);
                esCol.dataType = jCol.DataTypeName ? jCol.DataTypeName.toLowerCase() : undefined;
                esCol.editType = jCol.EditType;
                esCol.width = parseInt(jCol.Width);

                switch (jCol.AggregateFunction) {
                    case "1":
                        esCol.aggregate = "count";
                        break;
                    case "2":
                        esCol.aggregate = "sum";
                        break;
                    case "3":
                        esCol.aggregate = "average";
                        break;
                    case "4":
                        esCol.aggregate = "min";
                        break;
                    case "5":
                        esCol.aggregate = "max";
                        break;
                }

                esCol.formatString = jCol.FormatString;
                esCol.visible = (jCol.Visible == "true");

                var esClass = esCol.dataType;
                switch (esCol.dataType) {
                    case "byte":
                        {
                            if (esCol.editType == 8) {
                                esClass = "boolean-checkbox";
                            }
                            break;
                        }
                }

                esCol.attributes = {
                    "class": "es-grid-cell-" + esClass
                }

                if (jCol.TextAlignment == "3") {
                    esCol.attributes.style = "text-align: right;";
                }

                //Enum Column
                if (jCol.EditType == "5") {
                    var l1 = _.sortBy(_.filter(gridexInfo.ValueList, function(x) {
                        var v = x.ColName == jCol.ColName;
                        v = v && (typeof x.Value != 'undefined');
                        v = v && x.fFilterID.toLowerCase() == inFilterID;
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
                var FiscalPeriod = "FiscalPeriod";
                var FiscalYear = "FiscalYear";
                var Bimonthly = "Bimonthly";

                function isActualDate(v) {
                    return v && v != "1753/01/01" && v != "9999/01/01";
                }

                var dVal = eval(expr.replace(/#/g, '"'));
                var esdate = new esGlobals.ESDateParamVal(pInfo.id);

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

                var drOptions = esGlobals.getesDateRangeOptions();
                var elem = _.find(drOptions, function(xd) {
                    return xd.dValue == expr;
                });

                if (!angular.isUndefined(elem)) {
                    esdate.paramValue.dRange = expr;
                    return esdate;
                }

                var fD = calcActualDate(dVal.fromType, dVal.fromD, true);
                var tD = calcActualDate(dVal.toType, dVal.toD, false);

                esdate.paramValue.dRange = "0";
                esdate.paramValue.fromD = fD;
                esdate.paramValue.toD = tD;
                return esdate;
            }

            function calcActualDate(dateType, valOffset, bFrom) {
                switch (dateType) {
                    case "Year":
                        {
                            if (bFrom) {
                                if (valOffset > 0) {
                                    valOffset = valOffset - 1;
                                }
                                return moment().add(valOffset, 'years').startOf('year').toDate();
                            } else {
                                return moment().add(valOffset, 'years').endOf('year').toDate();
                            }
                        }
                    case "Month":
                        {
                            if (bFrom) {
                                return moment().startOf('month').add(valOffset, 'months').toDate();
                            } else {
                                return moment().endOf('month').add(valOffset, 'months').toDate();
                            }
                        }
                    case "Week":
                        {
                            if (bFrom) {
                                return moment().startOf('week').add(1, 'days').add(valOffset, 'weeks').toDate();
                            } else {
                                return moment().endOf('week').add(1, 'days').add(valOffset, 'weeks').toDate();
                            }
                        }
                    case "Quarter":
                        {
                            if (bFrom) {
                                if (valOffset > 0) {
                                    valOffset = valOffset - 1;
                                }
                                return moment().startOf('quarter').add(valOffset, 'quarters').toDate();
                            } else {
                                return moment().endOf('quarter').add(valOffset, 'quarters').endOf('quarter').toDate();
                            }
                        }
                    default:
                        {
                            alert("ESDateRange option NOT Supported. [" + dateType + ", " + valOffset + ", " + bFrom + "]. Using Current Month instead");
                            if (bFrom) {
                                return moment().startOf('month').toDate();
                            } else {
                                return moment().endOf('month').toDate();
                            }
                        }
                }
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
                return new esGlobals.ESNumericParamVal(inArg.paramID, k);
            }

            function ESString(inArg, val, val2) {
                var k = {
                    value: val,
                    valueTo: val2,
                    oper: inArg.oper || "EQ"
                };
                return new esGlobals.ESStringParamVal(inArg.paramID, k);
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
                        return new esGlobals.ESNumericParamVal(esParamInfo.id, {
                            oper: "EQ",
                            value: 0
                        });
                    }
                    return esEval(esParamInfo, dx[0].Value);
                }

                //ESDateRange
                if (ps.indexOf("entersoft.framework.platform.esdaterange, queryprocess") == 0) {
                    if (!dx || dx.length == 0) {
                        return new esGlobals.ESDateParamVal(esParamInfo.id, esParamInfo.controlType == 6 ? null : {
                            dRange: "ESDateRange(FiscalPeriod)",
                            fromD: null,
                            toD: null
                        });
                    }
                    return dateEval(esParamInfo, dx[0].Value);
                }

                //ESString
                if (ps.indexOf("entersoft.framework.platform.esstring, queryprocess") == 0) {
                    if (!dx || dx.length == 0) {
                        return new esGlobals.ESStringParamVal(esParamInfo.id, {
                            oper: "EQ",
                            value: null
                        });
                    }

                    return esEval(esParamInfo, dx[0].Value);
                }

                //Not set
                if (!dx || dx.length == 0) {
                    var orgVal = esParamInfo.multiValued ? [] : null;
                    return new esGlobals.ESParamVal(esParamInfo.id, orgVal, esParamInfo.enumList);
                }

                var processedVals = _.map(dx, function(k) {
                    return processStrToken(esParamInfo, k.Value);
                });

                if (processedVals.length == 1) {
                    processedVals = processedVals[0];
                }
                return new esGlobals.ESParamVal(esParamInfo.id, processedVals, esParamInfo.enumList);
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

                if (!_.startsWith(val, "##(")) {
                    return val;
                }

                switch (val.toLowerCase()) {
                    case "##(esbranch)":
                        var m = esGlobals.getClientSession();
                        if (m && m.connectionModel) {
                            return m.connectionModel.BranchID;
                        }

                        return val;
                    default:
                        return val;
                };
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
                this.visibleDefinitions = function() {
                    if (!this.definitions) {
                        return [];
                    }

                    var f = this.definitions;
                    return _.filter(f, {
                        visible: true
                    });
                }
            }

            ESParamsDefinitions.prototype.visibleDefinitions = function() {
                var f = this.definitions;
                return f ? _.filter(f, {
                    visible: true
                }) : [];
            }

            ESParamsDefinitions.prototype.strVal = function(vals) {
                if (!vals || !this.definitions || this.definitions.length == 0) {
                    return '';
                }

                var s = _.reduce(_.sortBy(_.filter(this.definitions, {
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
                    var dx = _.filter(gxDef, {
                        fParamID: espInfo.id
                    });

                    espInfo.defaultValues = getEsParamVal(espInfo, dx);
                } else {
                    espInfo.defaultValues = getEsParamVal(espInfo, []);
                }

                return espInfo;
            }

            function winGridInfoToESGridInfo(xGroupID, xFilterID, gridexInfo) {
                if (!gridexInfo || !gridexInfo.LayoutColumn) {
                    return null;
                }

                var inFilterID;
                var inGroupID;
                if (angular.isObject(xGroupID)) {
                    inGroupID = xGroupID.GroupID;
                    inFilterID = xGroupID.FilterID;
                } else {
                    inGroupID = xGroupID;
                    inFilterID = xFilterID;
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
                    columnSets: undefined,
                    columns: undefined,
                    params: undefined,
                    defaultValues: undefined,
                    groups: undefined,
                };

                esGridInfo.groups = _.map(_.filter(gridexInfo.LayoutGroup, function(y) {
                    return (y.fFilterID.toLowerCase() == fId);
                }), function(x) {
                    return {
                        field: x.ColName,
                        aa: x.AA,
                        sortOrder: x.SortOrder
                    };
                });

                var z2 = _.map(_.filter(gridexInfo.LayoutColumn, function(y) {
                    return (y.fFilterID.toLowerCase() == fId) && (y.DataTypeName != "Guid");
                }), function(x) {
                    return winColToESCol(inGroupID, fId, gridexInfo, x);
                });


                var z1 = _.sortBy(z2, function(x) {
                    return parseInt(x.AA);
                });


                var z3 = _.map(z1, function(x) {
                    return esColToKCol(x);
                });

                filterInfo = filterInfo[0];
                esGridInfo.id = filterInfo.ID;
                esGridInfo.caption = filterInfo.Caption;
                esGridInfo.rootTable = filterInfo.RootTable;
                esGridInfo.selectedMasterTable = filterInfo.SelectedMasterTable;
                esGridInfo.selectedMasterField = filterInfo.SelectedMasterField;
                esGridInfo.columnSets = _.sortBy(_.map(_.filter(gridexInfo.LayoutColumnSet, function(x) {
                    return x.fFilterID.toLowerCase() == fId;
                }), function(p) {
                    return {
                        aa: parseInt(p.Position),
                        title: p.Caption,
                        columns: undefined
                    };
                }), 'aa');

                esGridInfo.columns = z3;
                // now process the column sets
                // put column sets first
                if (esGridInfo.columnSets && esGridInfo.columnSets.length > 0) {
                    _.each(esGridInfo.columnSets, function(x) {
                        x.columns = _.filter(z3, {
                            columnSet: x.aa
                        });
                        z3 = _.difference(z3, x.columns);
                    });

                    esGridInfo.columnSets = _.sortBy(_.filter(esGridInfo.columnSets, function(x) {
                        return x.columns && x.columns.length > 0;
                    }), 'aa');

                    z3 = esGridInfo.columnSets.concat(z3);
                    esGridInfo.columns = z3;

                } else {
                    // No column sets defined, so just list the columns
                    esGridInfo.columns = z3;
                }

                esGridInfo.params = new ESParamsDefinitions(esGridInfo.caption, _.map(gridexInfo.Param, function(p) {
                    return winParamInfoToesParamInfo(p, gridexInfo);
                }));


                var dfValues = _.map(esGridInfo.params.definitions, function(p) {
                    return p.defaultValues;
                });

                esGridInfo.defaultValues = new esGlobals.ESParamValues(dfValues);
                return esGridInfo;
            }

            return ({

                ESRequeryDetailGrids: ESRequeryDetailGrids,
                ESMasterDetailGridRelation: ESMasterDetailGridRelation,


                /**
                 * @ngdoc function
                 * @name es.Web.UI.esUIHelper#winGridInfoToESGridInfo
                 * @methodOf es.Web.UI.esUIHelper
                 * @module es.Web.UI
                 * @kind function
                 * @description  This function processes and transforms an Entersoft Windows - Janus specific definition of the UI layout of an
                 * Entersoft Public Query or Entersoft Scroller to an abstract web-oriented defintion of the layout to be used by WEB UI components
                 * such as telerik kendo-ui, jQuery grids, etc.
                 * @param {string|ESPublicQueryDef} xGroupID if string then Entersoft Public Query GroupID or a {@link es.Services.Web.esGlobals#methods_ESPublicQueryDef ESPublicQueryDef} object that defines the rest of the parameters
                 * @param {string} xFilterID Entersoft Public Query FilterID. In case that pqGroupID is ESPublicQueryDef type then this parameter can be null or undefined
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
                esGridInfoToLocalKInfo: esGridInfoToLocalKInfo,

                /**
                 * @ngdoc function
                 * @name es.Web.UI.esUIHelper#esGridInfoToKInfo
                 * @methodOf es.Web.UI.esUIHelper
                 * @module es.Web.UI
                 * @kind function
                 * @description  This function processes and transforms an {@link es.Web.UI.esUIHelper#methods_winGridInfoToESGridInfo esgridInfo} object (abstract definition of gridexInfo)
                 * to a Telerik kendo-grid layout definition object.
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
            $scope.esGridOptions = esWebUIHelper.esGridInfoToKInfo($scope.pGroup, $scope.pFilter, {}, $scope.esWebGridInfo);
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

                getPivotDS: preparePivotDS,

                onMapClick: function(a, b, c) {
                    alert("A location has been clicked. Soon you will see a form here !!!");
                }

            });
        }
    ]);

})();
