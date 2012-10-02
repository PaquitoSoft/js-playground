var request = require('request'),
	util = require('util'),
	fs = require('fs');

/*
request('http://localhost:8888/products.json', function(err, resp, body) {
	var products = JSON.parse(body);
	var brands = Object.keys(products);
	brands.forEach(function(brand) {
		products[brand].forEach(function(product) {
			request(product.imgUrl).pipe(fs.createWriteStream(__dirname + '/images/boots/' + brand + '/' + product.id + '.jpg'));
		});
	});
});
*/

/*
fs.readFile(__dirname + '/products.json', 'utf8', function(err, data) {
	var result = {};
	util.log(data);
	data = JSON.parse(data);
	var brands = Object.keys(data);
	brands.forEach(function(brand) {
		result[brand] = [];
		data[brand].forEach(function(product) {
			result[brand].push({
				"id": product.id,
				"imgUrl": "/images/boots/" + brand + "/" + product.id + ".jpg",
				"name": product.name,
				"price": (product.price.length > 0) ? product.price.substr(1) : 0
			});
		});
	});
	fs.writeFileSync(__dirname + '/products_data.json', JSON.stringify(result), 'utf8');
});
*/