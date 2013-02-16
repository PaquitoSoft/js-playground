(function(collections, BB, Product) {
	
	collections.BootsCollection = BB.Collection.extend({

		model: Product,

		url: '/resources/products_data.json',

		initializer: function() {
			console.log("BootsCollection initialized");
		}/*,

		fetch: function(onSuccess) {
			this.fetch({
				success: function(collection, response, options) {
					console.log(arguments);
				},
				error: function(collection, hrx, options) {
					console.log(arguments);
				}
			});
		}
		*/
	});

}($SC_APP.collections, Backbone, $SC_APP.models.Product));