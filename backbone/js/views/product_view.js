(function(views, BB, $) {
	
	views.ProductView = BB.View.extend({

		id: 'productPanel',

		templateId: 'productDetailTpl',

		initialize: function() {
			console.log('ProductView controller created!');
		},

		render: function() {
			
		}
	});

}($SC_APP.views, Backbone, Zepto));