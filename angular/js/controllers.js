"use strict";


function BootsListController($scope, Products, $log) {

	Products.all().then(function(results) {
		$scope.brands = results.brands;
		$scope.boots = results.products;
	});

	$scope.selectedBrands = [];

	$scope.productPriceOrder = '';

	$scope.selectBrand = function() {
		var brands = $scope.selectedBrands,
			index = brands.indexOf(this.brand.code);
		if (~index) {
			brands.splice(index, 1);
		} else {
			brands.push(this.brand.code);
		}
	};

	$scope.byBrand = function(boot) {
		var brandsCodes = $scope.selectedBrands;
		if (brandsCodes.length > 0) {
			return ~$scope.selectedBrands.indexOf(boot.brandCode);
		} else {
			return true;
		}
	};

}

function BootDetailController($scope, $rootScope, $routeParams, Products) {
	
	Products.productById($routeParams.bootId).then(function(productData) {
		$scope.productData = productData;
		// TODO This url path should not be here
		$scope.mainImgUrl = '/images/boots/product/' + productData.id + '/' + productData.id + '.jpg';
		$scope.selectedImgIndex = 1;
	});
	
	$scope.setImage = function(index) {
		// TODO This url path should not be here
		$scope.mainImgUrl = '/images/boots/product/' + $scope.productData.id + '/' +
			$scope.productData.id + ((index > 1) ? '_' + index : '') +'.jpg';
		$scope.selectedImgIndex = index;
	};

	$scope.buyProduct = function($event) {
		$event.preventDefault();
		// 'this' is the controller's scope
		$rootScope.$broadcast('addProductToCart', this.productData);
	};
}

function ShoppingCartController($scope, $rootScope, $log) {

	$scope.orderItems = [];
	$scope.totalAmount = 0.00;

	var getOrderItem = function(productId) {
		var result,
			i = 0,
			ois = $scope.orderItems,
			len = ois.length;
		for (; i < len; i++) {
			if (ois[i].product.id === productId) {
				result = ois[i];
				break;
			}
		}
		return result;
	};


	$scope.checkout = function($event) {
		$event.preventDefault();
	};

	$rootScope.$on('addProductToCart', function(event, product) {
		var prevOrderItem = getOrderItem(product.id),
			price;
		
		if (prevOrderItem) {
			price = parseFloat(prevOrderItem.product.price, 10);
			prevOrderItem.quantity++;
			prevOrderItem.amount += price;
		} else {
			price = parseFloat(product.price, 10);
			$scope.orderItems.push({
				product: product,
				quantity: 1,
				amount: price
			});
		}
		$scope.totalAmount += price;
	});

}
