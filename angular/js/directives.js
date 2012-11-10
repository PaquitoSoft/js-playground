/*global angular:true, console:true */
'use strict';

/* Directives */

(function() {
	var directives = angular.module('bootsStoreDirectives', []);

	directives.directive('scrollIf', function () {
		return function (scope, element, attributes) {
			setTimeout(function () {
				if (scope.$eval(attributes.scrollIf)) {
					console.log(scope);
					console.log(element);
					console.log(attributes);
					window.scrollTo(0, element[0].offsetTop - 10);
				}
			}, 0);
		};
	});
}());