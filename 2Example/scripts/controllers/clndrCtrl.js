'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('calendarCtrl', function ($scope) {
   
  $scope.selectedDate = null;
    $scope.firstDayOfWeek = 0; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.setDirection = function(direction) {
      $scope.direction = direction;
    };

    $scope.dayClick = function(date) {
      $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
    };

    $scope.prevMonth = function(data) {
      $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
    };

    $scope.nextMonth = function(data) {
      $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
    };

   
});