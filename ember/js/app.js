// Ember application main file

var App = Ember.Application.create({
	rootElement: $('#middleFrame')
});


// Router
App.Router.map(function() {
	this.resource('brands'); // '/#/brands'
});

App.BrandsRoute = Ember.Route.extend({
	model: function() {
		return App.Brand.find();
	}
});

// Controllers
App.BrandsController = Ember.ArrayController.extend({});

// Models
App.Store = DS.Store.extend({
	revision: 11,
	adapter: 'DS.FixtureAdapter'
});

App.Brand = DS.Model.extend({
	name: DS.attr('string'),
	products: DS.hasMany('App.Product')
});

App.Product = DS.Model.extend({
	name: DS.attr('string'),
	imgUrl: DS.attr('string'),
	price: DS.attr('number')/*,
	brand: DS.belongsTo('App.Brand')*/
});

App.Brand.FIXTURES = [
	{
		id: 1,
		name: 'Adidas',
		products: []
	},
	{
		id: 2,
		name: 'Asics',
		products: []
	},
	{
		id: 3,
		name: 'Hummel',
		products: []
	},
	{
		id: 4,
		name: 'Lotto',
		products: []
	},
	{
		id: 5,
		name: 'Mizuno',
		products: []
	},
	{
		id: 6,
		name: 'Nike',
		products: []
	},
	{
		id: 7,
		name: 'Puma',
		products: []
	},
	{
		id: 8,
		name: 'Umbro',
		products: []
	}
];

App.Product.FIXTURES = [
	{
		id: "th14677",
		imgUrl: "/images/boots/adidas/th14677.jpg",
		name: "Adidas F10 TRX SG Kids Football Boots Metallic Silver/Black/Infra Red",
		price: 17.50/*,
		brand: 1*/
	}

];