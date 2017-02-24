'use strict';

var app = angular.module('Directives', ['htmlSortable']);

app.controller('MainCtrl', function($scope) {
  $scope.data1 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
  ];

  $scope.add = function () {
    $scope.data1.push({id: $scope.data1.length + 1, name: 'E'});
  };

  $scope.sortableCallback = function (sourceModel, destModel, start, end) {
    console.log(start + ' -> ' + end);
  };
});
