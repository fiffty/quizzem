(function() {

angular.module('myApp')
.service('codeEditorWorker', ['$q', codeEditorWorker]);

function codeEditorWorker($q) {
	var deferred = $q.defer();
	var worker = new Worker('js/workers/eval.js');
	this.safeEval = safeEval;

	worker.onmessage = function(e) {
		deferred.resolve(e.data);
	};

	function safeEval(untrustedCode) {
		worker.postMessage(untrustedCode);
		return deferred.promise;		
	}
}

})();