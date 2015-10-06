angular.module('es.Web.UI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/esGrid.html',
    "<div kendo-grid k-ng-delay=esGridOptions k-auto-bind=false k-options=\"esGridOptions\">"
  );


  $templateCache.put('src/partials/esParamAdvancedNumeric.html',
    "<div><label class=control-label>{{esParamDef.caption}}</label><input class=form-control kendo-masked-text-box ng-click=popup() ng-model=esParamVal[esParamDef.id].strVal ng-model-options=\"{ getterSetter: true }\"></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedNumericModal.html',
    "<div class=modal-header><h4 class=modal-title><span class=\"glyphicon glyphicon-star\"></span>{{esParamDef.caption}}</h4></div><div class=modal-body><form novalidate class=form><div class=row><div class=\"form-group col-xs-12 col-md-4\"><label class=control-label>Φίλτρο<label><select class=form-control kendo-drop-down-list style=\"min-width: 150px\" ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></label></div><div class=\"form-group col-xs-12 col-md-4\"><label class=control-label>{{esParamVal[esParamDef.id].paramValue.oper != 'RANGE' ? 'Value' : 'From'}}</label><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.value k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"></div><div class=\"form-group col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><label class=control-label>To</label><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.valueTo k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"></div></div><form></form></form></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedString.html',
    "<div><label class=control-label>{{esParamDef.caption}}</label><input class=form-control kendo-masked-text-box ng-click=popup() ng-model=esParamVal[esParamDef.id].strVal ng-model-options=\"{ getterSetter: true }\"></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedStringModal.html',
    "<div class=modal-header><h4 class=modal-title><span class=\"glyphicon glyphicon-star\"></span>{{esParamDef.caption}}</h4></div><div class=modal-body><form novalidate class=form><div class=row><div class=\"form-group col-xs-12 col-md-4\"><label class=control-label>Φίλτρο<label><select class=form-control kendo-drop-down-list style=\"min-width: 150px\" ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select></label></div><div class=\"form-group col-xs-12 col-md-4\"><label class=control-label>{{esParamVal[esParamDef.id].paramValue.oper != 'RANGE' ? 'Value' : 'From'}}</label><input class=form-control kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.value\"></div><div class=\"form-group col-xs-12 col-md-4\" ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><label class=control-label>To</label><input class=form-control kendo-masked-text-box ng-model=\"esParamVal[esParamDef.id].paramValue.valueTo\"></div></div><form></form></form></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button></div>"
  );


  $templateCache.put('src/partials/esParamDateRange.html',
    "<div class=es-advanced-param-wrap><label class=control-label>{{esParamDef.caption}}</label><div><input class=form-control kendo-masked-text-box ng-focus=\"bix = !bix\" ng-click=\"bix = !bix\" ng-model=esParamVal[esParamDef.id].strVal ng-model-options=\"{ getterSetter: true }\"></div><div class=es-advanced-param ng-hide=!bix><select class=form-control kendo-drop-down-list k-data-text-field=\"'title'\" k-auto-bind=true k-data-value-field=\"'dValue'\" k-data-source=dateRangeOptions k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.dRange></select><span ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange > '1'\"><input kendo-date-picker k-ng-model=esParamVal[esParamDef.id].paramValue.fromD k-format=\"'dd/MM/yyyy'\"></span> <span ng-hide=\"esParamVal[esParamDef.id].paramValue.dRange != '0'\"><input kendo-date-picker k-ng-model=esParamVal[esParamDef.id].paramValue.toD k-format=\"'dd/MM/yyyy'\"></span></div></div>"
  );


  $templateCache.put('src/partials/esParamEnum.html',
    "<label class=control-label>{{esParamDef.caption}}</label><select class=form-control kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=true k-option-label=\"{ text: 'All', value: null}\" k-data-source=esParamDef.enumList k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiEnum.html',
    "<label class=control-label>{{esParamDef.caption}}</label><select class=form-control kendo-multi-select k-placeholder=esParamDef.toolTip k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=false k-value-primitive=true k-data-source=esParamDef.enumList k-ng-model=esParamVal[esParamDef.id].paramValue></select>"
  );


  $templateCache.put('src/partials/esParamMultiZoom.html',
    "<label class=control-label>{{esParamDef.caption}}</label><select class=form-control kendo-multi-select k-placeholder=esParamDef.caption k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=esParamDef.invSelectedMasterField k-data-value-field=esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParamNumeric.html',
    "<label class=control-label>{{esParamDef.caption}}</label><input class=form-control kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\">"
  );


  $templateCache.put('src/partials/esParamText.html',
    "<label class=control-label>{{esParamDef.caption}}</label><input class=form-control kendo-masked-text-box k-mask=esParamDef.formatString ng-model=\"esParamVal[esParamDef.id].paramValue\">"
  );


  $templateCache.put('src/partials/esParamZoom.html',
    "<label class=control-label>{{esParamDef.caption}}</label><select class=form-control kendo-combo-box k-placeholder=esParamDef.toolTip k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=esParamDef.invSelectedMasterField k-data-value-field=esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false k-min-length=3 ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select>"
  );


  $templateCache.put('src/partials/esParams.html',
    "<accordion><accordion-group heading=\"Parameters ({{esParamsDef.length}})\" is-open=true><form class=form><div class=row><div class=\"form-group col-xs-12 col-sm-6 col-md-4 col-lg-3\" ng-repeat=\"param in esParamsDef | filter:{visible: true} | orderBy:'aa'\"><es-param es-type=\"param | esParamTypeMapper\" es-param-val=esParamsValues es-param-def=param></es-param></div></div></form></accordion-group></accordion>"
  );


  $templateCache.put('src/partials/esWebPQ.html',
    "<div class=row><es-params-panel ng-cloak es-params-values=esParamsValues es-group-id=esGroupId es-filter-id=esFilterId es-params-def=esParamsDef></es-params-panel></div><div class=row ng-cloak><es-grid es-group-id=esGroupId es-filter-id=esFilterId es-grid-options=esGridOptions es-execute-params=\"esParamsValues\"></div>"
  );

}]);
