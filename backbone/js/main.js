(function(runtime, BB, ShoppingCartView, CatalogView, ProductDetailView) {
	
	// Create the main router
	var AppRouter = BB.Router.extend({
		routes: {
			'/:productId': 'index',
			'/boots/:productId': 'productDetail'
		},

		initialize: function() {
			
			runtime.catalog = new CatalogView();
			runtime.shoppingCart = new ShoppingCartView();

		},

		index: function(productId) {

		},

		productDetail: function(productId) {
			
		}

	});

	runtime.router = new AppRouter();
	BB.history.start();

}($SC_APP.runtime, Backbone, $SC_APP.views.ShoppingCartView, $SC_APP.views.CatalogView, $SC_APP.views.ProductDetailView));