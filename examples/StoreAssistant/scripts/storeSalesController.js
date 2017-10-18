/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

(function() {
    'use strict';

    var appE = angular.module('esStoreAssistant');

    appE.controller('storeSalesCtrl', ['$scope', 'esMessaging', 'esWebApi', 'esUIHelper', 'esGlobals', '$timeout',
        function($scope, esMessaging, esWebApiService, esWebUIHelper, esGlobals, $timeout) {
            var vm = this;

            vm.storeSalesPQs = {
                "AA": 3040,
                "ID": "PQ_3040",
                "GroupID": "SALES",
                "Title": {
                    "en": "",
                    "el": "Ανάλυση λιανικής",
                    "ro": "",
                    "bg": ""
                },
                "Description": "Ανάλυση λιανικής",
                "ESUIType": "esCombo",
                "esDef": [{
                        "AA": 3041,
                        "ID": "PQ_3041",
                        "Title": "Ανάλυση καλαθιού λιανικής ανά υποκατάστημα",
                        "Description": "Ανάλυση καλαθιού λιανικής ανά υποκατάστημα",
                        "ESUIType": "esGrid",
                        "esDef": {
                            "GroupID": "ESWebManager",
                            "FilterID": "SalesRetailMarketBasketAnalysisByBranch",
                            "PQOptions": {
                                "ServerPaging": true,
                                "PageSize": 20,
                                "AutoExecute": false
                            }
                        }
                    },
                    {
                        "AA": 3042,
                        "ID": "PQ_3042",
                        "Title": "Μέση τιμή τζίρου & ποσότητας ανά ημέρα",
                        "Description": "Μέση τιμή τζίρου & ποσότητας ανά ημέρα",
                        "ESUIType": "esChart",
                        "esDef": {
                            "GroupID": "ESWebManager",
                            "FilterID": "SalesRetailAverageTurnOverQuantityByDay",
                            "UIOptions": {
                                "autoBind": true,
                                "legend": {
                                    "visible": true,
                                    "position": "top",
                                    "labels": {
                                        "template": "#= series.title #"
                                    }
                                },
                                "series": [{
                                        "type": "column",
                                        "field": "ESFIItemPeriodics_TurnOver",
                                        "categoryField": "Day",
                                        "axis": "ESFIItemPeriodics_TurnOver",
                                        "color": "#228B22",
                                        "title": "Τζίρος"
                                    },
                                    {
                                        "type": "line",
                                        "field": "Quantity",
                                        "categoryField": "Day",
                                        "axis": "Quantity",
                                        "title": "Ποσότητα"
                                    }

                                ],
                                "valueAxis": [{
                                        "visible": true,
                                        "name": "ESFIItemPeriodics_TurnOver",
                                        "labels": {
                                            "format": "{0}"
                                        },
                                        "title": {
                                            "text": {
                                                "en": "Turnover",
                                                "el": "Τζίρος",
                                                "ro": "",
                                                "bg": ""
                                            }
                                        }
                                    },
                                    {
                                        "visible": true,
                                        "name": "Quantity",
                                        "labels": {
                                            "format": "{0}"
                                        },
                                        "title": {
                                            "text": {
                                                "en": "Quantity",
                                                "el": "Ποσότητα",
                                                "ro": "",
                                                "bg": ""
                                            }
                                        }
                                    }
                                ],
                                "categoryAxis": {
                                    "categories": "Day",
                                    "labels": {
                                        "rotation": 45,
                                        "font": "8px"
                                    },
                                    "axisCrossingValues": [
                                        0,
                                        205
                                    ]
                                },
                                "tooltip": {
                                    "visible": true,
                                    "template": " #= category #, <br/>  #= kendo.format('{0:n2}',value )#"
                                }
                            }
                        }
                    },

                    {
                        "AA": 3043,
                        "ID": "PQ_3043",
                        "Title": "Φόρτος συναλλαγών ανά εβδομάδα",
                        "Description": "Φόρτος συναλλαγών ανά εβδομάδα",
                        "ESUIType": "esChart",
                        "esDef": {
                            "GroupID": "ESWebManager",
                            "FilterID": "SalesRetailTransactionLoadAnalysisByWeek",
                            "UIOptions": {
                                "autoBind": true,
                                "legend": {
                                    "visible": true,
                                    "position": "top",
                                    "labels": {
                                        "template": "#= series.title #"
                                    }
                                },
                                "series": [{
                                        "type": "column",
                                        "field": "ESFIItemPeriodics_TurnOver",
                                        "categoryField": "Week",
                                        "axis": "ESFIItemPeriodics_TurnOver",
                                        "color": "#228B22",
                                        "title": "Τζίρος"
                                    },
                                    {
                                        "type": "line",
                                        "field": "ESFIItemPeriodics_SalesQty",
                                        "categoryField": "Week",
                                        "axis": "ESFIItemPeriodics_SalesQty",
                                        "title": "Ποσότητα"
                                    }

                                ],
                                "valueAxis": [{
                                        "visible": true,
                                        "name": "ESFIItemPeriodics_TurnOver",
                                        "labels": {
                                            "format": "{0}"
                                        },
                                        "title": {
                                            "text": {
                                                "en": "Turnover",
                                                "el": "Τζίρος",
                                                "ro": "",
                                                "bg": ""
                                            }
                                        }
                                    },
                                    {
                                        "visible": true,
                                        "name": "ESFIItemPeriodics_SalesQty",
                                        "labels": {
                                            "format": "{0}"
                                        },
                                        "title": {
                                            "text": {
                                                "en": "Number of transactions",
                                                "el": "Πλήθος συναλλαγών",
                                                "ro": "",
                                                "bg": ""
                                            }
                                        }
                                    }
                                ],
                                "categoryAxis": {
                                    "categories": "Week",
                                    "labels": {
                                        "rotation": 45,
                                        "font": "8px"
                                    },
                                    "axisCrossingValues": [
                                        0,
                                        205
                                    ]
                                },
                                "tooltip": {
                                    "visible": true,
                                    "template": " #= category #, <br/>  #= kendo.format('{0:n2}',value )#"
                                }
                            }
                        }
                    }
                ]
            };
        }
    ]);
})();