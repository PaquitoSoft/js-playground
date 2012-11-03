/*global angular:true, BootsListController:true, BootDetailController:true */
'use strict';

angular.module('bootsStore', ['bootsStoreFilter', 'appStorage']).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/catalog-view.html',
		controller: BootsListController
	}).when('/boots/:bootId', {
		templateUrl: 'templates/product-view.html',
		controller: BootDetailController
	}).otherwise({
		redirectTo: '/'
	});
}]);

/* App Module */
/*
angular.module('phonecat', ['phonecatFilters', 'phonecatServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/phones', {templateUrl: 'partials/phone-list.html',   controller: PhoneListCtrl}).
      when('/phones/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/phones'});
}]);
*/