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

App.ApplicationRoute = Ember.Route.extend({
	setupController: function() {
		this.controllerFor('products').set('model', App.Product.find());
	}
});

// Controllers
App.BrandsController = Ember.ArrayController.extend({});

App.ProductsController = Ember.ArrayController.extend({});

// Models
App.Store = DS.Store.extend({
	revision: 11,
	adapter: 'DS.FixtureAdapter'
});

App.Brand = DS.Model.extend({
	code: DS.attr('string'),
	products: DS.hasMany('App.Product')
});

App.Product = DS.Model.extend({
	name: DS.attr('string'),
	imgUrl: DS.attr('string'),
	price: DS.attr('number'),
	brand: DS.belongsTo('App.Brand')
});

App.OrderItem = DS.Model.extend({
	quantity: DS.attr('number'),
	product: DS.belongsTo('App.Product')
});

App.Brand.FIXTURES = [
	{
		id: 1,
		code: 'adidas',
		products: []
	},
	{
		id: 2,
		code: 'asics',
		products: []
	},
	{
		id: 3,
		code: 'hummel',
		products: []
	},
	{
		id: 4,
		code: 'lotto',
		products: []
	},
	{
		id: 5,
		code: 'mizuno',
		products: []
	},
	{
		id: 6,
		code: 'nike',
		products: []
	},
	{
		id: 7,
		code: 'puma',
		products: []
	},
	{
		id: 8,
		code: 'umbro',
		products: []
	}
];

App.Product.FIXTURES = [
	{
		id: "th14677",
		imgUrl: "/images/boots/adidas/th14677.jpg",
		name: "Adidas F10 TRX SG Kids Football Boots Metallic Silver/Black/Infra Red",
		price: 17.50,
		brand: 1
	}

];