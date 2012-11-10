"use strict";


function BootsListController($scope, Products, $routeParams, $log) {
	$scope.prevItem = $routeParams.productId;

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
		productData.alternativeImages = [];
		[1,2,3,4,5].forEach(function(count) {
			// TODO This url path should not be here
			productData.alternativeImages.push("/images/boots/product/" + productData.id + "/" + productData.id +
				((count > 1) ? ('_' + count) : '') + ".jpg");
		});
		$scope.mainImgUrl = productData.alternativeImages[0];
		$scope.productData = productData;
		$scope.selectedImgIndex = 0;
	});
	
	$scope.setImage = function(index) {
		$scope.mainImgUrl = $scope.productData.alternativeImages[index];
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
	$scope.orderPlaced = false;

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
		if ($scope.orderItems.length) {
			$scope.orderItems = [];
			$scope.totalAmount = 0.00;
			$scope.orderPlaced = true;
		}
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
		$scope.orderPlaced = false;
	});

}
