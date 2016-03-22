(function() {

angular.module('myApp', ['ngRoute','quizzem'])
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
					},{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (fullGreeting.indexOf(greeting) == -1) { pass = false; msg = 'Oops. Something is not right with the variable fullGreeting.';};return [pass,msg]",						
					},{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (did.console.log.indexOf(fullGreeting) == -1) { pass = false; msg = 'You have not logged fullGreeting onto the console yet.' };return [pass,msg]",
					}]
				},
                options: function() {
                    return {codemirrorOptions: {lineWrapping: true,lineNumbers: true, mode: 'javascript'}}
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
					},{
						startingCode: "",
						testCode: "var pass=true;var msg='Good job!';if (did.angular.controller.indexOf('myCtrl') == -1) { pass = false; msg = 'There is no angular controller named myCtrl.';};return [pass,msg]",	
					}]
				},
                options: function() {
                    return {codemirrorOptions: {lineWrapping: true,lineNumbers: true, mode: 'javascript'}}
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
					}]
				},
                options: function() {
                    return {codemirrorOptions: {lineWrapping: true,lineNumbers: true, mode: 'javascript'}}
                }
			}
		})
        .when('/html', {
            templateUrl: 'partials/container.html',
            controller: 'TestsCtrl as ctrl',
            resolve: {
				tests: function() {
					return [{
						startingCode: "<h1>Hello World</h1>",
						testCode: "",
					}]
				},
                options: function() {
                    return {codemirrorOptions: {lineWrapping: true,lineNumbers: true, mode: 'html'}}
                }
			}
        })
		.otherwise({
			redirectTo: '/console-log'
		});
});


})();