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
	S('.simpleCart_items').html(function(html) {
		return html.trim() === "";
	});

	// Order grand total must be 0
	S('.orderTotal').text('$0.00');

	// Products order must be 'none'
	S('.orderPrice option[selected="selected"]').val('none');

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
	S('.orderPrice option[value="asc"]').click();

	// Check first and last products
	checkPrices('$12.99', '$189.99');
	
	// Change selection to 'descending'
	S('.orderPrice option[value="desc"]').click();

	// Check first and last products
	checkPrices('$189.99', '$12.99');
	
	// Revert order to initial status
	S('.orderPrice option[value="none"]').click();

	// Check first and last products
	checkPrices('$44.99', '$14.99');
	
	// Filter products by brand and order them price 'ascending'
	S('.brands span[data-code="asics"]').click();
	S('.orderPrice option[value="asc"]').click();

	// Check first and last products
	checkPrices('$59.99', '$114.99');

	// Add a new brand filter
	S('.brands span[data-code="umbro"]').click();

	// Check first and last products
	checkPrices('$14.99', '$114.99');

});

// Product detail navigation
test("Product detail navigation", function() {

	S('.product[data-id="th12739"]').click();
	S('.productView').visible();
	S('.catalogView').invisible();
	S('.productView .productPrice .amount').text(function(price) {
		console.log(arguments);
		console.log(this);
		return price.indexOf('39.99') !== -1;
	});
});

// TODO Shopping cart addition
/*
test("Add products to cart", function() {

	// Add a product to the shopping cart and check its addition
	var productId = S('.product:nth(10)').attr('data-id');
	S('.product:nth(10) a').click();

	// Shopping cart should only have one item
	S('.simpleCart_items .itemContainer').size(1);

	// Shopping cart product should be the one clicked
	S(function() {
		var addedProductId = S('.simpleCart_items .itemContainer:first').attr('data-productId');
		equal(productId, addedProductId, "Visible products match selected brands");
	});

	// TODO Complete this test

});
*/

// TODO Order checkout