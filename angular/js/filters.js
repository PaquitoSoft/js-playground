/*global angular:true */
'use strict';

(function() {
	var filters = angular.module('bootsStoreFilter', []);

	filters.filter('capitalize', function() {
		return function(input) {
			return input.substr(0, 1).toUpperCase() + input.substr(1);
		};
	});

})();
