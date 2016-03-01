(function() {

angular.module('myApp')
.controller('AppCtrl', AppCtrl);

function AppCtrl($location) {
	var app = this;

	app.go = function(path) {
		$location.path(path);
	}
}

})();