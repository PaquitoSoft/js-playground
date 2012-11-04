// Helper functions
function checkPrices(first, last) {
	S('.product .price:first').text(first);
	S('.product .price:last').text(last);
}

// Test suite definition
module("Simple Cart", {
  setup: function() {
    // opens the page you want to test
    S.open("../vanilla/index.html");
    // S.open("../angular/index.html");
  }
});

test("Asserting page initial state", function() {

	// Check the brands count
	S('.brands span').size(8);

	// Check the products count
	S('#catalog li').size(279);

	// There must be no brand selected
	S('.brands .selected').size(0);

	// Filtered products indicator must have the correct value
	S('.resultsCount').text('279');

	// Shopping cart must be empty
	S('.simpleCart_items .itemContainer').size(0);

	// Order grand total must be 0
	S('.orderTotal').text('$0.00');

	// Products order must be 'none'
	S('.orderPrice option[selected="selected"]').val(function(val) {
		return val === 'none' || val === '';
	});

});

test("Products filtering", function() {
	var initialProductsCount = S('#catalog li').size();

	// Select a brand must change products count on the grid
	S('.brands span[data-code="lotto"]').click();
	S('#catalog li').size(9);
	S('#catalog li[data-brandCode="lotto"]').size(9);
	
	// Products count indicator should be equals to products on the grid
	S(function() {
		S('.resultsCount').text('' + S('#catalog li').size());
	});
	
	// Deselect that brand should update products to its default state (all visible)
	S('.brands span[data-code="lotto"]').click();
	S('#catalog li').size(initialProductsCount);
	S(function() {
		S('.resultsCount').text('' + S('#catalog li').size());
	});

	// Select three brands should update products grid with produtcs from both brands
	S('.brands span[data-code="umbro"]').click();
	S('.brands span[data-code="nike"]').click();
	S('.brands span[data-code="hummel"]').click();
	S('#catalog li').size(124);
	S(function() {
		var count = 0;
		count += S('#catalog li[data-brandCode="umbro"]').size();
		count += S('#catalog li[data-brandCode="nike"]').size();
		count += S('#catalog li[data-brandCode="hummel"]').size();
		equal(count, 124, "Visible products match selected brands");
	});

	// Products indicator should be correct
	S(function() {
		S('.resultsCount').text('' + S('#catalog li').size());
	});

	// Deselecting one of them should leave the others selected
	S('.brands span[data-code="nike"]').click();
	S('#catalog li').size(16);
	S(function() {
		S('.resultsCount').text('' + S('#catalog li').size());
	});
	S(function() {
		var count = 0;
		count += S('#catalog li[data-brandCode="umbro"]').size();
		count += S('#catalog li[data-brandCode="hummel"]').size();
		equal(count, 16, "Visible products match selected brands");
	});

});

test("Products ordering", function() {

	// Check default order is none
	S('.orderPrice option[selected="selected"]').text('---');

	// Select 'ascending'
	S('.orderPrice option:nth-child(2)').click();

	// Check first and last products
	checkPrices('$12.99', '$189.99');
	
	// Change selection to 'descending'
	S('.orderPrice option:nth-child(3)').click();

	// Check first and last products
	checkPrices('$189.99', '$12.99');
	
	// Revert order to initial status
	S('.orderPrice option:nth-child(1)').click();

	// Check first and last products
	checkPrices('$44.99', '$14.99');
	
	// Filter products by brand and order them price 'ascending'
	S('.brands span[data-code="asics"]').click();
	S('.orderPrice option:nth-child(2)').click();

	// Check first and last products
	checkPrices('$59.99', '$114.99');

	// Add a new brand filter
	S('.brands span[data-code="umbro"]').click();

	// Check first and last products
	checkPrices('$14.99', '$114.99');

});

// Product detail navigation
test("Product detail navigation", function() {

	S('.product[data-id="th12739"] a').click();
	S('.productView').visible();
	S('.catalogView').invisible();
	S('.productView .productDetail').attr('data-productId', 'th12739');
	S('.productView .productPrice .amount').text(function(price) {
		return price.indexOf('39.99') !== -1;
	});

	S('.back a').click();
	S('.productView').invisible();
	S('.catalogView').visible();
});

// Shopping cart
test("Add products to cart", function() {
	var productId_1 = "th12809",
		productId_2 = "th14007";

	// Add a product to the shopping cart and check its addition
	S('.product[data-id="' + productId_1 + '"] a').click();
	S('.productView .actions .buttonLink').visible().click();

	// Shopping cart should only have one item
	S('.simpleCart_items .itemContainer').size(1);

	// Shopping cart product should be the one clicked
	S(function() {
		var addedProductId = S('.simpleCart_items .itemContainer:first').attr('data-productId');
		equal(productId_1, addedProductId, "Visible products match selected brands");
	});
	
	// Shopping cart total should be equals to the product price
	S(function() {
		var bootsPrice = S('.productPrice .amount').text();
		S('.orderTotal').text(bootsPrice);
	});
	
	// Let's add the same product again
	S('.productView .actions .buttonLink').visible().click();

	// Shopping cart must still have only one item
	S('.simpleCart_items .itemContainer').size(1);

	// Quantity and price should have changed
	S('.shoppingCart .itemContainer input[name="quantity"]').val('2');
	// S('.shoppingCart .itemContainer input[name="quantity"]').attr('value', '2');
	S('.shoppingCart .itemContainer .itemTotal').text('$59.98');
	S('.shoppingCart .orderTotal').text('$59.98');

	// Now we go to another product detail page and add it to the cart
	S('.productDetail .back a').click();
	S('.product[data-id="' + productId_2 + '"]').visible();
	S('.product[data-id="' + productId_2 + '"] a').click();
	S('.productView .actions .buttonLink').visible().click();

	// Shopping cart should now have two items
	S('.simpleCart_items .itemContainer').size(2);

	// Shopping cart product should be the one clicked
	S(function() {
		var addedProductId = S('.simpleCart_items .itemContainer:nth(1)').attr('data-productId');
		equal(productId_2, addedProductId, "Visible products match selected brands");
	});

	// Order total should have changed
	S('.shoppingCart .orderTotal').text('$139.97');

	// TODO Update first order item quantity by hand

	// Now we checkout the order
	S('.simpleCart_checkout').click();

	// There must be no items in the cart
	S('.simpleCart_items .itemContainer').size(0);

	// Order total amount should be zero
	S('.shoppingCart .orderTotal').text('$0.00');

	// Shopping cart should show a message
	S('.shoppingCart .orderProcessMsg').visible().text("Thanks for purchase!");

});
