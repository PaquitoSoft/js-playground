/*global angular:true */
'use strict';

angular.module('appStorage', [], function($provide) {
	$provide.factory('Products', ['$http', '$q', function($http, $q) {
		var brandsData, productsData;

		var fetchAll = function() {
			var deferred = $q.defer();
			if (productsData) { // TODO For any weird reason, productsData are not getting cached...
				deferred.resolve(productsData);
			} else {
				$http.get('../resources/products_data.json').success(function(productsData) {
					var brandsCodes = Object.keys(productsData),
						brands = [],
						products = [];

					brandsCodes.forEach(function(brandCode) {
						brands.push({
							code: brandCode
						});
						productsData[brandCode].forEach(function(product) {
							products.push({
								id: product.id,
								brandCode: brandCode,
								name: product.name,
								shortName: product.name.substr(0, 10),
								price: parseFloat(product.price, 10)
							});
						});
					});
					brandsData = brands;
					productsData = products;
					deferred.resolve({
						brands: brands,
						products: products
					});
				});
			}
			return deferred.promise;
		};

		var getBrands = function() {
			var deferred = $q.defer();
			fetchAll().then(function(brands, products) {
				deferred.resolve(brands);
			});
			return deferred.promise;
		};

		var getProducts = function() {
			var deferred = $q.defer();
			fetchAll().then(function(brands, products) {
				deferred.resolve(products);
			});
			return deferred.promise;
		};

		var getProduct = function(productId) {
			var deferred = $q.defer();
			fetchAll().then(function(data) {
				var result, i = 0, len = data.products.length;
				for (; i < len; i++) {
					if (productId === data.products[i].id) {
						result = data.products[i];
						break;
					}
				}
				deferred.resolve(result);
			});
			return deferred.promise;
		};

		return {
			all: fetchAll,
			brands: getBrands,
			products: getProducts,
			productById: getProduct
		};
	}]);
});

/* Services */
/*
angular.module('phonecatServices', ['ngResource']).
    factory('Phone', function($resource){
  return $resource('phones/:phoneId.json', {}, {
    query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
  });
});
*/