(function(plugins, $, M) {
	
	plugins.templates = function() {

		var cache = {};

		function render(templateId, params) {
			var tpl = cache[templateId];
			if (!tpl) {
				tpl = $(templateId).text();
			}
			return M.render(tpl, params);
		}

		return {
			render: render
		};
	};

}($SC_APP.plugins, Zepto, Mustache));