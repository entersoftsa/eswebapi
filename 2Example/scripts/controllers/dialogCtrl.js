'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('formCtrl', ['$scope', '$mdDialog', 'esWebApi', 'esUIHelper', '_', 'esCache', 'esMessaging', 'esGlobals',
    function($scope, $mdDialog, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.readonly = false;
        $scope.fruitNames = ['Apple', 'Banana', 'Orange'];
        $scope.roFruitNames = angular.copy($scope.fruitNames);
        $scope.tags = [];

        $scope.webPQOptions = {};
        $scope.webPQOptions.theGroupId = "ESMMStockItem";
        $scope.webPQOptions.theFilterId = "ESMMStockItem_def";
        $scope.webPQOptions.theVals = new esGlobals.ESParamValues();

        $scope.status = '  ';
        $scope.showAlert = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .content('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
        };
        $scope.showConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .content('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Sounds like a scam');
            $mdDialog.show(confirm).then(function() {
                $scope.status = 'You decided to get rid of your debt.';
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
        };
    }
]);
