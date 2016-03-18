const scripts = document.getElementsByTagName("script");
const currentScriptPath = scripts[scripts.length-1].src;
if (currentScriptPath.slice(-6) == 'min.js') {
	const templatePath = currentScriptPath.replace('quizzem.min.js', 'quizzem.html');
} else {
	const templatePath = currentScriptPath.replace('quizzem.js', 'quizzem.html');
}

angular.module('quizzem', [])
.directive('qzm', ['$q', '$timeout', qzm]);


// Angular Directive
function qzm($q, $timeout) {
	return {
		templateUrl: templatePath,
		restrict: 'EA',
		scope: {
			inputOptions: '=qzmOptions',
			inputTests: '=qzmTests',
			inputRefreshState: '=qzmRefreshState',
			qzmOnCheck: '&'
		},
		link: QzmLink,
	};

	function QzmLink(scope, elem, attr, ngModel) {
		// Require CodeMirror
		if (angular.isUndefined(CodeMirror)) {
			throw new Error('Quizzem needs CodeMirror to work.');
		}


		// METHODS
		scope.checkWork 		= checkWork; // method that checks user submitted work
		scope.codemirrorLoaded 	= codemirrorLoaded; // callback method for codemirror load
		scope.goToStep 			= goToStep; // navigate between quiz stages

		// INITIAL SETUP
		// setup meta info for quiz steps
		scope.currentStep 		= 0; // track current step
		scope.maxStep			= 0; // track progress
		scope.showError 		= false;
		// create a new codemirror instance when
		let codemirror;
		// scope.inputTests receive a value
		scope.$watch(function() {
			return scope.inputTests;
		}, function(newVal) {
			if (newVal) { // make sure newVal is not empty
				$timeout(function() {
					renderCodemirror();
					goToStep(codemirror, 0);
				});
			}
		});

		// HOISTED METHODS
		// method that checks user submitted work
		function checkWork() {
			scope.showError = false;
			let stringifiedFunc = scope.code + '\n' + scope.testCode;

			// create web worker
			let workerCode = quizzemWebWorker.toString();
			workerCode = workerCode.substring(workerCode.indexOf("{")+1, workerCode.lastIndexOf("}"));
			let blob = new Blob([workerCode], {type:'application/javascript'});
			let worker = new Worker(URL.createObjectURL(blob));
			
			// send message to worker
			worker.postMessage(stringifiedFunc);

			// handle message from worker
			let deferred = $q.defer();
			worker.onmessage = function(e) {
				deferred.resolve(e.data);
				worker.terminate();
			};
			deferred.promise.then(function(data) {
				if (scope.errorInUserCode = data.error[0]) {
					scope.showError = true;
					// pass out result of code check
					scope.qzmOnCheck({passed: false});
				} else {
					// pass out result of code check
					if (scope.currentStep == scope.maxStep) scope.maxStep++;
					if (scope.currentStep < scope.inputTests.length - 1) {
						goToStep(codemirror, ++scope.currentStep);
						scope.qzmOnCheck({passed: false});
					} else {
						scope.qzmOnCheck({passed: true});
					}
				}
			});
		}
		// callback method for codemirror load
		function codemirrorLoaded(editor) {}
		// navigate between quiz stages
		function goToStep(codemirror, index) {
			scope.code 			= scope.inputTests[index].startingCode || scope.code;
			codemirror.setValue(scope.code); // set codemirror's value to scope varialbe
			scope.testCode 		= scope.inputTests[index].testCode;
			scope.language 		= scope.inputTests[index].language;
			scope.instructions 	= scope.inputTests[index].instructions;
			scope.currentStep 	= index;			
		}
		// render codemirror
		function renderCodemirror() {
			if (codemirror) {
				let cmElem = codemirror.getWrapperElement();
				cmElem.parentNode.removeChild(cmElem);
				codemirror = null;				
			}
			let opts = scope.inputOptions.codemirrorOptions;
			opts.mode = scope.inputTests[0].language.toLowerCase();
			codemirror = new CodeMirror(document.getElementById('qzm-codemirror'), opts);
			// stream codemirror changes to scope variable
			codemirror.on('change', function(instance) {
				scope.code = instance.getValue();
			});				
			// streaming scope variable changes to codemirror happens in goToStep()			
		}
	}
};

