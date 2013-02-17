// Router
App.Router.map(function() {
	this.resource('brands'); // '/#/brands'
});

App.BrandsRoute = Ember.Route.extend({
	model: function() {
		return App.Brand.find();
	}/*,
	setupController: function(controller) {
		console.log(controller.get('model'));
		console.log(controller.get('content'));
		var filteredProducts = [];
		controller.get('content').forEach(function(brand) {
			filteredProducts = filteredProducts.concat(brand.get('products').toArray());
		});
		controller.set('filteredProductsCount', filteredProducts.length);
		this.controllerFor('products').set('model', filteredProducts);
	}*/
});

App.ApplicationRoute = Ember.Route.extend({
	setupController: function() {
		this.controllerFor('products').set('model', App.Product.find());
	}
});
