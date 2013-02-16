(function(models, BB) {
	
	models.Product = BB.Model.extend({
		getShortName: function() {
			return this.get('name').substr(0, 10);
		}
	});

}($SC_APP.models, Backbone));