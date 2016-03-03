# quizzem
Create quizes within an in-browser text editor


[demo](http://fiffty.github.io/quizzem/)

## Installing
```
bower install quizzem --save
```

```html
<link rel="stylesheet" type="text/css" href="bower_components/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="bower_components/codemirror/lib/codemirror.css">
<link rel="stylesheet" type="text/css" href="bower_components/quizzem/dist/quizzem.css">
<script type="text/javascript" src="bower_components/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script type="text/javascript" src="bower_components/quizzem/dist/quizzem.min.js"></script>
```

## Requirements
- AngularJs
- angular-sanitize
- [angular-ui-codemirror](https://github.com/angular-ui/ui-codemirror)
- [font-awesome](https://fortawesome.github.io/Font-Awesome/)


## Attributes
### qzm-options
- object
```javascript
{codemirrorOptions: <code mirror options object>}
```
### qzm-tests
- array
```javascript
[{startingCode: <String>, testCode: <String>, instructions: [<String>,<String>,],language: 'JavaScript',]
```

### qzm-on-check
- function
- the function will have access to a parameter named `passed`, which is a boolean
```javascript
ctrl.didPass = function(passed) { ctrl.passed = passed; }
```


## Writing Tests
### qzm-tests
- did the user create a variable?
 - basic javascript syntax errors (including undefined variables) are catched. You can safely reference the name of the variables for tests.
- did the user call a certain method?
 - an object called `did` is available in `ce-tests`. It is made to resemble how methods look (e.g., use `did.angular.module` to test for `angular.module()`) and its value is an array of the parameters being sent in to the methods. 

### bulking up the environment
- eval.js is the web worker that runs the user submitted code
 - global scopes inside here is stripped of a lot of objects, whitelist more objects when needed
 - `testEnv()` inside eval.js sets up psuedo objects and methods (e.g., `console` object, `angular` object)
 - psuedo methods in `testEnv()` should push its parameters inside the `did` object
