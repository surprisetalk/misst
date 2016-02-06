'use strict';

//Setting up route
angular.module('mixtapes').config(['$stateProvider',
  function($stateProvider) {
    // Missttapes state routing
    $stateProvider
      .state('missttapes', {
        url: '/missttape',
        templateUrl: 'modules/mixtapes/client/views/missttapes.client.view.html'
      });
  }
]);
