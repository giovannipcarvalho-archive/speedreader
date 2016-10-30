/* global angular */
var fs = require('fs');
var app = angular.module('speedreader', ['ngMaterial']);

app.controller('MainController', ['$scope', '$interval', '$mdDialog',
	function($scope, $interval, $mdDialog){
	var text = "";

	document.ondragover = document.ondrop = (ev) => {
		ev.preventDefault()
	}

	document.body.ondrop = (ev) => {
		var filepath = ev.dataTransfer.files[0].path;
		console.log(filepath);
		fs.readFile(filepath, 'utf8', function(err, data){
			if(err) return console.log(err);
			text = data;
			$scope.text = text.split(" ");
			$scope.prevword = "";
			$scope.word = $scope.text[0];
			$scope.nextword = $scope.text[1];
			$scope.$digest();
			
			document.getElementById('info').style.visibility = 'hidden';
		});	
		ev.preventDefault();
	}

	$scope.pos = 0;
	$scope.wpm = 200;
	$scope.progress = 0;

	var delay = 1000/($scope.wpm)*60;
	
	function updateWPM(){
		delay = 1000/($scope.wpm)*60;
		pause();
	}
	
	function updateWords(){
		if($scope.pos > 0){
			$scope.prevword = $scope.text[$scope.pos - 1];
		} else {
			$scope.prevword = "";
		}
		
		$scope.word = $scope.text[$scope.pos];
		
		if($scope.pos < $scope.text.length){
			$scope.nextword = $scope.text[$scope.pos + 1];
		} else {
			$scope.nextword = "";
		}
		
		$scope.progress = $scope.pos / $scope.text.length * 100;
	}

	var stop;
	function update(){
		if ($scope.text == null){
			pause();
			return;
		}
		if ($scope.pos >= $scope.text.length - 1){
			pause();
		} else {
			$scope.pos++;
			updateWords();
			console.log("Delay: " + delay + ". Pos: " + $scope.pos + ". Word: " + $scope.word);
		}
	}
	
	function play(){
		stop = $interval(update, delay);
		document.getElementById('prevbox').style.visibility = 'hidden';
		document.getElementById('nextbox').style.visibility = 'hidden';
	}
	
	function pause(){
		$interval.cancel(stop);
		stop = undefined;
		document.getElementById('prevbox').style.visibility = 'visible';
		document.getElementById('nextbox').style.visibility = 'visible';
	}

	var colorScheme = 0;
	$scope.hotkey = function(event){
		console.log(event.keyCode);
		if(event.keyCode == 32){
			if(stop == undefined){
				//play
				play();
			} else {
				//pause
				pause();
			}
		} else if (event.keyCode == 106){
			$scope.next();
		} else if (event.keyCode == 107){
			$scope.prev();
		} else if (event.keyCode == 45 || event.keyCode == 95){
			$scope.wpm -= 10;
			updateWPM();
		} else if (event.keyCode == 43 || event.keyCode == 61){
			$scope.wpm += 10;
			updateWPM();
		} else if (event.keyCode == 114) {
			pause();
			$scope.pos = 0;
			updateWords();
		} else if (event.keyCode == 99) {
			// toggle color
			if (colorScheme == 0) {
				document.getElementsByTagName('body')[0].style.backgroundColor = 'white';
				document.getElementsByTagName('body')[0].style.color = 'black';
				colorScheme++;
			} else if (colorScheme == 1){
				document.getElementsByTagName('body')[0].style.backgroundColor = '#313131';
				document.getElementsByTagName('body')[0].style.color = '#ccc';
				colorScheme = 0;
			}
			
		} else if (event.keyCode == 116) {
			// set text dialog
		} else if (event.keyCode == 63) {
		    $mdDialog.show(
		      $mdDialog.alert()
		        .clickOutsideToClose(true)
		        .title('Help')
		        .textContent('Press +/- to adjust WPM. Space to play/pause. C to change colorscheme.')
		        .ariaLabel('Help')
		        .ok('Got it!')
		    );
		}
	}

	// var scrollCount = 0;
	// var scrollThreshold = 12;
	
	$scope.prev = function() {
		// scrollCount++;
		// if($scope.pos > 0 && scrollCount >= scrollThreshold){
		if($scope.pos > 0){
			//$scope.word = $scope.text[--$scope.pos];
			$scope.pos--;
			// scrollCount = 0;
		}
		updateWords();
	}

	$scope.next = function() {
		// scrollCount++;
		// if($scope.pos < $scope.text.length && scrollCount >= scrollThreshold){
		if($scope.pos < $scope.text.length - 1){
			//$scope.word = $scope.text[++$scope.pos];
			$scope.pos++;
			// scrollCount = 0;
		}
		updateWords();
	}
}]);

app.directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                
                        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault) {
                                event.preventDefault();                        
                            }

                        }
            });
        };
});

app.directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                
                        if(delta < 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelDown);
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault)  {
                                event.preventDefault();
                            }

                        }
            });
        };
});
