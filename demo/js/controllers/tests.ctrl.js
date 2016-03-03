(function() {

angular.module('myApp')
.controller('TestsCtrl', TestsCtrl);

function TestsCtrl(tests, $location) {
	var ctrl = this;
	ctrl.options = {codemirrorOptions: {lineWrapping: true,lineNumbers: true}};
	ctrl.tests = tests;
	ctrl.rerender = 1;

	ctrl.didPass = function(passed) {
		ctrl.passed = passed;
	}

	ctrl.stringify = function() {
		ctrl.newTestString = toString(ctrl.newTest);
	}

	function toString(func) {
		var o = '';
		var temp = func.toString().split('\n');
		temp.shift();
		temp.pop();
		for (var i = 0; i < temp.length; i++) {
			o += temp[i].trim() + '\n';
		}
		return o;
	}
}

})();