// Web worker
function quizzemWebWorker() {
	(function () {
	    // save methods in local variable before stripping away properties
	    let _postMessage = postMessage;
	    let _addEventListener = addEventListener;

	    // anonymous function to strip away properties that aren't needed
	    (function (obj) {
	        'use strict';

	        let current = obj; // currentlt, current => DedicatedWorkerGlobalScope 
	        let keepProperties = [
	            // required by JavaScript
	            'Object', 'Function', 'Infinity', 'NaN', 'undefined',
	            // other stuff we want to keep
	            'Array', 'Boolean', 'Number', 'String', 'Symbol', 'Map', 'Math', 'Set', 'isNaN',
	            // stuff that cannot be deleted
	            'caches', 'TEMPORARY', 'PERSISTENT'
	        ];

	        do {
	            Object.getOwnPropertyNames(current).forEach(function (name) {
	                if (keepProperties.indexOf(name) === -1) {
	                    delete current[name];
	                }
	            });

	            // get higher scope and strip away properties again
	            current = Object.getPrototypeOf(current);
	        } while (current !== Object.prototype); // until we get to Object() 
	    })(this);

	    // listen to message being sent in to worker
	    _addEventListener('message', function (e) {
	        let msg = {
	            error: [],
	        };
	        // initialize test enviroment
	        testEnv(msg);
	        // construct the function inside the worker whose scope has limited properties
	        let f = new Function(e.data);
	        
	        // run the function inside the worker, and send its returned value as message
	        try {
	            let obj = f();
	            if (obj[0] == false) {
	                msg.error.push(obj[1]);
	            } else {
	                msg.success = obj[1];
	            }
	        } catch(err) {
	            msg.error.push(err.toString());
	        }
	        _postMessage(msg);
	    });

        let testEnv = (msg) => {
            // object that logs psuedo method calls
	        // visible to module javascript objects
	        this.did = {
	            console: {
	                log: [],
	            },
	            angular: {
	                module: [],
	                moduleArray: [],
	                controller: [],
	                controllerFunc: [],
	                service: [],
	                serviceFunc: [],
	                filter: [],
	                filterFunc: [],
	            }
	        }

	        // PSUEDO OBJECTS

	        // console
	        this.console = {
	            log: function(a) {
	                self.did.console.log.push(a);
	            }
	        }

	        // angular
	        let errorMessagesSetters = function(name, func, key) {
	            if (!(name && func)) {
	                msg.error.push(key + ' method needs two parameters when initiating an app.');
	            } else if (typeof(name) != 'string') {
	                msg.error.push('The first parameter for ' + key + ' must be a string.');
	            } else if (typeof(func) != 'function') {
	                msg.error.push('The second parameter for ' + key + ' must be a function.');
	            }         
	        }
	        this.angular = {
	            module: function(name, array) {
	                if (!(name && array)) {
	                    msg.error.push('angular.module() method needs two parameters when initiating an app.');
	                } else if (typeof(name) != 'string') {
	                    msg.error.push('The first parameter for angular.module() must be a string.');
	                } else if (typeof(array) != 'object') {
	                    msg.error.push('The second parameter for angular.module() must be an array.');
	                }
	                if (!msg.error[0]) {self.did.angular.module.push(name);self.did.angular.moduleArray.push(array);}
	                self.angular.module = self.angular.moduleGetter;
	                return self.angular;
	            },
	            moduleGetter: function(name) {
	                if (typeof(name) != 'string') msg.error.push('The parameter for angular.module() must be a string.');
	                if (!msg.error[0]) {self.did.angular.module.push(name);}
	                return self.angular;
	            },
	            controller: function(name, func) {
	                errorMessagesSetters(name, func, '.controller()');
	                if (!msg.error[0]) {self.did.angular.controller.push(name);self.did.angular.controllerFunc.push(func);} 
	                return self.angular;              
	            },
	            service: function(name, func) {
	                errorMessagesSetters(name, func, '.service()');
	                if (!msg.error[0]) {self.did.angular.service.push(name);self.did.angular.serviceFunc.push(func)}
	                return self.angular;                 
	            },
	            filter: function(name, func) {
	                errorMessagesSetters(name, func, '.filter()');
	                if (!msg.error) {self.did.angular.filter.push(name);self.did.angular.filterFunc.push(func);}
	                return self.angular;
	            }
	        }
	        //node
	        this.process = {
	            argv: ['node','app.js','1','2','hello', '4'],
	        }             
        }
	})();
}