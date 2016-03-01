(function() {

angular.module('myApp', ['ngRoute','ngSanitize','ui.codemirror', 'quizzem'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/console-log', {
			templateUrl: 'partials/container.html',
			controller: 'TestsCtrl as ctrl',
			resolve: {
				tests: function() {
					return [{
						startingCode: "var greeting = 'hello ';",
						testCode: "var pass=true;var msg='Good job!';if (!name) { pass = false; msg = 'There is no varialbe named name';};return [pass,msg]",
						instructions: ['Save a string value inside a variable called <code>name</code>'],
						language: 'JavaScript',
					},{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (fullGreeting.indexOf(greeting) == -1) { pass = false; msg = 'Oops. Something is not right with the variable fullGreeting.';};return [pass,msg]",						
						instructions: ['Create a variable called <code>fullGreeting</code>', 'Concatenate <code>name</code> after <code>greeting</code> and save the result in <code>fullGreeting</code>'],
						language: 'JavaScript',
					},{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (did.console.log.indexOf(fullGreeting) == -1) { pass = false; msg = 'You have not logged fullGreeting onto the console yet.' };return [pass,msg]",
						instructions: ['log <code>fullGreeting</code> in the console'],
						language: 'JavaScript',
					}]
				}
			}
		})
		.when('/angular-module', {
			templateUrl: 'partials/container.html',
			controller: 'TestsCtrl as ctrl',
			resolve: {
				tests: function() {
					return [{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (did.angular.module.indexOf('myApp') == -1) { pass = false; msg = 'There is no angular module named myApp.';};return [pass,msg]",
						instructions: ['Create an Angular module named <code>myApp</code>'],
						language: 'JavaScript',
					},{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (did.angular.controller.indexOf('myCtrl') == -1) { pass = false; msg = 'There is no angular controller named myCtrl.';};return [pass,msg]",						
						instructions: ['Create an Angular controller named <code>myCtrl</code> and attach it to <code>myApp</code>'],
						language: 'JavaScript',
					}]
				}
			}
		})
		.when('/node-process', {
			templateUrl: 'partials/container.html',
			controller: 'TestsCtrl as ctrl',
			resolve: {
				tests: function() {
					return [{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';var _sum=0;for (index in process.argv) {var num = Number(process.argv[index]);if (!isNaN(num)){_sum+=num}}if (did.console.log.indexOf(_sum) == -1) {pass=false;msg='Oops. Did not log in the right value.';}return[pass,msg];",
						instructions: ['The goal is to create a node app that accepts one or more arguments and command line arguments and prints the sum.', 'Use node\'s <code>process</code> object.', 'The <code>process</code> object has an <code>argv</code> method that can accept and store arguments in an array'],
						language: 'JavaScript',
					}]
				}
			}
		})
		.otherwise({
			redirectTo: '/console-log'
		});
});


})();