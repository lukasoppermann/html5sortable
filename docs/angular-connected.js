'use strict';

var app = angular.module('Directives', ['htmlSortable']);

app.controller('MainCtrl', function($scope) {
  $scope.sortableOptions = {
    connectWith: '.connected'
  };

  $scope.data1 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
  ];

  $scope.data2 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
  ];

  $('ul').bind('dragover', function (event) {
    var $dropZone = $(this), $timeout = window.dropZoneTimeout;
    var $hClass = 'muted';

    if (!$timeout) {
      $dropZone.addClass($hClass);
    } else {
      clearTimeout($timeout);
    }

    window.dropZoneTimeout = setTimeout(function () {
      window.dropZoneTimeout = null;
      $dropZone.removeClass($hClass);
    }, 100);

    event.preventDefault();
  });
});
