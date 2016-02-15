'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('profileCtrl', ['$scope', '$log', 'esMessaging', 'esWebApi', 'esGlobals', '$mdToast',
    function($scope, $log, esMessaging, esWebApiService, esGlobals, $mdToast) {

        esWebApiService.fetchEntity("ESGOUser", "5B6F2E05-0AB6-4F29-9015-6A4352009EAD")
            .then(function(ret) {
            	$scope.esUserObject = ret.data;

            }, function(err) {
            	$scope.esUserObject = {};
            });

        $scope.products = [{
            url: 'images/portrait1.jpg'
        }, {
            url: 'images/portrait2.jpg'
        }, {
            url: 'images/portrait3.jpg'
        }, {
            url: 'images/portrait4.jpg'
        }, {
            url: 'images/portrait5.jpg'
        }, {
            url: 'images/portrait7.jpg'
        }, {
            url: 'images/portrait8.jpg'
        }, {
            url: 'images/portrait9.jpg'
        }];

    }
]);
