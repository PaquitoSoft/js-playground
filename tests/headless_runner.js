function waitFor(testFx, onReady, timeoutMillis) {
	var maxTimeoutMillis = timeoutMillis || 3001, // Default 3 seconds timeout
		start = Date.now(),
		condition = false,
		interval = setInterval(function() {
			if ((Date.now() - start < maxTimeoutMillis) && !condition) {
				// If not timeout yet and condition not yet fulfilled
				condition = (typeof(testFx) === 'string' ? eval(testFx) : testFx());
			} else {
				if (!condition) {
					// Timeout
					console.log("waitFor() timeout!");
					console.log(testFx);
					phantom.exit(1);
				} else {
					// Condition fulfilled
					// console.log("waitFor() finished in " + (Date.now() - start) + " (ms).");
					typeof(onReady) === 'string' ? eval(onReady) : onReady(); // Do what it's supposed to do when condition is fulfilled
					clearInterval(interval);
				}
			}
		}, 100); // Check time interval

}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(message) {
	console.log(message);
};

page.open('http://localhost:8888/tests/runner.html', function(status) {
	if (status !== 'success') {
		console.log("Unable to access testing page.");
		phantom.exit(1);
	} else {
		console.log("Tests runner loaded; running tests...");

		var bodyContent = page.evaluate(function() {
			return document.body.innerText;
		});
		console.log(bodyContent);


		waitFor(function() {
			return page.evaluate(function() {
				var el = document.getElementById('qunit-testresult');
				if (el && el.innerText.match('completed')) {
					return true;
				} else {
					return false;
				}
			});
		}, function() {
			var failedNum = page.evaluate(function() {
				var el = document.getElementById('qunit-testresult');
				console.log(el.innerText);
				try {
					return el.getElementsByClassName('failed')[0].innerHtml;
				} catch (e) {
					console.log('Error...');
					console.log(e);
				}
				return 10000;
			});
			phantom.exit(parseInt(failedNum, 10) > 0 ? 1 : 0);
		}, 15 * 1000);
	}
});