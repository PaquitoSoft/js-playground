(function(views, BB, $, M, BootsCollection, Product) {

	// TODO Move to a helper module
	function capitalize(input) {
		return input.substr(0, 1).toUpperCase() + input.substr(1);
	}
	
	views.CatalogView = BB.View.extend({

		el: '#catalogPanel',

		brandsTpl: $('#catalogBrandsTpl').html(),

		bootTpl: $('#catalogItemTpl').html(),

		events: {
			'click .brands span': 'brandClickHandler',
			'click .product': 'productClickHandler'
		},

		initialize: function() {
			var self = this,
				bootsColl = new BB.Collection();

			this.$brandsContainer = this.$el.find('#header');
			this.$bootsContainer = this.$el.find('#catalog');
			this.$productsCounter = null;
			
			this.brands = new BB.Collection();
			this.boots = new BB.Collection();
			this.filteredBoots = new BB.Collection();

			// Fetch products data
			bootsColl.url = '/resources/products_data.json';
			bootsColl.fetch({
				success: function(collection, response) {
					
					// Parse incoming data as it's not Backbone friendly
					Object.keys(response).forEach(function(key) {
						self.brands.add(new BB.Model({
							code: key,
							name: capitalize(key),
							products: response[key]
						}));

						response[key].forEach(function(item) {
							item.brandCode = key;
							self.boots.add(new Product(item));
						});
					});

					self.filteredBoots.add(self.boots.models);
					
					// Once we have the data we render the component UI
					self.render();
				},
				error: function(collection, xhr, options) {
					// TODO Handle error fetching data
				}
			});
			
			console.log('CatalogView controller created!');

		},

		render: function() {
			this.renderBrands();
			this.renderBoots();
		},

		renderBrands: function() {
			this.$brandsContainer.html(M.render(this.brandsTpl, {
				brands: this.brands.toJSON(),
				productsCount: this.boots.size()
			}));
			this.$productsCounter = this.$brandsContainer.find('.resultsCount');
		},

		renderBoots: function() {
			var result = [];
			this.filteredBoots.forEach(function(item) {
				result.push(M.render(this.bootTpl, {
					id: item.id,
					brandCode: item.get('brandCode'),
					price: item.get('price'),
					shortName: function() {
						return item.getShortName();
					}
				}));
			}, this);
			this.$bootsContainer.html(result.join(''));
		},

		brandClickHandler: function(event) {
			var $el = $(event.currentTarget),
				filter = {
					brandCode: $el.data('code')
				},
				selectedBrands,
				bootsSource,
				brandBoots;

			// Change brand selection state
			$el.toggleClass('selected');

			// Check if there is only one brand selected
			selectedBrands = this.$brandsContainer.find('span.selected');
			if (selectedBrands.length === 1 && selectedBrands.get(0) === $el[0]) {
				this.filteredBoots = new BootsCollection();
			}

			// Filter content
			if ($el.hasClass('selected')) {
				this.filteredBoots.add(this.boots.where(filter), {silent: true});
			} else {
				this.filteredBoots.remove(this.filteredBoots.where(filter), {silent: true});
			}

			// Check if user emptied the list
			if (this.filteredBoots.length < 1) {
				this.filteredBoots = this.boots;
			}

			// Render boots list again
			this.renderBoots();

			// TODO Update products counter
			this.$productsCounter.text(this.filteredBoots.length);
		},

		productClickHandler: function(event) {
			event.preventDefault();
			console.log("Link to product...");
		}
	});

}($SC_APP.views, Backbone, Zepto, Mustache, $SC_APP.collections.BootsCollection, $SC_APP.models.Product));