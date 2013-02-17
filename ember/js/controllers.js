// Controllers
App.BrandsController = Ember.ArrayController.extend({

	filteredBrands: [],

	filteredProductsCount: 0,

	filterBy: function(brand) {
		var index = this.filteredBrands.indexOf(brand),
			fBrands = this.filteredBrands,
			filteredProducts = [];

		if (index !== -1) {
			fBrands.splice(index, 1);
			if (fBrands.length < 1) {
				fBrands = this.get('content').toArray();
			}
		} else {
			fBrands.push(brand);
		}

		fBrands.forEach(function(brand) {
			filteredProducts = filteredProducts.concat(brand.get('products').toArray());
		});
		
		this.set('filteredProductsCount', filteredProducts.length);
		this.controllerFor('products').set('content', filteredProducts);
	}
});

App.ProductsController = Ember.ArrayController.extend({});
