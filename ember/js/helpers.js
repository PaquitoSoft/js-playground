// Template helpers
Ember.Handlebars.registerBoundHelper('strip', function(text) {
	return text.substr(0, 10);
});

Ember.Handlebars.registerBoundHelper('money', function(value) {
	var result = "" + value,
		index = result.indexOf('.');

	if (index !== -1) {
		if (result.substr(index + 1).length < 2) {
			result += '0';
		} else {
			result = result.substr(0, index + 3);
		}
	} else {
		result += '.00';
	}
	return result;
});
