angular.module('es.Web.UI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/esGrid.html',
    "<div kendo-grid=esGridCtrl k-ng-delay=esGridOptions.dataSource es-srv-paging=esSrvPaging k-auto-bind=false k-options=esGridOptions></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedNumeric.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=\"col-xs-12 col-md-4\"><select class=\"form-control es-param-control\" kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.oper != 'RANGE', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE'}\"><input type=number class=es-param-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.value k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\"></div><div class=\"col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input class=es-param-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.valueTo k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\"></div></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedString.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=\"col-xs-12 col-md-4\"><select class=\"form-control es-param-control\" kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.oper != 'RANGE', 'col-md-4': esParamVal[esParamDef.id].paramValue.oper == 'RANGE'}\"><input class=\"form-control es-param-control\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.value\"></div><div class=\"col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input class=\"form-control es-param-control\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.valueTo\"></div></div>"
  );


  $templateCache.put('src/partials/esParamDateRange.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><div class=row><div class=col-xs-12 ng-class=\"{'col-md-4': esParamVal[esParamDef.id].paramValue.dRange == '0' || esParamVal[esParamDef.id].paramValue.dRange =='1'}\"><select class=\"form-control es-param-control\" kendo-drop-down-list uib-tooltip=\"Hello World\" uib-tooltip-trigger=mouseenter k-data-text-field=\"'title'\" k-auto-bind=true k-data-value-field=\"'dValue'\" k-data-source=dateRangeOptions k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.dRange></select></div><div class=col-xs-12 ng-class=\"{'col-md-8': esParamVal[esParamDef.id].paramValue.dRange == '1', 'col-md-4': esParamVal[esParamDef.id].paramValue.dRange == '0'}\" ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange > '1'\"><input class=\"form-control es-param-control\" kendo-date-picker k-ng-model=\"esParamVal[esParamDef.id].paramValue.fromD\"></div><div class=col-xs-12 ng-class=\"{'col-md-4': esParamVal[esParamDef.id].paramValue.dRange == '0'}\" ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange != '0'\"><input class=\"form-control es-param-control\" kendo-date-picker k-ng-model=\"esParamVal[esParamDef.id].paramValue.toD\"></div></div>"
  );


  $templateCache.put('src/partials/esParamEnum.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" kendo-drop-down-list name={{::esParamDef.id}} ng-required=::esParamDef.required ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=true k-option-label=\"{ text: 'All', value: null}\" k-data-source=::esParamDef.enumList k-value-primitive=true ng-model-options=\"{getterSetter: true}\" ng-model=esParamVal[esParamDef.id].pValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiEnum.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=\"form-control es-param-control\" name={{::esParamDef.id}} ng-required=::esParamDef.required kendo-multi-select k-placeholder=::esParamDef.id k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=false k-value-primitive=true k-data-source=esParamDef.enumList ng-model-options=\"{getterSetter: true}\" ng-model=esParamVal[esParamDef.id].pValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiZoom.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=form-control kendo-multi-select name={{::esParamDef.id}} ng-required=::esParamDef.required k-placeholder=::esParamDef.caption k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=::esParamDef.invSelectedMasterField k-data-value-field=::esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParamNumeric.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><input class=form-control kendo-numeric-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required align=right k-ng-model=esParamVal[esParamDef.id].paramValue k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{::esParamDef.precision}}'\">"
  );


  $templateCache.put('src/partials/esParamText.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><input class=\"form-control es-param-control\" kendo-masked-text-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-mask=::esParamDef.formatString ng-model-options=\"{getterSetter: true}\" ng-model=\"esParamVal[esParamDef.id].pValue\">"
  );


  $templateCache.put('src/partials/esParamZoom.html',
    "<label class=\"control-label es-param-label\" uib-tooltip={{::esParamDef.toolTip}} tooltip-placement=top tooltip-trigger=mouseenter>{{::esParamDef.caption}}</label><select class=form-control kendo-combo-box name={{::esParamDef.id}} ng-required=::esParamDef.required k-placeholder=::esParamDef.toolTip k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=::esParamDef.invSelectedMasterField k-data-value-field=::esParamDef.invSelectedMasterField k-filter=\"'contains'\" ng-required=::esParamDef.required k-auto-bind=false k-min-length=3 ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParams.html',
    "<uib-accordion><uib-accordion-group is-open=esPanelOpen><uib-accordion-heading>{{::esParamsDef.title}} - Parameters <span class=badge>{{::esParamsDef.visibleDefinitions().length}}</span> <i class=\"pull-right glyphicon\" uib-popover-placement=left uib-popover-append-to-body=true uib-popover-template=\"'src/partials/esParamsPanelPopover.html'\" popover-title={{::esParamsDef.title}} popover-trigger=mouseenter ng-class=\"{'glyphicon-zoom-out': esPanelOpen, 'glyphicon-zoom-in': !esPanelOpen}\"></i></uib-accordion-heading><form novalidate class=form name=esParamsPanelForm><div class=row><div class=\"form-group col-xs-12 col-sm-6 col-md-4 col-lg-3\" ng-class=\"{'has-error': esParamsPanelForm.{{::param.id}}.$invalid}\" ng-repeat=\"param in esParamsDef.visibleDefinitions() | orderBy:'aa'\"><es-param class=es-param es-type=\"param | esParamTypeMapper\" es-param-val=esParamsValues es-param-def=param></es-param></div></div></form></uib-accordion-group></uib-accordion>"
  );


  $templateCache.put('src/partials/esParamsPanelPopover.html',
    "<div class=row ng-repeat=\"param in esParamsDef.definitions | filter:{visible: true} | orderBy:'aa'\"><div ng-if=esParamsValues[param.id].strVal()><span class=\"col-xs-12 col-sm-6\"><strong>{{::param.caption}}<strong></strong></strong></span> <span class=\"col-xs-12 col-sm-6\">{{esParamsValues[param.id].strVal()}}</span></div></div>"
  );


  $templateCache.put('src/partials/esWebPQ.html',
    "<div class=row ng-if=::esParamsDef.visibleDefinitions().length><es-params-panel ng-cloak es-params-values=esParamsValues es-group-id=esGroupId es-filter-id=esFilterId es-params-def=esParamsDef></es-params-panel></div><div ng-if=esShowTopPagination class=row><kendo-pager auto-bind=false page-size=20 page-sizes=\"[20, 50, 100, 'All']\" refresh=true data-source=\"esGridOptions.dataSource\"></div><div class=row ng-cloak><es-grid es-group-id=esGroupId es-filter-id=esFilterId es-grid-options=esGridOptions es-srv-paging=esSrvPaging es-execute-params=\"esParamsValues\"></div>"
  );

}]);
