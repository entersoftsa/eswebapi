angular.module('es.Web.UI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/partials/esGrid.html',
    "<div class=boxc-col><div kendo-grid k-ng-delay=esGridOptions k-auto-bind=false k-options=\"esGridOptions\"></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedNumeric.html',
    "<div class=es-prm><label class=es-prm-label>{{esParamDef.caption}}</label><div class=es-prm-val><select class=es-prm-val kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.value k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"> <span ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue.valueTo k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"></span></div></div>"
  );


  $templateCache.put('src/partials/esParamAdvancedString.html',
    "<div class=es-prm><label class=es-prm-label>{{esParamDef.caption}}</label><div class=es-prm-val><select class=es-prm-val kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'caption'\" k-data-value-field=\"'value'\" k-auto-bind=true k-data-source=esWebUIHelper.getesComplexParamFunctionOptions() k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue.oper></select><input kendo-masked-text-box k-clear-prompt-char=true k-mask=esParamDef.formatString k- ng-model=\"esParamVal[esParamDef.id].paramValue.value\"> <input kendo-masked-text-box k-clear-prompt-char=true k-mask=esParamDef.formatString ng-model=esParamVal[esParamDef.id].paramValue.valueTo ng-hide=\"esParamVal[esParamDef.id].paramValue.oper != 'RANGE'\"></div></div>"
  );


  $templateCache.put('src/partials/esParamEnum.html',
    "<div class=boxc-col><h4>{{esParamDef.caption}} and the field to bind to {{esParamDef.id}} and value is {{esParamVal[esParamDef.id]}}</h4><select class=es-prm-val kendo-drop-down-list ng-cloak k-ng-delay=esParamDef k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=true k-option-label=\"{ text: 'All', value: null}\" k-data-source=esParamDef.enumList k-value-primitive=true k-ng-model=esParamVal[esParamDef.id].paramValue></select></div>"
  );


  $templateCache.put('src/partials/esParamMultiEnum.html',
    "<div class=boxc-col><label>{{esParamDef.caption}}</label><select class=es-prm-val kendo-multi-select k-placeholder=esParamDef.toolTip k-data-text-field=\"'text'\" k-data-value-field=\"'value'\" k-auto-bind=false k-value-primitive=true k-data-source=esParamDef.enumList k-ng-model=esParamVal[esParamDef.id].paramValue></select></div>"
  );


  $templateCache.put('src/partials/esParamMultiZoom.html',
    "<div class=\"boxc-col es-prm\"><label class=es-prm-label>{{esParamDef.caption}} xaxa</label><select class=es-prm-val kendo-multi-select k-placeholder=esParamDef.caption k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=esParamDef.invSelectedMasterField k-data-value-field=esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select></div>"
  );


  $templateCache.put('src/partials/esParamNumeric.html',
    "<div class=es-prm><label class=es-prm-label>{{esParamDef.caption}}</label><div class=es-prm-val><input kendo-numeric-text-box align=right k-ng-model=esParamVal[esParamDef.id].paramValue k-spinners=false k-decimals=esParamDef.precision k-format=\"'n'+'{{esParamDef.precision}}'\"></div></div>"
  );


  $templateCache.put('src/partials/esParamText.html',
    "<div class=es-prm><label class=es-prm-label>{{esParamDef.caption}}</label><div class=es-prm-val><input kendo-masked-text-box k-mask=esParamDef.formatString ng-model=\"esParamVal[esParamDef.id].paramValue\"></div></div>"
  );


  $templateCache.put('src/partials/esParamZoom.html',
    "<div class=boxc-col><label>{{esParamDef.caption}}</label><select kendo-combo-box k-placeholder=esParamDef.toolTip k-template=\"'<span><b>#: Code #</b> -- #: Description #</span>'\" k-data-text-field=esParamDef.invSelectedMasterField k-data-value-field=esParamDef.invSelectedMasterField k-filter=\"'contains'\" k-auto-bind=false k-min-length=3 ng-model=esParamVal[esParamDef.id].paramValue k-data-source=esParamLookupDS></select></div>"
  );


  $templateCache.put('src/partials/esParams.html',
    "<div><h4>Parameters</h4><div><div ng-repeat=\"param in esParamsDef | filter:{visible: true} | orderBy:'aa'\"><div><es-param es-type=\"param | esParamTypeMapper\" es-param-val=esParamsValues es-param-def=param></es-param><hr></div></div></div></div>"
  );


  $templateCache.put('src/partials/esWebPQ.html',
    "<div class=boxc-col><div><es-params-panel ng-cloak es-params-values=esParamsValues es-group-id=esGroupId es-filter-id=esFilterId es-params-def=esParamsDef></es-params-panel></div><div ng-cloak><es-grid es-group-id=esGroupId es-filter-id=esFilterId es-grid-options=esGridOptions es-execute-params=\"esParamsValues\"></div></div>"
  );

}]);
