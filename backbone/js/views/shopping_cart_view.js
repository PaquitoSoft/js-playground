(function(views, BB, $) {
	
	views.ShoppingCartView = BB.View.extend({

		id: 'sidebar',

		orderItemTemplateId: 'orderItemTpl',

		initialize: function() {
			console.log('ShoppingCartView controller created!');
		},

		render: function() {
			
		}
	});

}($SC_APP.views, Backbone, Zepto));