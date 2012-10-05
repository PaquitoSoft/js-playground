(function($, localStore) {
	var productsData = [],
		selectedPriceOrder = 'none',
		PRODUCTS_DATA_KEY = 'products_data',
		brandsNamesContainer = $('.brands'),
		resultsCount = $('.resultsCount'),
		productsContainer = $('#catalog'),
		productsOrderSelector = $('.orderPrice'),
		miniShopCart = $('.simpleCart_items'),
		checkoutButton = $('.simpleCart_checkout'),
		orderTotal = $('#sidebar .orderTotal');

	
	function getProductData(productId, brand) {
		var result, products = [], i = 0, len;
		if (brand) {
			products = productsData[brand];
		} else {
			Object.keys(productsData).forEach(function(brand) {
				products = products.concat(productsData[brand]);
			});
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
	
	function formatPrice(price) {
		var result = "$" + price,
			index = result.indexOf('.');

		if (index !== -1) {
			if (result.substr(index + 1).length < 2) {
				result += '0';
			} else {
				result = result.substr(0, index + 3);
			}
		} else {
			result += '.00';
		}
		return result;
	}

	function drawBrands() {
		Object.keys(productsData).forEach(function(brand) {
			brandsNamesContainer.append('<span data-code="' + brand + '">' + $.camelCase('-' + brand) + '</span>');
		});
	}

	function updateOrderTotal() {
		var total = 0;
		miniShopCart.find('.itemContainer').each(function(item, orderItem) {
			var productData = getProductData($(orderItem).attr('data-productId')),
				orderItemTotal = parseInt($(orderItem).find('.itemQuantity input').val(), 10) * parseFloat(productData.price, 10);
			total += orderItemTotal;
		});
		orderTotal.html(formatPrice(total));
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
						'<div class="itemQuantity"><input type="text" name="quantity" value="1" maxlength="2"></div>' +
						'<div class="itemTotal">$' + product.price + '</div>';
	}

	function getSelectedProductsData() {
		var products = [],
			priceOrder = selectedPriceOrder,
			selectedBrands = brandsNamesContainer.find('span.selected');

		// If no brand is selected, we show all products
		if (selectedBrands.length < 1) {
			selectedBrands = brandsNamesContainer.find('span');
		}

		// Get products to show data
		selectedBrands.each(function(i, brandEl) {
			products = products.concat(productsData[$(brandEl).attr('data-code')]);
		});

		// Apply selected order
		if ('none' !== priceOrder) {
			products = products.sort(function(product1, product2) {
				if ('asc' === priceOrder) {
					return product1.price - product2.price;
				} else {
					return product2.price - product1.price;
				}
			});
		}

		return products;
	}

	function updateProductsGrid() {
		var products = getSelectedProductsData();

		// Update products grid
		productsContainer.html(createProductsHtml(products));

		// Update products count
		resultsCount.html(products.length);
	}

	function loadProductsData(callback) {
		var data = localStore.getItem(PRODUCTS_DATA_KEY);
		if (!data) {
			$.getJSON('../resources/products_data.json', function(extData) {
				localStore.setItem(PRODUCTS_DATA_KEY, JSON.stringify(extData));
				callback(extData);
			});
		} else {
			callback(JSON.parse(data));
		}
	}

	function configureBrandsLinks() {
		brandsNamesContainer.on('click', 'span', function(e) {
			e.preventDefault();
			$(this).toggleClass('selected');
			updateProductsGrid();
		});
	}

	function configureAddToCart() {
		productsContainer.on('click', 'li', function(event) {
			event.preventDefault();
			var productData = getProductData($(this).attr('data-id')),
				prevItem = miniShopCart.find('.itemContainer[data-productId="' + productData.id + '"]'),
				prevOrderItemQty, prevOrderItemTotalPrice, newQty;

			if (prevItem.length > 0) {
				prevOrderItemQty = prevItem.find('.itemQuantity input');
				prevOrderItemTotalPrice = prevItem.find('.itemTotal');
				newQty = parseInt(prevOrderItemQty.val(), 10) + 1;
				prevOrderItemQty.val(newQty);
				prevOrderItemTotalPrice.html(formatPrice(newQty * parseFloat(prevItem.find('.itemPrice').text().substr(1), 10)));
			} else {
				if (miniShopCart.find('.itemContainer').length > 0) {
					miniShopCart.append(createMiniShopCartItemHtml(productData));
				} else {
					miniShopCart.html(createMiniShopCartItemHtml(productData));
				}
			}

			updateOrderTotal();
		});
	}

	function configureOrderItemQtyChange() {
		var codes = [8, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
		miniShopCart.on('keydown', '.itemQuantity input', function(event) {
			if (codes.indexOf(event.which) === -1) {
				event.preventDefault();
			}
		});
		miniShopCart.on('keyup', '.itemQuantity input', function(event) {
			var qty = $(this).val(),
				productEl = $(this).parents('.itemContainer').first(),
				productData = getProductData(productEl.attr('data-productId')),
				newPrice = formatPrice(qty * productData.price);
			productEl.find('.itemTotal').html(newPrice);
			updateOrderTotal();
		});
	}
	
	function configureCheckout() {
		checkoutButton.click(function(event) {
			event.preventDefault();
			miniShopCart.html('<p class="orderProcessMsg">Thanks for purchase!</p>');
			brandsNamesContainer.find('.selected').removeClass('selected');
			updateProductsGrid();
			updateOrderTotal();
		});
	}

	function configureProductsOrderSelection() {
		productsOrderSelector.change(function(event) {
			selectedPriceOrder = $(event.target).val();
			updateProductsGrid();
		});
	}

	// Setup page
	loadProductsData(function(data) { // Load products data
		productsData = data; // Store as a module variable

		// Insert brands links
		drawBrands();

		// Show all products
		updateProductsGrid();

		// Configure brands links
		configureBrandsLinks();

		// Configure products order change
		configureProductsOrderSelection();

		// Configure add to cart action
		configureAddToCart();

		// Configure update order items quantity
		configureOrderItemQtyChange();

		// Configure checkout
		configureCheckout();
	});
	

})(jQuery, window.localStorage);