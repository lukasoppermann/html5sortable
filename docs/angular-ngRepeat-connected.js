'use strict';

var app = angular.module('Directives', ['htmlSortable']);

app.controller('MainCtrl', function($scope) {
  $scope.sortableOptions = {
    connectWith: '.connected'
  };

  $scope.dataSets = {
   firstSet: [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
   ],
   secondSet: [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
   ],
   thirdSet: [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
   ]
  };
});
