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

	// Select 'ascending' and check selected value and product items order

});

// Adicion al carro

// Finalizar pedido