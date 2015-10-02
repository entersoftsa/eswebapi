angular.module('es.Web.UI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/esGrid.html',
    "<div kendo-grid k-ng-delay=esGridOptions k-auto-bind=false k-options=\"esGridOptions\">"
  );


  $templateCache.put('src/partials/esParamAdvancedNumeric.html',
    "<div><label>{{esParamDef.caption}}</label><div><select kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.value k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"> <span ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.valueTo k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"></span></div></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedString.html',
    "<div class=row><label>{{esParamDef.caption}}</label><div class=row><div class=col-xs-4><select kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></div><div class=col-xs-4><input class=\"col-xs-12 col-md-7\" kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.value\"></div><div class=col-xs-4><input class=\"col-xs-12 col-md-12\" kendo-masked-text-box ng-model=esParamVal[esParamDef.id].paramValue.valueTo ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"></div></div></div>"
  );


  $templateCache.put('src/partials/esParamDateRange.html',
    "<div><label>{{esParamDef.caption}}</label><div><select kendo-drop-down-list k-data-text-field=\"'title'\" k-auto-bind=true k-data-value-field=\"'dValue'\" k-data-source=dateRangeOptions k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.dRange style=\"width: 50%\"></select><span ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange > '1'\"><input kendo-date-picker k-ng-model=esParamVal[esParamDef.id].paramValue.fromD k-format=\"'dd/MM/yyyy'\"></span> <span ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange != '0'\"><input kendo-date-picker k-ng-model=esParamVal[esParamDef.id].paramValue.toD k-format=\"'dd/MM/yyyy'\"></span></div></div>"
  );


  $templateCache.put('src/partials/esParamEnum.html',
    "<div><label>{{esParamDef.caption}}</label><div><select kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=true k-option-label=\"{ text: 'All', value: null}\" k-data-source=esParamDef.enumList k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue></select></div></div>"
  );


  $templateCache.put('src/partials/esParamMultiEnum.html',
    "<div><label>{{esParamDef.caption}}</label><select kendo-multi-select k-placeholder=esParamDef.toolTip k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=false k-value-primitive=true k-data-source=esParamDef.enumList k-ng-model=esParamVal[esParamDef.id].paramValue></select></div>"
  );


  $templateCache.put('src/partials/esParamMultiZoom.html',
    "<div><label>{{esParamDef.caption}}</label><select kendo-multi-select k-placeholder=esParamDef.caption k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=esParamDef.invSelectedMasterField k-data-value-field=esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select></div>"
  );


  $templateCache.put('src/partials/esParamNumeric.html',
    "<div><label>{{esParamDef.caption}}</label><div><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"></div></div>"
  );


  $templateCache.put('src/partials/esParamText.html',
    "<label>{{esParamDef.caption}}</label><input kendo-masked-text-box k-mask=esParamDef.formatString ng-model=\"esParamVal[esParamDef.id].paramValue\">"
  );


  $templateCache.put('src/partials/esParamZoom.html',
    "<label>{{esParamDef.caption}}</label><select kendo-combo-box k-placeholder=esParamDef.toolTip k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=esParamDef.invSelectedMasterField k-data-value-field=esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false k-min-length=3 ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParams.html',
    "<div class=\"form-group col-xs-12 col-sm-6 col-md-4 col-lg-3\" ng-repeat=\"param in esParamsDef | filter:{visible: true} | orderBy:'aa'\"><es-param es-type=\"param | esParamTypeMapper\" es-param-val=esParamsValues es-param-def=param></es-param></div>"
  );


  $templateCache.put('src/partials/esWebPQ.html',
    "<div><div class=row><es-params-panel ng-cloak es-params-values=esParamsValues es-group-id=esGroupId es-filter-id=esFilterId es-params-def=esParamsDef></es-params-panel></div><div class=row ng-cloak><es-grid es-group-id=esGroupId es-filter-id=esFilterId es-grid-options=esGridOptions es-execute-params=\"esParamsValues\"></div></div>"
  );

}]);
