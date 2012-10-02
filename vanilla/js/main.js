(function($, localStore) {
	var PRODUCTS_DATA_KEY = 'products_data',
		brandsNamesContainer = $('.brands'),
		productsContainer = $('#catalog'),
		miniShopCart = $('.simpleCart_items');

	function getAllProducts(productsData) {
		var result = [];
		Object.keys(productsData).forEach(function(brand) {
			result = result.concat(productsData[brand]);
		});
		return result;
	}

	function getProductData(productsData, productId, brand) {
		var result, products, i = 0, len;
		if (brand) {
			products = productsData[brand];
		} else {
			products = getAllProducts(productsData);
		}
		len = products.length;
		for (;i < len; i++) {
			if (products[i].id === productId) {
				result = products[i];
				break;
			}
		}
		return result;
	}
	
	function drawBrands(productsData) {
		Object.keys(productsData).forEach(function(brand) {
			brandsNamesContainer.append('<span data-code="' + brand + '">' + $.camelCase('-' + brand) + '</span>');
		});
	}

	function createProductsHtml(products) {
		var result = [];
		products.forEach(function(product) {
			result.push('<li data-id="' + product.id + '"><img src="' + product.imgUrl + '"><span class="price">$' + product.price + '</span><b>' + product.name.substr(0, 10) + '<br/><a href="#"> add to cart</a></b>');
		});
		return result.join('');
	}

	function createMiniShopCartItemHtml(product) {
		return '<div class="itemContainer" data-productId="' + product.id + '"><div class="itemImage"><img src="' + product.imgUrl + '"></div>' + 
						'<div class="itemName">' + product.name.substr(0, 10) + '</div>' +
						'<div class="itemPrice">$' + product.price + '</div>' +
						'<div class="itemOptions"> </div>' + 
						'<div class="itemQuantity"><input type="text" value="1"></div>' + 
						'<div class="itemTotal">$' + product.price + '</div>';
	}

	function showAllProducts(productsData) {
		var products = [];
		brandsNamesContainer.find('span').removeClass('selected');
		productsContainer.html(createProductsHtml(getAllProducts(productsData)));
	}

	function showBrandProducts(brand, productsData) {
		brandsNamesContainer.find('span').removeClass('selected');
		brandsNamesContainer.find('span[data-code="' + brand + '"]').addClass('selected');
		productsContainer.html(createProductsHtml(productsData[brand]));
	}

	function loadProductsData(callback) {
		var data = localStore.getItem(PRODUCTS_DATA_KEY);
		if (!data) {
			$.getJSON('/resources/products_data_2.json', function(extData) {
				localStore.setItem(PRODUCTS_DATA_KEY, JSON.stringify(extData));
				callback(extData);
			});
		} else {
			callback(JSON.parse(data));
		}
	}

	function configureBrandsLinks(productsData) {
		brandsNamesContainer.on('click', 'span', function(e) {
			e.preventDefault();
			var brand = $(this);
			brandsNamesContainer.find('span').removeClass('selected');
			if (brand.hasClass('selected')) {
				showAllProducts(productsData);
			} else {
				brand.addClass('selected');
				showBrandProducts(brand.attr('data-code'), productsData);	
			}
		});
	}

	function configureAddToCart(productsData) {
		productsContainer.on('click', 'li', function(event) {
			event.preventDefault();
			var selectedBrand = brandsNamesContainer.find('.selected'),
				productData = getProductData(productsData, $(this).attr('data-id'), (selectedBrand) ? selectedBrand.attr('data-code') : null),
				prevItem = miniShopCart.find('.itemContainer[data-productId="' + productData.id + '"]'),
				prevOrderItemQty, prevOrderItemTotalPrice, newQty;

			if (prevItem.length > 0) {
				prevOrderItemQty = prevItem.find('.itemQuantity input');
				prevOrderItemTotalPrice = prevItem.find('.itemTotal');
				newQty = parseInt(prevOrderItemQty.val(), 10) + 1;
				prevOrderItemQty.val(newQty);
				prevOrderItemTotalPrice.html('$' + (newQty * parseFloat(prevItem.find('.itemPrice').text().substr(1), 10)));
			} else {
				miniShopCart.append(createMiniShopCartItemHtml(productData));
			}

		});
	}
	
	// Setup page 
	loadProductsData(function(data) { // Load products data

		// Insert brands links
		drawBrands(data);

		// Show all products
		showAllProducts(data);

		// Configure brands links
		configureBrandsLinks(data);

		// Configure add to cart action
		configureAddToCart(data);
	});
	

})(jQuery, window.localStorage);